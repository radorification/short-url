/*
export const isAuthenticated = (req, res, next) => {
    console.log('User in session:', req.user);
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};
*/