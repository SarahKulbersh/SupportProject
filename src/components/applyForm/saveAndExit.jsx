import React, {useContext} from 'react'
import { applyFormCardNumberContext } from '../../Context';
import { useNavigate } from 'react-router-dom';
import { backArrowIcon } from "../../assets/index"

const SaveAndExit = ({ changeTo }) => {
    const navigate = useNavigate()
    const { applyFormCardNumber, setApplyFormCardNumber } = useContext(applyFormCardNumberContext)

    return (<div className='job_save_exit'>
      <div className='job_save_exit_head'>
        {applyFormCardNumber !== 1 && <img onClick={() => { setApplyFormCardNumber(changeTo) }} className='' src={backArrowIcon} alt="" />}
        <div className='job_save_exit_text' onClick={(e) => {
          setApplyFormCardNumber(1);
          navigate(-1);
        }}>Exit</div>
      </div>
      <div className='job_save_exit_progress'>
        <div style={{ width: `${((applyFormCardNumber / 5) * 100)}%` }} className='job_save_exit_complete'></div>
        <div style={{ width: `${(((5 - applyFormCardNumber) / 5) * 100)}%` }} className='job_save_exit_left'></div>
      </div>
    </div>)
  }

export default SaveAndExit
