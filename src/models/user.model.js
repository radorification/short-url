import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    createdUrls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Url' }], //URLs created by this user
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
