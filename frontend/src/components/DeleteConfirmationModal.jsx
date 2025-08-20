import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  Fade,
  Avatar,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

function DeleteConfirmationModal({ open, onClose, onConfirm, user, loading = false }) {
  const handleConfirm = () => {
    onConfirm(user?.id);
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
          pt: 3,
          pb: 2,
          px: 3,
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="white">
            Confirmar Exclusão
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            p: 2,
            mb: 3,
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            Você está prestes a excluir:
          </Typography>
          
          <Box display="flex" alignItems="center" gap={2} mt={1}>
            {user.avatar_url ? (
              <Avatar 
                src={user.avatar_url} 
                alt={user.name}
                sx={{ width: 48, height: 48 }}
              />
            ) : (
              <Avatar sx={{ width: 48, height: 48, bgcolor: '#e0e0e0' }}>
                <PersonOffIcon sx={{ color: '#757575' }} />
              </Avatar>
            )}
            <Box flex={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'flex-start',
            backgroundColor: '#fff3e0',
            border: '1px solid #ffcc80',
            borderRadius: 2,
            p: 2,
          }}
        >
          <WarningAmberIcon sx={{ color: '#f57c00', fontSize: 20, mt: 0.5 }} />
          <Box>
            <Typography variant="body2" fontWeight={500} color="#e65100" gutterBottom>
              Atenção! Esta ação é irreversível.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Todos os dados relacionados a este usuário serão permanentemente removidos do sistema.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            borderColor: '#e0e0e0',
            color: '#757575',
            '&:hover': {
              borderColor: '#bdbdbd',
              backgroundColor: '#fafafa',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading}
          startIcon={loading ? null : <DeleteOutlineIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ff5252 0%, #ff7043 100%)',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
              opacity: 0.6,
            },
          }}
        >
          {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationModal;