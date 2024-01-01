import { backArrowIcon } from "../../../assets";
import UpdateEducation from "./updateEducation";
import UpdateWorkHistory from "./updateWorkHistory";
import UpdateUserDetails from "./updateUserDetails";
import UpdateSkills from "./updateSkills";

let profileDetailsBackup = {};

export const EditResume = ({ page = 1, setPage, setProfileDetails, profileDetails }) => {

    return (
        <>
            <img src={backArrowIcon} alt="" width="30px" className="" onClick={() => { setProfileDetails(profileDetailsBackup); setPage(-1) }} />
            {page === 1 && <UpdateUserDetails setPage={setPage} />}
            {page === 2 && <UpdateWorkHistory setPage={setPage} />}
            {page === 3 && <UpdateEducation setPage={setPage} />}
            {page === 4 && <UpdateSkills setPage={setPage} />}
        </>
    )
}