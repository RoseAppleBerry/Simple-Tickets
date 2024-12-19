import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfileModel.css';

const UserProfileModel = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        role: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You need to log in first!');
                window.location.href = '/login';
                return;
            }
            try {
                const res = await axios.get('/api/user/profile', {
                    headers: { Authorization: token },
                });
                setUserData(res.data);
            } catch (err) {
                console.error(err.message);
                setError('Failed to load profile information.');
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.put(
                '/api/user/profile',
                { name: userData.name, email: userData.email },
                { headers: { Authorization: token } }
            );
            setSuccess('Profile updated successfully!');
        } catch (err) {
            console.error(err.message);
            setError('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role:</label>
                    <input
                        type="text"
                        name="role"
                        value={userData.role}
                        readOnly
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default UserProfileModel;
