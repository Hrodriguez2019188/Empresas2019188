import User from '../users/user.model.js';
import Business from '../business/business.model.js';

export const emailExists = async (email = '') => {
  const existsEmail = await User.findOne({ email });
  if (existsEmail) {
    throw new Error(`El correo electrónico ${email} ya está registrado`);
  }
};

export const userExistsById = async (id = '') => {
  const existsUser = await User.findById(id);
  if (!existsUser) {
    throw new Error(`No existe un usuario con el ID: ${id}`);
  }
};

export const businessExists = async (name = '') => {
  const existsBusiness = await Business.findOne({ name });
  if (existsBusiness) {
    throw new Error(`Ya existe un negocio con el nombre: ${name}`);
  }
};

export const businessExistsById = async (id = '') => {
  const existsBusiness = await Business.findById(id);
  if (!existsBusiness) {
    throw new Error(`No existe un negocio con el ID: ${id}`);
  }
};
