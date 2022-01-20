import '../styles/tasks.css'
import { useAtom } from "jotai";
import { FormEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { taskType, statuses } from "./commons.interfaces";
import { useDrag } from '@use-gesture/react'
import { animated, useSpring } from 'react-spring'
import { useBoundingClientObserver } from "../observers/useResizeObserver";
import { endDateIsValid } from "./validators";
import { 
    addtask, 
    currentTargetBox, 
    tasksBoxRect, 
    tasksData, 
    movetask, 
    showAddForm, 
    updateCurrentTargetBox 
} from "../storage";
import data from '../ISSUES.json'

export default function Issues() {
    const [{backlog, todo, done}, settasks] = useAtom(tasksData)
    const [showFormBox] = useAtom(showAddForm)
    useEffect(() => {
        settasks(data)
    }, [])


    return (
        <section id='tasks'>
            <TasksBox tasks={backlog} status="backlog" />
            <TasksBox tasks={todo} status="todo" />
            <TasksBox tasks={done} status="done" />
            {showFormBox && <AddtaskForm status={showFormBox} />}   
        </section>
    )

}


const TasksBox = ({ tasks, status }: { tasks: taskType[] | undefined, status: statuses }) => {
    const ref = useRef<HTMLDivElement>(null!)
    const [, setboxRect] = useAtom(tasksBoxRect)
    const [curTarget] = useAtom(currentTargetBox)
    const rect = useBoundingClientObserver(ref)
    const classname = useMemo(() => status === curTarget ? 'targeted': '', [curTarget])
    const [,setShowFormBox] = useAtom(showAddForm)

    useEffect(() => {
        // observe each tasks box dimension each time it change sizes
        setboxRect(prev => {
            prev[status] = rect.boundingClient
            return prev
        })
    }, [rect])

    return (
        <section id={status} ref={ref} className={classname}>
            <div className='tasks-head'>
                <h3>{mapStatusString[status]}</h3>
                <button onClick={() => setShowFormBox(status)}>+ add task</button>
            </div>   
            {
            tasks 
            ? tasks.map(task => <TaskCard key={task.task_id} task={task} status={status} /> ) 
            : <h3>no tasks</h3>
            }          
        </section>
    )
}

const TaskCard = ({ task, status }: { task: taskType, status: statuses }) => {
    const [,move] = useAtom(movetask)
    const [,updateTarget] = useAtom(updateCurrentTargetBox)
    const [{x, y}, spring] = useSpring(() => ({ x: 0, y: 0 }))
    const {days, isLate} = getRemainingDay(task.end_date)
    const [classname, setClassname] = useState('task')

    const bind = useDrag(({down, movement: [mx, my],...state}) => {
        // update current tasks box target according to the mouse position, move the current dragged task 
        // into the target list when mouseUp  trigger
        spring.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down })
        updateTarget(state.xy)
        if (!down) {
            setClassname('task')
            move({
                task,
                from: status
            })
        }
        else setClassname('task hovered')
    })

    return (
        <animated.div className={classname} style={{ x, y }} {...bind()}>
            <h4 title={task.title}>{task.title}</h4>
            <p className="assignee">{task.assignee}</p>
            <div className="tags"><p>{task.tags}</p></div>
            <small style={{ color: isLate ? 'red' : 'inherit' }}>{days}</small>
        </animated.div>
    )
}

const AddtaskForm = ({ status }: { status: statuses }) => {
    const [, addData] = useAtom(addtask)
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
        <div id='add-task-form' onClick={closeForm}>
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
    const different = Math.ceil((curDate - date) / (1000 * 60 * 60 * 24))
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