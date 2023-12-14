import React, { useState, useContext } from 'react'
import { Card, Button, Container, Form } from 'react-bootstrap';
import { collection, setDoc, doc, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { database } from "./firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { idJobToApplyContext } from './Context';

export function JobApplyForm() {

    // card 1
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [phone, setPhone] = useState('')
    const [resumeOption, setResumeOption] = useState('')
    // card 4
    const [educationLevel, setEducationLevel] = useState('')
    const [studyField, setStudyField] = useState('')
    const [schoolName, setSchoolName] = useState('')
    const [educationFromMonth, setEducationFromMonth] = useState()
    const [educationToMonth, setEducationToMonth] = useState()
    const [educationFromYear, setEducationFromYear] = useState()
    const [educationToYear, setEducationToYear] = useState()
    //card 5
    const [jobTitle, setJobTitle] = useState()
    const [company, setCompany] = useState()
    const [jobFromMonth, setJobFromMonth] = useState()
    const [jobToMonth, setJobToMonth] = useState()
    const [jobFromYear, setJobFromYear] = useState()
    const [jobToYear, setJobToYear] = useState()
    const [jobDescription, setJobDescription] = useState()
    //card 6
    const [skills, setSkills] = useState([])
    const [skill, setSkill] = useState('')
    const { jobToApplyId, setJobToApplyId } = useContext(idJobToApplyContext)

    const navigate = useNavigate();

    const userId = "docexsists6@gmail.com"
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
    function handleContinueBtn(cardNumber) {

        if (resumeOption === 1)
            setCardNumber(3);
        else if (resumeOption === 2)
            setCardNumber(4)
        else if (resumeOption === 3)
            submitApply();
    }

    function addSkill() {
        skills.push(skill)
    }
    function submitApply() {
        if (validationErrors.length === 0) {
            skills?.map(s => (
                submitSkills(s)
            ))
            submitUserDetails()
            submitEducation()
            submitWorkHistory()
            updateApplyJobs()
            updateIdentitiesUserApplyes()
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
    async function submitEducation() {

        const persons = collection(database, "persons");
        const userRef = doc(persons, userId);
        const DocId = `${educationFromYear}-${educationToYear}`
        const subcollectionRef = collection(userRef, "educations");
        try {
            await setDoc(doc(subcollectionRef, DocId), {
                educationLevel: educationLevel,
                schoolName: schoolName,
                studyName: studyField,
                timeOfStudyFromMonth: educationFromMonth,
                timeOfStudyFromYear: educationFromYear,
                timeOfStudyToMonth: educationToMonth,
                timeOfStudyToYear: educationToYear
            });
        } catch (error) {
            console.error("Error adding document:", error);
        }
    }
    async function submitWorkHistory() {

        const persons = collection(database, "persons");
        const userRef = doc(persons, userId);
        const docId = `${jobFromYear}-${jobToYear}`
        const subcollectionRef = collection(userRef, "workHistory");
        try {
            await setDoc(doc(subcollectionRef, docId), {
                company: company,
                description: jobTitle,
                title: jobTitle,
                timeOfStudyFromMonth: jobFromMonth,
                timeOfWorkFromYear: jobFromYear,
                timeOfWorkToMonth: jobToMonth,
                timeOfWorkToYear: jobToYear
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
    async function updateIdentitiesUserApplyes() {
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
        const emailId = "docexsists6@gmail.com"

        const userRef = doc(database, "persons", emailId)
        const additionalData = {
            city: city,
            createdAt: serverTimestamp(),
            email: email,
            firstName: firstName,
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
                            <Form.Control type='text' onChange={(e) => setFirstName(e.target.value)} required />
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type='text' onChange={(e) => setLastName(e.target.value)} required />
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                            <Form.Label>City (optional)</Form.Label>
                            <Form.Control type='text' onChange={(e) => setCity(e.target.value)} />
                            <label for="phone" class="form-label">Phone number</label>
                            <input type="text" class="form-control" id="phone" name="phone" onChange={(e) => setPhone(e.target.value)} />
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
                            <button class="btn btn-primary w-100" onClick={handleContinueBtn}>Continue</button>

                        </Form>
                    </Card.Body>
                </Card>
            }
            {cardNumber === 3 &&

                <Card>
                    <Card.Body>
                        <Form>
                            <h5>Upload a resume</h5>
                            <h6>Acceptable files: docx,pdf</h6>
                            <Container class="container border border-primary rounded p-3">
                                <h6>Drag and drop here, or</h6>
                                <h6>Select a file</h6>
                                <Button>Upload</Button>
                            </Container>
                        </Form>
                    </Card.Body>
                </Card>
            }
            {cardNumber === 4 &&
                <Card>
                    <Card.Body>
                        <Form>
                            <h4>Build your resume (1 of 4)</h4>
                            <h4>Do you want to add any education details?</h4>

                            <Form.Label>Level of education *</Form.Label>
                            <Form.Control type='text' required onChange={(e) => setEducationLevel(e.target.value)} />
                            <Form.Label>Field of study</Form.Label>
                            <Form.Control type='text' required onChange={(e) => setStudyField(e.target.value)} />
                            <Form.Label>Name of school</Form.Label>
                            <Form.Control type='text' required onChange={(e) => setSchoolName(e.target.value)} />

                            <Form.Text>Time period</Form.Text>
                            <Form.Group>
                                <Form.Label>From</Form.Label>
                                <input type="number" class="form-control" name="numberInput" min="1" max="12" placeholder='Month' onChange={(e) => setEducationFromMonth(e.target.value)} />
                                <input type="number" class="form-control" name="numberInput" min="1960" max="2024" placeholder='Year' onChange={(e) => setEducationFromYear(e.target.value)} />

                            </Form.Group>
                            <Form.Group>
                                <Form.Label>To</Form.Label>
                                <input type="number" class="form-control" name="numberInput" min="1" max="12" placeholder='Month' onChange={(e) => setEducationToMonth(e.target.value)} />
                                <input type="number" class="form-control" name="numberInput" min="1960" max="2024" placeholder='Year' onChange={(e) => setEducationToYear(e.target.value)} />
                            </Form.Group>
                            <Button onClick={(e) => setCardNumber(5)}>Save and continue</Button>

                        </Form>
                    </Card.Body>
                </Card>
            }
            {cardNumber === 5 &&
                <Card>
                    <Card.Body>
                        <Form>
                            <Form.Text>Do you want to add work history?</Form.Text>
                            <Form.Group>
                                <Form.Label>Job title *</Form.Label>
                                <Form.Control type='text' required onChange={(e) => setJobTitle(e.target.value)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Company</Form.Label>
                                <Form.Control type='text' required onChange={(e) => setCompany(e.target.value)} />
                            </Form.Group>
                            <Form.Text>Time period</Form.Text>
                            <Form.Group>
                                <Form.Label>From</Form.Label>
                                <input type="number" class="form-control" name="numberInput" min="1" max="12" placeholder='Month' onChange={(e) => setJobFromMonth(e.target.value)} />
                                <input type="number" class="form-control" name="numberInput" min="1960" max="2024" placeholder='Year' onChange={(e) => setJobFromYear(e.target.value)} />

                            </Form.Group>
                            <Form.Group>
                                <Form.Label>To</Form.Label>
                                <input type="number" class="form-control" name="numberInput" min="1" max="12" placeholder='Month' onChange={(e) => setJobToMonth(e.target.value)} />
                                <input type="number" class="form-control" name="numberInput" min="1960" max="2024" placeholder='Year' onChange={(e) => setJobToYear(e.target.value)} />
                            </Form.Group>
                            <Form.Label>Description</Form.Label>
                            <br />
                            <Form.Text>Describe your position and any significant accomplishments</Form.Text>

                            <textarea
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows="5"
                                onChange={(e) => setJobDescription(e.target.value)}
                            />

                            <Button onClick={(e) => setCardNumber(6)}>Save and continue</Button>

                        </Form>
                    </Card.Body>
                </Card>
            }
            {cardNumber === 6 &&
                <Card>
                    <Card.Body>
                        <Form>
                            <p>Build your resume (3 of 4)</p>
                            <label for="phone" class="form-label">Do you want to share some of your skills?</label>
                            <Form.Text>we recommend adding at least 6 skills</Form.Text>
                            <input type="text" class="form-control" placeholder='Add a skill' onChange={(e) => setSkill(e.target.value)} />
                            {skills?.map(skill => (
                                <h4>{skill}</h4>
                            ))}

                            <Button onClick={addSkill}>+</Button>
                            <Button onClick={submitApply}>Save and continue</Button>
                        </Form>
                    </Card.Body>
                </Card>
            }
        </Container>
    )
}
