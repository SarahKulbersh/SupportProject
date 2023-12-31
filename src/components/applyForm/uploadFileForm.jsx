import React, { useState, useContext } from 'react'
import { Card, Container, Form } from 'react-bootstrap';
import { crossIcon, dragIcon } from "../../assets/index"
import { v4 as uuidv4 } from 'uuid';
import { setDoc, doc, serverTimestamp, updateDoc, getDoc } from "firebase/firestore";
import { database, storage } from "../../firebaseConfig";
import { ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import Cookies from 'js-cookie';
import { applyFormCardNumberContext } from '../../Context';

import SaveAndExit from './saveAndExit';

function UploadFileForm() {
    const [resumeFile, setResumeFile] = useState('');
    const userId = sessionStorage.getItem("userId");
    const { applyFormCardNumber, setApplyFormCardNumber } = useContext(applyFormCardNumberContext)

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

    const emailEmployer = async (fileName) => {

        const userId = sessionStorage.getItem("userId")
        const jobId = sessionStorage.getItem("jobId")
        const employerId = extractEmailFromDateString(jobId)
        const date = getCurrentDateTimeString()
    
        try {
            const fileRef = ref(storage, `resumes/${fileName}`);
            const fileURL = await getDownloadURL(fileRef)

          await setDoc(doc(database, "mail", `${userId}_#_${date}_#_${employerId}`), {
            to: [employerId],
            message: {
              subject: `${Cookies.get('firstName')} ${Cookies.get('lastName')} might be a good fit for ${sessionStorage.getItem("jobTitle")} `,
              text: 'This is the plaintext section of the email body.',
              html: `Contact ${Cookies.get('firstName') +" "+ Cookies.get('lastName')} by emailing ${userId} or calling ${Cookies.get('phone')}. 
              Take a look at their resume <a href=${fileURL}>${Cookies.get('firstName')} ${Cookies.get('lastName')} resume</a>`,
            //   attachments: [
            //     {
            //       content: fileURL,
            //       filename: fileName,
            //     },
            //   ],
            }
          });
        } catch (error) {
          console.error("Error submitUserDetails:", error);
        }
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
                const fileName = resumeFile.name + myId
                await emailEmployer(fileName)
                await submitUserFileDetails(fileName)
                // await updateIdentitiesUserApplies()
                await addToApplicationsCollection()
                setApplyFormCardNumber(1)


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
