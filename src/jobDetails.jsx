import React from 'react'
import { useContext, useEffect } from 'react'
import { JobContext, userIdContext, idJobToApplyContext } from './Context'
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./styles/jobResults.css"
import { applyIcon } from './assets'
import parse from 'html-react-parser';

export default function JobDetails() {

  const { job, setJob } = useContext(JobContext);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") ?? null;
  const { jobToApplyId, setJobToApplyId } = useContext(idJobToApplyContext)

  function convertTime(timeStr) {
    const [hours, minutes] = timeStr.split(":");
    const timeObj = new Date();
    timeObj.setHours(hours);
    timeObj.setMinutes(minutes);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return timeObj.toLocaleTimeString("en-US", options);
  }
  useEffect(() => { }, [job])
  if (!job) {
    return null;
  }
  function handleApply(jobId) {
    alert("apply")
    setJobToApplyId(jobId);
    console.log(jobId)
    console.log("userId", userId)
    if (sessionStorage.getItem("userId") === null) {
      navigate('/login')

    }
    else {
      navigate('/apply')
    }

  }


  return (
    <div className='job_result_cnt'>
    <h4>{job.jobTitle}</h4>
    <button className='job_result_btn' onClick={() => handleApply(job.postingJobId)}>Apply <img src={applyIcon} alt=""/></button>
    {/* <h5>Job type</h5> */}
    <div className='job_result_tags'>
      <div>Full Time</div>
      <div>{job.startedTimeFrom && job.endedTimeIn ? (
        <>
          {convertTime(job.startedTimeFrom).replace(" ", "")}{" - "}
          {convertTime(job.endedTimeIn).replace(" ", "")}
          {job.isEST ? " EST" : "Israel time"}
        </>
      ) : null}</div>
    </div>
    <text>{parse(job.jobDescription)}</text>
  </div>
  );
}