import React from 'react'
import { useContext, useEffect } from 'react'
import { JobContext } from './Context'
import { Card } from 'react-bootstrap';

export default function JobDetails() {

  const { job, setJob } = useContext(JobContext);

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

  return (
    <Card>
      <h2>{job.jobTitle}</h2>

      <p>{job.startedTimeFrom && job.endedTimeIn ? (
        <>
          {convertTime(job.startedTimeFrom).replace(" ", "")}{" - "}
          {convertTime(job.endedTimeIn).replace(" ", "")}
          {job.isEST ? " EST" : ""}
        </>
      ) : null}</p>
      <p>Job Description: {job.jobDescription}</p>
      <p>Pay: {job.jobPayment}{job.jobPaymentKind} per {job.jobPaymentPer}</p>
      {/* location causing error */}
      {/* <p>Job Location: {job.jobLocation}</p> */}
      <p>Experience Required: {job.JobExperienceRequiredDesc}</p>
      <p>{job.isRemoteAvailable ? "Working Remotely available" : "Remote work not available"}</p>

    </Card>
  );
}