import { useAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import data from '../ISSUES.json'
import { currentTargetBox, issuesBoxRect, issuesData, moveIssue, updateCurrentTargetBox } from "../storage";
import { issueType, statuses } from "./commons.interfaces";
import { useDrag } from '@use-gesture/react'
import { animated, useSpring } from 'react-spring'
import { useBoundingClientObserver, useResizeObserver } from "../observers/useResizeObserver";

export default function Issues() {
    const [{backlog, todo, done}, setIssues] = useAtom(issuesData)
    useEffect(() => {
        setIssues(data)
    }, [])


    return (
        <section id='issues'>
            <Box issues={backlog} status="backlog" />
            <Box issues={todo} status="todo" />
            <Box issues={done} status="done" />
        </section>
    )

}


const Box = ({ issues, status }: { issues: issueType[], status: statuses }) => {
    const ref = useRef<HTMLDivElement>(null!)
    const [, setboxRect] = useAtom(issuesBoxRect)
    const [curTarget, setTarget] = useAtom(currentTargetBox)
    const rect = useBoundingClientObserver(ref)
    const classname = useMemo(() => status === curTarget ? 'targeted': '', [curTarget])
    useEffect(() => {
        setboxRect(prev => {
            prev[status] = rect.boundingClient
            return prev
        })
    }, [rect])

    useEffect(() => {
        console.log(curTarget)
    }, [curTarget])


    return (
        <section id={status} ref={ref} onPointerOver={() => setTarget(status)} className={classname}>
            {
            issues 
            ? issues.map(issue => <Issue key={issue.issue_id} issue={issue} /> ) 
            : <h3>no issues</h3>
            }          
        </section>
    )
}

const Issue = ({ issue }: { issue: issueType }) => {
    const [issues] = useAtom(issuesData)
    const [,move] = useAtom(moveIssue)
    const [,updateTarget] = useAtom(updateCurrentTargetBox)
    const [{x, y}, spring] = useSpring(() => ({ x: 0, y: 0}))
    const bind = useDrag(({down, movement: [mx, my],...state}) => {
        spring.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down})
        updateTarget(state.xy)
        
    })


    return (
        <animated.div className="issue" style={{ x, y }} {...bind()}>
            id: {issue.issue_id}
            title: {issue.title}
            <button>move</button>
        </animated.div>
    )
}


