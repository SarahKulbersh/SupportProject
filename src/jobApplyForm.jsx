import React, { useContext } from 'react'
import { applyFormCardNumberContext } from './Context'
import EducationForm from './components/applyForm/educationForm'
import WorkHistory from './components/applyForm/workHistory'
import SkillsForm from './components/applyForm/skillsForm'
import UserDetails from './components/applyForm/userDetails'
import UploadFileForm from './components/applyForm/uploadFileForm'
import ResumeOptionsForm from './components/applyForm/resumeOptionsForm'
import "./styles/jobApplyForm.css"
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Card, Container, Form } from 'react-bootstrap';

export function JobApplyForm() {
    const { applyFormCardNumber, setApplyFormCardNumber} = useContext(applyFormCardNumberContext)

    return (
        <>
        <NavBar />
        <br/><br/><br/>
        <Container className='job_apply_form'>            
            {applyFormCardNumber === 1 && <UserDetails />}
            {applyFormCardNumber === 2 && <ResumeOptionsForm />}
            {applyFormCardNumber === 3 && <UploadFileForm />}
            {applyFormCardNumber === 4 && <EducationForm />}
            {applyFormCardNumber === 5 && <WorkHistory />}
            {applyFormCardNumber === 6 && <SkillsForm />}
        </Container>
        <Footer/>
        </>
    )
}
