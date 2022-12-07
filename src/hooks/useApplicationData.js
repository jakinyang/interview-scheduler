import { useEffect, useReducer } from "react";
import Axios from "axios";

export default function useApplicationData() {
  // Reducer Implementation
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // Helper Function for getting free spots
  function reducer(state, action) {
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

    // Helper function for creating appointment object
    const makeInterviewObj = (id, interview) => {
      // Update appointment object with interview details
      const appointment = {
        ...state.appointments[id],
        interview: interview,
      };

      // Update appointments object from state with new appointment
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      // Call getFreeSpots which will return an updated days array with the correct number of spots!
      const days = getFreeSpotsForDay(state, appointments);

      // Return object with appointments and days
      return { appointments, days };
    }
    // Constants for Action.type
    const SET_DAY = action => {
      const day = action.day;
      return state = { ...state, day };
    };
    const SET_APPLICATION_DATA = action => {
      const days = action.days;
      const appointments = action.appointments;
      const interviewers = action.interviewers;
      return state = { ...state, days, appointments, interviewers };
    };
    const SET_INTERVIEW = action => {
      const id = action.id;
      const interview = action.interview;
      const { days, appointments } = makeInterviewObj(id, interview);
      return state = { ...state, days, appointments };
    };

    const reducers = {
      SET_DAY,
      SET_APPLICATION_DATA,
      SET_INTERVIEW,
      default: state,
    };

    return reducers[action.type](action) || reducers.default;
  }



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

  // Helper functions for setState
  const setDay = day => dispatch({ type: 'SET_DAY', day });

  // Websocket
  useEffect(() => {
    const wsURL = process.env.REACT_APP_WEBSOCKET_URL;
    const ws = new WebSocket(wsURL);
    ws.onopen = () => {
      console.log('Websocket Handshake complete');
      ws.send('Hello from the client!');
      ws.send('ping');
      ws.onmessage = event => {
        console.log(`Message received: ${event.data}`);
        const data = JSON.parse(event.data);
        if (data.type === 'SET_INTERVIEW') {
          const { type, id, interview } = data;
          console.log(`Update appointments call received. Data: Type: ${type} id: ${id} interview: ${interview}`)
          dispatch({ type: type, id, interview });
        }
      }
    }
  })

  // Booking Interview
  const bookInterview = function (id, interview) {
    return Axios.put(`/api/appointments/${id}`, {
      interview
    })
      .then(() => {
        // Plug days straight into appointments
        dispatch({ type: 'SET_INTERVIEW', id, interview });
      });
  }

  // Cancel Interview
  const cancelInterview = function (id, interview) {
    return Axios.delete(`/api/appointments/${id}`)
      .then(() => {
        // Plug days straight into appointments
        dispatch({ type: 'SET_INTERVIEW', interview, id });
      })
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}