/*
import express from 'express';
import { getUrlAnalytics } from '../controllers/shorten.controller.js';
import { getOverallAnalytics } from '../controllers/shorten.controller.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Route for fetching analytics
router.get('/:alias', getUrlAnalytics);

router.get('/overall', isAuthenticated, getOverallAnalytics);

export default router;
*/