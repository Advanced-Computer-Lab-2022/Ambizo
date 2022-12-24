import React from "react";
import Header from "../Header/Header";
import CourseService from "../../services/Course.service";
import AdministratorService from "../../services/Administrator.service";
import AccessRequestsImage from "../../images/AccessRequestImage.svg";
import Report from "../Report/Report";
import _ from "lodash";

async function retrieveReports() {
    return CourseService.getReports()
        .then((result) => {
            return result;
        })
}

async function retrieveAllReports() {
    return AdministratorService.getAllReports()
        .then((result) => {
            return result;
        })
}

function ReportsPage() {

    const [reports, setReports] = React.useState([]);
    const userType = sessionStorage.getItem("Type");
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (userType === "admin") {
            retrieveAllReports().then((result) => {
                setReports(result.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            retrieveReports().then((result) => {
                setReports(result.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
        }
    }, [userType]);

    function updateFollowUp(index, text) {
        setReports(prev => {
            let newReports = [...prev];
            newReports[index].FollowUp = text;
            return newReports;
        });
    }

    function updateStatus(index, text) {
        setReports(prev => {
            let newReports = [...prev];
            newReports[index].Status = text;
            return newReports;
        });
    }

    let unseenCount = 0;
    let pendingCount = 0;
    let resolvedCount = 0;

    let reportList = reports?.map((report, index) => {
        if (report.Status === "unseen") {
            unseenCount++;
        } else if (report.Status === "pending") {
            pendingCount++;
        } else if (report.Status === "resolved") {
            resolvedCount++;
        }
        return (
            <Report
                key={index}
                index={index}
                reportId={report._id}
                userType={userType}
                reporter={report.Username}
                date={report.createdAt.substring(0, 10)}
                courseTitle={report.CourseTitle}
                courseId={report.CourseId}
                description={report.Description}
                type={report.Type}
                status={report.Status}
                followUp={report.FollowUp}
                updateFollowUp={updateFollowUp}
                updateStatus = {updateStatus}
            />
        );
    });

    reportList = _.sortBy(reportList, ["props.status"]);

    return (
        <>
            <div className={"loader-container" + (!isLoading ? " hidden" : "")}>
                <div className="spinner"> </div>
            </div>
            {isLoading ?
                (
                    <>
                        <Header />
                    </>
                )
                :
                (
                    <>
                        <Header />
                        <div className="reports--headerdiv">
                            <h1 className="reports--header">Reports Page</h1>
                            <img className="reports--pricesimage" src={AccessRequestsImage} alt='Access Requests' />
                        </div>
                        {unseenCount === 0 && pendingCount === 0 && resolvedCount === 0 &&
                            <div className="reports--number">
                                <h2>No Reports</h2>
                            </div>
                        }
                        {unseenCount > 0 &&
                            <>
                            <div className="reports--number">
                                <h2>{unseenCount} Unseen {unseenCount === 1 ? "Report" : "Reports"}</h2>
                            </div>
                            <section className="reports-list">
                                {reportList.slice(pendingCount + resolvedCount)}
                            </section>
                            </>
                        }
                        {pendingCount > 0 &&
                            <>
                            <div className="reports--number">
                                <h2>{pendingCount} Pending {pendingCount === 1 ? "Report" : "Reports"}</h2>
                            </div>
                            <section className="reports-list">
                                {reportList.slice(0, pendingCount)}
                            </section>
                            </>
                        }
                        {resolvedCount > 0 &&
                            <>
                            <div className="reports--number">
                                <h2>{resolvedCount} Resolved {resolvedCount === 1 ? "Report" : "Reports"}</h2>
                            </div>
                            <section className="reports-list">
                                {reportList.slice(pendingCount, pendingCount + resolvedCount)}
                            </section>
                            </>
                        }    
                    </>
                )
            }
        </>
    );
}

export default ReportsPage;