import { nanoid } from 'nanoid';
import {Url} from '../models/url.model.js';
import {ApiError} from "../utils/ApiError.js"

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const createShortUrl = async (req, res) => {
    try {
        const { longUrl, customAlias, topic, visitHistory } = req.body;

         // Ensure user is authenticated
        /*
         if (!req.user) { // <-- ADD: Check if the user is logged in
            return res.status(401).json({ error: 'Unauthorized' }); 
        }
            */

        // Validate input
        if (!longUrl || !/^https?:\/\/.+/i.test(longUrl)) {
            throw new ApiError(400, "Invalid URL")
        }

        // Check for custom alias
        let alias;
        if (customAlias) {
            // Verify custom alias is unique
            const existingAlias = await Url.findOne({ alias: customAlias });
            if (existingAlias) {
                return res.status(400).json({ error: 'Custom alias already in use.' });
            }
            alias = customAlias;
        } else {
            // Generate a unique alias
            alias = nanoid(8);
        }

        // Check if the URL already exists
        const existingUrl = await Url.findOne({ longUrl });
        if (existingUrl) {
            return res.status(200).json({
                shortUrl: `${BASE_URL}/${existingUrl.alias}`,
                createdAt: existingUrl.createdAt,
            });
        }

        // Create a new short URL
        const newUrl = await Url.create({
            longUrl,
            alias,
            topic: topic || 'general',
            visitHistory
        });
        

        res.status(201).json({
            shortUrl: `${BASE_URL}/${newUrl.alias}`,
            createdAt: newUrl.createdAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUrlAnalytics = async (req, res) => {
    try {
        const { alias } = req.params;

        // Find the URL document by alias
        const url = await Url.findOne({ alias });
        if (!url) {
            console.log("Alias not found")
            return res.status(404).json({ error: 'Alias not found' });
        }

        const totalClicks = url.visitHistory.length;

        // Extract unique clicks based on timestamp and user-agent (for simplicity, timestamp only here)
        const uniqueClicks = new Set(
            url.visitHistory.map((entry) => entry.timestamp.toDateString())
        ).size;

        // Group clicks by date for the last 7 days
        const clicksByDate = {};
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        url.visitHistory.forEach((entry) => {
            const date = entry.timestamp.toDateString();
            if (new Date(entry.timestamp) >= sevenDaysAgo) {
                clicksByDate[date] = (clicksByDate[date] || 0) + 1;
            }
        });

        const clicksByDateArray = Object.entries(clicksByDate).map(([date, count]) => ({
            date,
            count,
        }));

        // Placeholder for osType and deviceType (requires user-agent parsing)
        const osType = {}; // Extend this logic based on user-agent parsing
        const deviceType = {}; // Extend this logic based on user-agent parsing

        url.visitHistory.forEach((entry) => {
            if (entry.osName) {
                osType[entry.osName] = osType[entry.osName] || { uniqueClicks: 0, uniqueUsers: new Set() };
                osType[entry.osName].uniqueClicks += 1;
                osType[entry.osName].uniqueUsers.add(entry.timestamp.toDateString());
            }

            if (entry.deviceName) {
                deviceType[entry.deviceName] = deviceType[entry.deviceName] || { uniqueClicks: 0, uniqueUsers: new Set() };
                deviceType[entry.deviceName].uniqueClicks += 1;
                deviceType[entry.deviceName].uniqueUsers.add(entry.timestamp.toDateString());
            }
        });

        const osTypeArray = Object.entries(osType).map(([osName, data]) => ({
            osName,
            uniqueClicks: data.uniqueClicks,
            uniqueUsers: data.uniqueUsers.size,
        }));

        const deviceTypeArray = Object.entries(deviceType).map(([deviceName, data]) => ({
            deviceName,
            uniqueClicks: data.uniqueClicks,
            uniqueUsers: data.uniqueUsers.size,
        }));

        res.status(200).json({
            totalClicks,
            uniqueClicks,
            clicksByDate: clicksByDateArray,
            osType,
            deviceType,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getTopicAnalytics = async (req, res) => {
    try {
        const { topic } = req.params;

        // Find all URLs under the specified topic
        const urls = await Url.find({ topic });
        if (urls.length === 0) {
            return res.status(404).json({ error: 'No URLs found for this topic' });
        }

        // Aggregate analytics for the topic
        let totalClicks = 0;
        let uniqueClicksSet = new Set();
        const clicksByDate = {};
        const urlAnalytics = [];

        urls.forEach((url) => {
            // Update total clicks and unique clicks
            totalClicks += url.visitHistory.length;
            url.visitHistory.forEach((entry) => uniqueClicksSet.add(entry.timestamp.toDateString()));

            // Group clicks by date
            url.visitHistory.forEach((entry) => {
                const date = entry.timestamp.toDateString();
                clicksByDate[date] = (clicksByDate[date] || 0) + 1;
            });

            // Prepare analytics for each URL
            const uniqueUrlClicks = new Set(url.visitHistory.map((entry) => entry.timestamp.toDateString())).size;
            urlAnalytics.push({
                shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${url.alias}`,
                totalClicks: url.visitHistory.length,
                uniqueClicks: uniqueUrlClicks,
            });
        });

        // Convert clicksByDate to an array format
        const clicksByDateArray = Object.entries(clicksByDate).map(([date, count]) => ({
            date,
            count,
        }));

        res.status(200).json({
            totalClicks,
            uniqueClicks: uniqueClicksSet.size,
            clicksByDate: clicksByDateArray,
            urls: urlAnalytics,
        });
    } catch (error) {
        console.error('Error fetching topic analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export {
    createShortUrl, 
    getUrlAnalytics,
    getTopicAnalytics
}