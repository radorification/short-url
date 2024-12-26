import express from "express";
export const app = express();
import shortenRoutes from "./routes/shorten.js"
//import analyticsRoutes from './routes/analytics.js';
import { Url } from "./models/url.model.js";
import { UAParser } from "ua-parser-js";
import session from 'express-session';
import passport from 'passport';
import './config/passport.js'; // Passport configuration
//import authRoutes from './routes/auth.js';
import cookieParser from "cookie-parser";



//app.use('/api/analytics', analyticsRoutes);
app.use(cookieParser());
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}))

// Session configuration
/*app.use(
    session({
        secret: 'password123', // Replace with a strong secret
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true,
            secure: false
         },
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
*/

// Routes
app.use('/api', shortenRoutes);
//app.use('/api/analytics', analyticsRoutes);

// Authentication routes
//app.use('/auth', authRoutes);

app.get("/:alias", async (req, res) => {
    const alias = req.params.alias;
    const parser = new UAParser();
    const ua = parser.setUA(req.headers['user-agent']).getResult();
    const osName = ua.os.name || 'Unknown';
    const deviceName = ua.device.type || 'Desktop';
    

   try {
     const handleRedirect = await Url.findOneAndUpdate({
         alias
     },
     {
         $push: {
             visitHistory: {
                 timestamp: new Date(),
                 osName,
                 deviceName,
             }
         }
     },
 
     { new: true }
     );
 
     if (!handleRedirect) {
         return res.status(404).json({ error: 'Alias not found' });
     }
     
     res.redirect(handleRedirect.longUrl);
   } catch (error) {
    console.error('Error during redirect:', error);
    res.status(500).json({ error: 'Internal server error' });
   }
});

/*
app.get('/api/dashboard', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({
        message: 'Welcome to the dashboard!',
        user: req.user,
    });
});
*/