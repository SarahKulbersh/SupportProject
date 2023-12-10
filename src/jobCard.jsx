import React from 'react'
import { Card, Button } from 'react-bootstrap';

export default function JobCard({ postingJobsData }) {

    function convertTime(timeStr) {
        const [hours, minutes] = timeStr.split(":");
        const timeObj = new Date();
        timeObj.setHours(hours);
        timeObj.setMinutes(minutes);
        const options = { hour: "numeric", minute: "numeric", hour12: true };
        return timeObj.toLocaleTimeString("en-US", options);
    }
    

    return (
        <>
            <div className='container'>
                <div className='row justify-content-center'>

                    {postingJobsData.map(job => (
                        <Card className='col-md-4' style={{ margin: '10px' }}>
                            <div key={job.id} style={{ padding: '15px' }}>

                                <Card.Title >{job.jobTitle}</Card.Title>
                                <Card.Text>  {job.jobLocation}</Card.Text>

                                <div style={{ paddingRight: '50px' }}>
                                    <Button variant="secondary" className="float-left" style={{ backgroundColor: 'lightgray', color: 'black', border: 'none', marginRight: '10px', fontSize: '13px' ,cursor:'default' }}> {job.isFullTimeJob ? "Full Time" : "Part Time"}</Button>
                                    <Button variant="secondary" className="float-left" style={{ backgroundColor: 'lightgray', color: 'black', border: 'none', fontSize: '13px', cursor:'default' }}>
                                        {job.startedTimeFrom && job.endedTimeIn ? (
                                            <>
                                                {convertTime(job.startedTimeFrom).replace(" ", "")}{" - "}
                                                {convertTime(job.endedTimeIn).replace(" ", "")}
                                                {job.isEST ? " EST" : ""}
                                            </>
                                        ) : null}
                                    </Button>
                                </div>

                                <Card.Text>  {job.jobDescription}</Card.Text>

                                <Button variant="primary" className="float-end">Apply</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

        </>
    )
}
