import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

export function connect() {
  // if already connected, just return
  if (mongoose.connections[0].readyState) return;

  console.log('Connecting to database: ', uri);
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
