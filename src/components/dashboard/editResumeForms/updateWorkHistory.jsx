import React, { useState } from 'react'
import { Card, Button, Form } from 'react-bootstrap';
import { collection, setDoc, doc, serverTimestamp, updateDoc, deleteDoc } from "firebase/firestore";
import { addMore } from "../../../assets/index"
import { database } from "../../../firebaseConfig";

function UpdateWorkHistory({ setPage }) {
  const storedItem = sessionStorage.getItem('editObject');
  const editedItem = JSON.parse(storedItem);
  const [jobs, setJobs] = useState([
    {
      company: editedItem.company,
      description: editedItem.description,
      timeOfWorkFromMonth: editedItem.timeOfWorkFromMonth,
      timeOfWorkFromYear: editedItem.timeOfWorkFromYear,
      timeOfWorkToMonth: editedItem.timeOfWorkToMonth,
      timeOfWorkToYear: editedItem.timeOfWorkToYear,
      title: editedItem.title
    }])
  const today = new Date();
  const currentYear = today.getFullYear();
  const years = [...Array(31).keys()].map((year) => currentYear - year);
  const [error, setError] = useState(''); // To store error messages

  const submitWorkHistory = () => {

    const filteredJobs = jobs.filter((e) => {
      return (
        e.company !== '' ||
        e.description !== '' ||
        e.timeOfWorkFromMonth !== 'Month' ||
        e.timeOfWorkFromYear !== 'Year' ||
        e.timeOfWorkToMonth !== 'Month' ||
        e.timeOfWorkToYear !== 'Year' ||
        e.title !== ''
      );
    });

    const hasEmptyFields = filteredJobs.some((e) => {

      return (
        e.company === '' ||
        e.description === '' ||
        e.timeOfWorkFromMonth === 'Month' ||
        e.timeOfWorkFromYear === 'Year' ||
        e.timeOfWorkToMonth === 'Month' ||
        e.timeOfWorkToYear === 'Year' ||
        e.title === ''
      );
    });
    const hasInvalidDates = filteredJobs.some((e) => {
      const fromYear = parseInt(e.timeOfWorkFromYear);
      const toYear = parseInt(e.timeOfWorkToYear);

      if (fromYear > toYear) {
        return true;
      }

      if (fromYear === toYear) {
        const fromMonth = parseInt(e.timeOfWorkFromMonth);
        const toMonth = parseInt(e.timeOfWorkToMonth);
        return fromMonth > toMonth;
      }

      return false
    })
    if (hasEmptyFields) {
      setError("All fields must be filled to submit work history")
    } else if (hasInvalidDates) {
      setError("Work dates are invalid")
    } else {
      setError('')
      filteredJobs.map((workHistory) => updateWorkHistory(workHistory));
    }

    return false;
  }
  async function updateWorkHistory(e) {

    const userId = sessionStorage.getItem("userId")
    const persons = collection(database, "person");
    const userRef = doc(persons, userId);
    const storedItem = sessionStorage.getItem('editObject');
    const editedItem = JSON.parse(storedItem);
    const educationId = `${editedItem.timeOfWorkFromYear}-${editedItem.timeOfWorkToYear}`;
    const docRef = doc(collection(userRef, 'workHistory'), educationId);
    await deleteDoc(docRef);

    const DocId = `${e.timeOfWorkFromYear}-${e.timeOfWorkToYear}`
    const subcollectionRef = collection(userRef, "workHistory");

    try {
      await setDoc(doc(subcollectionRef, DocId), {
        company: e.company,
        description: e.description,
        timeOfWorkFromMonth: e.timeOfWorkFromMonth,
        timeOfWorkFromYear: e.timeOfWorkFromYear,
        timeOfWorkToMonth: e.timeOfWorkToMonth,
        timeOfWorkToYear: e.timeOfWorkToYear,
        title: e.title
      });
    } catch (error) {
      console.error("Error adding document:", error);
    }
    setPage(-1)
  }

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
  return (
    <Card>
      <Card.Body className='job_apply_form_body'>
        <Form className='job_form_apply_fields'>
          {jobs?.map((job, index) => (
            <div key={index}>
              {index >= 1 &&
                <p style={{ color: "red", cursor: "pointer" }} onClick={handleDeleteWorkHistoryInput}>Remove work history</p>
              }
              <Form.Group>
                <Form.Label className='job_form_field'>Job title *</Form.Label>
                <Form.Control className='job_form_input' type='text' name='title' value={job.title} required onChange={(e) => handleWorkHistoryChange(e, index)} />
              </Form.Group>
              <Form.Group>
                <Form.Label className='job_form_field'>Company</Form.Label>
                <Form.Control className='job_form_input' type='text' name='company' value={job.company} required onChange={(e) => handleWorkHistoryChange(e, index)} />
              </Form.Group>

              <Form.Text className='job_form_field'>Time period</Form.Text>
              <Form.Group className='job_edu_form_date'>
                <Form.Label>From</Form.Label>
                <div>
                  <Form.Select name='timeOfWorkFromMonth' value={job.timeOfWorkFromMonth} onChange={(e) => handleWorkHistoryChange(e, index)}>
                    <option>Month</option>
                    {[...new Array(12).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select name='timeOfWorkFromYear' value={job.timeOfWorkFromYear} onChange={(e) => handleWorkHistoryChange(e, index)}>
                    <option>Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
              <Form.Group className='job_edu_form_date'>
                <Form.Label>To</Form.Label>
                <div>
                  <Form.Select name='timeOfWorkToMonth' value={job.timeOfWorkToMonth} onChange={(e) => handleWorkHistoryChange(e, index)}>
                    <option>Month</option>
                    {[...new Array(12).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select name='timeOfWorkToYear' value={job.timeOfWorkToYear} onChange={(e) => handleWorkHistoryChange(e, index)}>
                    <option>Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
              <div className='job_form_desc_box'>
                <Form.Label>Description</Form.Label>
                <Form.Text>Describe your position and any significant accomplishments</Form.Text>
              </div>
              <textarea
                rows="5"
                name='description'
                value={job.description}
                onChange={(e) => handleWorkHistoryChange(e, index)}
              />
              {index === jobs.length - 1 && (
                <div className='job_form_add' onClick={() => handleAddWorkHistoryInput()}>
                  <img src={addMore} alt="" />
                  Add more
                </div>
              )}

            </div>
          ))}
          {error !== '' &&
            <p style={{ color: 'red' }}>{error}</p>
          }

          <div className='job_form_desc_btn_box'>

            <Button className='job_form_submit' onClick={(e) => submitWorkHistory()}>Save changes</Button>

          </div>

        </Form>
      </Card.Body>
    </Card>
  )
}

export default UpdateWorkHistory
