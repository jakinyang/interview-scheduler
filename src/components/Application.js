import React, { useEffect, useState } from "react";
import Axios from "axios";

// Components
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";

// Helper Functions
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {

  // Initialise state object
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // Helper functions for setState
  const setDay = day => setState(prev => ({ ...prev, day }));
  // const setDays = days => setState(prev => ({...prev, days }));
  // const setAppointments = appointments => setState(prev => ({...prev, appointments }));

  // HTTP request to api for data to populate state object
  useEffect(() => {
    Promise.all([
      Axios.get('/api/days'),
      Axios.get('/api/appointments'),
      Axios.get('/api/interviewers')
    ])
      .then(resolutions => {
        setState(prev => ({
          ...prev,
          days: resolutions[0].data,
          appointments: resolutions[1].data,
          interviewers: resolutions[2].data,
        }));
      })
      .catch(err => {
        console.log('Error from Axios GET request to /api/days', err.message);
      });

  }, [])

  // Booking Interview
  const bookInterview = function(id, interview) {
    console.log(id, interview);
    // Update appointment object with interview details
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    console.log(appointment);

    // Update appointments object from state with new appointment
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    console.log(appointments);

    // Set state with new, updated appointments object
    

    // Make Axios put to persist current state in database memory
    return Axios.put(`/api/appointments/${id}`, {
      interview
    })
    .then(() => {
      setState(prev => ({...prev, appointments}));
    });
  }

  // Cancel Interview
  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return Axios.delete(`/api/appointments/${id}`)
    .then(() => {
      setState(prev => ({...prev, appointments}));
    })
  }

  // Getting an appointment object by day and the current state
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // Getting an interviewers object by day and the current state
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  // Call Appointment component with interview object passed as props
  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
