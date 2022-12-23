import React from "react";
import Header from "../Header/Header";
import CourseService from "../../services/Course.service";
import AdministratorService from "../../services/Administrator.service";
import Report from "../Report/Report";

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

    let reportList = reports?.map((report, index) => {
        return (
            <Report
                key={index}
                index={index}
                reportId={report._id}
                userType={userType}
                reporter={report.Username}
                courseTitle={report.CourseTitle}
                description={report.Description}
                type={report.Type}
                status={report.Status}
                followUp={report.FollowUp}
                updateFollowUp={updateFollowUp}
                updateStatus = {updateStatus}
            />
        );
    });

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
                        <div className="reports--reportcard">
                            {reportList}
                        </div>
                    </>
                )
            }
        </>
    );
}

export default ReportsPage;