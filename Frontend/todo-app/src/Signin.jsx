import { useState } from 'react';
import { Link } from 'react-router-dom';
import { endpoints } from './config';

function Signin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await fetch(endpoints.adminLogin, {
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
                alert("Signin successful!");
            } else {
                alert("Signin failed!");
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
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    color: '#2c3e50',
                    marginBottom: '30px',
                    fontSize: '28px',
                    fontWeight: '600'
                }}>Welcome Back!</h2>

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
                            transition: 'border-color 0.3s ease',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4299e1'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                            transition: 'border-color 0.3s ease',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4299e1'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: 'linear-gradient(45deg, #4299e1 0%, #667eea 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11)',
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
                    Sign In
                </button>

                <div style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    fontSize: '14px',
                    color: '#718096'
                }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{
                        color: '#4299e1',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signin;


