import React from 'react'
import { Route, Routes } from 'react-router-dom';
import "./styles/index.css";
import { PostJobForm } from './postJobForm';
import { JobApplyForm } from './jobApplyForm';
import LandingPage from './landingPage';
import JobsList from './jobsList';
import { UserLogin } from './userLogin';
import Dashboard from './dashboard';
export default function AllRoutes() {
    return (
        <Routes>
        <Route path='/post' element={<PostJobForm />} />
        <Route path='/apply' element={<JobApplyForm />} />
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='jobsList/:searchTerm' element={<JobsList />} />
        <Route path='dashboard/:tab' element={<Dashboard />} />
      </Routes>

    )
}
