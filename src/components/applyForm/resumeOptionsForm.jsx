import React, { useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Container, Form } from 'react-bootstrap';
import { uploadIcon, backArrowIcon, orLineIcon } from "../../assets/index"
import { database } from "../../firebaseConfig";
import { applyFormCardNumberContext } from '../../Context';
import { collection, setDoc, doc, serverTimestamp, updateDoc, arrayUnion, getDoc, Timestamp } from "firebase/firestore";
import Cookies from 'js-cookie';

function ResumeOptionsForm() {
  const { applyFormCardNumber, setApplyFormCardNumber } = useContext(applyFormCardNumberContext)
  const userId = sessionStorage.getItem("userId")
  const jobToApplyId = sessionStorage.getItem("jobId")

  const navigate = useNavigate()
  const [resumeOption, setResumeOption] = useState('')

  async function submitUserDetailsNoResume() {
    const userId = sessionStorage.getItem("userId")
    const userRef = doc(database, "person", userId)
    const additionalData = {
      city: Cookies.get('city'),
      firstName: Cookies.get('firstName'),
      lastName: Cookies.get('lastName'),
      phoneNumber: Cookies.get('phone'),
      updatedAt: serverTimestamp()
    }
    try {
      await updateDoc(userRef, additionalData);
    } catch (error) {
      console.error("Error submitUserDetails:", error);
    }
  }
  const handleContinueBtn = (e) => {
    e.preventDefault();
    if (resumeOption === 1)
      setApplyFormCardNumber(3);
    else if (resumeOption === 2)
      setApplyFormCardNumber(4)
    else if (resumeOption === 3) {
      try {
        submitUserDetailsNoResume()
        // updateIdentitiesUserApplies()
        addToApplicationsCollection()
        updateApplyJobs()
      } catch (err) {
        console.log(err)
      }
      navigate(-1)
    }
  }
  async function addToApplicationsCollection() {
    const employeeId = extractEmailFromDateString(sessionStorage.getItem("jobId"));
    const postDate = extractDateTime(sessionStorage.getItem("jobId"))
    const userId = sessionStorage.getItem("userId");
    const applicationDocId = employeeId + "_#_" + postDate + "_#_" + userId;

    try {
      await setDoc(doc(database, "jobApplications", applicationDocId), {
        createdAt: serverTimestamp(),
        firstName: Cookies.get('firstName'),
        lastName: Cookies.get('lastName'),
        jobTitle: sessionStorage.getItem("jobTitle"),
      });
    } catch (error) {
      console.error("Error submitUserDetails:", error);
    }
  }
  async function updateApplyJobs() {

    const persons = collection(database, "person");
    const userRef = doc(persons, userId);

    const subcollectionRef = collection(userRef, "applyJobs");
    try {
      await setDoc(doc(subcollectionRef, getCurrentDateTimeString()), {
        applyId: getCurrentDateTimeString(),
        postJobId: jobToApplyId,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document:", error);
    }
  }
  function extractDateTime(str) {
    const string = str + ''
    const dateTime = string.split("_");
    const timeAndDate = dateTime.slice(0, 6).join("_");
    return timeAndDate;
  }
  function extractEmailFromDateString(dateString) {
    const str = dateString + ''
    const substrings = str.split('_');

    const email = substrings[substrings.length - 1];
    return email;
  }
  const getCurrentDateTimeString = () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");

    return `${hours}_${minutes}_${seconds}_${year}_${month}_${day}`;
  }
  const SaveAndExit = ({ changeTo }) => {
    return (<div className='job_save_exit'>
      <div className='job_save_exit_head'>
        {applyFormCardNumber !== 1 && <img onClick={() => { setApplyFormCardNumber(changeTo) }} className='' src={backArrowIcon} alt="" />}
        <div className='job_save_exit_text' onClick={(e) => {
          setApplyFormCardNumber(1);
          navigate(-1);
        }}>Exit</div>
      </div>
      <div className='job_save_exit_progress'>
        <div style={{ width: `${((applyFormCardNumber / 5) * 100)}%` }} className='job_save_exit_complete'></div>
        <div style={{ width: `${(((5 - applyFormCardNumber) / 5) * 100)}%` }} className='job_save_exit_left'></div>
      </div>
    </div>)
  }

  return (
    <Card>
      <Card.Body className='job_apply_form_body'>
        <SaveAndExit changeTo={1} />


        <Form className='job_form_apply_fields'>
          <h4>Add a resume for the employer</h4>

          <Container type='button' className='job_apply_upload_box' onClick={(e) => setResumeOption(1)} style={resumeOption === 1 ? { border: "navy 1px solid" } : null}>
            <img src={uploadIcon} className='uplaod_icon' alt="" />
            <div>
              <h4 className='job_form_head_field'>Upload a resume</h4>
              <p className='job_form_upload_desc'>Accepted file types: PDF, DOCX</p>
            </div>
          </Container>
          <img src={orLineIcon} alt="" />
          <Container className='job_apply_upload_box' type='button' onClick={(e) => setResumeOption(2)} style={resumeOption === 2 ? { border: "navy 1px solid" } : null}>
            <img src={uploadIcon} className='uplaod_icon' alt="" />
            <div>
              <p className='job_form_upload_desc_rec'>Recommended</p>
              <h4 className='job_form_head_field'>Build a Logoipsum Resume</h4>
              <p className='job_form_upload_desc'>We’ll guide you through it, there are only a few steps</p>
            </div>
          </Container>
          <img src={orLineIcon} alt="" />
          <Container type='button' className='job_apply_upload_box' onClick={(e) => setResumeOption(3)} style={resumeOption === 3 ? { border: "navy 1px solid" } : null}>
            <img src={uploadIcon} className='uplaod_icon' alt="" />
            <div>
              <h4 className='job_form_head_field'>Continue without a resume</h4>
              <p className='job_form_upload_desc'>We highly recommend that you provide a resume!</p>
            </div>
          </Container>
          <br />
          <button className='job_form_submit' onClick={(e) => handleContinueBtn(e)}>Continue</button>

        </Form>
      </Card.Body>
    </Card>
  )
}

export default ResumeOptionsForm
