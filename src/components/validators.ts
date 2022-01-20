const endDateIsValid = (startDate: string, endDate:string) => {
    const start = startDate.split('-').map(str => parseInt(str))
    const end = endDate.split('-').map(str => parseInt(str))
    if (start[0] != end[0]) return start[0] < end[0]
    if (start[1] != end[1]) return start[1] < end[1]
    return start[2] <= end[2]   
}   


export {endDateIsValid}