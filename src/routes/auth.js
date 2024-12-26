/*import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: true,
    }),
    (req, res) => {
        res.redirect('/api/dashboard'); // Redirect to dashboard or another route after login
    }
);

// Logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

export default router;
*/