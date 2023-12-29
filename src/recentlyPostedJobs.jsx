import React from 'react'
import { database } from "./firebaseConfig";
import { useState, useEffect } from 'react';
import { collectionGroup, getDocs } from 'firebase/firestore';
import JobCard from './jobCard';
import "./styles/recent_jobs.css"

export function RecentlyPostedJobs() {

  const [postingJobsData, setPostingJobsData] = useState([]);
  const [dataToSend, setDataToSend] = useState()
  const defaultLength = 4;
  const [showAll, setShowAll] = useState();


  useEffect(() => {
    async function getLatestJobs() {
      try {
        const postingJobsSubcollection = await getDocs(collectionGroup(database, "postingJobs"));
        const fetchedPostingJobsData = postingJobsSubcollection.docs.map(
          (doc) => doc.data())
          .filter((job) => job.isJobActive);
        fetchedPostingJobsData.sort((a, b) => a.createdAt - b.createdAt);
        setPostingJobsData(fetchedPostingJobsData.slice(-8)); // Take the last 4 jobs
        setShowAll(false)
      } catch (error) {
        console.error("Error retrieving jobs", error);
      }
    }

    getLatestJobs();
  }, []);

  useEffect(() => {
    if (showAll === false) {
      setDataToSend(showAll ? postingJobsData : postingJobsData.slice(0, defaultLength))
    } else {
      setDataToSend(showAll ? postingJobsData : postingJobsData.slice(0, 7))
    }
  }, [showAll])


  return (
    <div className='recent_jobs'>
      <h2 className='recent_jobs_heading'>Recently Posted Jobs</h2>
      <div className='recent_job_list'>
        <JobCard postingJobsData={dataToSend} />
      </div>
      <button className='recent_jobs_learn_more' onClick={() => setShowAll((prev) => !prev)}>{!showAll ? "See more" : "See less"}</button>

    </div>
  );
}
