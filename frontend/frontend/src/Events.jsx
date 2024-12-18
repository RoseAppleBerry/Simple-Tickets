import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [tickets, setTickets] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/event');
                setEvents(res.data);
            } catch (err) {
                console.error(err.message);
                setError('Failed to load events. Please try again later.');
            }
        };
        fetchEvents();
    }, []);

    const handleBookTickets = async (eventId) => {
        const ticketCount = tickets[eventId] || 1;
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Please log in to book tickets.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axios.post(
                'http://localhost:5000/event/book',
                { eventId, tickets: ticketCount },
                { headers: { Authorization: token } }
            );
            alert('Tickets booked successfully!');
        } catch (err) {
            console.error(err.message);
            setError('Failed to book tickets. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTicketChange = (eventId, value) => {
        setTickets({ ...tickets, [eventId]: value });
    };

    return (
        <div className="events-container">
            <h2>All Events</h2>
            {error && <p className="error-message">{error}</p>}
            {events.length === 0 ? (
                <p>No events available.</p>
            ) : (
                <ul>
                    {events.map((event) => (
                        <li key={event._id} className="event-item">
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                            <p>Location: {event.location}</p>
                            <p>Tickets Available: {event.ticketsAvailable}</p>
                            <p>Price: ${event.price}</p>
                            <div>
                                <label>Tickets:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={event.ticketsAvailable}
                                    value={tickets[event._id] || 1}
                                    onChange={(e) =>
                                        handleTicketChange(event._id, parseInt(e.target.value))
                                    }
                                />
                                <button
                                    onClick={() => handleBookTickets(event._id)}
                                    disabled={loading}
                                >
                                    {loading ? 'Booking...' : 'Book Tickets'}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Events;
