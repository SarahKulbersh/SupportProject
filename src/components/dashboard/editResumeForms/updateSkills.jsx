import React, { useState } from 'react'
import { addMore, deleteIcon } from "../../../assets/index"
import { Card, Form } from 'react-bootstrap';
import { collection, setDoc, doc, getDocs, serverTimestamp, deleteDoc } from "firebase/firestore";
import { database } from "../../../firebaseConfig";

function UpdateSkills({ setPage }) {
  const storedItem = sessionStorage.getItem('editObject');
  const editedItem = JSON.parse(storedItem);

  const fetchSkills = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      const personDocRef = doc(database, 'person', userId);

      const skillsCollectionRef = collection(personDocRef, 'skills');
      const skillsDocsSnap = await getDocs(skillsCollectionRef);
      const skillsData = [];
      skillsDocsSnap.forEach((doc) => {
        skillsData.push(doc.data());
      });
      setSkills(skillsData);
    } catch (error) {
      console.log(error);
    }
  }

  const [skills, setSkills] = useState(editedItem)

  const [inputValue, setInputValue] = useState('');


  const removeSkill = async (index) => {
    try {
      const userId = sessionStorage.getItem("userId");
      const personDocRef = doc(database, 'person', userId);

      const skillId = skills[index].skillName.split(" ")[0];
      const skillsDocRef = doc(collection(personDocRef, 'skills'), skillId);
      await deleteDoc(skillsDocRef);

    } catch (error) {
      console.log(error);
    }
    fetchSkills()
  };

  const addSkill = async (s) => {

    if (inputValue !== '') {
      const userId = sessionStorage.getItem("userId")
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
      fetchSkills()
      setInputValue('')
    }
  };

  return (
    <Card>
      <Card.Body className='job_apply_form_body'>

        <Form className='job_form_apply_fields' >
          <Form.Text>we recommend adding at least 6 skills</Form.Text>
          <div className='job_form_field_box'>
            <input type="text" class="form-control" placeholder='Add a skill' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <img src={addMore} alt="" className='add_skill_img' onClick={() => { addSkill(inputValue) }} />
          </div>
          {skills?.map((skill, index) => (
            <div className='job_form_field_dlt_box'>
              <input className='job_form_input' type="text" value={skill.skillName} />
              <img src={deleteIcon} alt="" onClick={() => { removeSkill(index) }} />
            </div>
          ))}
        </Form>
      </Card.Body>
    </Card>
  )
}

export default UpdateSkills
