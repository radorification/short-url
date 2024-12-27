import express from'express';
import { createShortUrl, getUrlAnalytics, getTopicAnalytics } from '../controllers/shorten.controller.js';
import rateLimit from 'express-rate-limit';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per IP
    message: 'Too many requests, please try again later.',
});

// Route for creating short URL
router.post('/shorten', limiter, createShortUrl);

// Route for getting analytics by alias
router.get('/analytics/:alias', isAuthenticated, getUrlAnalytics);

// Route for getting topic-based analytics
router.get('/analytics/topic/:topic', isAuthenticated, getTopicAnalytics);

export default router;
