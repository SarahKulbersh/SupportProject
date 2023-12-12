import React, { useContext, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap';
import { JobContext, EstPreviewContext } from './Context';

export default function JobCard({ postingJobsData }) {

  const { estPreview, setEstPreview } = useContext(EstPreviewContext)

  const { job, setJob } = useContext(JobContext);

  useEffect(() => {
    if (!job && postingJobsData) {
      setJob(postingJobsData[0]);
    }
  }, [])

  const openJob = (job) => {
    setJob(job);
  };

  function convertTime(timeStr, isEST) {
    console.log("converttimerendered")
    const [hours, minutes] = timeStr.split(":");
    const timeObj = new Date();
    timeObj.setHours(hours);
    timeObj.setMinutes(minutes);
    if (estPreview === "all") {
      return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });

    }
    else if (isEST) {
      if (estPreview === "true") {
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      } else {
        timeObj.setHours(timeObj.getHours() + 7);
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      }
    } else {
      if (estPreview === "true") {
        timeObj.setHours(timeObj.getHours() - 7);
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      } else {
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      }
    }
  }

  return (
    <>
      {postingJobsData?.map(job => (
        <Card className='col-md-4' style={{ margin: '10px' }} onClick={() => openJob(job)} key={job.postingJobId}>
          <div key={job.postingJobId} style={{ padding: '15px' }}>

            <Card.Title >{job.jobTitle}</Card.Title>
            <Card.Text>  {job.jobLocation}</Card.Text>

            <div style={{ paddingRight: '50px' }}>
              <Button variant="secondary" className="float-left" style={{ backgroundColor: 'lightgray', color: 'black', border: 'none', marginRight: '10px', fontSize: '13px', cursor: 'default' }}> {job.isFullTimeJob ? "Full Time" : "Part Time"}</Button>

              <Button variant="secondary" className="float-left" style={{ backgroundColor: 'lightgray', color: 'black', border: 'none', fontSize: '13px', cursor: 'default' }}>
                {job.startedTimeFrom && job.endedTimeIn ? (
                  <>
                    {convertTime(job.startedTimeFrom, job.isEST).replace(" ", "")}{" - "}
                    {convertTime(job.endedTimeIn, job.isEST).replace(" ", "")}
                    {(job.isEST && estPreview === null) || estPreview === true ? " EST" : ""}
                  </>
                ) : null}
              </Button>
            </div>

            <Card.Text>  {job.jobDescription}</Card.Text>

            <Button variant="primary" className="float-end">Apply</Button>
          </div>
        </Card>
      ))}
    </>
  )
}
