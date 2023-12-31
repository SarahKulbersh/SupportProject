import { useNavigate } from "react-router-dom";
import {backButtonIcon, notificationIcon, proflieIcon} from "../../assets";


export const Header = () => {
    const navigate = useNavigate()

    return (
        <div className='job_header'>
            <img src={backButtonIcon} alt="" onClick={() =>{navigate(-1)}}/>
            <div className='header_box'>
                <img src={notificationIcon} alt=""/>
                <div>
                    <img src={proflieIcon} alt=""/>
                    {sessionStorage.getItem("userId")}
                </div>
            </div>
        </div>
    )
}