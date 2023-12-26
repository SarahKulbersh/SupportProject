import React, { useState } from 'react'
import { logoIcon } from "../assets/index";
import { Link } from 'react-router-dom';
import "../styles/navbar.css";
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {

    const location = useLocation();
    const navigate = useNavigate()
    const [userId, setUserId] = useState(() => {
        const storedUserId = sessionStorage.getItem('userId');
        return storedUserId || null;
    });
    const handleSignOut = (e) => {
        sessionStorage.removeItem('userId');
        setUserId(null);
    };
    const handleSignIn = (e) => {
        sessionStorage.setItem("locationBeforeSignIn", location.pathname )
        navigate('/signin')
    };

    return (
        <div className='navbar'>
            <div>
                <Link to="/">
                    <img src={logoIcon} alt="" />
                </Link>
                <Link to="/" className='nav_about'>
                    About Us
                </Link>
                <Link to="/">
                    Contact Us
                </Link>


            </div>
            <div className='job_nav_left'>
                {/* <div className='flag'>
                    <img src={flagIcon} />
                    <select>
                        <option>English</option>
                    </select>
                </div> */}
                <Link to='/post'>
                    <button className='signin submit_job_btn'>Submit job</button>
                </Link>
                {!userId &&
                    <button className='signin' onClick={handleSignIn}>
                        Sign In
                    </button>
                }
                {userId &&
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            {/* <img src="https://icons8.com/icon/85356/male-user"/> */}
                            Hello {userId}
                        </button>
                        <ul class="dropdown-menu">
                            <li><Link to="/dashboard/jobs" class="dropdown-item">My Dashboard</Link>
                            </li>
                            {/* <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li> */}
                            <li><hr class="dropdown-divider" /></li>
                            <li><a class="dropdown-item" href="#" style={{ color: "red" }} onClick={handleSignOut}>Log Out</a></li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}
