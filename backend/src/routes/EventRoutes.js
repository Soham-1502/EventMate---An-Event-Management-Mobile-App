// routes/events.js - Updated API Routes Structure
import express from 'express';
import GetAllUserEvents from '../controller/eventController/GetAllUserEvents.js';
import GetOneUserEvent from '../controller/eventController/GetOneUserEvent.js';
import GetAllEvents from '../controller/eventController/GetAllEvents.js'; // New controller

const router = express.Router();

// Public routes - All events (for events discovery page)
router.get('/getAll', GetAllEvents); // GET /api/events/getAll?page=1&limit=20&search=...

// User-specific routes - Events created by a specific user
router.get('/getAll/:userId', GetAllUserEvents); // GET /api/events/getAll/userId?page=1&limit=20

// Single event routes
router.get('/getOne/:eventId', GetOneUserEvent); // GET /api/events/getOne/eventId?include_stats=true

// Additional routes you might want to add:

// Featured events
router.get('/featured', async (req, res) => {
    return GetAllEvents(req, res, { featured_only: true });
});

// Events by location
router.get('/location/:location', async (req, res) => {
    req.query.location = req.params.location;
    return GetAllEvents(req, res);
});

// Events by category
router.get('/category/:category', async (req, res) => {
    req.query.category = req.params.category;
    return GetAllEvents(req, res);
});

// Trending events (most popular in last 7 days)
router.get('/trending', async (req, res) => {
    req.query.sort_by = 'attendee_count';
    req.query.sort_order = 'desc';
    req.query.date_from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    return GetAllEvents(req, res);
});

export default router;