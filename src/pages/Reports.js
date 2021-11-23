import '../assets/styles/Reports.css';

// Importing common files used in react
import React, { useEffect, useRef, useState } from "react";

// Importing 3rd Party Dependencies
import { saveAs } from 'file-saver';

// Importing the components used in this page
import Loading from '../components/Loading';

function Reports() {
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportModalTitle, setReportModalTitle] = useState('');
    const [reportModalCategory, setReportModalCategory] = useState('');
    const [reportModalItems, setReportModalItems] = useState([]);

    const reports_reservations = [
        {
            title: `Planned Event Reservations`,
            description: `This report shows all future special event reservations that have been made.`,
            category: `Reservation`,
            query: `
                SELECT 
                    USER.User_email, 
                    date_format(STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y'), '%m/%e/%Y') AS Date, 
                    RESERVATION.Reservation_time AS Start_Time, 
                    RESERVATION.Reservation_duration AS Duration_Hours, 
                    RESERVATION.Reservation_note AS Note
                FROM RESERVATION
                JOIN USER ON USER.User_id = RESERVATION.Customer_id
                WHERE Reservation_type = 1
                AND STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y') >= STR_TO_DATE(date_format(curdate(), '%m/%e/%Y'), '%m/%e/%Y')
                AND RESERVATION.Reservation_status = 1
                ORDER BY UNIX_TIMESTAMP(STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y')) ASC
            `,
        },
        {
            title: `Today's Reservations`,
            description: `This report will show the number of customer reservations at the end of the day`,
            category: `Reservation`,
            query: `
                SELECT USER.User_firstname, USER.User_lastname, USER.User_phone, RESERVATION.Reservation_time, date_format(NOW(), '%m/%e/%Y') AS Date
                FROM RESERVATION
                JOIN USER ON USER.User_id = RESERVATION.Customer_id
                WHERE RESERVATION.Reservation_date = date_format(NOW(), '%m/%e/%Y')
                AND RESERVATION.Reservation_status = 1
            `,
        },
        {
            title: `Anticipated Reservations`,
            description: `This report will show the number of future customer reservations that have been made`,
            category: `Reservation`,
            query: `
                SELECT date_format(STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date, COUNT(RESERVATION.Customer_id) AS Todays_Reservations
                FROM RESERVATION
                WHERE STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y') >= STR_TO_DATE(date_format(curdate(), '%m/%e/%Y'), '%m/%e/%Y')
                AND RESERVATION.Reservation_status = 1
                GROUP BY Date
                ORDER BY Date ASC
            `,
        },
    ]

    const reports_users = [
        {
            title: `Most Frequent Users`,
            description: `This report orders all users by the number of reservations they've made.`,
            category: `User`,
            query: `
                SELECT USER.User_email, COUNT(RESERVATION.Customer_id) AS Total_Reservations
                FROM USER
                JOIN RESERVATION ON USER.User_id = RESERVATION.Customer_id
                GROUP BY USER.User_email
                ORDER BY total_reservations DESC
            `,
        },
        {
            title: `All Active Employees`,
            description: `All active employees in the database system`,
            category: `User`,
            query: `
                SELECT 
                    User_id, 
                    User_email, 
                    User_firstname, 
                    User_lastname, 
                    IF(User_type = '0', 'Customer', IF(User_type = '1', 'Employee', 'Manager')) AS Employee_Type
                FROM USER
                WHERE User_type = 1
                OR User_type  = 2
                AND User_status = 1
                ORDER BY User_id DESC
            `,
        },
        {
            title: `All Active Customers`,
            description: `All active customers in the database system`,
            category: `User`,
            query: `
                SELECT 
                    User_id, 
                    User_email, 
                    User_firstname, 
                    User_lastname, 
                    IF(User_type = '0', 'Customer', IF(User_type = '1', 'Employee', 'Manager')) AS Employee_Type
                FROM USER
                WHERE User_type = 0 
                AND User_status = 1
                ORDER BY User_id DESC
            `,
        },
        {
            title: `Customers With Alerts Enabled`,
            description: `This report will show all active customer accounts who've chosen to receieve email alerts.`,
            category: `User`,
            query: `
                SELECT 
                    User_email AS Email
                FROM USER
                WHERE User_getAnnouncements = 1
                AND User_type = 0
                AND User_status = 1
                ORDER BY User_email ASC
            `,
        },
    ]

    const reports_courts = [
        {
            title: `Number of Courts Used Today`,
            description: `This report will show the number of courts that were used for the day.`,
            category: `Court`,
            query: `
                SELECT 
                    date_format(STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date, 
                    SUM(JSON_LENGTH(RESERVATION.Court_id)) AS Total_Courts_Used
                    
                FROM RESERVATION
                WHERE RESERVATION.Reservation_date = date_format(curdate(), '%m/%e/%Y')
                AND RESERVATION.Reservation_status = 1
                ORDER BY UNIX_TIMESTAMP(STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y')) ASC
            `,
        },
        {
            title: `Number of Courts Used This Month`,
            description: `This report will show the number of courts that have been used for the current month.`,
            category: `Court`,
            query: `
                SELECT 
                    month(current_date()) AS Month,
                    year(current_date()) AS Year,
                    SUM(JSON_LENGTH(RESERVATION.Court_id)) AS Total_Courts_Used
                FROM RESERVATION
                WHERE month(STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y')) = month(current_date())
            `,
        },
        {
            title: `Number of Courts Used This Year`,
            description: `This report will show the number of courts that have been used for the current year.`,
            category: `Court`,
            query: `
                SELECT 
                    year(current_date()) AS Year,
                    SUM(JSON_LENGTH(RESERVATION.Court_id)) AS Total_Courts_Used
                FROM RESERVATION
                WHERE year(STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y')) = year(current_date())
            `,
        },
        {
            title: `Number of Courts Used Each Day`,
            description: `This report will show the number of courts that are used each day.`,
            category: `Court`,
            query: `
                SELECT 
                    date_format(STR_TO_DATE(RESERVATION.Reservation_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date, COUNT(RESERVATION.Court_id) AS Court_Count
                FROM RESERVATION
                WHERE Reservation_status = '1'
                GROUP BY Date
            `,
        },
    ]

    const reports_feedback = [
        {
            title: `Negative Feedback Received`,
            description: `This report will show all negative feedback received, ordered by most recent.`,
            category: `Feedback`,
            query: `
                SELECT 
                    date_format(STR_TO_DATE(Feedback_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date,
                    IF(Feedback_rating = '0', 'Awful', IF(Feedback_rating = '1', 'Bad', 'Okay')) AS Rating,
                    IF(Feedback_type = '0', 'Staff', IF(Feedback_type = '1', 'Court', IF(Feedback_type = '2', 'Facility', IF(Feedback_type = '3', 'Suggestion', IF(Feedback_type = '4', 'Website', 'Other'))))) AS Category,
                    USER.User_email AS Email,
                    Feedback_note AS Note
                FROM FEEDBACK
                JOIN USER ON USER.User_id = FEEDBACK.Customer_id
                WHERE Feedback_rating <= 2
                ORDER BY UNIX_TIMESTAMP(STR_TO_DATE(Feedback_date, '%m/%e/%Y')) ASC
            `,
        },
        {
            title: `Positive Feedback Received`,
            description: `This report will show all positive feedback received, ordered by most recent.`,
            category: `Feedback`,
            query: `
                SELECT 
                    date_format(STR_TO_DATE(Feedback_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date,
                    IF(Feedback_rating = '3', 'Good', 'Great') AS Rating,
                    IF(Feedback_type = '0', 'Staff', IF(Feedback_type = '1', 'Court', IF(Feedback_type = '2', 'Facility', IF(Feedback_type = '3', 'Suggestion', IF(Feedback_type = '4', 'Website', 'Other'))))) AS Category,
                    USER.User_email AS Email,
                    Feedback_note AS Note
                FROM FEEDBACK
                JOIN USER ON USER.User_id = FEEDBACK.Customer_id
                WHERE Feedback_rating > 2
                ORDER BY UNIX_TIMESTAMP(STR_TO_DATE(Feedback_date, '%m/%e/%Y')) ASC
            `,
        },
        {
            title: `Staff Complaints Received`,
            description: `This report will show all complaints made about the staff.`,
            category: `Feedback`,
            query: `
                SELECT 
                    date_format(STR_TO_DATE(Feedback_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date,
                    IF(Feedback_rating = '0', 'Awful', IF(Feedback_rating = '1', 'Bad', 'Okay')) AS Rating,
                    IF(Feedback_type = '0', 'Staff', IF(Feedback_type = '1', 'Court', IF(Feedback_type = '2', 'Facility', IF(Feedback_type = '3', 'Suggestion', IF(Feedback_type = '4', 'Website', 'Other'))))) AS Category,
                    USER.User_email AS Email,
                    Feedback_note AS Note
                FROM FEEDBACK
                JOIN USER ON USER.User_id = FEEDBACK.Customer_id
                WHERE Feedback_rating <= 2
                AND LENGTH(Feedback_note) > 0
                AND Feedback_type = '0'
                ORDER BY UNIX_TIMESTAMP(STR_TO_DATE(Feedback_date, '%m/%e/%Y')) ASC
            `,
        },
        {
            title: `Court Complaints Received`,
            description: `This report will show all complaints made about the courts.`,
            category: `Feedback`,
            query: `
                SELECT 
                    date_format(STR_TO_DATE(Feedback_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date,
                    IF(Feedback_rating = '0', 'Awful', IF(Feedback_rating = '1', 'Bad', 'Okay')) AS Rating,
                    IF(Feedback_type = '0', 'Staff', IF(Feedback_type = '1', 'Court', IF(Feedback_type = '2', 'Facility', IF(Feedback_type = '3', 'Suggestion', IF(Feedback_type = '4', 'Website', 'Other'))))) AS Category,
                    USER.User_email AS Email,
                    Feedback_note AS Note
                FROM FEEDBACK
                JOIN USER ON USER.User_id = FEEDBACK.Customer_id
                WHERE Feedback_rating <= 2
                AND LENGTH(Feedback_note) > 0
                AND Feedback_type = '1'
                ORDER BY UNIX_TIMESTAMP(STR_TO_DATE(Feedback_date, '%m/%e/%Y')) ASC
            `,
        },
    ]

    const reports_closures = [
        {
            title: `Upcoming Business Closures`,
            description: `Any business closures that have been planned over the next year`,
            category: `Closure`,
            query: `
                SELECT CLOSURE.Closure_id, date_format(STR_TO_DATE(CLOSURE.Closure_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date
                FROM CLOSURE
                WHERE STR_TO_DATE(CLOSURE.Closure_date, '%m/%e/%Y') >= STR_TO_DATE(date_format(curdate(), '%m/%e/%Y'), '%m/%e/%Y')
                ORDER BY UNIX_TIMESTAMP(STR_TO_DATE(CLOSURE.Closure_date, '%m/%e/%Y')) ASC
            `,
        },
        {
            title: `Past Business Closures`,
            description: `Any business closures that have been occured before the current day`,
            category: `Closure`,
            query: `
                SELECT CLOSURE.Closure_id, date_format(STR_TO_DATE(CLOSURE.Closure_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date
                FROM CLOSURE
                WHERE STR_TO_DATE(CLOSURE.Closure_date, '%m/%e/%Y') < STR_TO_DATE(date_format(curdate(), '%m/%e/%Y'), '%m/%e/%Y')
                ORDER BY UNIX_TIMESTAMP(STR_TO_DATE(CLOSURE.Closure_date, '%m/%e/%Y')) ASC
            `,
        },
        {
            title: `Closure Affected Reservations`,
            description: `Existing reservations that will affected by upcoming closures`,
            category: `Closure`,
            query: `
                SELECT 
                    date_format(STR_TO_DATE(CLOSURE.Closure_date, '%m/%e/%Y'), '%m/%d/%Y') AS Date,
                    RESERVATION.Reservation_id AS Reservation_id,
                    RESERVATION.Reservation_time AS Reservation_time,
                    USER.User_email AS Email
                FROM CLOSURE
                    JOIN RESERVATION ON RESERVATION.Reservation_date = CLOSURE.Closure_date
                    JOIN USER ON USER.User_id = RESERVATION.Customer_id
                    WHERE STR_TO_DATE(CLOSURE.Closure_date, '%m/%e/%Y') >= STR_TO_DATE(date_format(curdate(), '%m/%e/%Y'), '%m/%e/%Y')
                    ORDER BY UNIX_TIMESTAMP(STR_TO_DATE(CLOSURE.Closure_date, '%m/%e/%Y')) ASC
            `,
        },
    ]

    const reports_equipment = [
        {
            title: `Racket Usage`,
            description: `This reports lists the reservations where a racket was used.`,
            category: `Equipment`,
            query: `
                SELECT 
                    Reservation_id, 
                    Reservation_date AS Date, 
                    Reservation_time AS Start_Time, 
                    Reservation_duration AS Duration_Hours,
                    USER.User_email AS Customer
                FROM RESERVATION
                JOIN USER ON USER.User_id = RESERVATION.Customer_id
                WHERE JSON_CONTAINS(Equipment_id, '0') = 1
                AND Reservation_status = 1
            `,
        },
        {
            title: `Hopper Usage`,
            description: `This reports lists the reservations where a hopper was used.`,
            category: `Equipment`,
            query: `
                SELECT 
                    Reservation_id, 
                    Reservation_date AS Date, 
                    Reservation_time AS Start_Time, 
                    Reservation_duration AS Duration_Hours,
                    USER.User_email AS Customer
                FROM RESERVATION
                JOIN USER ON USER.User_id = RESERVATION.Customer_id
                WHERE JSON_CONTAINS(Equipment_id, '1') = 1
                AND Reservation_status = 1
            `,
        },
        {
            title: `Ball Machine Usage`,
            description: `This reports lists the reservations where a ball machine was used.`,
            category: `Equipment`,
            query: `
                SELECT 
                    Reservation_id, 
                    Reservation_date AS Date, 
                    Reservation_time AS Start_Time, 
                    Reservation_duration AS Duration_Hours,
                    USER.User_email AS Customer
                FROM RESERVATION
                JOIN USER ON USER.User_id = RESERVATION.Customer_id
                WHERE JSON_CONTAINS(Equipment_id, '2') = 1
                AND Reservation_status = 1
            `,
        },
    ]

    // API functions
    async function reportDownload(query, category, title) {
        let response = await fetch("http://52.4.223.125:3040/report/download", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({report_query: query})
        });
        response = await response.json();
        downloadDocument(response.report, category, title);
    }

    async function reportOpen(query, category, title) {
        let response = await fetch("http://52.4.223.125:3040/report/download", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({report_query: query})
        });
        response = await response.json();
        setReportModalItems(response.report);
    }

    // Download excel document
    function downloadDocument(data, category, title) {
        const blob = new Blob(
            [
                Object.keys(data[0]).map(key => {
                    if(key.includes(category)) {
                        return (
                            key.substring(key.indexOf("_") + 1)
                        )
                    }
                    else {
                        return key;
                    }
                })
                + "\n" +
                data.map(item => {
                    if(item.Court_id) {
                        item.Court_id = `"${item.Court_id.join(',')}"`
                    }

                    return (
                        Object.values(item)
                    )
                }).join("\n")
            ],
            { type: "text/csv;charset=utf-8" }
        )
        
        var today = new Date();
        today = today.toLocaleDateString("en-US");
        today = today.replace(/\//g, "-");

        saveAs(blob, `${title.replace(" ", "_")}_${today}.csv`);
    }

    // Handling functions
    function handleReportOpen(query, category, title) {
        setReportModalOpen(true);
        setReportModalTitle(title);
        setReportModalCategory(category);
        reportOpen(query, category, title);
    }

    function handleReportDownload(query, category, title) {
        reportDownload(query, category, title);
    }

    function handleCloseReportModal() {
        setReportModalOpen(false);
        resetSelected();
    }

    function resetSelected() {
        setReportModalTitle('');
        setReportModalItems([]);
        setReportModalCategory('');
    }

    function renderReportSet(data_object) {
        return (
            <>
                {data_object.map((report, index) => {
                    return (
                        <div className="report-item" key={index}>
                            <div className="report-title">
                                {report.title}
                            </div>
                            <div className="report-description">
                                {report.description}
                            </div>
                            <div className="report-footer">
                                <div className="report-category">
                                    {report.category}
                                </div>
                                <div className="report-open"
                                    onClick={() => handleReportOpen(report.query, report.category, report.title)}
                                >
                                    Open
                                </div>
                                <div className="report-download"
                                    onClick={() => handleReportDownload(report.query, report.category, report.title)}
                                >
                                    Download
                                </div>
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }

    return (
        <>
            <div className="container-reports">

                <div className="reports-linebreak">Reservations</div>
                <div className="reports-content">
                    {renderReportSet(reports_reservations)}
                </div>

                <div className="reports-linebreak">Users</div>
                <div className="reports-content">
                    {renderReportSet(reports_users)}
                </div>

                <div className="reports-linebreak">Courts</div>
                <div className="reports-content">
                    {renderReportSet(reports_courts)}
                </div>

                <div className="reports-linebreak">Feedback</div>
                <div className="reports-content">
                    {renderReportSet(reports_feedback)}
                </div>

                <div className="reports-linebreak">Closures</div>
                <div className="reports-content">
                    {renderReportSet(reports_closures)}
                </div>

                <div className="reports-linebreak">Equipment</div>
                <div className="reports-content">
                    {renderReportSet(reports_equipment)}
                </div>

                <div className="reports-linebreak" style={{opacity: 0}}>End</div>
            </div>
            <div className={`modal-report ${reportModalOpen ? "active" : ""}`}>
                <div className={`modal-report-content ${reportModalOpen ? "active" : ""}`}>
                    <div className="modal-report-title">
                        {reportModalTitle}
                        <div className="modal-report-close"
                            onClick={() => handleCloseReportModal()}
                        />
                    </div>
                    {reportModalItems.length > 0 && <div className="modal-report-body">
                        <div className="modal-report-header">
                            {Object.keys(reportModalItems[0]).map((key, index) => {
                                return (
                                    <div 
                                        className="modal-report-text" 
                                        key={index}
                                        style={{
                                            minWidth: `${100 / Object.keys(reportModalItems[0]).length}%`,
                                            maxWidth: `${100 / Object.keys(reportModalItems[0]).length}%`,
                                        }}
                                    
                                    >
                                        {key.includes(reportModalCategory) ? key.substring(key.indexOf("_") + 1) : key}
                                    </div>
                                )
                            })}
                        </div>
                        {reportModalItems.map((item, index) => {
                            return (
                                <div className="modal-report-item" key={index}>
                                    {Object.values(item).map((value, vIndex) => {
                                        return (
                                            <div 
                                                className="modal-report-text" 
                                                key={vIndex}
                                                style={{
                                                    minWidth: `${100 / Object.keys(reportModalItems[0]).length}%`,
                                                    maxWidth: `${100 / Object.keys(reportModalItems[0]).length}%`,
                                                }}
                                            >
                                                
                                                {JSON.stringify(value)}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>}
                </div>
            </div>
            <Loading timeRange={[250, 500]} />
        </>
    )
}

export default Reports;