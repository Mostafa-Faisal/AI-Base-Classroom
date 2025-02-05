import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from './config';

function MCQ() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Check authentication when component mounts
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "null") {
            alert("Please login first!");
            navigate("/signin");
            return;
        }

        // Verify token validity with backend
        fetch(endpoints.adminMe, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Authentication failed");
            }
            return res.json();
        })
        .catch(() => {
            alert("Please login first!");
            navigate("/signin");
        });
    }, [navigate]);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        if (!token || token === "null") {
            alert("Please login first!");
            navigate("/signin");
            return;
        }

        setLoading(true);
        setError(null);

        const file = e.target.files[0];
        if (!file) {
            setError("Please select a file");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("pdf_file", file);

        try {
            const response = await fetch(endpoints.mcqUpload, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': "Bearer " + token
                },
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    alert("Please login first!");
                    navigate("/signin");
                    return;
                }
                throw new Error(`Server error: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.questions && data.questions.length > 0) {
                setQuestions(data.questions);
                setError(null);
            } else {
                throw new Error("No questions received from server");
            }
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                setError("Cannot connect to server. Please make sure the server is running.");
            } else {
                setError(error.message || "Error uploading file");
            }
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "#f4f4f4",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
        }}>
            <div style={{
                maxWidth: "800px",
                width: "100%",
                textAlign: "center",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h1 style={{color: "#333", marginBottom: "20px"}}>Generate Questions</h1>
                <div style={{marginBottom: "20px"}}>
                    <h2 style={{color: "#666"}}>Upload PDF</h2>
                    <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileUpload}
                        style={{
                            margin: "10px 0",
                            padding: "10px"
                        }}
                    />
                    {loading && (
                        <p style={{color: "#666"}}>
                            Generating questions... Please wait...
                        </p>
                    )}
                    {error && (
                        <p style={{color: "red", margin: "10px 0"}}>
                            {error}
                        </p>
                    )}
                </div>

                {questions.length > 0 && (
                    <div style={{
                        marginTop: "20px",
                        padding: "15px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "4px",
                        textAlign: "left"
                    }}>
                        <h2 style={{color: "#333", textAlign: "center"}}>Generated Questions:</h2>
                        <ol style={{
                            paddingLeft: "20px",
                            margin: "15px 0"
                        }}>
                            {questions.map((question, index) => (
                                <li key={index} style={{
                                    color: "#444",
                                    fontSize: "1.1em",
                                    lineHeight: "1.4",
                                    marginBottom: "15px",
                                    padding: "10px",
                                    backgroundColor: "white",
                                    borderRadius: "4px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                                }}>
                                    {question}
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MCQ;