const express = require('express');
const eventRouter = express.Router();
const Event = require('../models/event');
const authMiddleware = require('../middleware/auth'); // Middleware for authentication
const { createEvent, getEvents, bookTickets, approveEvent } = require('../controllers/event'); // Import controllers

// Existing Endpoint: Get All Events
eventRouter.get("/all", async (req, res) => {
    try {
        const allEvent = await Event.find();
        console.log(allEvent);
        res.status(200).send(allEvent);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch events.' });
    }
});

// Create Event (Organizers only)
eventRouter.post('/create', authMiddleware, createEvent);

// Fetch Events (User-specific or public)
eventRouter.get('/', authMiddleware, getEvents);

// Book Tickets (Users only)
eventRouter.post('/book', authMiddleware, bookTickets);

// Approve or Reject Event (Admins only)
eventRouter.post('/approve', authMiddleware, approveEvent);

// Update Event (Existing Logic)
eventRouter.put('/:id', authMiddleware, async (req, res) => {
    const eventId = req.params.id;
    const { title, description, date, venue } = req.body;
    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        if (event.organizer.toString() !== req.userId) {
            return res.status(403).json({ error: 'You do not have permission to update this event.' });
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.venue = venue || event.venue;

        await event.save();

        res.status(200).json({ message: 'Event updated successfully.', event });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Event update failed. Please try again later.' });
    }
});

// Delete Event (Existing Logic)
eventRouter.delete('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        const deleteEvent = await Event.findByIdAndDelete(id);
        if (!deleteEvent) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Event deletion failed. Please try again later.' });
    }
});

module.exports = eventRouter;
