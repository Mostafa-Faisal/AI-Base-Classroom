import { useEffect, useState } from "react";  // Add useState import
import { endpoints } from './config';

function Courses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch(endpoints.adminCourses, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        .then((response) => {
            response.json().then((data) => {
                // console.log(data.courses);
                setCourses(data.courses);
            })
        })
    }, []);

    return (
        <div style={{ padding: "20px", background: "white" }}>
            <h1>Courses</h1>
            <div style={{ display: "grid", gap: "20px"}}>
                {courses.map((course) => (
                    <div  
                        key={course._id} 
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            borderRadius: "8px",
                            background: "lightblue"
                        }}
                    >
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Courses;