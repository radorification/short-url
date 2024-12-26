import express from'express';
import { createShortUrl, getUrlAnalytics } from '../controllers/shorten.controller.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per IP
    message: 'Too many requests, please try again later.',
});

// Route for creating short URL
router.post('/shorten/', limiter, createShortUrl);
router.get('/analytics/:alias', getUrlAnalytics);
export default router;
