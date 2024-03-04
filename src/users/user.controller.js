import { response, request } from 'express';
import bcryptjs from 'bcryptjs';
import User from './user.model.js';
import { jwtGenerate } from '../helpers/generate-jwt.js';

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); 
    if (!user) return response.status(400).json({ msg: 'Usuario no encontrado' }); 
    if (!user.state)
      return response
        .status(400)
        .json({ msg: 'Usuario eliminado de la base de datos' });
    const passCompare = bcryptjs.compareSync(password, user.password); 
    if (!passCompare)
      return response.status(400).json({ msg: 'Contraseña incorrecta' });
    const token = await jwtGenerate(user.id); 
    res.status(200).json({ msg: '¡Sesión iniciada!', user, token });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: 'Error' });
  }
};

// Método POST
export const userPost = async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();
  res.status(200).json({ user });
};

// Método GET
export const userGet = async (req, res) => {
  const { limit, from } = req.query;
  const query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);
  res.status(200).json({ total, users });
};
