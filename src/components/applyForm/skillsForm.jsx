import React, { useState, useContext } from 'react'
import { addMore, deleteIcon } from "../../assets/index"
import { applyFormCardNumberContext } from '../../Context';
import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { collection, setDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import Cookies from 'js-cookie';
import SaveAndExit from './saveAndExit';

function SkillsForm() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [inputValue, setInputValue] = useState('');
  const { applyFormCardNumber, setApplyFormCardNumber } = useContext(applyFormCardNumberContext)
  const jobToApplyId = sessionStorage.getItem("jobId")
  const userId = sessionStorage.getItem("userId");

  const handleSkillInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const addSkill = () => {
    if (inputValue !== '') {
      setSkills([...skills, inputValue]);
      setInputValue('');
    }
  };
  const removeSkill = (index) => {
    setSkills(skills.filter((item, i) => i !== index));
  };
  function submitApply() {

    const education = JSON.parse(Cookies.get("education"))
    console.log("education", education[0])
    const jobs = JSON.parse(Cookies.get("workHistory"))
    console.log("jobs", jobs)


    skills?.map(s => (
      submitSkills(s)
    ))
    education?.map(e => (
      submitEducation(e)
    ))
    jobs?.map(job => (
      submitWorkHistory(job)
    ))
    submitUserDetails()
    updateApplyJobs()
    // updateIdentitiesUserApplies()
    addToApplicationsCollection()
    emailEmployer()
    setApplyFormCardNumber(1)
    navigate(-1)
  }
  async function submitEducation(e) {
    const persons = collection(database, "person");
    const userRef = doc(persons, userId);
    const DocId = `${e.timeOfStudyFromYear}-${e.timeOfStudyToYear}`
    const subcollectionRef = collection(userRef, "educations");

    try {
      await setDoc(doc(subcollectionRef, DocId), {
        educationLevel: e.educationLevel,
        schoolName: e.schoolName,
        studyName: e.studyName,
        timeOfStudyFromMonth: e.timeOfStudyFromMonth,
        timeOfStudyFromYear: e.timeOfStudyFromYear,
        timeOfStudyToMonth: e.timeOfStudyToMonth,
        timeOfStudyToYear: e.timeOfStudyToYear
      });
    } catch (error) {
      console.error("Error adding document:", error);
    }
  }
  async function submitWorkHistory(job) {

    const persons = collection(database, "person");
    const userRef = doc(persons, userId);
    const docId = `${job.timeOfWorkFromYear}-${job.timeOfWorkToYear}`
    const subcollectionRef = collection(userRef, "workHistory");
    try {
      await setDoc(doc(subcollectionRef, docId), {
        company: job.company,
        description: job.description,
        title: job.title,
        timeOfWorkFromMonth: job.timeOfWorkFromMonth,
        timeOfWorkFromYear: job.timeOfWorkFromYear,
        timeOfWorkToMonth: job.timeOfWorkToMonth,
        timeOfWorkToYear: job.timeOfWorkToYear
      });
    } catch (error) {
      console.error("Error adding document:", error);
    }
  }
  async function submitUserDetails() {

    const userRef = doc(database, "person", userId)
    const additionalData = {
      city: Cookies.get('city'),
      firstName: Cookies.get('firstName'),
      lastName: Cookies.get('lastName'),
      isActive: true,
      phoneNumber: Cookies.get('phone'),
      updatedAt: serverTimestamp()
    }
    try {
      await updateDoc(userRef, additionalData);
    } catch (error) {
      console.error("Error submitUserDetails:", error);
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
  async function submitSkills(s) {

    const persons = collection(database, "person");
    const userRef = doc(persons, userId);
    const words = s.split(" ");
    const firstWord = words[0];
    const subcollectionRef = collection(userRef, "skills");
    try {
      await setDoc(doc(subcollectionRef, firstWord), {
        createdAt: serverTimestamp(),
        skillName: s
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

  const emailEmployer = async () => {

    const userId = sessionStorage.getItem("userId")
    const jobId = sessionStorage.getItem("jobId")
    const employerId = extractEmailFromDateString(jobId)
    const date = getCurrentDateTimeString()
    // Get user's details from cookies
    const firstName = Cookies.get("firstName");
    const lastName = Cookies.get("lastName");
    const phone = Cookies.get("phone");
    const city = Cookies.get("city");

    // Get user's education from cookies
    const education = JSON.parse(Cookies.get("education"));

    // Get user's skills from state
    const skills2 = skills.join(", ");

    const workHistory = JSON.parse(Cookies.get("workHistory"));
    try {
      await setDoc(doc(database, "mail", `${userId}_#_${date}_#_${employerId}`), {
        to: [employerId],
        message: {
          subject: `${firstName} ${lastName} might be a good fit for ${sessionStorage.getItem("jobTitle")} `,
          text: 'This is the plaintext section of the email body.',
          html: `
          Contact ${firstName} ${lastName} by emailing ${userId} or calling ${phone} in ${city}.

          <br/>

          <p>Education</p>
          <ul>
            ${education
              .map(
                (e) =>
                  `<li>${e.educationLevel} - ${e.schoolName}</li>`
              )
              .join("")}
          </ul>

          <br/>

          <p>Skills</p>
          <p>${skills2}</p>

          <br/>

          <p>Work History</p>
          <ul>
            ${workHistory
              .map(
                (job) =>
                  `<li>${job.title} at ${job.company}</li>
                  <ul>
                    <li>${job.description}</li>
                    <li>Time of Work: ${job.timeOfWorkFromMonth}/${job.timeOfWorkFromYear} - ${job.timeOfWorkToMonth}/${job.timeOfWorkToYear}</li>
                  </ul>`
              )
              .join("")}
          </ul>`,
        }
      });
    } catch (error) {
      console.error("Error submitUserDetails:", error);
    }
  }


  return (
    <Card>
      <Card.Body className='job_apply_form_body'>
        <SaveAndExit changeTo={5} />

        <Form className='job_form_apply_fields' >
          <div>
            <p className='job_form_upload_desc'>Build your resume (3 of 4)</p>
            <label htmlFor="phone">Do you want to share some of your skills?</label>
          </div>
          <Form.Text>we recommend adding at least 6 skills</Form.Text>
          <div className='job_form_field_box'>
            <input type="text" class="form-control" placeholder='Add a skill' value={inputValue} onChange={handleSkillInputChange} />
            <img src={addMore} alt="" className='add_skill_img' onClick={addSkill} />
          </div>
          {skills?.map((skill, index) => (
            <div className='job_form_field_dlt_box'>
              <input className='job_form_input' type="text" value={skill} />
              <img src={deleteIcon} alt="" onClick={() => { removeSkill(index) }} />
            </div>
          ))}
          <Button className='job_form_submit skill_btn' onClick={submitApply}>Save and continue</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default SkillsForm
