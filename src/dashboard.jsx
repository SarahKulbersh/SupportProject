import React, { useEffect, useState } from 'react'
import "./styles/dashboard.css";
// import "./styles/dashboard2.css";
import { SideBar } from "./components/dashboard/EmployerSideBar";
import { useParams } from "react-router-dom";
import { Header } from "./components/dashboard/Header";
import { Inbox } from "./components/dashboard/Inbox";
import { Jobs } from "./components/dashboard/Jobs";
import { EmployeeApplication } from './components/dashboard/EmployeeApplications';
import { EmployerApplications } from './components/dashboard/EmployerApplications';
import { UserSideBar } from './components/dashboard/EmployeeSidebar'
import { MyResume } from './components/dashboard/MyResume'

export default function Dashboard() {

    const [isEmployee, setIsEmployee] = useState(sessionStorage.getItem("isEmployee"));

    const { tab = "jobs" } = useParams();

    useEffect(() => {
        const check = sessionStorage.getItem("isEmployee")
        if (check === "true")
            setIsEmployee(true);
        else
            setIsEmployee(false);
    }, [])

    return (<div className='dashboard'>
        {isEmployee ? <UserSideBar /> : <SideBar />}
        <Header />
        <div className="dashboard_content">
            {(() => {
                switch (tab) {
                    case "jobs":
                        return isEmployee ? <MyResume /> : <Jobs />
                    case "applications":
                        return isEmployee ? <EmployeeApplication /> : <EmployerApplications />
                    case "inbox":
                        return isEmployee ? <Inbox /> : <Inbox />
                    default:
                        return <Jobs />
                }
            })()}
        </div>
    </div>)
}