import React, { useContext, useEffect, useState } from 'react'
import { Card, Button } from 'react-bootstrap';
import { JobContext, EstPreviewContext, idJobToApplyContext } from './Context';
import { useNavigate } from 'react-router-dom';

export default function JobCard({ postingJobsData }) {

  const navigate = useNavigate();

  const { estPreview, setEstPreview } = useContext(EstPreviewContext)
  const {jobToApplyId, setJobToApplyId} = useContext(idJobToApplyContext)
  const { job, setJob } = useContext(JobContext);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (postingJobsData && postingJobsData.length > 0) {
      setHasData(true);
    }
  }, []);

  useEffect(() => {
    if (hasData && !job && postingJobsData) {
      setJob(postingJobsData[0]);
    }
  }, [hasData, job, postingJobsData]);

  useEffect(() => {

    if (!job && postingJobsData) {
      setJob(postingJobsData[0]);
    }
  }, [postingJobsData])

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

  function handleApply (jobId){
    setJobToApplyId(jobId)
    console.log(jobId)
    navigate('/apply')
    
  }
  return (
    <>
      {postingJobsData?.map(job => (
        <Card type='button' style={{ margin: '10px' }} onClick={() => openJob(job)} key={job.postingJobId}>
          <div key={job.postingJobId} style={{ padding: '15px' }}>

            <Card.Title >{job.jobTitle}</Card.Title>
            {/* location causing error */}
            {/* <Card.Text>  {job.jobLocation}</Card.Text> */}

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

            <Button variant="primary" className="float-end" onClick={() =>handleApply(job.postingJobId)}>Apply</Button>
          </div>
        </Card>
      ))}
    </>
  )
}
