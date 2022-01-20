import { atom, useAtom } from "jotai"
import { DOMRectProps } from "sukuroru"
import { issuesType, issueType, statuses } from "./components/commons.interfaces"



const issuesData = atom({} as issuesType)
const currentTargetBox = atom<statuses | null>(null)
const issuesBoxRect = atom({
    backlog: {} as DOMRect | undefined,
    todo: {} as DOMRect | undefined,
    done: {} as DOMRect | undefined
})

const updateCurrentTargetBox = atom(
    (get) => get(currentTargetBox),
    (get, set, [mouseX, mouseY]) => {
        const boxesRect = get(issuesBoxRect)
        for (const status of Object.keys(boxesRect)) {
            const rect = boxesRect[status as statuses]
            if (
                rect 
                && mouseX < rect.right 
                && mouseX > rect.left
                && mouseY < rect.bottom
                && mouseY > rect.top
                ) {
                    set(currentTargetBox, status as statuses)
                    return
            }
            else set(currentTargetBox, null)            
        }
    }
)

const showAddForm = atom<statuses | false>(false)

const addIssue = atom(
    null,
    (get, set, { data, status }: {data: Omit<issueType, 'issue_id'>, status: statuses }) => {
        const allData = get(issuesData)
        const id = Math.max(...getAllIDs(allData)) + 1
        set(issuesData, prev => {
            prev[status].push({...data, issue_id: id})
            return {...prev}
        })
    }
)

const moveIssue = atom(
    (get) => get(issuesData),
    (get, set, {issue, from}: {issue: issueType, from: statuses }) => {
        const to = get(currentTargetBox)
        set(issuesData, (data) => {
            if (!to || from === to) return data
            data[from] = data[from]
            .filter(issu => issu.issue_id != issue.issue_id)
            .sort((a, b) => a.issue_id - b.issue_id)
            data[to].push(issue)
            return {...data}
        })
        set(currentTargetBox, null)
    }
)


// helper  function 
const getAllIDs = (data: issuesType) => {
    let ids = []
    for (const key of Object.keys(data)) {
        ids.push(...getIDs(data[key as statuses]))
    }
    return ids
}

const getIDs = (data: issueType[]) => data.reduce((prev, cur) => [...prev, cur.issue_id], [] as number[])



export { 
    issuesData, 
    moveIssue, 
    issuesBoxRect, 
    currentTargetBox, 
    updateCurrentTargetBox,
    addIssue,
    showAddForm
}