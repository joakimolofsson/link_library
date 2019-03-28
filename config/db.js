const mongoose = require('mongoose');

const mongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_ADDRESS, { useNewUrlParser: true });
        console.log('MongoDB Connected');
    } catch(err) {
        console.log(`MongoDB Error: ${err}`);
    }
};

module.exports = mongoDb;