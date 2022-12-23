import React from 'react';
import CourseService from '../../services/Course.service';
import AdministratorService from '../../services/Administrator.service';

function Report(probs) {
    let { index, reportId, userType, reporter, courseTitle, description, type, status, followUp, updateFollowUp, updateStatus } = probs;
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
                <div className='reportcard--header'>
                    <h1 className='reporcard--coursetitle'>{courseTitle}</h1>
                    {admin && <h2 className='reportcard--reporter'>Reported by {reporter}</h2>}
                </div>
                <div className='reportcard--details'>
                    <h2 className='reportcard--type'>Type = {type}</h2>
                    <h2 className='reportcard--status'>Status = {status}</h2>
                </div>
                <div className='reportcard--description'>
                    <h2 className='reportcard--description--title'>Description</h2>
                    <p className='reportcard--description--text'>{description}</p>
                </div>
                {followUp &&
                    <div className='reportcard--followup'>
                        <h2 className='reportcard--followup--title'>Follow Up</h2>
                        <p className='reportcard--followup--text'>{followUp}</p>
                    </div>
                }
                {admin &&
                    <div className='reportcard--actionbuttons'>
                        <button className='reportcard--actionbuttons--button' onClick={setPending}>Set as pending</button>
                        <button className='reportcard--actionbuttons--button' onClick={setResolved}>Set as resolved</button>
                        <p className="error--emptyfollowup">{errorMessage}</p>
                    </div>
                }
                {!admin && status === "unseen" && !followUp &&
                    <>
                        <textarea
                            className="reportcard--followup--text"
                            value={followUpText}
                            onChange={handleFollowUpChange}
                            placeholder="Didn't get a response? Write a follow up here ..."
                        />
                    <button className="reportcard--followup--submit" onClick={handleFollowUpSubmit}>Submit</button>
                    <p className="error--emptyfollowup">{errorMessage}</p>
                    </>
                }
            </div>
        </>
    )
}

export default Report;