import 'bootstrap/dist/css/bootstrap.min.css'
import LandingPage from './landingPage'
import JobsList from './jobsList';
import { Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import { JobContext } from './Context';


function App() {
  const [job, setJob] = useState('');


  return <>
    <JobContext.Provider value={{ job: job, setJob: setJob }}>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='jobsList/:searchTerm' element={<JobsList />} />
      </Routes>
    </JobContext.Provider>

  </>
}

export default App;
