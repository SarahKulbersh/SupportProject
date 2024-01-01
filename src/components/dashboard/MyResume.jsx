import { backArrowIcon, addMore, deleteIcon, editIcon } from "../../assets";
import { useEffect, useState } from "react";
import { EditResume } from "./editResumeForms/EditResume.jsx";
import { doc } from 'firebase/firestore';
import { getDoc, deleteDoc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { database } from "../../firebaseConfig.js";
import Cookies from "js-cookie";

export const MyResume = () => {

    const [profileDetails, setProfileDetails] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        city: "",
    });
    const [educationDetails, setEducationDetails] = useState();
    const [workHistoryDetails, setWorkHistoryDetails] = useState();
    const [skillsDetails, setSkillsDetails] = useState();

    const [page, setPage] = useState(-1)

    const fetchDetails = async () => {
        try {
            const userId = sessionStorage.getItem("userId")
            const personDocRef = doc(database, 'person', userId);
            const docsSnap = await getDoc(personDocRef);
            const userData = docsSnap?.data();
            setProfileDetails(userData);
        } catch (error) {
            console.log(error)
        }
    }
    const fetchEducation = async () => {
        try {
            const userId = sessionStorage.getItem("userId");
            const personDocRef = doc(database, 'person', userId);

            const educationCollectionRef = collection(personDocRef, 'educations');
            const educationDocsSnap = await getDocs(educationCollectionRef);
            const educationData = [];
            educationDocsSnap.forEach((doc) => {
                educationData.push(doc.data());
            });

            setEducationDetails(educationData);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchWorkHistory = async () => {
        try {
            const userId = sessionStorage.getItem("userId");
            const personDocRef = doc(database, 'person', userId);

            const workHistoryCollectionRef = collection(personDocRef, 'workHistory');
            const workHistoryDocsSnap = await getDocs(workHistoryCollectionRef);
            const workHistoryData = [];
            workHistoryDocsSnap.forEach((doc) => {
                workHistoryData.push(doc.data());
            });
            setWorkHistoryDetails(workHistoryData);
        } catch (error) {
            console.log(error);
        }
    }
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
            setSkillsDetails(skillsData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchDetails();
        fetchEducation()
        fetchWorkHistory()
        fetchSkills()
    }, [])
    useEffect(() => {
        fetchDetails();
        fetchEducation()
        fetchWorkHistory()
        fetchSkills()
    }, [page])

    const removeWorkHistory = async (index) => {
        const userId = sessionStorage.getItem("userId")
        const persons = collection(database, "person");
        const userRef = doc(persons, userId);
        const workHistoryId = `${workHistoryDetails[index].timeOfWorkFromYear}-${workHistoryDetails[index].timeOfWorkToYear}`;
        const docRef = doc(collection(userRef, 'workHistory'), workHistoryId);
        await deleteDoc(docRef);
        fetchWorkHistory()

    }
    const removeEducation = async (index) => {
        const userId = sessionStorage.getItem("userId")
        const persons = collection(database, "person");
        const userRef = doc(persons, userId);
        const educationId = `${educationDetails[index].timeOfStudyFromYear}-${educationDetails[index].timeOfStudyToYear}`;
        const docRef = doc(collection(userRef, 'educations'), educationId);
        await deleteDoc(docRef);
        fetchEducation()
    }
    const removeSkill = async (index) => {
        try {
            const userId = sessionStorage.getItem("userId");
            const personDocRef = doc(database, 'person', userId);

            const skillId = skillsDetails[index].skillName.split(" ")[0];
            const skillsDocRef = doc(collection(personDocRef, 'skills'), skillId);
            await deleteDoc(skillsDocRef);

            setSkillsDetails(prev => {
                const updatedSkills = [...prev];
                updatedSkills.splice(index, 1);
                fetchSkills()
                return updatedSkills;
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickEdit = (number, item) => {
        sessionStorage.setItem('editObject', JSON.stringify(item));
        setPage(number);
    }
    return (
        <div className='my_resume'>
            {page < 0 ? (<div className='my_resume_box'>
                <div className='resume_prof_details'>
                    <div className='resume_prof_edit_head'>
                        <div className="my_resume_name">{profileDetails.firstName + " " + profileDetails.lastName}</div>
                        <div className='my_resume_edit_imgs'>
                            <img src={editIcon} alt="" onClick={() => handleClickEdit(1, profileDetails)} />
                        </div>
                    </div>
                    <div className="resume_desc_details">{profileDetails.phoneNumber}</div>
                    <div className="resume_desc_details">{profileDetails.email}</div>
                    <div className="resume_desc_details">{profileDetails.city}</div>
                </div>


                <div className='resume_prof_details'>
                    <div className="my_resume_name">Work experience</div>
                    {workHistoryDetails?.map((item, index) => (
                        <div key={index} style={{ border: 'lightgray solid 1px ', borderRadius: '4px', padding: '10px', width: '300px' }}>
                            <div className='resume_prof_edit_head'>

                                <div className="resume_desc_details" style={{ color: 'black' }}>{item.title}</div>

                                <div className='my_resume_edit_imgs'>
                                    <img src={editIcon} alt="" onClick={() => handleClickEdit(2, item)} />
                                    <img src={deleteIcon} onClick={() => { removeWorkHistory(index) }} alt="" />
                                </div>
                            </div>
                            <div className="resume_desc_details">{item.company}</div>
                            <div className="resume_desc_details">{item.schoolName}</div>
                            <div className="resume_desc_details">{item.timeOfWorkFromMonth}/{item.timeOfWorkFromYear} - {item.timeOfWorkToMonth}/{item.timeOfWorkToYear}</div>

                        </div>
                    ))}
                </div>


                <div className='resume_prof_details'>
                    <div className="my_resume_name">Education</div>

                    {educationDetails?.map((item, index) => (
                        <div key={index} style={{ border: 'lightgray solid 1px ', borderRadius: '4px', padding: '10px', width: '300px' }}>
                            <div className='resume_prof_edit_head'>
                                <div className="resume_desc_details" style={{ color: 'black' }}>{item.educationLevel}</div>
                                <div className='my_resume_edit_imgs'>
                                    <img src={editIcon} alt="" onClick={() => handleClickEdit(3, item)} />
                                    <img src={deleteIcon} onClick={() => { removeEducation(index) }} alt="" />
                                </div>
                            </div>
                            <div className="resume_desc_details">{item.studyName}</div>
                            <div className="resume_desc_details">{item.schoolName}</div>
                            <div className="resume_desc_details">{item.timeOfStudyFromMonth}/{item.timeOfStudyFromYear} - {item.timeOfStudyToMonth}/{item.timeOfStudyToYear}</div>

                        </div>
                    ))}
                </div>

                <div className='resume_prof_details'>
                    <div className="my_resume_name">Skills</div>
                    {skillsDetails !== undefined && !!skillsDetails?.length && skillsDetails.map((e, i) => (
                        <div key={i} style={{ border: 'lightgray solid 1px ', borderRadius: '4px', padding: '10px', width: '300px' }}>
                            <div className='resume_prof_edit_head'>
                                <div className="resume_desc_details" style={{ color: 'black' }}>{e.skillName}</div>

                                <div className='my_resume_edit_imgs'>
                                    <img src={editIcon} alt="" onClick={() => handleClickEdit(4, skillsDetails)} />
                                    <img src={deleteIcon} onClick={() => removeSkill(i)} alt="" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>) : (<EditResume setProfileDetails={setProfileDetails} profileDetails={profileDetails} setPage={setPage} page={page} />)}
        </div>
    )
}