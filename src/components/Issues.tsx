import '../styles/issues.css'
import { useAtom } from "jotai";
import { FormEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { issueType, statuses } from "./commons.interfaces";
import { useDrag } from '@use-gesture/react'
import { animated, useSpring } from 'react-spring'
import { useBoundingClientObserver } from "../observers/useResizeObserver";
import { endDateIsValid } from "./validators";
import { 
    addIssue, 
    currentTargetBox, 
    issuesBoxRect, 
    issuesData, 
    moveIssue, 
    showAddForm, 
    updateCurrentTargetBox 
} from "../storage";
import data from '../ISSUES.json'

export default function Issues() {
    const [{backlog, todo, done}, setIssues] = useAtom(issuesData)
    const [showFormBox] = useAtom(showAddForm)
    useEffect(() => {
        setIssues(data)
    }, [])


    return (
        <section id='issues'>
            <IssuesBox issues={backlog} status="backlog" />
            <IssuesBox issues={todo} status="todo" />
            <IssuesBox issues={done} status="done" />
            {showFormBox && <AddIssueForm status={showFormBox} />}   
        </section>
    )

}


const IssuesBox = ({ issues, status }: { issues: issueType[] | undefined, status: statuses }) => {
    const ref = useRef<HTMLDivElement>(null!)
    const [, setboxRect] = useAtom(issuesBoxRect)
    const [curTarget] = useAtom(currentTargetBox)
    const rect = useBoundingClientObserver(ref)
    const classname = useMemo(() => status === curTarget ? 'targeted': '', [curTarget])
    const [,setShowFormBox] = useAtom(showAddForm)
    useEffect(() => {
        setboxRect(prev => {
            prev[status] = rect.boundingClient
            return prev
        })
    }, [rect])

    return (
        <section id={status} ref={ref} className={classname}>
            <div className='issues-head'>
                <h3>{mapStatusString[status]}</h3>
                <button onClick={() => setShowFormBox(status)}>+ add task</button>
            </div>   
            {
            issues 
            ? issues.map(issue => <IssueCard key={issue.issue_id} issue={issue} status={status} /> ) 
            : <h3>no issues</h3>
            }          
        </section>
    )
}

const IssueCard = ({ issue, status }: { issue: issueType, status: statuses }) => {
    const [,move] = useAtom(moveIssue)
    const [,updateTarget] = useAtom(updateCurrentTargetBox)
    const [{x, y}, spring] = useSpring(() => ({ x: 0, y: 0 }))
    const {days, isLate} = getRemainingDay(issue.end_date)
    const [classname, setClassname] = useState('issue')

    const bind = useDrag(({down, movement: [mx, my],...state}) => {
        spring.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down })
        updateTarget(state.xy)
        if (!down) {
            setClassname('issue')
            move({
                issue,
                from: status
            })
        }
        else setClassname('issue hovered')
    })

    return (
        <animated.div className={classname} style={{ x, y }} {...bind()}>
            <h4 title={issue.title}>{issue.title}</h4>
            <p className="assignee">{issue.assignee}</p>
            <div className="tags"><p>{issue.tags}</p></div>
            <small style={{ color: isLate ? 'red' : 'inherit' }}>{days}</small>
        </animated.div>
    )
}

const AddIssueForm = ({ status }: { status: statuses }) => {
    const [, addData] = useAtom(addIssue)
    const [, setShowFormBox] = useAtom(showAddForm)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [warning, setWarning] = useState('')

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        if (endDateIsValid(startDate, endDate)) {
            addData({
                status,
                data: {
                    title: form._title.value,
                    tags: form.tags.value,
                    assignee: form.assignee.value,
                    start_date: form.start_date.value,
                    end_date: form.end_date.value
                }
            })
            setShowFormBox(false)
            setWarning('')
        }
        else {
            setWarning('Please input correct date values')
        }
    }

    const closeForm = (e:MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id) setShowFormBox(false)
    }

    return (
        <div id='add-issue-form' onClick={closeForm}>
            <form onSubmit={handleSubmit}>
                <h3>New Task</h3>
                <input name='_title' placeholder="Title" required/>
                <input name='tags' placeholder="Tags" required />
                <input name='assignee' placeholder="Assignee"  required />
                <input name='start_date' placeholder="Start date" type="date" 
                value={startDate} onChange={e => setStartDate(e.currentTarget.value)} required />
                <input name='end_date' placeholder="End date" type="date" 
                value={endDate} onChange={e => setEndDate(e.currentTarget.value)} required/>
                {warning && <p>{warning}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}


// helper
const getRemainingDay = (endDate:string) => {
    const date = new Date(endDate).valueOf()
    const curDate = Date.now()
    const different = Math.ceil((date - curDate) / (1000 * 60 * 60 * 24))
    if (different === 0) return { isLate: false, days: 'today'}
    return (
        different > 0
        ? { isLate: true, days: `${different} days overdue`}
        : { isLate: false, days: `${Math.abs(different)} days`}
    )
}

const mapStatusString = {
    todo: 'To Do',
    backlog: 'Backlog',
    done: 'Done'
}