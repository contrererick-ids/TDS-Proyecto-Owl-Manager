import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function connectToDataBase(){
    if (!process.env.DB_CONST_STRING) {
        console.error('Database connection string is not defined in environment variables.');
        process.exit(1);
    } else {
        try{
            await mongoose.connect(process.env.DB_CONST_STRING);
            console.log('Connected to database');
        } catch (error) {
            console.error('Error connecting to database:', error);
            process.exit(1);
        }
    }
}

export default connectToDataBase;