import { Router } from 'express';
import { check } from 'express-validator';
import { userPost, userGet, userLogin } from './user.controller.js';
import { emailExists, userExistsById } from '../helpers/db-validators.js';
import { validateFields } from '../middlewares/validate-fields.js';

const router = new Router();

router.get('/', userGet); // Ruta para obtener usuarios

router.post( // Ruta para registrar un nuevo usuario
  '/',
  [
    check('username', 'El nombre de usuario es requerido').not().isEmpty(),
    check('email', 'El correo electrónico es requerido').isEmail(),
    check('email').custom(emailExists), // Validar si el correo ya está registrado
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validateFields, // Validar los campos
  ],
  userPost // Controlador para registrar un nuevo usuario
);

router.post( // Ruta para iniciar sesión
  '/login',
  [
    check('email', 'Correo electrónico inválido').isEmail(),
    check('password', 'La contraseña es requerida').not().isEmpty(),
    validateFields, // Validar los campos
  ],
  userLogin // Controlador para iniciar sesión
);

export default router;
