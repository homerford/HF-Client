// All imports must be done before the main function
    // Importing this page's CSS file
    import '../assets/styles/Login.css';

    // Importing common files used in react
    import React, { useEffect, useRef, useState } from "react";
    
    // Imorting the components used in this page
    import AlertMessage from '../components/AlertMessage';
    
    // Importing the router files
    import {
        BrowserRouter as Router,
        Switch,
        Route,
        Link,
        useParams
    } from "react-router-dom";
    
    // Main function for the specific 'page'
    function PasswordReset(props) {
        const [alertMessage, setAlertMessage] = useState({
            msg: "",
            type: ""
        });
        const [password1, setPassword1] = useState("");
        const [password2, setPassword2] = useState("");

        let { id } = useParams();

        function handlePasswordUpdate() {
            if (passwordIsValid(password1) && (password1 === password2)) {
                fetch("http://52.4.223.125:3040/user/update-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: id,
                        password: password1
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        sendAlertMessage("Password updated successfully! You will be redirected to the login page shortly...", "Good");
                        setTimeout(() => {
                            window.location.href = "/login";
                        }, 2000);
                    })
                    .catch(err => {
                        sendAlertMessage("Password update failed!", "Bad");
                    });
            } else {
                sendAlertMessage("Passwords do not match or are invalid!", "Bad");
            }
            setPassword1("");
            setPassword2("");
        }

        function passwordIsValid(value) {
            let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
            if(value.match(regex) == null) {
                return false;
            }
            return true;
        }

        function sendAlertMessage(message, type) {
            setAlertMessage({
                msg: "",
                type: ""
            });
            setAlertMessage({
                msg: message,
                type: type
            });
        }
    
        return (
            // Empty root element. The return can have only one root element
            <>
                <div className="container-login">
                    <div className="login-window-container active">
                        <div className="login-window-head">
                            <span className="login-title">Password Reset</span>
                        </div>
                        <div className="login-window-body" style={{backgroundColor: "transparent"}}>
                            <form className="login-form" style={{backgroundColor: "transparent", boxShadow: "none"}}>
                                
                                <div className="login-input-container" style={{flexDirection: "column", height: "auto", padding: "1vmin", boxShadow: "none"}}>
                                    <span className="login-input-label">New Password: </span>
                                    <input className="login-input" type="password" value={password1} style={{width: "30vmin", fontSize: "2vmin", margin: "0", height: "3vmin"}}
                                        onChange={e => {
                                            setPassword1(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="login-input-container" style={{flexDirection: "column", height: "auto", padding: "1vmin", boxShadow: "none", marginTop: "1vmin"}}>
                                    <span className="login-input-label">Confirm New Password: </span>
                                    <input className="login-input" type="password" value={password2} style={{width: "30vmin", fontSize: "2vmin", margin: "0", height: "3vmin"}}
                                        onChange={e => {
                                            setPassword2(e.target.value);
                                        }}
                                    />
                                </div>
                                <span style={{textAlign: "center", fontFamily: "Round", opacity: "50%", fontSize: "1vmin", width: "40vmin", marginTop: "1vmin"}}>
                                    Remember! A password must contain at least one: special character, number, uppercase letter, and lowercase letter. Minimum 8 characters. Maximum 20 characters.
                                </span>
                                <div className="login-submit-button"
                                    style={{
                                        marginTop: "3vmin",
                                        height: "3vmin",
                                        width: "auto",
                                        padding: "2vmin",
                                        marginLeft: "0",
                                        marginRight: "0",
                                    }}
                                    onClick={() => {
                                        handlePasswordUpdate();
                                    }}
                                >
                                    Update Password
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div className="login-response-container"><AlertMessage alertMessage={alertMessage}/></div>
                </div>
            </>
        )
    }
    
    // Function must be 'exposed' to rest of the application at the end of the file as shown below.
    export default PasswordReset;