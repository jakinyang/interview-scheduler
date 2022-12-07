import React from "react";

import { render, cleanup } from "@testing-library/react";

import PropTypes from 'prop-types';

import Appointment from 'components/Appointment/index';

afterEach(cleanup);
describe("Appointment", () => {
  it("renders without crashing", () => {
    render(<Appointment time='5pm'/>);
  });

})

Appointment.propTypes = {
  id: PropTypes.number, 
  time: PropTypes.string.isRequired, 
  interview: PropTypes.object, 
  interviewers: PropTypes.object, 
  bookInterview: PropTypes.func, 
  cancelInterview: PropTypes.func,
}