const Event = require('./event'); // Event model

// Create Event (Organizers only)
exports.createEvent = async (req, res) => {
    if (req.user.role !== 'organizer') return res.status(403).json({ message: 'Unauthorized' });
    const { title, description, date, location, ticketsAvailable, price } = req.body;
    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            ticketsAvailable,
            price,
            status: 'Pending',
            organizer: req.user.id
        });
        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch Events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Book Tickets (Users only)
exports.bookTickets = async (req, res) => {
    if (req.user.role !== 'user') return res.status(403).json({ message: 'Unauthorized' });
    const { eventId, tickets } = req.body;
    try {
        const event = await Event.findById(eventId);
        if (!event || event.ticketsAvailable < tickets) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }
        event.ticketsAvailable -= tickets;
        await event.save();
        res.status(200).json({ message: 'Tickets booked successfully', event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve or Reject Event (Admins only)
exports.approveEvent = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    const { eventId, status } = req.body; // status: 'Approved' or 'Rejected'
    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        event.status = status;
        await event.save();
        res.status(200).json({ message: `Event ${status}`, event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
