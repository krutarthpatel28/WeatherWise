import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'], // Added validation message
    },
    description: {
        type: String,
        required: [true, 'Description is required'], // Added validation message
    },
    content: {
        type: String,
        required: [true, 'Content is required'], // Added validation message
    },
    username: {
        type: String,
        required: [true, 'Username is required'], // Added validation message
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the User model
        required: true, // Ensure the creator field is mandatory
    }
});

// Export the model
module.exports = mongoose.model('Post', postSchema);