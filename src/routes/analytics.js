import express from 'express';
import { getOverallAnalytics } from '../controllers/analytics.controller.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', isAuthenticated, getOverallAnalytics);

export default router;
