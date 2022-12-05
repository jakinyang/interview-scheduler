export function getAppointmentsForDay(state, day) {
  let dayObj;
  for(let elem of state.days) {
    if (elem.name === day) dayObj = elem;
  }
  if (dayObj === undefined) return [];
  const appArr = dayObj.appointments;
  const appointments = [];
  appArr.forEach(num => {
    appointments.push(state.appointments[num]);
  })
  return appointments;
}

export function getInterview(state, interview) {
  if (interview === null) return null;
  const interviewerId = interview.interviewer;
  const interviewerObj = state.interviewers[interviewerId];
  const interviewObj = {
    student: interview.student,
    interviewer: {
      id: interviewerObj.id,
      name: interviewerObj.name,
      avatar: interviewerObj.avatar,
    }
  }
  
  return interviewObj;
}

export function getInterviewersForDay(state, day) {
  let dayObj;
  for(let elem of state.days) {
    if (elem.name === day) dayObj = elem;
  }
  if (dayObj === undefined) return [];
  const interviewersArr = dayObj.interviewers;
  const interviewers = [];
  interviewersArr.forEach(num => {
    interviewers.push(state.interviewers[num]);
  })
  return interviewers;
}