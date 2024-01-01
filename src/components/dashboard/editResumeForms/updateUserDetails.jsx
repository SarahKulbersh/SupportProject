import React, { useState } from 'react'
import { Card, Form } from 'react-bootstrap';
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { database } from "../../../firebaseConfig";

function UpdateUserDetails({ setPage }) {

    const storedItem = sessionStorage.getItem('editObject');
    const editedItem = JSON.parse(storedItem);
    const userId = sessionStorage.getItem("userId")

    async function submitUserDetails() {

        const userRef = doc(database, "person", userId)
        const additionalData = {
            city: city,
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
        setPage(-1)
    }

    const [errors, setErrors] = useState({});
    const errorValues = Object.values(errors);

    const validation = {

        firstName: () => {
            if (firstName.length === 0) {
                return "First name is required.";
            }

            const nameRegex = /^[\u0590-\u05FFa-zA-Z]+$/u;
            return nameRegex.test(firstName.trim());
        },

        lastName: () => {
            if (lastName === '') {
                return "Last name is required.";
            }

            const nameRegex = /^[\u0590-\u05FFa-zA-Z]+$/u;
            return nameRegex.test(lastName.trim());
        },
        city: () => {
            if (city === '')
                return true;

            const nameRegex = /^[a-zA-Z .'-]+$/;
            return nameRegex.test(city.trim());
        },
        phone: () => {
            if (phone === '') {
                return "Phone is required.";
            }
            const phoneNumberRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
            return phoneNumberRegex.test(phone.trim());
        }
    };
    const handleBlur = (field) => {

        const error = validation[field](field === 'phone' ? phone : field.trim()); // Trim the value for firstName and lastName
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error || 'Invalid input',
        }));
    };

    const [firstName, setFirstName] = useState(editedItem.firstName)
    const [lastName, setLastName] = useState(editedItem.lastName)
    const [email, setEmail] = useState(editedItem.email)
    const [city, setCity] = useState(editedItem.city)
    const [phone, setPhone] = useState(editedItem.phoneNumber)
    const [phoneAreaCode, setPhoneAreaCode] = useState(editedItem.phoneAreaCode)

    return (
        <Card>
            <Card.Body className='job_apply_form_body'>

                <Form className='job_form_apply_fields'>
                    <div className='job_apply_field'>
                        <Form.Label className='job_form_field'>First name</Form.Label>
                        <Form.Control className='job_form_input' type='text' onChange={(e) => setFirstName(e.target.value)} onBlur={() => handleBlur('firstName')} required value={firstName} />
                        {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                    </div>
                    <div className='job_apply_field'>
                        <Form.Label className='job_form_field'>Last name</Form.Label>
                        <Form.Control className='job_form_input' type='text' onChange={(e) => setLastName(e.target.value)} onBlur={() => handleBlur('lastName')} required value={lastName} />
                        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                    </div>
                    <div className='job_apply_field'>
                        <label htmlFor="email" className='job_form_field'>Email</label>
                        <input type="email" className='job_form_input' id="email" onChange={(e) => setEmail(e.target.value)} defaultValue={userId} readOnly />
                    </div>
                    <div className='job_apply_field'>
                        <Form.Label>City (optional)</Form.Label>
                        <Form.Control type='text' onChange={(e) => setCity(e.target.value)} onBlur={() => handleBlur('city')} value={city} />
                        {errors.city && <p className="error-message">{errors.city}</p>}
                    </div>
                    <div className='job_apply_field'>
                        <Form.Label htmlFor="phone" className='job_form_field' onChange={(e) => setPhone(e.target.value)} required value={phone} onBlur={() => handleBlur('phone')}>Phone number</Form.Label>
                        <div className='job_form_phone_input'>
                            <Form.Select size="lg" className='job_form_phone_code' onChange={(e) => setPhoneAreaCode(e.target.value)} required value={phoneAreaCode}>
                                <option>+1</option>
                            </Form.Select>
                            <Form.Control className='job_form_input' type='text' id="phone" name="phone" onChange={(e) => setPhone(e.target.value)} value={phone} onBlur={() => handleBlur('phone')} />
                        </div>
                        {errors.phone && <p className="error-message">{errors.phone}</p>}
                    </div>
                    <button className='job_form_submit' type='button' onClick={() => {

                        // Validate all fields before submission
                        for (const field in validation) {
                            handleBlur(field);
                        }
                        if (firstName === '' || lastName === '' || phone === '') {
                            return; // Do not proceed with signUp function if any required field is empty
                        }

                        if (errorValues.every(value => value === true)) {
                            submitUserDetails();
                        }
                    }}>Continue</button>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default UpdateUserDetails
