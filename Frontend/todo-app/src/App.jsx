import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { endpoints } from './config';
import Signup from "./Signup.jsx";
import Signin from "./Signin.jsx";
import Addcourse from "./Addcourse.jsx";
import Courses from "./Courses.jsx";
import MCQ from "./MCQ.jsx";

// Update animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .welcome-container {
    animation: fadeIn 1s ease-out;
  }

  .content-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .content-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
`;
document.head.appendChild(style);

function MenuBar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    fetch(endpoints.adminMe, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.username) {
        setUserEmail(data.username);
      }
    });
  }, []);

  const menuItems = [
    { path: '/addcourse', label: 'Add Course' },
    { path: '/courselist', label: 'Course List' },
    { path: '/mcq', label: 'Question Generator' }
  ];

  if (!userEmail) {
    menuItems.push(
      { path: '/signup', label: 'Sign Up' },
      { path: '/signin', label: 'Sign In' }
    );
  }

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
      padding: '1rem',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h1 style={{ 
        margin: '0 0 1rem 0', 
        color: '#2c3e50',
        fontSize: '24px',
        fontWeight: '600',
        padding: '1rem 0',
        borderBottom: '1px solid #f0f0f0'
      }}>AI-Based Classroom</h1>
      
      {userEmail && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '1rem',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ color: '#2c3e50', marginBottom: '8px' }}>{userEmail}</div>
          <button
            onClick={() => {
              localStorage.setItem("token", null);
              window.location = "/";
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#c82333';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#dc3545';
            }}
          >
            Logout
          </button>
        </div>
      )}
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderRadius: '8px',
              color: '#2c3e50',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.paddingLeft = '20px';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.paddingLeft = '16px';
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function WelcomeBanner() {
  return (
    <div className="welcome-container" style={{
      textAlign: 'center',
      padding: '3rem',
      marginBottom: '2rem',
      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      borderRadius: '16px',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to AI-Based Classroom</h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
        Discover, learn, and grow with our extensive collection of courses.
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="content-card" style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>{title}</h3>
      <p style={{ color: '#666' }}>{description}</p>
    </div>
  );
}

function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <WelcomeBanner />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        padding: '1rem'
      }}>
        <FeatureCard 
          icon="📚"
          title="Rich Course Library"
          description="Access a wide variety of courses across different domains"
        />
        <FeatureCard 
          icon="🎯"
          title="Interactive Learning"
          description="Engage with interactive content and assessments"
        />
        <FeatureCard 
          icon="🚀"
          title="Track Progress"
          description="Monitor your learning journey with detailed progress tracking"
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{
      display: 'flex',
      backgroundColor: "#f4f4f4",
      minHeight: '100vh'
    }}>
      <Router>
        <MenuBar />
        <div style={{
          marginLeft: '250px',
          padding: '2rem',
          width: '100%'
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/addcourse" element={<Addcourse/>} />
            <Route path="/courselist" element={<Courses />} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/signin" element={<Signin/>} />
            <Route path="/mcq" element={<MCQ/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}


export default App;

