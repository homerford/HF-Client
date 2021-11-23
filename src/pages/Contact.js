// All imports must be done before the main function
    // Importing this page's CSS file
    import '../assets/styles/Contact.css';

    // Importing common files used in react
    import React, { useEffect, useRef, useState } from "react";
    
    // Importing the components used in this page
    import Loading from '../components/Loading';
    import AlertMessage from '../components/AlertMessage';
    
    // Main function for the specific 'page'
    function Contact(props) {
        const [loggedIn, setLogginIn] = useState(window.sessionStorage.getItem('current_user') ? true : false);
        const [currentUser, setCurrentUser] = useState(JSON.parse(window.sessionStorage.getItem('current_user')));
        const [alertMessage, setAlertMessage] = useState({
            msg: "",
            type: ""
        });
        const [feedbackType, setFeedbackType] = useState(0);
        const [feedbackRating, setFeedbackRating] = useState(4);
        const [feedbackNote, setFeedbackNote] = useState("");
    
        // Regular varaible declaration
        const pageTitle = "Contact"
        var isMobile = props.isMobile;
    
        // 'useEffect' runs once for every render of the page
        useEffect(() => {

        });

        function formatDate(date) {
            return (
                date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear()
            )
        }

        async function handleSubmitFeedback() {
            if (feedbackNote.length > 0) {
                fetch("http://52.4.223.125:3040/feedback/add/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: parseInt(feedbackType),
                        rating: parseInt(feedbackRating),
                        note: feedbackNote,
                        customer_id: currentUser.User_id,
                        date: formatDate(new Date())
                    })
                })
                    .then(res => res.json())
                    .then(() => {
                        sendAlertMessage("Thank you for your feedback!", "Good");
                        resetSelected();
                    })
                    .catch(err => {
                        sendAlertMessage("Feedback submission failed!", "Bad");
                        resetSelected();
                    });
            }
            else {
                sendAlertMessage("Please enter a feedback note!", "Bad");
            }
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

        function resetSelected() {
            setFeedbackNote("");
            setFeedbackRating(4);
            setFeedbackType(0);
        }
    
        return (
            // Empty root element. The return can have only one root element
            <>
                <div className="container-contact">
                    <AlertMessage alertMessage={alertMessage}/>
                    <div className="contact-content">
                        <div className="contact-info">
                            <h2 style={{fontWeight: "bold"}}>How to Reach Us</h2>
                            <p>Phone: 713-842-3460</p>
                            <p>Address: <a href="https://goo.gl/maps/Q8n6Xyq7nPtuPWWQ6" target="_blank">5225 Calhoun, 77021 Houston TX</a></p>
                            <p>
                                <span style={{fontWeight: "bold"}}>Hours of operation:</span>
                                <br/>
                                Weekdays: 7:30 AM – 9:00 PM 
                                <br/>
                                Weekends: 7:30 AM – 6:00 PM 
                                <br/>
                                Closed: Thanksgiving, December 25th, January 1st<br/>
                            </p>
                            <p>
                                <span style={{fontWeight: "bold"}}>Manager:</span>
                                <br/>
                                Roger White: 832-373-8798
                            </p>
                        </div>
                        {loggedIn && <form className="feedback-form-container">
                            <span style={{fontSize: "1.25vmin", marginBottom: "1vmin"}}>Please submit feedback about your experience below!</span>
                            <textarea className="feedback-input" rows="4" cols="50"
                                onChange={(e) => setFeedbackNote(e.target.value)}
                                value={feedbackNote}
                            ></textarea>
                            <div className="contact-row">
                                <div className="contact-row-item">
                                    <span style={{fontSize: "1.1vmin", marginBottom: "0.5vmin"}}>Category: </span>
                                    <select name="feedback-type" className="contact-select"
                                        onChange={(e) => setFeedbackType(e.target.value)}
                                    >
                                        <option value="0">Staff</option>
                                        <option value="1">Court</option>
                                        <option value="2">Facility</option>
                                        <option value="3">Suggestion</option>
                                        <option value="4">Website</option>
                                        <option value="5">Other</option>
                                    </select>
                                </div>
                                <div className="contact-row-item">
                                    <span style={{fontSize: "1.1vmin", marginBottom: "0.5vmin"}}>Experience: </span>
                                    <select name="feedback-rating" className="contact-select" defaultValue="4"
                                        onChange={(e) => setFeedbackRating(e.target.value)}
                                    >
                                        <option value="0">Awful</option>
                                        <option value="1">Bad</option>
                                        <option value="2">Okay</option>
                                        <option value="3">Good</option>
                                        <option value="4">Great</option>
                                    </select>
                                </div>
                            </div>
                        
                            <button className="feedback-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSubmitFeedback();
                                }}
                            >Submit</button>
                        </form>}
                    </div>
         
                    {loggedIn && <div className="user-welcome">Welcome back, <b style={{marginLeft: '0.5vmin'}}>{currentUser.User_firstname}</b>!</div>}
                </div>
                <Loading timeRange={[250, 500]} />
            </>
        )
    }
    
    // Function must be 'exposed' to rest of the application at the end of the file as shown below.
    export default Contact;