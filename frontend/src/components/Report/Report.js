import React from 'react';
import CourseService from '../../services/Course.service';
import AdministratorService from '../../services/Administrator.service';
import { useNavigate } from 'react-router-dom';

function Report(probs) {
    const navigate = useNavigate();
    let { index, reportId, userType, reporter, date, courseTitle, courseId, description, type, status, followUp, updateFollowUp, updateStatus } = probs;
    let admin = userType === "admin";
    const [followUpText, setFollowUpText] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    function handleFollowUpChange(event) {
        setFollowUpText(event.target.value);
    }

    function handleFollowUpSubmit() {
        if (followUpText === '') {
            setErrorMessage('Please write a follow up');
        }
        else {
            CourseService.followUpReport(reportId, followUpText).then(() => {
                setErrorMessage('');
                setFollowUpText('');
                updateFollowUp(index, followUpText);
            })
            .catch(error => {
                console.log(error);
                setErrorMessage('Something went wrong, please try again later');
            });
        }
    }

    function setPending() {
        AdministratorService.updateReportStatus(reportId, 'pending').then(() => {
            updateStatus(index, 'pending');
        })
        .catch(error => {
            console.log(error);
            setErrorMessage('Something went wrong, please try again later');
        });
    }

    function setResolved() {
        AdministratorService.updateReportStatus(reportId, 'resolved').then(() => {
            updateStatus(index, 'resolved');
        })
            .catch(error => {
                console.log(error);
                setErrorMessage('Something went wrong, please try again later');
            });
    }

    return (
        <>
            <div className='reportcard'>
                <div className='reportcard--info'>
                    <div className='reportcard--course'>
                        <p className="accesscourse--info">Course title:</p>
                        <h3 className="course--name" onClick={() => navigate(`/coursedetails/${courseId}`)}>{courseTitle}</h3>
                    </div>
                    {admin &&
                        <div className='reportcard--reporter'>
                            <p className="accesscourse--info">Reported by:</p>
                            <h3 className="reporter--name">{reporter}</h3>
                        </div>
                    }
                    <div className='reportcard--date'>
                        <p className="accesscourse--info">Created at:</p>
                        <h3 className="date--value">{date}</h3>
                    </div>
                    <div className='reportcard--type'>
                        <p className="accesscourse--info">Type:</p>
                        <h3 className="type--value">{type}</h3>
                    </div>
                    <div className='reportcard--status'>
                        <p className="accesscourse--info">Status:</p>
                        <h3 className="status--value">{status}</h3>
                    </div>
                    <div className='reportcard--description'>
                        <p className='accesscourse--info'>Description:</p>
                        <h3 className='description--text'>{description}</h3>
                    </div>
                    {followUp &&
                        <div className='reportcard--followup'>
                            <p className='accesscourse--info'>Follow Up:</p>
                            <h3 className='followup--text'>{followUp}</h3>
                        </div>
                        }
                    {!admin && status === "unseen" && !followUp &&
                        <>
                            <textarea
                                className="reportcard--followup--textarea"
                                value={followUpText}
                                onChange={handleFollowUpChange}
                                placeholder="Didn't get a response? Write a follow up here ..."
                            />
                            <button className="reportcard--followup--submitbutton" onClick={handleFollowUpSubmit}>Submit</button>
                            <p className="error--emptyfollowup">{errorMessage}</p>
                        </>
                    }
                    {admin &&
                        <div className='reportcard--buttons'>
                            {status !== "pending" &&
                                <button className='reportcard--pendingbutton' onClick={setPending}>Set as pending</button>
                            }
                            {status !== "resolved" &&
                                <button className='reportcard--resolvedbutton' onClick={setResolved}>Set as resolved</button>
                            }
                            <p className="error--emptyfollowup">{errorMessage}</p>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Report;