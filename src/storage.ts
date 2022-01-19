import { atom, useAtom } from "jotai"
import { DOMRectProps } from "sukuroru"
import { issuesType, issueType, statuses } from "./components/commons.interfaces"

interface draggedIssueType {
    from: statuses,
    to: statuses,
    issue: issueType
}



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


const moveIssue = atom(
    (get) => get(issuesData),
    (get, set, {issue, from ,to}: {issue: issueType, from: statuses, to: statuses}) => {
        set(issuesData, (data) => {
            if (from === to) return data
            data[from] = data[from]
            .filter(issu => issu.issue_id != issue.issue_id)
            .sort((a, b) => a.issue_id - b.issue_id)
            data[to].push(issue)
            return {...data}
        })
    }
)

export { issuesData, moveIssue, issuesBoxRect, currentTargetBox, updateCurrentTargetBox }