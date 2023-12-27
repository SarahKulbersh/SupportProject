import React, { useState, useContext } from 'react'
import { Card, Button, Form } from 'react-bootstrap';
import { addMore } from "../../assets/index"
import { applyFormCardNumberContext } from '../../Context';
import Cookies from 'js-cookie';
import SaveAndExit from './saveAndExit';

function EducationForm() {

  const { applyFormCardNumber, setApplyFormCardNumber } = useContext(applyFormCardNumberContext)

  const today = new Date();
  const currentYear = today.getFullYear();
  const years = [...Array(31).keys()].map((year) => currentYear - year);
  const [error, setError] = useState(''); // To store error messages

  const submitEducation = () => {

    const filteredEducation = education.filter((e) => {
      return (
        e.educationLevel !== '' ||
        e.schoolName !== '' ||
        e.studyName !== '' ||
        e.timeOfStudyFromMonth !== 'Month' ||
        e.timeOfStudyFromYear !== 'Year' ||
        e.timeOfStudyToMonth !== 'Month' ||
        e.timeOfStudyToYear !== 'Year'
      );
    });

    const hasEmptyFields = filteredEducation.some((e) => {
      return (
        e.educationLevel === '' ||
        e.schoolName === '' ||
        e.studyName === '' ||
        e.timeOfStudyFromMonth === 'Month' ||
        e.timeOfStudyFromYear === 'Year' ||
        e.timeOfStudyToMonth === 'Month' ||
        e.timeOfStudyToYear === 'Year'
      );
    });

    const hasInvalidDates = filteredEducation.some((e) => {
      const fromYear = parseInt(e.timeOfStudyFromYear);
      const toYear = parseInt(e.timeOfStudyToYear);

      if (fromYear > toYear) {
        return true;
      }

      if (fromYear === toYear) {
        const fromMonth = parseInt(e.timeOfStudyFromMonth);
        const toMonth = parseInt(e.timeOfStudyToMonth);
        return fromMonth > toMonth;
      }

      return false;
    });

    if (hasEmptyFields) {
      setError("All fields must be filled to submit education")
    } else if (hasInvalidDates) {
      setError("Education dates are invalid")
    } else {
      Cookies.set('education', JSON.stringify(filteredEducation));
      setApplyFormCardNumber(5);
    }

  }
  const [education, setEducation] = useState([
    {
      educationLevel: '',
      schoolName: '',
      studyName: '',
      timeOfStudyFromMonth: "Month",
      timeOfStudyFromYear: "Year",
      timeOfStudyToMonth: "Month",
      timeOfStudyToYear: "Year"
    }])
  const handleEducationChange = (event, index) => {
    let { name, value } = event.target;
    let onChangeValue = [...education];
    onChangeValue[index][name] = value;
    setEducation(onChangeValue);
  };
  const handleAddEducationInput = () => {
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


  return (
    <Card>
      <Card.Body className='job_apply_form_body'>
        <Form className='job_form_apply_fields'>
          <SaveAndExit changeTo={2} />
          <div>
            <p className='job_form_upload_desc'>Build your resume (1 of 4)</p>
            <p className='job_form_field'>Do you want to add any education details?</p>
          </div>
          {education?.map((e, index) => (
            <div key={index}>
              {index >= 1 &&
                <p style={{ color: "red", cursor:"pointer" }} onClick={handleDeleteInput}>Remove Education</p>
              }
              <Form.Label className='job_form_field'>Level of education *</Form.Label>
              <Form.Control className='job_form_input' type='text' name='educationLevel' required value={e.educationLevel} onChange={(e) => handleEducationChange(e, index)} />
              <Form.Label className='job_form_field'>Field of study</Form.Label>
              <Form.Control className='job_form_input' type='text' name='studyName' required value={e.studyField} onChange={(e) => handleEducationChange(e, index)} />
              <Form.Label className='job_form_field'>Name of school</Form.Label>
              <Form.Control className='job_form_input' type='text' name='schoolName' required value={e.schoolName} onChange={(e) => handleEducationChange(e, index)} />

              <Form.Text className='job_form_field'>Time period</Form.Text>
              <Form.Group className='job_edu_form_date'>
                <Form.Label>From</Form.Label>
                <div>
                  <Form.Select name='timeOfStudyFromMonth' value={e.timeOfStudyFromMonth} onChange={(e) => handleEducationChange(e, index)}>
                    <option>Month</option>
                    {[...new Array(12).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select name='timeOfStudyFromYear' value={e.timeOfStudyFromYear} onChange={(e) => handleEducationChange(e, index)}>
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
                  <Form.Select name='timeOfStudyToMonth' value={e.timeOfStudyToMonth} onChange={(e) => handleEducationChange(e, index)}>
                    <option>Month</option>
                    {[...new Array(12).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select name='timeOfStudyToYear' value={e.timeOfStudyToYear} onChange={(e) => handleEducationChange(e, index)}>
                    <option>Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
              <br />
              {index === education.length - 1 && (
                <div className='job_form_add' onClick={() => handleAddEducationInput()}>
                  <img src={addMore} alt="" />
                  Add more
                </div>
              )}
            </div>
          ))}
          { error !== '' &&
          <p style={{color:'red'}}>{error}</p>
          }
          <Button onClick={(e) => submitEducation()} className='job_form_submit skill_btn'>Save and continue</Button>
          <p style={{ color: "#2557A7", cursor:"pointer" }} onClick={() =>{setApplyFormCardNumber(5)}}>Skip</p>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default EducationForm
