import { useState } from "react";
import { SearchInput } from "./commons";
import '../styles/dashboard.css'

import Toby from '../assets/toby.jpg'
import Menu from '../assets/menu.svg'


export default function Dashboard() {
    const [isClosed, setIsClosed] = useState(true)



    return (
        <>
            <button className="dashboard-open" onClick={() => setIsClosed(false)}>
                <img src={Menu} />
            </button>
            <div id='dashboard' className={isClosed ? 'dashboard-hidden' : ''}>
                <button className="dashboard-close" onClick={() => setIsClosed(true)}>X</button>
                <SearchInput placeholder="Search" />

                <div className="profile">
                    <img className='profile-img' src={Toby}/>
                    <h5>Toby Maguire</h5>
                    <p className="role">Spider Man</p>
                    <div className="task1">
                        <p>2243</p>
                        <p>Completed Task</p>
                    </div>
                    <div className="task2">
                        <p>23</p>
                        <p>Open Task</p>
                    </div>
                </div>

                <div className='menu'>
                    <h5>MENU</h5>
                    <a href='#'>Home</a>
                    <a href='#'>My Task</a>
                    <a href='#'>Notification</a>
                </div>

                <div className="teams">
                    <h5>TEAMS</h5>
                    <a href='#'>Researcher</a>
                    <a href='#'>FE/BE Team</a>
                    <a href='#'>PM Team</a>

                </div>

                <a href="#"><small>+ Add Team</small></a>


            </div>
        </>
    )
}
