import 'bootstrap/dist/css/bootstrap.min.css'
import LandingPage from './landingPage'
import JobsList from './jobsList';
import { Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import { JobContext } from './Context';
import { EstPreviewContext } from './Context'
import {EmployerPostingJobsForm} from './employerPostingJobsForm'

function App() {
  const [job, setJob] = useState('');
  const [estPreview, setEstPreview] = useState('all');


  return <>
    <JobContext.Provider value={{ job: job, setJob: setJob }}>
      <EstPreviewContext.Provider value={{estPreview: estPreview, setEstPreview: setEstPreview}}>
      <Routes>
        <Route path='/post' element={<EmployerPostingJobsForm/>}/>
        <Route path='/' element={<LandingPage />} />
        <Route path='jobsList/:searchTerm' element={<JobsList />} />
      </Routes>
      </EstPreviewContext.Provider>
    </JobContext.Provider>

  </>
}

export default App;
