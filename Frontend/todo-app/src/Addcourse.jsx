import { useState } from "react";
import { endpoints } from './config';

function Addcourse() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleAddCourse = async () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            alert("Please login first!");
            return;
        }
    
        try {
            const response = await fetch(endpoints.adminCourses, {
                method: "POST",
                body: JSON.stringify({
                    title,
                    description
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert("Course added successfully!");
                setTitle('');
                setDescription('');
            } else {
                alert(data.message || "Failed to add course!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    };
    
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "90vh",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            padding: "20px"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "15px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "600px",
                animation: "fadeIn 0.5s ease-out"
            }}>
                <h2 style={{
                    textAlign: "center",
                    color: "#2d3748",
                    marginBottom: "30px",
                    fontSize: "28px",
                    fontWeight: "600"
                }}>Add New Course</h2>

                <div style={{
                    marginBottom: "20px"
                }}>
                    <label style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#4a5568",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}>Course Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "16px",
                            transition: "all 0.3s ease",
                            outline: "none"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#4299e1"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                        placeholder="Enter course title"
                    />
                </div>

                <div style={{
                    marginBottom: "30px"
                }}>
                    <label style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#4a5568",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}>Course Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "16px",
                            transition: "all 0.3s ease",
                            outline: "none",
                            minHeight: "150px",
                            resize: "vertical",
                            fontFamily: "inherit"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#4299e1"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                        placeholder="Enter course description"
                    />
                </div>

                <button
                    onClick={handleAddCourse}
                    style={{
                        width: "100%",
                        padding: "14px",
                        background: "linear-gradient(45deg, #4299e1 0%, #667eea 100%)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11)"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 7px 14px rgba(50, 50, 93, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 4px 6px rgba(50, 50, 93, 0.11)";
                    }}
                >
                    Add Course
                </button>

                <div style={{
                    marginTop: "20px",
                    padding: "15px",
                    backgroundColor: "#f7fafc",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#718096",
                    textAlign: "center"
                }}>
                    Make sure to fill in all the details before adding a new course.
                </div>
            </div>
        </div>
    );
}

export default Addcourse;