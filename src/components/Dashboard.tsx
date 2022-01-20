import { useState } from "react";
import { SearchInput } from "./commons";
import '../styles/dashboard.css'

import Toby from '../assets/toby.jpg'
import Aoba from '../assets/ichi.jpg'
import Lex from '../assets/lex.jpg'
import Musk from '../assets/musk.jpg'
import Menu from '../assets/menu.svg'

const TEAMS = {
    researcher: [Toby, Aoba, Musk],
    febe: [Lex, Toby],
    pm: [Toby, Aoba]
}


export default function Dashboard() {
    const [isClosed, setIsClosed] = useState(true)



    return (
        <>
            <button className="dashboard-open" onClick={() => setIsClosed(false)}>
                <img alt='menu' src={Menu} />
            </button>
            <div id='dashboard' className={isClosed ? 'dashboard-hidden' : ''}>
                <button className="dashboard-close" onClick={() => setIsClosed(true)}>X</button>
                <SearchInput placeholder="Search" />

                <div className="profile">
                    <img alt='profile' className='profile-img' src={Toby}/>
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
                    <a href='#'>
                        Researcher
                        <span className="members-icon">
                            {TEAMS.researcher.map(imgURL => 
                            <img src={imgURL} key={imgURL} className="profile-img" alt='profile' />)}
                        </span>
                    </a>
                    <a href='#'>
                        FE/BE Team
                        <span className="members-icon">
                            {TEAMS.febe.map(imgURL => 
                            <img src={imgURL} key={imgURL} className="profile-img" alt='profile' />)}
                        </span>
                    </a>
                    <a href='#'>
                        PM Team
                        <span className="members-icon">
                            {TEAMS.pm.map(imgURL => 
                            <img src={imgURL} key={imgURL} className="profile-img" alt='profile' />)}  
                        </span>
                    </a>

                </div>

                <a href="#"><small>+ Add Team</small></a>


            </div>
        </>
    )
}
