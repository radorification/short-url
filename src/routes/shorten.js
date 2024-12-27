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



/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Start Google Sign-In
 *     description: Redirect the user to Google for authentication. Once the user signs in successfully, a session cookie (`connect.sid`) is set in the browser.
 *     responses:
 *       302:
 *         description: Redirected to Google Sign-In.
 *
 * /auth/google/callback:
 *   get:
 *     summary: Google Sign-In Callback
 *     description: Handle the callback from Google after authentication. Upon successful login, the user is redirected, and a session cookie (`connect.sid`) is set in the browser.
 *     responses:
 *       302:
 *         description: Redirected after successful authentication.
 *       401:
 *         description: Authentication failed.
 *     x-notes:
 *       - "To use the session cookie for subsequent API calls:"
 *       - "1. Open your browser's developer tools after signing in (usually by pressing F12 or right-click -> 'Inspect')."
 *       - "2. Go to the 'Application' tab and select 'Cookies' from the left panel."
 *       - "3. Locate the cookie named `connect.sid` under your application domain."
 *       - "4. Copy the value of the cookie."
 *       - "5. Use this value in API testing tools (e.g., Postman) by adding it to the **Headers** section as: `Cookie: connect.sid=<your-cookie-value>`."
 */




/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a short URL
 *     description: Generate a short URL for sharing a long URL. Requires authentication.
 *     parameters:
 *       - in: header
 *         name: Cookie
 *         required: false
 *         description: Session cookie obtained after logging in via Google Sign-In.
 *         schema:
 *           type: string
 *           example: connect.sid=s%3Aexample-session-cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The original long URL to shorten.
 *                 example: https://example.com
 *               customAlias:
 *                 type: string
 *                 description: (Optional) Custom alias for the short URL.
 *                 example: my-custom-alias
 *               topic:
 *                 type: string
 *                 description: (Optional) A category under which the URL is grouped.
 *                 example: marketing
 *     responses:
 *       201:
 *         description: URL created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The generated short URL.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of creation.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized. Ensure the session cookie is included.
 */


/**
 * @swagger
 * /{alias}:
 *   get:
 *     summary: Redirect to original URL
 *     description: Redirect the short URL to its corresponding original URL.
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The alias of the short URL.
 *         schema:
 *           type: string
 *           example: my-custom-alias
 *     responses:
 *       302:
 *         description: Redirected successfully.
 *       404:
 *         description: Alias not found.
 */



/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a specific alias
 *     description: Retrieve detailed performance metrics for a given short URL alias, including clicks, unique users, and device statistics. Requires authentication.
 *     parameters:
 *       - in: header
 *         name: Cookie
 *         required: true
 *         description: Session cookie obtained after logging in via Google Sign-In.
 *         schema:
 *           type: string
 *           example: connect.sid=s%3Aexample-session-cookie
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The alias of the short URL.
 *         schema:
 *           type: string
 *           example: my-custom-alias
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of times the short URL has been accessed.
 *                 uniqueClicks:
 *                   type: integer
 *                   description: Number of unique users who accessed the URL.
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: integer
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                       uniqueClicks:
 *                         type: integer
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                       uniqueClicks:
 *                         type: integer
 *       401:
 *         description: Unauthorized. Ensure the session cookie is included.
 *       404:
 *         description: Alias not found.
 */


/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get topic-based analytics
 *     description: Retrieve analytics for all short URLs grouped under a specific topic. Requires authentication.
 *     parameters:
 *       - in: header
 *         name: Cookie
 *         required: true
 *         description: Session cookie obtained after logging in via Google Sign-In.
 *         schema:
 *           type: string
 *           example: connect.sid=s%3Aexample-session-cookie
 *       - in: path
 *         name: topic
 *         required: true
 *         description: The topic to retrieve analytics for.
 *         schema:
 *           type: string
 *           example: marketing
 *     responses:
 *       200:
 *         description: Topic-based analytics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: Total clicks across all URLs in the topic.
 *                 uniqueClicks:
 *                   type: integer
 *                   description: Unique users across all URLs in the topic.
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: integer
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                       totalClicks:
 *                         type: integer
 *                       uniqueClicks:
 *                         type: integer
 *       401:
 *         description: Unauthorized. Ensure the session cookie is included.
 *       404:
 *         description: Topic not found.
 */



/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     description: Retrieve overall performance metrics for all URLs created by the authenticated user. Requires authentication.
 *     parameters:
 *       - in: header
 *         name: Cookie
 *         required: true
 *         description: Session cookie obtained after logging in via Google Sign-In.
 *         schema:
 *           type: string
 *           example: connect.sid=s%3Aexample-session-cookie
 *     responses:
 *       200:
 *         description: Overall analytics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: integer
 *                   description: Total number of URLs created by the user.
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks across all URLs.
 *                 uniqueClicks:
 *                   type: integer
 *                   description: Total unique users across all URLs.
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: integer
 *       401:
 *         description: Unauthorized. Ensure the session cookie is included.
 */






export default router;