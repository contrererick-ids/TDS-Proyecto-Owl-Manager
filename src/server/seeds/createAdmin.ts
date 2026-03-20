import { config } from 'dotenv';
config();
import connectToDataBase from '../config/db';
import User, { UserRole } from '../models/user.model';
import bcrypt from  'bcrypt';

async function createAdmin() {
    try {
        await connectToDataBase();
        const userAdmin = await User.findOne({ username: 'admin' });
        if (userAdmin) {
            console.log('El usuario admin ya existe.');
            return;
        }
        const hashedPassword = await bcrypt.hash('admin123', 10);
        try {
            const newAdmin = new User({
                username: 'Admin01',
                password: hashedPassword,
                name: 'Juan',
                email: 'admin@example.com',
                role: UserRole.ADMIN,
                isActive: true
            });
            await newAdmin.save();
            console.log('Usuario admin creado exitosamente.');
        } catch (error) {
            console.error('Error al crear el usuario admin:', error);
        }
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    } finally {
        process.exit();
    }
}

createAdmin();
