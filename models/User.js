import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
        console.error("Error hashing password:", err);
        next(err);
    }
    next();
});

// Method to match the entered password with the stored hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        if (!isMatch) {
            console.log('Password mismatch');
        }
        return isMatch;
    } catch (err) {
        console.error("Error comparing passwords:", err);
        throw err;
    }
};

const User = mongoose.model('User', userSchema);

export default User;