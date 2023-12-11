import React from 'react'
import { useParams } from 'react-router-dom';
import { database } from "./firebaseConfig";
import { collectionGroup, getDocs } from 'firebase/firestore';
import JobCard from "./jobCard";
import { useState, useEffect } from 'react';
import JobDetails from './jobDetails';
import { Container } from 'react-bootstrap';
import { SearchBox } from './searchBox';

export default function JobsList() {

  const searchTerm = useParams().searchTerm;
  const [jobs, setJobs] = useState([]);
  const [isESTActive, setIsESTActive] = useState(false);

  function handleESTFilter() {
    setIsESTActive(!isESTActive);
  }

  useEffect(() => {
    async function fetchJobs() {
      const fetchedJobs = await searchJobs(searchTerm);
      setJobs(fetchedJobs)
    }
    fetchJobs();
  }, [searchTerm, jobs, isESTActive]);


  async function searchJobs(searchTerm) {
    try {
      const postingJobsSubcollection = await getDocs(collectionGroup(database, "postingJobs"));
      if (searchTerm === '*') {
        const fetchedPostingJobsData = postingJobsSubcollection.docs.map(
          (doc) => doc.data())
          .filter((job) => job.isJobActive);
        return fetchedPostingJobsData;
      }
      else {
        const filteredJobs = postingJobsSubcollection.docs.filter(doc => {
          const jobData = doc.data();
          const normalizedJobTitle = jobData.jobTitle.toLowerCase();
          const normalizedJobDescription = jobData.jobDescription.toLowerCase();
          const normalizedSearchTerm = searchTerm.toLowerCase();

          const jobTitleMatch = normalizedJobTitle.includes(normalizedSearchTerm);
          const jobDescriptionMatch = normalizedJobDescription.includes(normalizedSearchTerm);

          if (isESTActive) {
            return (
              (jobTitleMatch || jobDescriptionMatch) && 
              jobData.isEST === true &&
              jobData.isJobActive
            );
          } else {
            return (
              (jobTitleMatch || jobDescriptionMatch) &&
              jobData.isEST === false &&
              jobData.isJobActive
            );
          }
        });

        const fetchedPostingJobsData = filteredJobs.map(doc => doc.data());
        return fetchedPostingJobsData;
      }
    } catch (error) {
      console.error("Error retrieving jobs", error);
    }
  }

  return (
    <>
      <SearchBox />
      <button onClick={handleESTFilter}>{isESTActive ? 'Israel Standard Time (IST)' : 'Eastern Standard Time (EST)'}</button>    <Container style={{ position: "relative" }}>
        <JobCard postingJobsData={jobs} />
        <JobDetails />
      </Container>
    </>
  )
}
