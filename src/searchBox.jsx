import React from 'react'
import './styles/searchBox.css'
// import { database } from "./firebaseConfig";
// import { collectionGroup, getDocs } from 'firebase/firestore';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export function SearchBox() {

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()

  const handleSearch = async () => {
    // const results = await searchJobs(searchTerm);
    // console.log("Search results:", results);
    navigate(`/myJobs/${searchTerm}`);

  };

  // async function searchJobs(searchTerm) {
  //   try {
  //     const postingJobsSubcollection = await getDocs(
  //       collectionGroup(database, "postingJobs")
  //     );

  //     const filteredJobs = postingJobsSubcollection.docs.filter(doc => {
  //       const jobData = doc.data();
  //       const jobTitleMatch = jobData.tobTitle.toLowerCase().includes(searchTerm.toLowerCase());
  //       const jobDescriptionMatch = jobData.jobDescription.toLowerCase().includes(searchTerm.toLowerCase());
  //       return jobTitleMatch || jobDescriptionMatch;
  //     });

  //     const fetchedPostingJobsData = filteredJobs.map(doc => doc.data());
  //     return fetchedPostingJobsData;
  //   } catch (error) {
  //     console.error("Error retrieving jobs", error);
  //   }
  // }




  return (
    <div className="container">

      <div className="row height d-flex justify-content-center align-items-center">

        <div className="col-md-8">

          <div className="search">
            <i className="fa fa-search"></i>
            <input type="text" className="form-control" placeholder="Search" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          </div>

        </div>

      </div>
    </div>

  )
}
