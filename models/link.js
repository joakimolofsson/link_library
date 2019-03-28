const mongoose = require('mongoose');

const linkSchema = mongoose.Schema(
    {
        link: {
            type: String,
            required: true
        },
        description: {
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
        posted: {
            type: Date,
            default: Date.now
        },
        like: {
            type: Number,
            default: 0,
            required: true
        },
        dislike: {
            type: Number,
            default: 0,
            required: true
        }
    },
    {
        collection: 'link_coll'
    }
);

const LinkModel = mongoose.model('LinkModel', linkSchema);

module.exports = LinkModel;