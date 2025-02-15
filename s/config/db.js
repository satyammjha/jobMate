
import mongoose from 'mongoose';
const dbConnection = async () => {
    try {
        const response = await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected');
        return response;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

export default dbConnection;