import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

module.exports.createSecretToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60
    })
}