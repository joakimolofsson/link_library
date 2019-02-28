import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        age: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: 'user_coll'
    }
);

const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;