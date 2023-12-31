import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import "../styles/navbar.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { logoIcon, navClose, navIcon } from "../assets/index";

export default function NavBar() {
    const [isNav, setNav] = useState(false);

    const location = useLocation();
    const navigate = useNavigate()
    const [userId, setUserId] = useState(() => {
        const storedUserId = sessionStorage.getItem('userId');
        return storedUserId || null;
    });
    const handleSignOut = (e) => {
        sessionStorage.removeItem('userId');
        setUserId(null);
        sessionStorage.removeItem("isEmployee")
    };
    const handleSignIn = (e) => {
        sessionStorage.setItem("locationBeforeSignIn", location.pathname)
        navigate('/signin')
    };

    return (
        <div className='navigation_bar' style={{
            height: (isNav && (window.innerWidth < 758)) ? "100%" : "80px",
            backgroundColor: !isNav ? "white" : "rgba(0, 0, 0, 0.452)"
        }}>
            <div className='nav_bar'>
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
                    {sessionStorage.getItem("isEmployee") !== "true" &&
                        <button className='signin submit_job_btn'>Submit job</button>
                    }
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
                            <li><a class="dropdown-item" style={{ color: "red" }} onClick={handleSignOut}>Log Out</a></li>
                        </ul>
                    </div>
                }
            </div>

            <div className='mob_nav'>
                <Link to="/" className='mob_nav_logo'>
                    <img src={logoIcon} alt="" />
                </Link>
                <img src={!isNav ? navIcon : navClose} alt="" className='nav_icon' onClick={() => setNav(c => !c)} />
                {isNav && <> <div className='mob_nav_left'>
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
                    }        </div>
                    <div className='mob_nav_bar'>
                        <Link to="/" className='nav_about'>
                            About Us
                        </Link>
                        <Link to="/">
                            Contact Us
                        </Link>
                    </div></>}
            </div>

        </div>
    )
}