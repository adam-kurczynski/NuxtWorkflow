import type { TimelogResponse } from "~~/server/api/types";


export default (timesheets: TimelogResponse[] | number) => {
  if (typeof timesheets === 'number') {
    return timesheets
  }
  return  timesheets.reduce((acc, timesheet) => {
    const startTime = new Date(timesheet.user_timelog.startTime)
    const endTime = new Date(timesheet.user_timelog.endTime)
    const diff = endTime.getTime() - startTime.getTime()
    return acc + diff / 3600000
  }, 0)
  
}
