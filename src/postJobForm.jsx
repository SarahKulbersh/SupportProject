import React from 'react'
import { Card, Button, Container, Form } from 'react-bootstrap';
import { useState } from 'react';
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { database } from "./firebaseConfig";
import { useNavigate } from 'react-router-dom';


export function PostJobForm() {

    const [location, setLocation] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [selectedFullPart, setSelectedFullPart] = useState('full-time');
    const [selectedTime, setSelectedTime] = useState();
    const [startTime, setStartTime] = useState("08:00 AM");
    const [endTime, setEndTime] = useState("04:00 PM");
    const [description, setDescription] = useState('');
    const handleSetDescription = (description) => {
        const newDescription = description.split('\n').join('<br/>');
        setDescription(newDescription);
    }
    const [selectedShowPay, setSelectedShowPay] = useState('Range');
    const [minPay, setMinPay] = useState('');
    const [maxPay, setMaxPay] = useState('');
    const [selectedRatePer, setSelectedRatePer] = useState('');

    const [cardNumber, setCardNumber] = useState(1);
    const navigate = useNavigate();

    const [startHour, setStartHour] = useState('');
    const [finishHour, setFinishHour] = useState('');
    const [startMinutes, setStartMinutes] = useState('');
    const [finishMinutes, setFinishMinutes] = useState('');
    // const [startTimePeriod, setStartTimePeriod] = useState('');
    // const [finishTimePeriod, setFinishTimePeriod] = useState('');

    function handleContinueBtn(cardNumber) {setCardNumber(cardNumber + 1)}
    
    function handleBackBtn(cardNumber) {
        if (cardNumber === 1) {
            navigate(-1)
        }
        setCardNumber(cardNumber - 1)
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

    const addJobPost = async (e) => {
        const persons = collection(database, "persons");
        const userId = "skk@gmail.com";
        const isEst = () => {
            const selectedTime = "Eastern Time (EST)";
            return selectedTime === "Eastern Time (EST)";
        };

        const userRef = doc(persons, userId);
        const subcollectionRef = collection(userRef, "postingJobs");
        const postingJobIdString = getCurrentDateTimeString()+'_'+userId;
        try {
            await setDoc(doc(subcollectionRef, getCurrentDateTimeString()), {
                postingJobId:postingJobIdString,
                identityUserPublishId: userId,
                isEST: isEst(),
                isFullTimeJob: selectedFullPart,
                jobDescription: description,
                jobLocation: location,
                startedTimeFrom: `${startHour} : ${startMinutes}`,
                endedTimeIn: `${finishHour} : ${finishMinutes}`,
                // jobPayment : {minPay} - {maxPay}, 
                jobPaymentPer: selectedRatePer,
                jobTitle: jobTitle,
                updatedAt: serverTimestamp(),
                isJobActive: true,
                createdAt: serverTimestamp()
            });
            console.log("Document added to subcollection successfully!");
            navigate(-1)

        } catch (error) {
            console.error("Error adding document:", error);
        }
    }


    return (
        <Container className='d-flex align-items-center justify-content-center' >
            {cardNumber === 1 &&
                <Card style={{ padding: '40px' }}>
                    <Card.Body>
                        <Form>
                            <Form.Group id='jobTitle'>
                                <Form.Label>Job title *</Form.Label>
                                <Form.Control type='text' required onChange={(e) => setJobTitle(e.target.value)} />
                            </Form.Group>
                            <Form.Group id='location'>
                                <Form.Label>Where is your company located *</Form.Label>
                                <Form.Control type='text' required onChange={(e) => setLocation(e.target.value)} />
                            </Form.Group>
                            <Button className='btn btn-primary float-left' style={{ marginTop: '15px' }} onClick={() => handleBackBtn(1)}>Back</Button>
                            <Button className='float-end' style={{ marginTop: '15px' }} onClick={() => handleContinueBtn(1)}>continue</Button>
                        </Form>
                    </Card.Body>
                </Card>
            }
            {cardNumber === 2 &&
                <Card style={{ padding: '40px' }}>
                    <Card.Body>
                        <Form >
                            <Form.Group id='jobType'>
                                <Form.Label>Job type *</Form.Label>
                                <div className="button-group" style={{ margin: '10px' }}>
                                    <button
                                        className={`btn btn-primary float-left ${selectedFullPart === 'full-time' ? 'active' : ''}`}
                                        type='button'
                                        style={{ marginRight: '5px' }}
                                        onClick={() => setSelectedFullPart('full-time')} >
                                        Full-time
                                    </button>
                                    <button
                                        type='button'
                                        className={`btn btn-primary float-left ${selectedFullPart === 'part-time' ? 'active' : ''}`}
                                        onClick={() => setSelectedFullPart('part-time')}
                                    >
                                        Part-time
                                    </button>
                                </div>
                            </Form.Group>

                            <Form.Select
                                required
                                value={selectedTime}
                                style={{ marginBottom: '20px' }}
                                defaultValue={"Eastern Time (EST)"}
                                onChange={(e) => setSelectedTime(e.target.value)}
                            >
                                <option value={"Eastern Time (EST)"}>Eastern Time (EST)</option>
                                <option value={"Israel Time (IST)"}>Israel Time (IST)</option>
                            </Form.Select>

                            <input type="number" class="form-control" name="numberInput" min="1" max="23" defaultValue="8" onChange={(e) => setStartHour(e.target.value)} />
                            <input type="number" class="form-control" name="numberInput" min="00" max="60" step="1" defaultValue="00" onChange={(e) => setStartMinutes(e.target.value)} />

                            {/* <Form.Select required
                                value={startTimePeriod}
                                defaultValue="PM"
                                onChange={(e) => setStartTimePeriod(e.target.value)}
                            >
                            <option>AM</option>
                            <option>PM</option>
                            </Form.Select> */}

                            <input type="number" class="form-control" name="numberInput" min="1" max="12" defaultValue="8" onChange={(e) => setFinishHour(e.target.value)} />
                            <input type="number" class="form-control" name="numberInput" min="00" max="60" step="1" defaultValue="00" onChange={(e) => setFinishMinutes(e.target.value)} />

                            {/* <Form.Select required
                                value={finishTimePeriod}
                                defaultValue="PM"
                                onChange={(e) => setFinishTimePeriod(e.target.value)}
                            >
                            <option>AM</option>
                            <option>PM</option>
                            </Form.Select> */}

                            <Button className='btn btn-primary float-left' onClick={() => handleBackBtn(2)}>Back</Button>
                            <Button className='float-end' onClick={() => handleContinueBtn(2)}>continue</Button>

                        </Form>

                    </Card.Body>
                </Card>
            }
            {cardNumber === 3 &&
                <Card style={{ padding: '40px' }}>
                    <Card.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Job description *</Form.Label>

                                <textarea
                                    className="form-control"
                                    id="exampleFormControlTextarea1"
                                    rows="5"
                                    onChange={(e) => handleSetDescription(e.target.value)}
                                />
                                <Button className='btn btn-primary float-left' onClick={() => handleBackBtn(3)} style={{ marginTop: '15px' }}>Back</Button>
                                <Button className='float-end' onClick={() => handleContinueBtn(3)} style={{ marginTop: '15px' }}>continue</Button>
                            </Form.Group>
                        </Form>

                    </Card.Body>
                </Card>
            }
            {cardNumber === 4 &&

                <Card style={{ padding: '40px' }}>
                    <Card.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Show pay by</Form.Label>
                                <Form.Select
                                    required
                                    value={selectedShowPay}
                                    defaultValue={"Eastern Time (EST)"}
                                    onChange={(e) => setSelectedShowPay(e.target.value)}
                                >
                                    <option value={"Range"}>Range</option>
                                    <option value={"Starting amount"}>Starting amount</option>
                                    <option value={"Starting amount"}>Starting amount</option>
                                    <option value={"Maximum amount"}>Maximum amount</option>
                                    <option value={"Exact amount"}>Exact amount</option>

                                </Form.Select>
                            </Form.Group>
                            <Form.Group>

                                <Form.Label>Minimum</Form.Label>

                                <Form.Control type='text' required onChange={(e) => setMinPay(e.target.value)} />

                                <p>to</p>
                                <Form.Label>Maximum</Form.Label>
                                <Form.Control type='text' required onChange={(e) => setMaxPay(e.target.value)} />

                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Rate</Form.Label>
                                <Form.Select
                                    required
                                    value={selectedRatePer}
                                    defaultValue={"per year"}
                                    onChange={(e) => setSelectedRatePer(e.target.value)}
                                >
                                    <option value={"per year"}>per year</option>
                                    <option value={"per hour"}>per hour</option>
                                    <option value={"per day"}>per day</option>
                                    <option value={"per week"}>per week</option>
                                    <option value={"per year"}>per year</option>

                                </Form.Select>
                                <Form.Group>

                                    <Button className='btn btn-primary float-left' onClick={() => handleBackBtn(4)} style={{ marginTop: '15px' }}>Back</Button>
                                    <Button className='float-end' onClick={() => handleContinueBtn(4)} style={{ marginTop: '15px' }}>continue</Button>

                                </Form.Group>
                            </Form.Group>

                        </Form>

                    </Card.Body>
                </Card>
            }
            {cardNumber === 5 &&

                <Card style={{ padding: '40px' }}>
                    <Card.Body>
                        <Form>
                            <h1>{jobTitle}</h1>
                            <h5>{selectedShowPay}</h5>
                            <h1>{selectedFullPart}</h1>
                            <h1>{description}</h1>
                            <h5>{startTime}-{endTime}</h5>
                            <h5>{minPay}-{maxPay}</h5>
                            <h3>{selectedTime}</h3>
                            <h3>{selectedRatePer}</h3>
                            <Button className='btn btn-primary float-left' onClick={() => handleBackBtn(5)} style={{ marginTop: '15px' }}>Back</Button>
                            {/* i think there is an issue with this button being type=submit button: */}
                            <Button className='btn btn-primary float-end' onClick={() => addJobPost()} style={{ marginTop: '15px' }}>Submit</Button>

                        </Form>
                    </Card.Body>
                </Card>
            }
        </Container>
    )
}


