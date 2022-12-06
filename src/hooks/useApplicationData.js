import { useEffect, useState, useReducer } from "react";
import Axios from "axios";


export default function useApplicationData() {


  // Reducer Implementation
  function reducer(state, action) {
    // Constants for Action.type
    const SET_DAY = action => {
      state.day = action.day
    };
    const SET_APPLICATION_DATA = action => {
      const days = action.days;
      const appointments = action.appointments;
      const interviewers = action.interviewers;
      state = {...state, days, appointments, interviewers}
    };
    const SET_INTERVIEW = action => {
      const days = action.days;
      const appointments = action.appointments;
      state = {...state, days, appointments}
    };
    const reducers = {
      SET_DAY,
      SET_APPLICATION_DATA,
      SET_INTERVIEW,
      default: state,
    };

    return reducers[action.type](action) || reducers.default;
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // Helper functions for setState
  const setDay = day => dispatch({type: 'SET_DAY', day});
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
        dispatch({
          type: 'SET_APPLICATION_DATA',
          days: resolutions[0].data,
          appointments: resolutions[1].data,
          interviewers: resolutions[2].data,
        })
      })
      .catch(err => {
        console.log('Error from Axios GET request to /api/days', err.message);
      });

  }, [])

  // Alt update spots
  const getFreeSpotsForDay = (state, newAppointments) => {
    // Get the current day
    const currentDay = state.days.find((day) => day.name === state.day);
    console.log("CurrentDay: ", currentDay);

    // Then get the index of the current day in the days array (this will come in handy later)
    const currentDayIndex = state.days.findIndex(day => day.name === state.day);
    console.log('Current day index: ', currentDayIndex);

    // This is the list of all appointments (going to use to filter in next step)
    const listOfAppointmentIds = currentDay.appointments;
    console.log("List of appointmentIds: ", listOfAppointmentIds);

    // Here we're getting a shorter list of appoitnments that have no interview (are free spots!)
    const listOfFreeAppointments = listOfAppointmentIds.filter(
      (id) => !newAppointments[id].interview
    );
    console.log("List of free appointments: ", listOfFreeAppointments);

    // If we count how many appointments don't have interviews we get the number of spots
    const amountOfFreeSpots = listOfFreeAppointments.length;
    console.log("amoutn of free spots: ", amountOfFreeSpots);

    // We're going to take the old currentDay object, and update how many spots it has
    const newDayObj = { ...currentDay, spots: amountOfFreeSpots };
    console.log("New Day Object: ", newDayObj);

    // Make a new copy of the whole days array
    const newDays = [...state.days];

    // Use that index of the day we're changing to replace the day object at that index with our new day object
    newDays[currentDayIndex] = newDayObj;

    // And we're going to return that whole days array so we can plug it into setState later!
    console.log("New Days Array: ", newDays);
    return newDays;
  };



  // Booking Interview
  const bookInterview = function (id, interview) {
    // Update appointment object with interview details
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    // Update appointments object from state with new appointment
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // Call getFreeSpots which will return an updated days array with the correct number of spots!
    console.log('Get free spots called from booking');
    const days = getFreeSpotsForDay(state, appointments);

    // Make Axios put to persist current state in database memory
    return Axios.put(`/api/appointments/${id}`, {
      interview
    })
      .then(() => {
        // Plug days straight into appointments
        dispatch({type: 'SET_INTERVIEW', appointments, days });
      });
  }

  // Cancel Interview
  const cancelInterview = function (id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // Call getFreeSpots which will return an updated days array with the correct number of spots!
    console.log('Get free spots called from cancel');
    const days = getFreeSpotsForDay(state, appointments);

    return Axios.delete(`/api/appointments/${id}`)
      .then(() => {
        // Plug days straight into appointments
        dispatch({type: 'SET_INTERVIEW', appointments, days });
      })
  }


  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}