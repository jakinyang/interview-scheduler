export function getAppointmentsForDay(state, day) {
  const dayObj = state.days.find(elem => elem.name === day);
  if (dayObj === undefined) return [];
  const appointments = [];
  dayObj.appointments.forEach(num => {
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
  const dayObj = state.days.find(elem => elem.name === day);
  if (dayObj === undefined) return [];
  const interviewers = [];
  dayObj.interviewers.forEach(num => {
    interviewers.push(state.interviewers[num]);
  })
  return interviewers;
}