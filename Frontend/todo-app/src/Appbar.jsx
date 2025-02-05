import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { endpoints } from './config';

function Appbar() {

    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {

        function callback2(data) {
            if (data.username) {
                setUserEmail(data.username);
            }
        }

        function callback1(res) {
            res.json().then(callback2)
        }

        fetch(endpoints.adminMe, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(callback1);
    }, []);

    if (userEmail) {
        
        return (
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
             
            <div style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1" style={{ marginRight: 10 }}>{userEmail}</Typography>
                <Button variant={"contained"}
                onClick={() => {
                    localStorage.setItem("token", null);
                    window.location = "./";
                }}
                >Log Out</Button>
            </div>
            </div>
        );


    }

    return <div style={{display: "flex" , justifyContent: "space-between"}}>
        <div>
            <Typography variant="h4">AI-Based Classroom</Typography>
        </div>


        <div style={{display: "flex", justifyContent: "space-between"}}>
            <div>
                <Button variant={"contained"}
                onClick={() => {
                    window.location = "./signup"
                }}
                >Sign Up</Button>
            </div>
            <div style={{marginLeft: 5}}>
                <Button variant={"contained"}
                onClick={() => {
                    window.location = "./signin"
                }}
                >Sign In</Button>
            </div>
        </div>
    </div>
}

export default Appbar;

