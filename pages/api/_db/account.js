import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
  name: { type: String, required: true, minLength: 1 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

schema.set('toObject', {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

schema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

export default mongoose.connection.models.Account ||
  mongoose.model('Account', schema);
