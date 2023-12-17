import React, { useContext, useEffect, useState } from 'react'
import { Card, Button } from 'react-bootstrap';
import { JobContext, EstPreviewContext, idJobToApplyContext, userIdContext } from './Context';
import { useNavigate } from 'react-router-dom';
import "./styles/recent_jobs.css";

export default function JobCard({ postingJobsData }) {

  const navigate = useNavigate();

  const { estPreview, setEstPreview } = useContext(EstPreviewContext)
  const { jobToApplyId, setJobToApplyId } = useContext(idJobToApplyContext)
  const userId = sessionStorage.getItem("userId") ?? null;
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

  function handleApply(jobId) {
    setJobToApplyId(jobId);
    console.log(jobId)
    console.log("userId", userId)
    if (userId === null) {
      navigate('/login')

    }
    else {
      navigate('/apply')
    }

  }

  return (
    <>
      {postingJobsData?.map(job => (
        <div className='recent_job_card' type='button' onClick={() => openJob(job)} key={job.postingJobId}>
          <div className='recent_job_box_1' key={job.postingJobId}>

            <h3 >{job.jobTitle}</h3>
            {/* location causing error */}
            {/* <Card.Text>  {job.jobLocation}</Card.Text> */}
          </div>
          <div className='recent_job_company'>
            <h4>{job.companyName}</h4>
            <h6>{job.location}</h6>
          </div>

          <div className='recent_job_box_2'>
            <div className='recent_job_box_btn_1'> {job.isFullTimeJob ? "Full Time" : "Part Time"}</div>

            <div className='recent_job_box_btn_1'>

              {job.startedTimeFrom && job.endedTimeIn ? (
                <>
                  {convertTime(job.startedTimeFrom, job.isEST).replace(" ", "")}{" - "}
                  {convertTime(job.endedTimeIn, job.isEST).replace(" ", "")}
                  {(job.isEST && estPreview === null) || estPreview === true ? " EST" : ""}
                </>
              ) : null}
            </div>
            </div>

            <div className='recent_job_desc'>  {job.jobDescription
              .replace(/<br\s*\/?>/gm, " ")
              .split("\n")
              .join(" ")
              .substring(0, 150) + "..."}
              
            </div>

            <button className='recent_job_apply' onClick={() => handleApply(job.postingJobId)}>Apply</button>
        </div >
      ))
      }
    </>
  )
}
