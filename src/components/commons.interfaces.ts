interface issueType {
    issue_id: number,
    title: string,
    assignee: string,
    start_date: string,
    end_date: string,
    tags: string
}

interface issuesType {
    backlog: issueType[],
    todo: issueType[],
    done: issueType[]
}

type statuses = 'backlog' | 'todo' | 'done'

export type { issueType, issuesType, statuses }