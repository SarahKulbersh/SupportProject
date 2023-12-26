import React, { useContext, useState } from 'react'
import { applyFormCardNumberContext } from '../../Context'
import { Card, Container, Form } from 'react-bootstrap';
import { backArrowIcon, crossIcon, dragIcon } from "../../assets/index"
import { v4 as uuidv4 } from 'uuid';
import { setDoc, doc, serverTimestamp, updateDoc, getDoc } from "firebase/firestore";
import { database, storage } from "../../firebaseConfig";
import { ref, uploadBytes, deleteObject } from "firebase/storage";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function UploadFileForm() {
    const navigate = useNavigate()
    const { applyFormCardNumber, setApplyFormCardNumber } = useContext(applyFormCardNumberContext)
    const [resumeFile, setResumeFile] = useState('');
    const userId = sessionStorage.getItem("userId");

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
    const uploadFile = async (e) => {

        e.preventDefault()
        const userId = sessionStorage.getItem("userId")

        const myId = uuidv4()

        if (resumeFile != null) {

            const userDoc = doc(database, "person", userId);
            const userSnap = await getDoc(userDoc);
            const userData = userSnap.data();
            if (userData.resumeFileName !== '') {

                // Create a reference to the file to delete
                const desertRef = ref(storage, `/resumes/${userData.resumeFileName}`);

                // Delete the file
                deleteObject(desertRef).then(() => {
                    // File deleted successfully
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                });
            }

            // uploading file bytes
            try {
                const refFIle = ref(storage, "/resumes/" + resumeFile.name + myId);
                // console.log(refFIle)
                // console.log(resumeFile.size / 1024 / 1024 + "MB");
                // console.log(resumeFile.type);
                // console.log(resumeFile.name);
                await uploadBytes(refFIle, resumeFile);
                console.log()
                const fileName = resumeFile.name + myId
                await submitUserFileDetails(fileName)
                // await updateIdentitiesUserApplies()
                await addToApplicationsCollection()

            } catch (err) {
                console.log("error", err)
            }

        }
    };

    async function submitUserFileDetails(fileName) {

        const userRef = doc(database, "person", userId)
        const additionalData = {
            city: Cookies.get('city'),
            firstName: Cookies.get('firstName'),
            lastName: Cookies.get('lastName'),
            phoneNumber: Cookies.get('phone'),
            resumeFileName: fileName,
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

    return (
        <Card>
            <Card.Body className='job_apply_form_body'>
                <Form className='job_form_apply_fields'>
                    <SaveAndExit changeTo={2} />

                    <div className='job_form_resume_head'>
                        <h5>Upload a resume</h5>
                        <img src={crossIcon} alt="" />
                    </div>
                    <label htmlFor='resume_file'>
                        <h6 className='job_form_resume_accept'>Acceptable files: docx,pdf</h6>
                        <Container className='job_form_resume_box'>
                            <img src={dragIcon} alt="" />
                            <h6>Drag and drop here, or</h6>
                            <h6>Select a file</h6>
                        </Container>
                        {/* <input type='file' onChange={(e) => { setImageFile(e.target.files[0]) }} accept=".docx,.pdf" /> */}

                        <input type='file' placeholder='' id='resume_file' onChange={(e) => { setResumeFile(e.target.files[0]) }} accept=".docx,.pdf" />
                    </label>
                    <div className='job_form_resume_upload_btns'>
                        <button className='job_form_resume_canel_btn'>Cancel</button>
                        <button className='job_form_resume_upload_btn' onClick={(e) => { uploadFile(e) }}>Upload</button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default UploadFileForm
