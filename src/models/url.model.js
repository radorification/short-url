import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    longUrl: { 
        type: String,
        required: true 
    },
    alias: { 
        type: String, 
        unique: true, 
        required: false 
    },
    topic: { 
        type: String, 
        default: 'general' 
    },
    visitHistory: [
        {
            timestamp: { type: Date },
            osName: { type: String },
            deviceName: { type: String },
        },
    ],
},
{timestamps: true}
);

export const Url = mongoose.model('Url', urlSchema);
