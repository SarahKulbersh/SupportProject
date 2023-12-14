import 'bootstrap/dist/css/bootstrap.min.css'
import LandingPage from './landingPage'
import JobsList from './jobsList';
import { Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import { JobContext, EstPreviewContext, idJobToApplyContext } from './Context';
import { PostJobForm } from './postJobForm'
import { JobApplyForm } from './jobApplyForm';

function App() {
  const [job, setJob] = useState('');
  const [estPreview, setEstPreview] = useState('all');
  const [employerForm, setEmplyerForm] = useState({})
  const [jobToApplyId, setJobToApplyId] = useState('')

  return <>
    <JobContext.Provider value={{ job: job, setJob: setJob }}>
      <EstPreviewContext.Provider value={{ estPreview: estPreview, setEstPreview: setEstPreview }}>
        <idJobToApplyContext.Provider value={{ jobToApplyId: jobToApplyId, setJobToApplyId: setJobToApplyId }}>
          <Routes>
            <Route path='/post' element={<PostJobForm />} />
            <Route path='/apply' element={<JobApplyForm />} />
            <Route path='/' element={<LandingPage />} />
            <Route path='jobsList/:searchTerm' element={<JobsList />} />
          </Routes>
        </idJobToApplyContext.Provider>
      </EstPreviewContext.Provider>
    </JobContext.Provider >

  </>
}

export default App;
