import { useState } from 'react';
import { Link } from 'react-router-dom';
import { endpoints } from './config';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await fetch(endpoints.adminSignup, {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                window.location = "./";
                alert("Signup successful!");
            } else {
                alert("Signup failed!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                width: '100%',
                maxWidth: '400px',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    color: '#2d3748',
                    marginBottom: '30px',
                    fontSize: '28px',
                    fontWeight: '600'
                }}>Create Account</h2>

                <div style={{
                    marginBottom: '20px'
                }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: '#4a5568',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="Enter your username"
                    />
                </div>

                <div style={{
                    marginBottom: '30px'
                }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: '#4a5568',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="Create a password"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11)',
                        marginBottom: '20px'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 7px 14px rgba(50, 50, 93, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px rgba(50, 50, 93, 0.11)';
                    }}
                >
                    Sign Up
                </button>

                <div style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#718096'
                }}>
                    Already have an account?{' '}
                    <Link to="/signin" style={{
                        color: '#667eea',
                        textDecoration: 'none',
                        fontWeight: '500',
                        transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                    onMouseLeave={(e) => e.target.style.color = '#667eea'}
                    >
                        Sign In
                    </Link>
                </div>

                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#f7fafc',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#718096',
                    textAlign: 'center'
                }}>
                    By signing up, you agree to our{' '}
                    <a href="#" style={{
                        color: '#667eea',
                        textDecoration: 'none'
                    }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" style={{
                        color: '#667eea',
                        textDecoration: 'none'
                    }}>Privacy Policy</a>
                </div>
            </div>
        </div>
    );
}

export default Signup;