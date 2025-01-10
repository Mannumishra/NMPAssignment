import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Signup.css';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

const Signup = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/sign-up`,
                formData
            );

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Signup Successful!',
                    text: 'Please log in to continue.',
                    confirmButtonText: 'Go to Login',
                }).then(() => {
                    setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                    });
                    navigate('/log-in')
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.message || 'Something went wrong!',
                });
            }
        } catch (error) {
            console.error('Signup error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.error || 'Something went wrong!',
            });
        }
    };

    const handleGoogleSuccess = async (response) => {
        try {
            const { tokenId } = response;
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, { token: tokenId });

            if (res.status === 200) {
                alert('Login Successful');
                navigate('/');
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            alert('Something went wrong during Google Sign-In.');
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Google Sign-In Failed:', error);
    };


    return (
        <div className="main-signup">
            <div className="signup-container">
                <h2 className="signup-title">Signup</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                            <button
                                type="button"
                                className="show-password-button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="signup-button">Signup</button>
                </form>
                <p className="redirect-message mt-3">
                    Already have an account? <Link to="/log-in">Login</Link>
                </p>
            </div>
            <GoogleLogin
                clientId="679752321030-s89rf0m09blp6fs8rr8apqia14eoukfh.apps.googleusercontent.com"
                buttonText="Sign in with Google"
                onSuccess={handleGoogleSuccess}
                onFailure={handleGoogleFailure}
                cookiePolicy="single_host_origin"
            />
        </div>
    );
};

export default Signup;
