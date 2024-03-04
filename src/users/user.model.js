import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  username: { type: String, required: [true, 'El nombre de usuario es obligatorio'] },

  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio y debe ser único'],
    unique: true,
  },

  password: { type: String, required: [true, 'La contraseña es obligatoria'] },

  state: { type: Boolean, default: true },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default mongoose.model('User', UserSchema);
