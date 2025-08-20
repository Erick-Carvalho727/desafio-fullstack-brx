import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Fade,
  Zoom
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import api from '../services/api';
import UserForm from '../components/UserForm';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { ptBR } from '@mui/x-data-grid/locales';

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      showSnackbar('Erro ao carregar usuários', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenCreateModal = () => {
    setCurrentUser(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentUser(null);
  };

  const handleSaveUser = async (userData, avatarFile, isAvatarRemoved) => {
    try {
      let savedUser;
      if (currentUser) {
        const response = await api.put(`/users/${currentUser.id}`, userData);
        savedUser = response.data;
        showSnackbar('Usuário atualizado com sucesso!');
      } else {
        const response = await api.post('/users', userData);
        savedUser = response.data;
        showSnackbar('Usuário criado com sucesso!');
      }

      if (avatarFile && savedUser.id) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        await api.post(`/users/${savedUser.id}/upload-avatar`, formData);
      } else if (isAvatarRemoved) {
        await api.delete(`/users/${savedUser.id}/delete-avatar`);
      }

      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      showSnackbar('Erro ao salvar usuário', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
      showSnackbar('Usuário deletado com sucesso!');
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      showSnackbar('Erro ao deletar usuário', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (!deleting) {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const columns = [
    {
      field: 'avatar',
      headerName: 'Avatar',
      sortable: false,
      width: 70,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          {params.row.avatar_url ? (
            <img
              src={params.row.avatar_url}
              alt={params.row.name}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e0e0e0'
              }}
            />
          ) : (
            <AccountCircleIcon sx={{ fontSize: 40, color: '#bdbdbd' }} />
          )}
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Nome',
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" height="100%" alignItems="center" gap={1}>
          <EmailIcon sx={{ fontSize: 16, color: '#757575' }} />
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <Box display="flex" height="100%" alignItems="center" gap={0.5}>
          <Zoom in={true}>
            <Tooltip title="Editar usuário">
              <IconButton
                size="small"
                onClick={() => handleOpenEditModal(params.row)}
                sx={{
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Zoom>
          <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <Tooltip title="Deletar usuário">
              <IconButton
                size="small"
                onClick={() => handleOpenDeleteModal(params.row)}
                sx={{
                  color: '#d32f2f',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Zoom>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={24}
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.98)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #3e3e3e 0%, #555555 100%)',
              p: 3,
              color: 'white',
            }}
          >
            <Typography variant="h4" fontWeight="bold" margin={0} gutterBottom>
              Gerenciamento de Usuários
            </Typography>
          </Box>

          <Box
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenCreateModal}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                background: 'linear-gradient(135deg, #3e3e3e 0%, #555555 100%)',
                boxShadow: '0 4px 15px rgba(8, 8, 8, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(6, 6, 6, 0.6)',
                },
              }}
            >
              Adicionar Usuário
            </Button>
          </Box>


          <Box sx={{ p: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                <CircularProgress size={50} />
              </Box>
            ) : (
              <DataGrid
                rows={users}
                columns={columns}
                disableColumnMenu={true}
                getRowId={(row) => row.id}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                pageSizeOptions={[5, 10, 15]}
                disableSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f0f0f0',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    borderBottom: '2px solid #e0e0e0',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f8f8f8',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '2px solid #e0e0e0',
                  },
                  minHeight: 400,
                }}
              />
            )}
          </Box>
        </Paper>
      </Fade>

      <UserForm
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        currentUser={currentUser}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteUser}
        user={userToDelete}
        loading={deleting}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserListPage;