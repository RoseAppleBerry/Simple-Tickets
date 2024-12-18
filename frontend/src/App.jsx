import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Events from './Events';
import CreateEvent from './CreateEvent';
import UserProfileModel from './UserProfileModel';
import { useEffect } from 'react';

function App() {
    // Optionally, check token for authentication on load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('User is authenticated');
        }
    }, []);

    return (
        <div className="App">
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/create" element={<CreateEvent />} />
                    <Route path="/profile" element={<UserProfileModel />} />

                    {/* Catch-all Route */}
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
