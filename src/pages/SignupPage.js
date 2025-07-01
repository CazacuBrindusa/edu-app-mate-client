import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/SignupPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const [className, setClassName] = useState('');
    const [classes, setClasses] = useState(['']); // Professor can add multiple classes
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleRoleChange = (event) => {
        setUserType(event.target.value);
        if (event.target.value === 'student') {
            setClasses(['']); // Reset professor classes
        } else {
            setClassName(''); // Reset student class input
        }
    };

    const handleClassChange = (event, index) => {
        const updatedClasses = [...classes];
        updatedClasses[index] = event.target.value;
        setClasses(updatedClasses);
    };

    const handleAddClass = () => {
        setClasses([...classes, '']); // Add a new empty input for another class
    };

    const handleSubmit = async () => {
        setError('');
        setSuccessMessage('');
    
        if (!email.trim() || !name.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('All fields are required!');
            return;
        }
    
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
    
        const requestBody = {
            email: email.trim(),
            name: name.trim(),
            password: password.trim(),
            userType,
            // For students, we use 'className'
            className: userType === 'student' ? className.trim() : undefined,
            // For professors, we use 'professorClasses'
            professorClasses: userType === 'professor' ? classes.map(cls => cls.trim()).filter(cls => cls) : undefined,
        };
    
        try {
            await axios.post('/register', requestBody, {
                headers: { 'Content-Type': 'application/json' },
            });
    
            setSuccessMessage('Account created successfully! Redirecting...');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };    
    
    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <div className="form-group">
                    <label>Role</label>
                    <select value={userType} onChange={handleRoleChange}>
                        <option value="student">Student</option>
                        <option value="professor">Professor</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <div className="password-wrapper">
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span onClick={() => setPasswordVisible(!passwordVisible)} className="eyeIcon">
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span onClick={() => setPasswordVisible(!passwordVisible)} className="eyeIcon">
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                {userType === 'student' && (
                    <div className="form-group">
                        <label>Class Name</label>
                        <input
                            type="text"
                            placeholder="Enter class name"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                        />
                    </div>
                )}

                {userType === 'professor' && (
                    <div>
                        <label>Classes You Teach</label>
                        {classes.map((cls, index) => (
                            <div className="form-group" key={index}>
                                <input
                                    type="text"
                                    placeholder={`Class ${index + 1}`}
                                    value={cls}
                                    onChange={(e) => handleClassChange(e, index)}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={handleAddClass} className="add-class-btn">
                            + Add Another Class
                        </button>
                    </div>
                )}

                <button type="button" onClick={handleSubmit} className="signup-btn">
                    Sign Up
                </button>

                <button type="button" onClick={() => navigate('/')} className="back-to-login-btn">
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default SignupPage;
