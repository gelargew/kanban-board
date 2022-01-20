import { atom, useAtom } from "jotai"
import { DOMRectProps } from "sukuroru"
import { tasksType, taskType, statuses } from "./components/commons.interfaces"



const tasksData = atom({} as tasksType)
const currentTargetBox = atom<statuses | null>(null)
const tasksBoxRect = atom({
    backlog: {} as DOMRect | undefined,
    todo: {} as DOMRect | undefined,
    done: {} as DOMRect | undefined
})

const updateCurrentTargetBox = atom(
    (get) => get(currentTargetBox),
    (get, set, [mouseX, mouseY]) => {
        const boxesRect = get(tasksBoxRect)
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

const addtask = atom(
    null,
    (get, set, { data, status }: {data: Omit<taskType, 'task_id'>, status: statuses }) => {
        const allData = get(tasksData)
        const id = Math.max(...getAllIDs(allData)) + 1
        set(tasksData, prev => {
            prev[status].push({...data, task_id: id})
            return {...prev}
        })
    }
)

const movetask = atom(
    (get) => get(tasksData),
    (get, set, {task, from}: {task: taskType, from: statuses }) => {
        const to = get(currentTargetBox)
        set(tasksData, (data) => {
            if (!to || from === to) return data
            data[from] = data[from]
            .filter(issu => issu.task_id != task.task_id)
            .sort((a, b) => a.task_id - b.task_id)
            data[to].push(task)
            return {...data}
        })
        set(currentTargetBox, null)
    }
)


// helper  function 
const getAllIDs = (data: tasksType) => {
    let ids = []
    for (const key of Object.keys(data)) {
        ids.push(...getIDs(data[key as statuses]))
    }
    return ids
}

const getIDs = (data: taskType[]) => data.reduce((prev, cur) => [...prev, cur.task_id], [] as number[])



export { 
    tasksData, 
    movetask, 
    tasksBoxRect, 
    currentTargetBox, 
    updateCurrentTargetBox,
    addtask,
    showAddForm
}