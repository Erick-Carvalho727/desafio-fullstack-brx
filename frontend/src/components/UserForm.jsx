import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Avatar,
  Box,
  IconButton,
  Typography,
  Divider,
  Badge,
  FormHelperText,
  LinearProgress
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

function UserForm({ open, onClose, onSave, currentUser }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({ name: currentUser.name, email: currentUser.email });
      setAvatarPreview(currentUser.avatar_url || '');
    } else {
      setFormData({ name: '', email: '' });
      setAvatarPreview('');
    }
    setAvatarFile(null);
    setIsAvatarRemoved(false);
    setErrors({ name: '', email: '' });
  }, [currentUser, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    setIsAvatarRemoved(true);
  };

  const validateForm = () => {
    let newErrors = { name: '', email: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData, avatarFile, isAvatarRemoved);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      {saving && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
      
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #3e3e3e 0%, #555555 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" margin={0} fontWeight="bold">
            {currentUser ? 'Editar Usuário' : 'Novo Usuário'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={4}
          sx={{
            position: 'relative',
            mb: 3,
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  sx={{
                    backgroundColor: 'white',
                    boxShadow: 2,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                  <PhotoCameraIcon />
                </IconButton>
              </Box>
            }
          >
            <Avatar
              src={avatarPreview}
              sx={{
                width: 140,
                height: 140,
                border: '4px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                backgroundColor: '#e0e0e0',
              }}
            >
              {!avatarPreview && <PersonIcon sx={{ fontSize: 60, color: '#bdbdbd' }} />}
            </Avatar>
          </Badge>

          {avatarPreview && (
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleRemoveAvatar}
              sx={{ mt: 1, color: '#f44336' }}
            >
              Remover foto
            </Button>
          )}

          <FormHelperText sx={{ mt: 1, textAlign: 'center' }}>
            Clique no ícone da câmera para adicionar uma foto
          </FormHelperText>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            autoFocus
            name="name"
            label="Nome Completo"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              },
            }}
          />

          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={saving}
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
          onClick={handleSave}
          variant="contained"
          disabled={saving}
          startIcon={saving ? null : <SaveIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 4,
            background: 'linear-gradient(135deg, #3e3e3e 0%, #555555 100%)',
              boxShadow: '0 4px 15px rgba(8, 8, 8, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(6, 6, 6, 0.6)',
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #3e3e3e 0%, #555555 100%)',
              opacity: 0.6,
            },
          }}
        >
          {saving ? 'Salvando...' : (currentUser ? 'Atualizar' : 'Criar Usuário')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserForm;