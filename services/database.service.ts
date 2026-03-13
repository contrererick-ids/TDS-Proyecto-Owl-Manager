// services/database.service.ts
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

export async function connectToDatabase() {
  dotenv.config();
  
  await mongoose.connect(process.env.DB_CONN_STRING!);
  console.log('Conectado a MongoDB Atlas');
  
  return mongoose.connection;
}