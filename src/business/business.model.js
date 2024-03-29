import mongoose from 'mongoose';

const BusinessSchema = mongoose.Schema({
  name: { type: String, required: [true, 'El nombre es obligatorio'] },
  impactLevel: { type: String, required: [true, 'El nivel de impacto es obligatorio'] },
  experience: {
    type: String,
    required: [true, 'El tiempo de operación es obligatorio'],
  },
  category: { type: String, required: [true, 'La categoría es obligatoria'] },

  estado: { type: Boolean, default: true },
});

BusinessSchema.methods.toJSON = function () {
  const { __v, _id, ...business } = this.toObject();
  business.bid = _id;
  return business;
};

export default mongoose.model('Business', BusinessSchema);
