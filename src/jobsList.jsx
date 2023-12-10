import React from 'react'
import { useParams } from 'react-router-dom';
import { database } from "./firebaseConfig";
import { collectionGroup, getDocs } from 'firebase/firestore';
import JobCard from "./jobCard";
import { useState, useEffect } from 'react';

export default function JobsList() {

  const searchTerm = useParams().searchTerm;
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    searchJobs(searchTerm);
  }, []);


  async function searchJobs(searchTerm) {
    try {
      console.log(searchTerm)

      const postingJobsSubcollection = await getDocs(
        collectionGroup(database, "postingJobs")
      );

      const filteredJobs = postingJobsSubcollection.docs.filter(doc => {
        const jobData = doc.data();
        const jobTitleMatch = jobData.tobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const jobDescriptionMatch = jobData.jobDescription.toLowerCase().includes(searchTerm.toLowerCase());
        return jobTitleMatch || jobDescriptionMatch;
      });

      const fetchedPostingJobsData = filteredJobs.map(doc => doc.data());
      setJobs(fetchedPostingJobsData)
      console.log("jobs", jobs)
      return fetchedPostingJobsData;
    } catch (error) {
      console.error("Error retrieving jobs", error);
    }
  }

  return (
    <div>
      {jobs && jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>

  )
}
