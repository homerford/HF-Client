// All imports must be done before the main function
    // Importing this page's CSS file
import '../assets/styles/Admin2.css';

// Importing common files used in react
import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated, useTrail, config } from 'react-spring';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";
import Charts from '../components/Charts';

// Importing the components used in this page
import Loading from '../components/Loading';

// Log variables
var gotFeedback = false;
var selectedFeedback = [];

const feedbackCategories = {
    0: "Staff",
    1: "Court",
    2: "Facility",
    3: "Suggestion",
    4: "Website",
    5: "Other",
}

const feedbackRatings = {
    0: "Awful",
    1: "Bad",
    2: "Okay",
    3: "Good",
    4: "Great",
}

// Main function for the specific 'page'
function Admin(props) {
    const [loggedIn, setLogginIn] = useState(window.sessionStorage.getItem('current_user') ? true : false);
    const [currentUser, setCurrentUser] = useState(JSON.parse(window.sessionStorage.getItem('current_user')));
    const [selectedFilename, setSelectedFilename] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [feedbackListFinal, setFeedbackListFinal] = useState([]);
    const [userListFinal, setUserListFinal] = useState([]);
    const [userListSort, setUserListSort] = useState('asc');
    const [userListSortType, setUserListSortType] = useState(0);

    const [pieData, setPieData] = useState([{
        x: "1", y: 1
    }]);
    const [lineData, setLineData] = useState([{
        x: "1", y: 1
    }]);
    const [barData, setBarData] = useState([{
        user: "1", duration: 1
    }]);

    const [userItemStyle, setUserItemStyle] = useSpring(() => ({ x: 2 }))

    async function getPieData() {
        let query = `
            SELECT USER.User_firstname, USER.User_lastname, COUNT(RESERVATION.Customer_id) AS total_reservations
            FROM USER
            JOIN RESERVATION ON USER.User_id = RESERVATION.Customer_id
            GROUP BY USER.User_id
            ORDER BY total_reservations DESC
            LIMIT 5
        `;
        let response = await fetch("http://3.218.225.62:3040/report/download", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({report_query: query})
        });
        response = await response.json();
        
        let converted_chart_data = response.report.map((data, idx) => {
            return {
                x: `${data.User_firstname} ${data.User_lastname.substring(0,1)}.`,
                y: data.total_reservations
            }
        })

        setPieData(converted_chart_data);
    }

    // async function getLineData() {
    //     let query = `
    //         SELECT 
    //             date_format(STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date,
    //             COUNT(RESERVATION.Reservation_id) AS Total_Reservations
    //         FROM RESERVATION
    //         WHERE Reservation_status = 1
    //         GROUP BY Date
    //         LIMIT 7
    //     `;
    //     let response = await fetch("http://3.218.225.62:3040/report/download", {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({report_query: query})
    //     });
    //     response = await response.json();
        
    //     let converted_chart_data = response.report.map((data, idx) => {
    //         return {
    //             x: data.Date,
    //             y: data.Total_Reservations
    //         }
    //     })

    //     setLineData(converted_chart_data);
    // }

    async function getBarData() {
        let query = `
            SELECT date_format(STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date, COUNT(RESERVATION.Customer_id) AS Reservations
            FROM RESERVATION
            WHERE STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y') >= STR_TO_DATE(date_format(curdate(), '%m/%e/%Y'), '%m/%e/%Y')
            AND RESERVATION.Reservation_status = 1
            GROUP BY Date
            ORDER BY Reservations DESC
            LIMIT 10
        `;
        let response = await fetch("http://3.218.225.62:3040/report/download", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({report_query: query})
        });
        response = await response.json();
        
        let converted_chart_data = response.report.map((data, idx) => {
            return {
                user: data.Date,
                duration: data.Reservations
            }
        })

        // console.log(converted_chart_data);

        setBarData(converted_chart_data);
    }

    // Regular varaible declaration
    var isMobile = props.isMobile;

    // 'useEffect' runs once for every render of the page
    useEffect(() => {
        let isCancelled = false;

        if(!isCancelled) {
            if(!gotFeedback) {
                getFeedback();
            }
            getUsers();
            getPieData();
            // getLineData();
            getBarData();
        }

        return () => { isCancelled = true };
    }, [userListSortType, userListSort]);

    // Server functions
    async function getFeedback() {
        setFeedbackListFinal(["Loading..."]);
        let response = await fetch("http://3.218.225.62:3040/feedback/getall");
        response = await response.json();
        setFeedbackListFinal(response.items);
        // setFeedbackListFinal(response.files);
    }

    async function getUsers() {
        let response = await fetch("http://3.218.225.62:3040/user/getall");
        response = await response.json();
        setUserListFinal(response.users);
    }

    // Handling functions
    function resetSelected() {
        setSelectedFilename('');
        setSelectedFeedback(null);
        setFeedbackListFinal([]);
    }

    function handleFeedbackSelect() {

    }

    // Borrowed from: https://stackoverflow.com/a/33193668/17127255
    function scrollToBottom(id) {
        var element = document.getElementById(id);
        element.scrollTop = element.scrollHeight - element.clientHeight;
    }
    
    function handleButtonSort() {
        if(userListSort == "desc") {
            setUserListSort("asc");
        }
        else {
            setUserListSort("desc");
        }
        document.querySelector(".admin2-btn-sort").classList.toggle("desc");
    }

    // Sorting functions
    function sortObjectList(list, keyID, AscOrDesc) {
        /* Current supports ASC or DESC sort with numbers or strings */
        let keyValue = list[Object.keys(list)[0]];
        let keyValueType = typeof keyValue;

        if(keyValueType !== 'undefined') {
            keyValue = keyValue[Object.keys(keyValue)[keyID]]
            keyValueType = typeof keyValue;

            if(keyValueType === 'string') {
                if(AscOrDesc == "asc") {
                    return [...list].sort((a,b) => (a[Object.keys(a)[keyID]]).localeCompare(b[Object.keys(b)[keyID]]));
                }
                else if(AscOrDesc == "desc") {
                    return [...list].sort((a,b) => (b[Object.keys(b)[keyID]]).localeCompare(a[Object.keys(a)[keyID]]));
                }
                else {
                    return ["Error"];
                }
            }
            else {
                if(AscOrDesc == "asc") {
                    return [...list].sort((a,b) => a[Object.keys(a)[keyID]] - b[Object.keys(b)[keyID]]);
                }
                else if(AscOrDesc == "desc") {
                    return [...list].sort((a,b) => b[Object.keys(b)[keyID]] - a[Object.keys(a)[keyID]]);
                }
                else {
                    return ["Error"];
                }
            }
        }
        else {
            return["Loading"]
        }
    }

    return (
        <>
            <div className="container-admin2">
                <div className="container-admin2-content">
                    <div className="container-admin2-content-item-reservations">
                        <div className="container-admin2-content-item-title">Data Reports</div>
                        <div className="container-admin2-content-item-body-report">
                            <div className="container-report-item" style={{height: "25vmin"}}>
                                {/* Pie Chart - Number of Reservations for each Court over the Past Month */}
                                <span className="admin2-chart-title">Top 5 Users by Total Reservations</span>
                                <Charts chartData={pieData} chartType={"pie"}/>
                            </div>
                            {/* <div className="container-report-item">
                                <span className="admin2-chart-title">Number of Reservations for the Next 7 Days</span>
                                <Charts chartData={lineData} chartType={"line"}/>
                            </div> */}
                            <div className="container-report-item" style={{height: "25vmin"}}>
                                {/* Bar Chart - Top 10 users by cumulative reservation duration over the last month */}
                                <span className="admin2-chart-title">10 Busiest Upcoming Dates <br/>(By Reservation #)</span>
                                <Charts chartData={barData} chartType={"bar"}/>
                            </div>
                            <div className="container-report-item-more"
                                onClick={() => {
                                    window.location.href = "/reports";
                                }}
                            >
                                See all data reports
                            </div>
                        </div>
                    </div>
                    <div className="container-admin2-content-item-users">
                        <div className="container-admin2-content-item-title">
                            Users
                            <select className="admin2-btn-sort-type"
                                style={{marginLeft: 'auto'}}
                                onChange={(e) => {
                                    setUserListSortType(e.target.value);
                                }}
                            >
                                <option value={0}>ID</option>
                                <option value={3}>Email</option>
                                <option value={1}>Type</option>
                            </select>
                            <div className="admin2-btn-sort"
                                onClick={() => {
                                    handleButtonSort();
                                }}
                            >{userListSort}</div>
                        </div>
                        <div className="container-admin2-content-item-body-user">
                            {sortObjectList(userListFinal, userListSortType, userListSort).map((user,index) => {
                                return (
                                    <Link key={index} className="container-user-item" to={"/test/"+user.User_id}
                                        style={{
                                            color: (user.User_type == 2) 
                                            ? "rgba(50, 168, 82,0.9)" 
                                            : (user.User_type == 1) 
                                                ? "rgba(36, 101, 181,0.7)" 
                                                : "rgba(0,0,0,0.5)",
                                        }}
                                    >
                                        {user.User_id} - {user.User_email}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                    <div className="container-admin2-content-item-logs">
                        <span className="container-admin2-content-item-title">
                            {selectedFeedback != null
                            ? <>
                                <div className="admin2-btn-back"
                                    onClick={() => {
                                        getFeedback();
                                        resetSelected();
                                    }}
                                ></div>
                                <div style={{fontSize: "1.25vmin", color: "rgba(66, 135, 245,1)"}}>{selectedFeedback.Feedback_date} - {selectedFeedback.email}</div>
                            </> 
                            : "Feedback"}
                        </span>
                        <div className="container-admin2-content-item-body-log" id="log-scroller">
                            {!selectedFeedback && feedbackListFinal.map((item,index) => {
                                let user_email = userListFinal.find(user => user.User_id == item.Customer_id) ? userListFinal.find(user => user.User_id == item.Customer_id).User_email : "Loading...";
                                return (
                                    <div 
                                        className="feedback-item" 
                                        key={index} 
                                        style={
                                            item.Feedback_rating == 0 ? {color: "#F4511E"} :
                                            item.Feedback_rating == 1 ? {color: "#F4511E"} :
                                            item.Feedback_rating == 2 ? {color: "#FFB921"} :
                                            item.Feedback_rating == 3 ? {color: "#B3D667"} :
                                            {color: "#B3D667"}
                                        }
                                        onClick={() => {
                                            // if(selectedFilename == "") {
                                            //     setSelectedFilename(log);
                                            //     getLogfile(log);
                                            // }
                                            setSelectedFeedback({...item, email: user_email});
                                        }}
                                    >
                                        {item.Feedback_date} - {user_email}
                                    </div>
                                )
                            })}
                            {selectedFeedback && Object.values(selectedFeedback).map((value,index) => {
                                return (
                                    <div key={index} style={{width: "100%"}}>
                                        {index == 1 && <div 
                                            className="feedback-item" 
                                            style={{pointerEvents: "none"}}
                                        >
                                            Category: {Object.values(feedbackCategories)[value]}
                                        </div>}
                                        {index == 2 && <div 
                                            className="feedback-item" 
                                            style={{pointerEvents: "none"}}
                                        >
                                            Experience: {Object.values(feedbackRatings)[value]}
                                        </div>}
                                        {index == 3 && <div 
                                            className="feedback-item" 
                                            style={{pointerEvents: "none"}}
                                        >
                                            Note: {value}
                                        </div>}
                                        {index == 4 && <div 
                                            className="feedback-item" 
                                            style={{pointerEvents: "none"}}
                                        >
                                            Date: {value}
                                        </div>}
                                        {index == 6 && <div 
                                            className="feedback-item" 
                                            style={{pointerEvents: "none"}}
                                        >
                                            Email: {value}
                                        </div>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="container-admin2-content-item-reports">
                        <div className="container-admin2-content-item-title">Reservation System Manager</div>
                        <div className="container-admin2-content-item-body-reservation">
                            <div className="container-admin2-reservation-item"
                                onClick={() => {
                                    window.location.href = "/reserveadmin";
                                }}
                            >
                                <div className="container-admin2-reservation-button">
                                    <div className="container-admin2-reservation-button-img"></div>Launch App
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {loggedIn && <div className="user-welcome">Welcome back, <b style={{marginLeft: '0.5vmin'}}>{currentUser.User_firstname}</b>!</div>}
            </div>
            <Loading timeRange={[1000, 2000]} />
        </>
    )
}

// Function must be 'exposed' to rest of the application at the end of the file as shown below.
export default Admin;