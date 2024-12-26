import { User } from '../models/user.model.js';

export const getOverallAnalytics = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('createdUrls');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const urls = user.createdUrls;

        let totalClicks = 0;
        let uniqueClicksSet = new Set();
        const clicksByDate = {};
        const osType = {};
        const deviceType = {};

        urls.forEach((url) => {
            // Aggregate total and unique clicks
            totalClicks += url.visitHistory.length;
            url.visitHistory.forEach((entry) => uniqueClicksSet.add(entry.timestamp.toDateString()));

            // Group clicks by date
            url.visitHistory.forEach((entry) => {
                const date = entry.timestamp.toDateString();
                clicksByDate[date] = (clicksByDate[date] || 0) + 1;

                // Group by OS type
                if (entry.osName) {
                    osType[entry.osName] = osType[entry.osName] || { uniqueClicks: 0, uniqueUsers: new Set() };
                    osType[entry.osName].uniqueClicks += 1;
                    osType[entry.osName].uniqueUsers.add(entry.timestamp.toDateString());
                }

                // Group by device type
                if (entry.deviceName) {
                    deviceType[entry.deviceName] = deviceType[entry.deviceName] || { uniqueClicks: 0, uniqueUsers: new Set() };
                    deviceType[entry.deviceName].uniqueClicks += 1;
                    deviceType[entry.deviceName].uniqueUsers.add(entry.timestamp.toDateString());
                }
            });
        });

        const clicksByDateArray = Object.entries(clicksByDate).map(([date, count]) => ({
            date,
            count,
        }));

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
            totalUrls: urls.length,
            totalClicks,
            uniqueClicks: uniqueClicksSet.size,
            clicksByDate: clicksByDateArray,
            osType: osTypeArray,
            deviceType: deviceTypeArray,
        });
    } catch (error) {
        console.error('Error fetching overall analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
