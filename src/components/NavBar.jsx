import React from 'react'
import { flagIcon, logoIcon } from "../assets/index";
import { Link } from 'react-router-dom';
import "../styles/navbar.css";


export default function NavBar() {
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
                <div className='flag'>
                    <img src={flagIcon} />
                    <select>
                        <option>English</option>
                    </select>
                </div>
                <Link to="/post">
                    Submit resume
                </Link>
                <Link to='/apply'>
                    <button className='signin submit_job_btn'>Submit job</button>
                </Link>
                <button className='signin'>Sign In</button>
            </div>
        </div>
    )
}
