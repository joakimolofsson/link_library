import mongoose from 'mongoose';

const linkSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        posted: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: 'link_coll'
    }
);

const LinkModel = mongoose.model('LinkModel', linkSchema);

export default LinkModel;