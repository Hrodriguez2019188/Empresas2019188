import { Router } from 'express';
import { check } from 'express-validator';
import {
  businessPost,
  businessPut,
  businessGet,
  businessExcel,
  businessOrder,
} from './business.controller.js';
import {
  businessExists,
  businessExistsById,
} from '../helpers/db-validators.js';
import { validateFields } from '../middlewares/validate-fields.js';


const router = new Router();

router.get('/', [validateFields], businessGet); // Ruta para obtener negocios

router.post( // Ruta para registrar un nuevo negocio
  '/',
  [
    check('name').custom(businessExists), // Validar si el nombre del negocio ya existe
    check('impactLevel', 'El nivel de impacto es requerido').not().isEmpty(),
    check('experience', 'El tiempo de operación es requerido').not().isEmpty(),
    check('category', 'La categoría es requerida').not().isEmpty(),
    validateFields, // Validar los campos
  ],
  businessPost
);

router.get('/:orderReference', [ validateFields], businessOrder); // Ruta para obtener un negocio por referencia de orden

router.put( // Ruta para actualizar un negocio
  '/:id',
  [
    check('id', 'El ID no tiene un formato de MongoDB válido').isMongoId(),
    check('id').custom(businessExistsById), // Validar si el ID del negocio existe
    validateFields, // Validar los campos
  ],
  businessPut
);

export default router;
