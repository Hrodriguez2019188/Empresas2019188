import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';

export const validateJWT = async (req, res, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la solicitud',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);
    if (!user) {
      return res.status(401).json({
        msg: 'El usuario no existe en la base de datos',
      });
    }
    if (!user.state) {
      return res.status(401).json({
        msg: 'Token inválido - el usuario tiene el estado: false',
      });
    }

    req.user = user;

    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({
      msg: 'Token inválido',
    });
  }
};
