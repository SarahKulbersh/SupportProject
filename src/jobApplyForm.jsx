import React, { useState, useContext, useEffect, useId } from 'react'
import { Card, Button, Container, Form } from 'react-bootstrap';
import { collection, setDoc, doc, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { database } from "./firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { idJobToApplyContext, userIdContext } from './Context';
import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';


export function JobApplyForm() {

    // const {userId, setUserId} = useContext(userIdContext);
    const userId = localStorage.getItem("userId");

    // card 1
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [phone, setPhone] = useState('')
    const [resumeOption, setResumeOption] = useState('')
    //card 2
    async function submitUserDetailsNoResume() {
        const emailId = "docexsists7@gmail.com"

        const userRef = doc(database, "persons", emailId)
        const additionalData = {
            city: city,
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
            updatedAt: serverTimestamp()
        }
        try {
            await updateDoc(userRef, additionalData);
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }
    //card 3 
    // file uploading
    const [imgFile, setImageFile] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    async function submitUserFileDetails(fileName) {
        const emailId = "docexsists7@gmail.com"

        const userRef = doc(database, "persons", emailId)
        const additionalData = {
            city: city,
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
            resumeFileName: fileName,
            updatedAt: serverTimestamp()
        }
        try {
            await updateDoc(userRef, additionalData);
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }
    const uploadFile = async () => {

        updateIdentitiesUserApplies()
        const myId = uuidv4()

        if (imgFile != null) {
            if ((imgFile.size / 1024) > 10) {
                console.log(imgFile.size / 1024 / 1024 + "MB");
                console.log(imgFile.type);
                console.log(imgFile.name);
                // db ref
                const refFIle = ref(storage, "resume/" + imgFile.name + myId);
                // uploading file bytes
                uploadBytes(refFIle, imgFile);
            }
        }
        const fileName = imgFile.name + myId
        submitUserFileDetails(fileName)
        navigate(-1)
    };
    // display single image
    useEffect(() => {
        // referece db
        const displayImg = ref(storage, "/resume/img1.jpg");
        // Get the download URL
        getDownloadURL(displayImg)
            .then((url) => {
                // Insert url into an <img> tag to "download"
                setImgUrl(url);
            })
            .catch((error) => {
                switch (error.code) {
                    case 'storage/object-not-found':
                        // File doesn't exist
                        break;
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        // Unknown error occurred, inspect the server response
                        break;
                    default:
                    // default action
                }
            });
    }, []);

    // card 4
    const [education, setEducation] = useState([
        {
            educationLevel: "",
            schoolName: "",
            studyName: "",
            timeOfStudyFromMonth: "",
            timeOfStudyFromYear: "",
            timeOfStudyToMonth: "",
            timeOfStudyToYear: ""
        }])
    const handleChange = (event, index) => {
        let { name, value } = event.target;
        let onChangeValue = [...education];
        onChangeValue[index][name] = value;
        setEducation(onChangeValue);
    };
    const handleAddInput = () => {
        setEducation([...education, {
            educationLevel: "",
            schoolName: "",
            studyName: "",
            timeOfStudyFromMonth: "",
            timeOfStudyFromYear: "",
            timeOfStudyToMonth: "",
            timeOfStudyToYear: ""
        }]);
    };
    const handleDeleteInput = (index) => {
        const newArray = [...education];
        newArray.splice(index, 1);
        setEducation(newArray);
    };
    //card 5
    const [jobs, setJobs] = useState([
        {
            company: "",
            description: "",
            timeOfWorkFromMonth: "",
            timeOfWorkFromYear: "",
            timeOfWorkToMonth: "",
            timeOfWorkToYear: "",
            title: ""
        }])
    const handleWorkHistoryChange = (event, index) => {
        let { name, value } = event.target;
        let onChangeValue = [...jobs];
        onChangeValue[index][name] = value;
        setJobs(onChangeValue);
    };
    const handleAddWorkHistoryInput = () => {
        setJobs([...jobs, {
            company: "",
            description: "",
            timeOfWorkFromMonth: "",
            timeOfWorkFromYear: "",
            timeOfWorkToMonth: "",
            timeOfWorkToYear: "",
            title: ""
        }]);
    };
    const handleDeleteWorkHistoryInput = (index) => {
        const newArray = [...jobs];
        newArray.splice(index, 1);
        setJobs(newArray);
    };
    //card 6
    const [skills, setSkills] = useState([])
    const [inputValue, setInputValue] = useState('');
    const handleSkillInputChange = (event) => {
        setInputValue(event.target.value);
    };
    const addSkill = () => {
        setSkills([...skills, inputValue]);
        setInputValue('');
    };
    const removeSkill = (index) => {
        setSkills(skills.filter((item, i) => i !== index));
    };
    const { jobToApplyId, setJobToApplyId } = useContext(idJobToApplyContext)

    const navigate = useNavigate();

    const [validationErrors, setValidationErrors] = useState([])
    const [cardNumber, setCardNumber] = useState(1);

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
    const handleContinueBtn = (e) => {
        e.preventDefault();
        if (resumeOption === 1)
            setCardNumber(3);
        else if (resumeOption === 2)
            setCardNumber(4)
        else if (resumeOption === 3) {
            try {
                submitUserDetailsNoResume()
                updateIdentitiesUserApplies()
                updateApplyJobs()
            } catch (err) {
                console.log(err)
            }
            navigate(-1)
        }
    }
    function submitApply() {
        console.log('education length', education)

        if (validationErrors.length === 0) {
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
            updateIdentitiesUserApplies()
            navigate(-1)
        }

    }
    async function submitSkills(s) {

        const persons = collection(database, "persons");
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
    async function submitEducation(e) {
        console.log("trying to submit education")
        const persons = collection(database, "persons");
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

        console.log(job)
        console.log(job.timeOfWorkFromYear)
        const persons = collection(database, "persons");
        const userRef = doc(persons, userId);
        const docId = `${job.timeOfWorkFromYear}-${job.timeOfWorkToYear}`
        console.log('docId', docId)
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
    async function updateApplyJobs() {

        const persons = collection(database, "persons");
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
    async function updateIdentitiesUserApplies() {
        const persons = collection(database, "persons");
        const userRef = doc(persons, extractEmailFromDateString(jobToApplyId));
        const docId = extractDateTime(jobToApplyId)
        const subcollectionRef = collection(userRef, "postingJobs");

        try {
            await updateDoc(doc(subcollectionRef, docId), {
                identitiesUserApplyes: arrayUnion(userId)
            });
        } catch (error) {
            console.error("Error adding document:", error);
        }
    }
    async function submitUserDetails() {
        const emailId = "docexsists7@gmail.com"

        const userRef = doc(database, "persons", emailId)
        const additionalData = {
            city: city,
            email: email,
            firstName: firstName,
            lastName: lastName,
            isActive: true,
            phoneNumber: phone,
            updatedAt: serverTimestamp()
        }
        try {
            await updateDoc(userRef, additionalData);
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }

    return (
        <Container>
            {cardNumber === 1 &&
                <Card>
                    <Card.Body>
                        <Form>
                            <h4>Add your contact information</h4>
                            <Form.Label>First name</Form.Label>
                            <Form.Control type='text' onChange={(e) => setFirstName(e.target.value)} required value={firstName} />
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type='text' onChange={(e) => setLastName(e.target.value)} required value={lastName} />
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" name="email" onChange={(e) => setEmail(e.target.value)} defaultValue={userId} readOnly />
                            <Form.Label>City (optional)</Form.Label>
                            <Form.Control type='text' onChange={(e) => setCity(e.target.value)} />
                            <label class="form-label">Phone number</label>
                            <input type="text" class="form-control" id="phone" name="phone" onChange={(e) => setPhone(e.target.value)} value={phone} />
                            <br />
                            <button onClick={(e) => setCardNumber(2)} class="btn btn-primary w-100" >Continue</button>
                        </Form>
                    </Card.Body>
                </Card>
            }
            {cardNumber === 2 &&
                <Card>
                    <Card.Body>
                        <Form>
                            <Button onClick={(e) => setCardNumber(1)}>Back</Button>
                            <h3>Add a resume for the employer</h3>

                            <Container type='button' style={{ border: 'solid 1px navy', padding: '10px', borderRadius: '15px' }} onClick={(e) => setResumeOption(1)}>
                                <h4>Upload a resume</h4>
                                <p>Accepted file types: PDF, DOCX</p>
                            </Container>
                            <p>Or</p>
                            <Container type='button' style={{ border: 'solid 1px navy', padding: '10px', borderRadius: '15px' }} onClick={(e) => setResumeOption(2)}>
                                <p>Recommended</p>
                                <h4>Build a Logoipsum Resume</h4>
                                <p>We’ll guide you through it, there are only a few steps</p>
                            </Container>
                            <p>Or</p>
                            <Container type='button' style={{ border: 'solid 1px navy', padding: '10px', borderRadius: '15px' }} onClick={(e) => setResumeOption(3)}>
                                <h4>Continue without a resume</h4>
                                <p>We highly recommend that you provide a resume!</p>
                            </Container>
                            <br />
                            <button class="btn btn-primary w-100" onClick={(e) => handleContinueBtn(e)}>Continue</button>

                        </Form>
                    </Card.Body>
                </Card>
            }
            {cardNumber === 3 &&
                <Card>
                    <Card.Body>
                        <Form>
                            <Button onClick={(e) => setCardNumber(2)}>Back</Button>
                            <h5>Upload a resume</h5>
                            <h6>Acceptable files: docx,pdf</h6>
                            <Container class="container border border-primary rounded p-3">
                                <h6>Drag and drop here, or</h6>
                                <h6>Select a file</h6>
                                <input type='file' onChange={(e) => { setImageFile(e.target.files[0]) }} accept=".docx,.pdf" />
                                {/* <img src={imgUrl} height="200px" width="200px" alt="bla bla bla" /> */}
                                <Button onClick={uploadFile} >Upload</Button>
                            </Container>
                        </Form>
                    </Card.Body>
                </Card>
            }
            {cardNumber === 4 &&
                <Card>
                    <Card.Body>
                        <Form>
                            <Button onClick={(e) => setCardNumber(2)}>Back</Button>

                            <h4>Build your resume (1 of 4)</h4>
                            <h4>Do you want to add any education details?</h4>
                            {education?.map((e, index) => (
                                <div key={index}>
                                    <Form.Label>Level of education *</Form.Label>
                                    <Form.Control type='text' name='educationLevel' required value={e.educationLevel} onChange={(e) => handleChange(e, index)} />
                                    <Form.Label>Field of study</Form.Label>
                                    <Form.Control type='text' name='studyName' required value={e.studyField} onChange={(e) => handleChange(e, index)} />
                                    <Form.Label>Name of school</Form.Label>
                                    <Form.Control type='text' name='schoolName' required value={e.schoolName} onChange={(e) => handleChange(e, index)} />

                                    <Form.Text>Time period</Form.Text>
                                    <Form.Group>
                                        <Form.Label>From</Form.Label>
                                        <input type="number" name='timeOfStudyFromMonth' value={e.educationFromMonth} class="form-control" min="1" max="12" placeholder='Month' onChange={(e) => handleChange(e, index)} />
                                        <input type="number" name='timeOfStudyFromYear' value={e.educationFromYear} class="form-control" min="1960" max="2024" placeholder='Year' onChange={(e) => handleChange(e, index)} />

                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>To</Form.Label>
                                        <input type="number" name='timeOfStudyToMonth' value={e.educationToMonth} class="form-control" min="1" max="12" placeholder='Month' onChange={(e) => handleChange(e, index)} />
                                        <input type="number" name='timeOfStudyToYear' value={e.educationToYear} class="form-control" min="1960" max="2024" placeholder='Year' onChange={(e) => handleChange(e, index)} />
                                    </Form.Group>
                                    {education.length > 1 && (
                                        <Button onClick={() => handleDeleteInput(index)}>Delete</Button>
                                    )}
                                    {index === education.length - 1 && (
                                        <button onClick={() => handleAddInput()}>Add</button>
                                    )}
                                </div>
                            ))}

                            <Button onClick={(e) => setCardNumber(5)}>Save and continue</Button>

                        </Form>
                    </Card.Body>
                </Card>
            }
            {cardNumber === 5 &&
                <Card>
                    <Card.Body>
                        <Form>
                            <Button onClick={(e) => setCardNumber(4)}>Back</Button>

                            <Form.Text>Do you want to add work history?</Form.Text>
                            {jobs?.map((job, index) => (
                                <div key={index}>
                                    <Form.Group>
                                        <Form.Label>Job title *</Form.Label>
                                        <Form.Control type='text' name='title' value={job.title} required onChange={(e) => handleWorkHistoryChange(e, index)} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Company</Form.Label>
                                        <Form.Control type='text' name='company' value={job.company} required onChange={(e) => handleWorkHistoryChange(e, index)} />
                                    </Form.Group>
                                    <Form.Text>Time period</Form.Text>
                                    <Form.Group>
                                        <Form.Label>From</Form.Label>
                                        <input type="number" class="form-control" name='timeOfWorkFromMonth' value={job.timeOfWorkFromMonth} min="1" max="12" placeholder='Month' onChange={(e) => handleWorkHistoryChange(e, index)} />
                                        <input type="number" class="form-control" name='timeOfWorkFromYear' value={job.timeOfWorkFromYear} min="1960" max="2024" placeholder='Year' onChange={(e) => handleWorkHistoryChange(e, index)} />

                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>To</Form.Label>
                                        <input type="number" class="form-control" name='timeOfWorkToMonth' value={job.timeOfWorkToMonth} min="1" max="12" placeholder='Month' onChange={(e) => handleWorkHistoryChange(e, index)} />
                                        <input type="number" class="form-control" name='timeOfWorkToYear' value={job.timeOfWorkToYear} min="1960" max="2024" placeholder='Year' onChange={(e) => handleWorkHistoryChange(e, index)} />
                                    </Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <br />
                                    <Form.Text>Describe your position and any significant accomplishments</Form.Text>

                                    <textarea
                                        className="form-control"
                                        id="exampleFormControlTextarea1"
                                        rows="5"
                                        name='description'
                                        value={job.description}
                                        onChange={(e) => handleWorkHistoryChange(e, index)}
                                    />
                                    {jobs.length > 1 && (
                                        <Button onClick={() => handleDeleteWorkHistoryInput(index)}>Delete</Button>
                                    )}
                                    {index === jobs.length - 1 && (
                                        <Button onClick={() => handleAddWorkHistoryInput()}>Add</Button>
                                    )}

                                </div>
                            ))}

                            <Button onClick={(e) => setCardNumber(6)}>Save and continue</Button>

                        </Form>
                    </Card.Body>
                </Card>
            }
            {cardNumber === 6 &&
                <Card>
                    <Card.Body>
                        <Form>
                            <Button onClick={(e) => setCardNumber(5)}>Back</Button>

                            <p>Build your resume (3 of 4)</p>
                            <label for="phone" class="form-label">Do you want to share some of your skills?</label>
                            <Form.Text>we recommend adding at least 6 skills</Form.Text>
                            <input type="text" class="form-control" placeholder='Add a skill' value={inputValue} onChange={handleSkillInputChange} />
                            {skills?.map((skill, index) => (
                                <div key={index}>
                                    <h4>{skill}</h4>
                                    {skills.length > 1 && (
                                        <Button onClick={() => removeSkill(index)}>Delete</Button>
                                    )}
                                </div>
                            ))}
                            <Button onClick={addSkill}>Add</Button>

                            <Button onClick={submitApply}>Save and continue</Button>
                        </Form>
                    </Card.Body>
                </Card>
            }
        </Container>
    )
}
