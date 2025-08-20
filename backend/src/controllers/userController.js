const userService = require('../services/userService');

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
    }

    const newUser = await userService.createUser({ name, email });
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  };
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updatedUser = await userService.updateUser(id, { name, email });
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  };
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser  = await userService.deleteUser(id);
    if (deletedUser === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  };
};

const uploadAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const avatarUrl = req.file.location;

    const updatedUser = await userService.updateUserAvatar(id, avatarUrl);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const deleteAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await userService.deleteAvatar(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao deletar avatar:', error);
    res.status(500).json({ message: 'Erro interno ao deletar avatar.' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadAvatar,
  deleteAvatar,
};