import { useEffect, useState } from "react";
import { nextIcon } from "../../assets";
import { collection } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { getDocs, getDoc } from "firebase/firestore";


export const EmployerApplications = () => {

    const [jobs, setJobs] = useState([])
    const [jobsLength, setJobLength] = useState(0);
    const [page, setPage] = useState(1);
    const jobsPerPage = 6

    const fetchApplications = async () => {
        const userId = sessionStorage.getItem("userId");
        const arrayDocs = [];

        const querySnapshot = await getDocs(collection(database, "jobApplications"));
        querySnapshot.forEach((doc) => {
            if (doc.id.includes(`${userId}_#_`)) {
                // Extract the timestamp from the createdAt object
                const createdAt = doc.data().createdAt.toDate(); // Convert to JavaScript Date object

                // Create a new object with the extracted createdAt timestamp
                arrayDocs.push({
                    firstName: doc.data().firstName,
                    lastName: doc.data().lastName,
                    docId: doc.id,
                    createdAt: createdAt,  // Use the extracted timestamp
                    jobTitle: doc.data().jobTitle
                });
            }
        });

        return arrayDocs
    };

    useEffect(() => {
        fetchApplications(page).then((r) => {
            setJobs(r)
            setJobLength(r.length)

        })
    }, [page])

    return (<div className='job_dashboard'>
        <h2 className="job_dashboard_title">My Applications ({jobsLength})</h2>
        <div className='job_table'>
            <div className='job_table_thead'>
                <div className='job_table_th job_table_td_name'>Applicants</div>
                <div className='job_table_th'>Applied Date</div>
                <div className='job_table_th'>Actions</div>
            </div>
            {jobs.map(({ createdAt = "", firstName = "", lastName = "", jobTitle = "" }, i) => (<div key={i} className='job_table_tbody'>
                <div className='job_table_td job_table_td_name app_table_td_name'>{firstName} {lastName}
                    <div>{jobTitle}</div>
                </div>
                <div className='job_table_td'>{createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}</div>
                <div className='job_table_td job_table_td_action'>
                    View application
                </div>
            </div>))}
            <div className='pagination_boxes'>
                {(new Array(Math.floor(jobsLength / jobsPerPage)).fill((0))
                    .map((e, i) => (
                        <div key={i} style={i + 1 === page ? { color: "blue", background: "#DADDE0" } : {}}
                            onClick={() => { setPage(i + 1) }}
                            className={'pagination_box'}>{i + 1}
                        </div>)))}
                <img
                    onClick={() => (jobsLength / jobsPerPage) > page ? setPage(c => c + 1) : setPage(1)}
                    src={nextIcon} alt="" className='' />
            </div>
        </div>
    </div>

    )
}