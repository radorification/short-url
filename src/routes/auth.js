import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login-failed' }),
    (req, res) => {
        res.redirect('/auth/success'); // Redirect to a valid route
    }
);

// Login failed route
router.get('/login-failed', (req, res) => {
    res.status(401).json({ error: 'Login failed' });
});

// Successful login route
router.get('/success', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({
        message: 'Login successful',
        user: req.user,
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/'); // Redirect to home after logout
    });
});

export default router;