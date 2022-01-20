interface taskType {
    task_id: number,
    title: string,
    assignee: string,
    start_date: string,
    end_date: string,
    tags: string
}

interface tasksType {
    backlog: taskType[],
    todo: taskType[],
    done: taskType[]
}

type statuses = 'backlog' | 'todo' | 'done'

export type { taskType, tasksType, statuses }