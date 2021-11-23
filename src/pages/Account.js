// All imports must be done before the main function
    // Importing this page's CSS file
import '../assets/styles/Account.css';

// Importing common files used in react
import React, { useEffect, useRef, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
  } from "react-router-dom";

// Importing the components used in this page
import Loading from '../components/Loading';

// Imorting the components used in this page
import AlertMessage from '../components/AlertMessage';

// Main function for the specific 'page'
function Account(props) {
    const [loggedIn, setLogginIn] = useState(window.sessionStorage.getItem('current_user') ? true : false);
    const [currentUser, setCurrentUser] = useState(JSON.parse(window.sessionStorage.getItem('current_user')));
    const [userReservations, setUserReservations] = useState([]);
    const [alertMessage, setAlertMessage] = useState({
        msg: "",
        type: ""
    });
    const [userAlertStatus, setUserAlertStatus] = useState(JSON.parse(window.sessionStorage.getItem('current_user')).User_getAnnouncements);

    // Regular varaible declaration
    var isMobile = props.isMobile;

    // 'useEffect' runs once for every render of the page
    useEffect(() => {
        getUserReservations();
    },[]);

    // Handling functions
    async function getUserReservations() {
        let response = await fetch("http://52.4.223.125:3040/reservation/get-user/"+currentUser.User_id);
        response = await response.json();
        setUserReservations(response.reservations);
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

    function toggleUserAlerts() {
        fetch("http://52.4.223.125:3040/user/update-getannouncements", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: currentUser.User_id,
                getannouncements: currentUser.User_getAnnouncements ? 0 : 1
            })
        })
            .then(res => res.json())
            .then(data => {
                let updatedUser = JSON.parse(window.sessionStorage.getItem('current_user'));
                updatedUser.User_getAnnouncements = userAlertStatus ? 0 : 1;
                window.sessionStorage.setItem('current_user', JSON.stringify(updatedUser));
                setUserAlertStatus(updatedUser.User_getAnnouncements);
            })
            .catch(err => {
                sendAlertMessage("Error updating alert status!", "Bad");
            });
    }

    function resetPassword() {
        window.location.href = "/password-reset/"+currentUser.User_id;
    }

    return (
        // Empty root element. The return can have only one root element
        <>
            <div className="container-account">
                <div className="account-content-container">
                    <div className="account-row">
                        <div className="account-info-container">
                            <div className="account-info-item" style={{opacity: '100%', fontSize: '4.25vmin'}}>
                                {currentUser.User_firstname} {currentUser.User_lastname}
                            </div>
                            <div className="account-info-item" style={{opacity: '65%', fontSize: '2.5vmin', marginLeft: '5vmin'}}>
                                {currentUser.User_email}
                            </div>
                            <div className="account-info-item" style={{opacity: '65%', fontSize: '2.5vmin', marginLeft: '5vmin'}}>
                                {currentUser.User_phone}
                            </div>
                            <div className="account-info-item" style={{opacity: '65%', fontSize: '2.5vmin', marginLeft: '5vmin'}}>
                                {currentUser.User_type == 2 ? "Administrator" : currentUser.User_type == 1 ? "Employee" : "Customer"}
                            </div>
                            <div className="account-info-item" style={{opacity: '65%', fontSize: '2.5vmin', marginLeft: '5vmin'}}>
                                {currentUser.User_status == 1 ? "Verified Account" : currentUser.User_status == 0 ? "Account Inactive" : "Account Pending"}
                            </div>
                            <div className="account-info-item" 
                                style={{
                                    opacity: '40%', 
                                    fontSize: '1.25vmin', 
                                    marginLeft: '1.5vmin', 
                                    marginRight: 'auto',
                                    backgroundColor: "transparent",
                                    width: '25vmin',
                                    height: '6vmin',
                                    boxShadow: "0px 3px 5px 0px rgba(0,0,0,0.0)",
                                    borderRadius: "1vmin",
                                    padding: "1vmin",
                                    color: "red"
                                }}
                            >
                                Please call or email us to update your account information!
                            </div>
                            <div className="account-info-item" style={{marginLeft: '4vmin', marginTop: "auto"}}>
                                <span className="account-password-reset-btn active" style={{width: "25vmin"}}
                                    onClick={() => resetPassword()}
                                >Change Password</span>
                                <span className={`account-password-reset-btn ${userAlertStatus == 1 ? "active" : ""}`}
                                    style={{
                                        backgroundColor: "rgba(245, 158, 66, 0.8)",
                                    }}
                                    onClick={() => toggleUserAlerts()}
                                >
                                    Alerts: {userAlertStatus == 0 ? "Off" : "On"}
                                </span>
                            </div>
                        </div>
                        <div className="account-img" />
                    </div>
                    <div className="account-column-title">Reservation Overview</div>
                    <div className="account-column">
                        {userReservations.length > 0 && userReservations.map((res, index) => {
                            return (
                                <Link to="/reserve" className="account-column-item" key={index}>
                                    <span>{res.Reservation_date}</span>
                                    <span>{res.Reservation_duration} hour(s)</span>
                                    <span>{res.Reservation_people} {res.Reservation_people == 1 ? "person" : "people"}</span>
                                </Link>
                            )
                        })}
                        {userReservations.length == 0 && 
                            <div className="account-column-item"
                                style={{
                                    backgroundColor: "rgba(245, 158, 66, 0.0)",
                                    boxShadow: 'none',
                                    backgroundImage: "none",
                                    width: "100%",
                                    padding: "0.25vmin",
                                    border: 'none'
                                }}
                            >
                                <span>You haven't made any reservations yet...</span>
                            </div>
                        }
                    </div>
                </div>
                {loggedIn && <div className="user-welcome">Welcome back, <b style={{marginLeft: '0.5vmin'}}>{currentUser.User_firstname}</b>!</div>}
                <div className="login-response-container"><AlertMessage alertMessage={alertMessage}/></div>
            </div>
            <Loading timeRange={[500, 750]} />
        </>
    )
}

// Function must be 'exposed' to rest of the application at the end of the file as shown below.
export default Account;