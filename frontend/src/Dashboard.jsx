import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [userRole, setUserRole] = useState('');
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // Redirect if no token
                return;
            }
            try {
                // Fetch user role
                const res = await axios.get('http://localhost:5000/user/profile', {
                    headers: { Authorization: token },
                });
                setUserRole(res.data.role);

                // Fetch all events for dashboard display
                const eventsRes = await axios.get('http://localhost:5000/event');
                setEvents(eventsRes.data);
            } catch (err) {
                console.error(err.message);
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleApproveEvent = async (eventId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/event/approve',
                { eventId, status },
                { headers: { Authorization: token } }
            );
            alert(`Event ${status} successfully!`);
            window.location.reload(); // Refresh events
        } catch (err) {
            console.error(err.message);
            alert('Failed to approve/reject event.');
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Welcome to the Dashboard</h1>
            {userRole === 'user' && (
                <div>
                    <h2>Available Events</h2>
                    <ul>
                        {events.map((event) => (
                            <li key={event._id}>
                                {event.title} - {event.date} - {event.location}
                                <button onClick={() => navigate('/events')}>View Details</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {userRole === 'organizer' && (
                <div>
                    <h2>Organizer Panel</h2>
                    <button onClick={() => navigate('/create')}>Create New Event</button>
                    <h3>My Events</h3>
                    <ul>
                        {events
                            .filter((e) => e.organizer === localStorage.getItem('userId'))
                            .map((event) => (
                                <li key={event._id}>
                                    {event.title} - {event.date}
                                </li>
                            ))}
                    </ul>
                </div>
            )}

            {userRole === 'admin' && (
                <div>
                    <h2>Admin Panel - Approve Events</h2>
                    <ul>
                        {events
                            .filter((e) => e.status === 'Pending')
                            .map((event) => (
                                <li key={event._id}>
                                    {event.title} - {event.date} - {event.location}
                                    <button onClick={() => handleApproveEvent(event._id, 'Approved')}>
                                        Approve
                                    </button>
                                    <button onClick={() => handleApproveEvent(event._id, 'Rejected')}>
                                        Reject
                                    </button>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
