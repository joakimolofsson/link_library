import mongoose from 'mongoose';

const mongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_ADDRESS, { useNewUrlParser: true });
        console.log('MongoDB Connected');
    } catch(err) {
        console.log(`MongoDB Error: ${err}`);
    }
};

export default mongoDb;