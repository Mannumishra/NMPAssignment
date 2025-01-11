import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
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


    return (
        <div className="main-signup">
            <div className="signup-container">
                <h2 className="signup-title">Signup</h2>
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        const decoded = jwtDecode(credentialResponse.credential);
                        console.log('Google login response:', decoded);

                        const googleUserData = {
                            firstName: decoded.given_name || '',
                            lastName: decoded.family_name || decoded.name || '',
                            email: decoded.email || '',
                            password: 'Ana123@!',
                        };

                        // Signup request
                        axios.post(`${process.env.REACT_APP_BACKEND_URL}/sign-up`, googleUserData)
                            .then(response => {
                                if (response.status === 201) {
                                    console.log('Signup successful:', response.data);

                                    // After signup, directly log the user in
                                    const loginData = {
                                        email: googleUserData.email,
                                        password: googleUserData.password, // Use the same password set during signup
                                    };

                                    // Login request
                                    axios.post(`${process.env.REACT_APP_BACKEND_URL}/log-in`, loginData, { withCredentials: true })
                                        .then(loginResponse => {
                                            if (loginResponse.status === 200) {
                                                toast.success('Login successful!');
                                                sessionStorage.setItem("login", true);
                                                sessionStorage.setItem("userid", loginResponse.data.user.id);
                                                sessionStorage.setItem("role", loginResponse.data.user.role);
                                                window.location.href = '/dashboard';
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Login Successful!',
                                                    text: 'You are logged in with Google.',
                                                    confirmButtonText: 'Go to Dashboard',
                                                }).then(() => {
                                                    navigate('/dashboard');
                                                });
                                            } else {
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Oops...',
                                                    text: loginResponse.data.message || 'Something went wrong!',
                                                });
                                            }
                                        })
                                        .catch(loginError => {
                                            console.error('Login error:', loginError);
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Login Failed',
                                                text: loginError.response?.data?.message || 'Unable to log you in. Please try again.',
                                            });
                                        });
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: response.data.message || 'Something went wrong during signup!',
                                    });
                                }
                            })
                            .catch(signupError => {
                                console.error('Signup error:', signupError);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Signup Failed',
                                    text: signupError.response?.data?.error || 'Unable to sign you up. Please try again.',
                                });
                            });
                    }}
                    onError={() => {
                        console.log('Google Login Failed');
                        Swal.fire({
                            icon: 'error',
                            title: 'Google Login Failed',
                            text: 'Please try again later.',
                        });
                    }}
                />


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
        </div>
    );
};

export default Signup;
