// All imports must be done before the main function
    // Importing this page's CSS file
    import '../assets/styles/About.css';
    // Importing common files used in react
    import React, { useEffect, useRef, useState } from "react";
    
    // Importing the components used in this page
    import Loading from '../components/Loading';
    
    // Main function for the specific 'page'
    function About(props) {
        const [loggedIn, setLogginIn] = useState(window.sessionStorage.getItem('current_user') ? true : false);
        const [currentUser, setCurrentUser] = useState(JSON.parse(window.sessionStorage.getItem('current_user')));
    
        // Regular varaible declaration
        const pageTitle = "About"
        var isMobile = props.isMobile;

        const faqInfo = [
            {
                title: "Are the courts open to the public?",
                body: `Homer Ford Tennis Center is open to the public. Courts require a rental fee to use. Please check-in at the Pro shop found at the front of the tennis center.`
            },
            {
                title: "What are the hours of operation?",
                body: `Weekdays: 7:30 AM – 9:00 PM
                Weekends: 7:30 AM – 6:00 PM
                Closed: December 25th, Thanksgiving, January 1st`
            },
            {
                title: "How can I rent a court?",
                body: `You can rent a court either in person, over the phone, or online. Reservations can be made up to a week in advance.`
            },
            {
                title: "What are the court fees?",
                body: `Prime time reservations are on weekdays after 4pm and weekends. Non-prime time is weekdays before 4pm. Fees to use a court will be dependent on majority of your reservation time falls under.
                Non-prime 1h30mins: $4.00
                Non-prime 2hrs: $5.00
                Prime 1h30mins: $6.00
                Prime 2hrs: $8.00`
            },
            {
                title: "Do you offer tennis lessons for adults?",
                body: `We do offer tennis lessons at our facility. Please contact the manager for more information:
                Roger White: (832)373-8798`
            },
            {
                title: "Do you offer tennis lessons for kids?",
                body: `The Zina Garrison Academy is hosted at our facility; a youth tennis program that offers lessons to kids from ages 6-18. For more information, please visit their website at https://www.zinagarrison.org/`
            },
            {
                title: "Do you offer equipment rentals?",
                body: `Current equipment that we rent out is a ball machine. For additional equipment, ask at the front desk.`
            },
            {
                title: "Do you have tournaments or leagues?",
                body: `We do host tournaments and leagues at our tennis center. Contact the manager for more information to get involved in either one.
                Roger White: (832)373-8798`
            },
            {
                title: "Are pets allowed at your facility?",
                body: `Pets are not allowed within the gates of our facility.`
            },
            {
                title: "If you have any further questions, please contact our manager:",
                body: `Roger White: (832)373-8798`
            },
        ]
    
        // 'useEffect' runs once for every render of the page
        useEffect(() => {

        });

        function faqItem() {
            // var string = rawString.replace(/\n/g, '<br>');
            return (
                <>
                    <div className="faq-item-container">
                        <span className="faq-item-title"></span>
                        <span className="faq-item-body"></span>
                    </div>
                </>
            );
        }
        
        return (
            // Empty root element. The return can have only one root element
            <>
                <div className="container-about">
                    <div className="test-container">
                        <div className="top-row">
                            <div className="top-item-container" style={{width: "90%"}}>
                                <div className="map-item-1" />
                            </div>
                            <div className="top-item-container">
                                <div className="map-item-2" />
                            </div>
                        </div>
                        <div className="bottom-row">
                            {faqInfo.map((val, idx) => {
                                return (
                                    <div className="faq-item-container" key={idx}>
                                        <span className="faq-item-title"><b>{val.title}</b></span>
                                        <span className="faq-item-body">{val.body}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    {loggedIn && <div className="user-welcome">Welcome back, <b style={{marginLeft: '0.5vmin'}}>{currentUser.User_firstname}</b>!</div>}
                </div>
                <Loading timeRange={[250, 500]} />
            </>
        )
    }
    
    // Function must be 'exposed' to rest of the application at the end of the file as shown below.
    export default About;