import React, { useState } from "react";
import api from '../api/axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER', // Default role
        agreeToTerms: false,
    });
    const [loading, setLoading] = useState(false); // Add loading state

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const validateForm = () => {
        const { email, username, password, confirmPassword, agreeToTerms } = formData;

        // Email validation
        if (!email || !email.includes('@')) {
            message.error('Please enter a valid email address.');
            return false;
        }

        // Username validation
        if (!username || username.length < 4) {
            message.error('Username must be at least 4 characters long.');
            return false;
        }

        // Password validation
        if (!password || password.length < 8) {
            message.error('Password must be at least 8 characters long.');
            return false;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            message.error('Passwords do not match.');
            return false;
        }

        // Check if terms and conditions are agreed to
        if (!agreeToTerms) {
            message.error('You must agree to the terms and conditions.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Perform front-end validation
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            // Prepare the request payload
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };

            console.log('Attempting to register with payload:', payload);

            const response = await axios.post(
                '/api/auth/signup',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000 // 10 seconds timeout
                }
            );

            console.log('Registration response:', response);

            if (response.status === 201) {
                message.success('Registration successful! Redirecting to login...');

                // Redirect to the login page
                setTimeout(() => navigate('/login'), 1500);
            }
        } catch (error) {
            console.error('Registration error:', error);

            if (error.code === 'ECONNABORTED') {
                message.error('Request timeout. Please try again.');
            } else if (error.response) {
                // Server responded with error status
                const { status, data } = error.response;

                if (status === 400) {
                    message.error(data.message || 'Invalid request data');
                } else if (status === 409) {
                    message.error(data.message || 'User already exists with this email or username');
                } else if (status === 500) {
                    message.error(data.message || 'Server error. Please try again later.');
                } else {
                    message.error(`Error: ${status} - ${data.message || 'Unknown error'}`);
                }
            } else if (error.request) {
                // No response received
                message.error('No response from server. Please check your connection.');
            } else {
                // Other errors
                message.error('Registration failed: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <center>
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 max-w">
                        Or
                        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                            login to your account
                        </a>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        minLength="4"
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        minLength="8"
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="At least 8 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        minLength="8"
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    Account Type
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="role"
                                        name="role"
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="CUSTOMER">Regular User</option>
                                        <option value="RESTAURANT_ADMIN">Restaurant Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    name="agreeToTerms"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                    I agree to all the <a href="/terms" className="font-medium text-blue-600 hover:text-blue-500">Terms</a> and <a href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">Privacy Policies</a>
                                </label>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Already have an account?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href="/login"
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Sign in
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </center>
        </div>
    );
}

export default SignupPage;