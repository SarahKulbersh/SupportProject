import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import { database } from "./firebaseConfig";
import { collectionGroup, getDocs } from 'firebase/firestore';
import JobCard from "./jobCard";
import { useState, useEffect } from 'react';
import JobDetails from './jobDetails';
import { Container } from 'react-bootstrap';
import { SearchBox } from './searchBox';
import { EstPreviewContext } from './Context';

export default function JobsList() {

  const searchTerm = useParams().searchTerm;
  const [jobs, setJobs] = useState([]);
  const { estPreview, setEstPreview } = useContext(EstPreviewContext)

  function handleTimePreview() {
    if (estPreview === "true")
      setEstPreview("false");
    else
      setEstPreview("true");

  }
  useEffect(() => {
    setEstPreview(false)
  }, [])

  useEffect(() => {
    async function fetchJobs() {
      const fetchedJobs = await searchJobs(searchTerm);
      console.log(fetchedJobs)
      setJobs(fetchedJobs)
    }
    fetchJobs();
  }, [searchTerm]);


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

          return (
            (jobTitleMatch || jobDescriptionMatch) &&
            jobData.isJobActive
          )

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
      <button onClick={handleTimePreview}>{estPreview ? 'Israel Standard Time (IST)' : 'Eastern Standard Time (EST)'}</button>
      <Container  style={{overflow: 'hidden'}}>
        <div style={{float: 'left', width:'50%'}}>
        <JobCard postingJobsData={jobs}  />
        </div>
        <JobDetails  style={{float: 'left', width:'50%'}}/>
      </Container>

    </>
  )
}
