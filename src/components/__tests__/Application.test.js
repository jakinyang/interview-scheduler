import React from "react";

import { 
  render, 
  cleanup, 
  waitForElement, 
  getByText, 
  fireEvent, 
  getByAltText,
  prettyDOM,
  getAllByTestId,
  getByPlaceholderText,
  queryByText,
  getByTestId,
  getByRole
} from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));
    
    const appointments = getAllByTestId(container, "appointment");
    
    const appointment = appointments[0];
    
    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: {value: "Lydia Miller-Jones"}
    });
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer")); 

    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  })

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, 'Delete'));
    
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, 'Delete the appointment?')).toBeInTheDocument();
    
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));
    
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();
    
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, 'Add'));
    
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, 'Edit'));
    
    // 4. Check that the form is shown with the name and interviewer pre-selected.
    expect(getByTestId(appointment, 'student-name-input')).toHaveValue('Archie Cohen');

    // 5. Change the input value
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: {value: "Lydia Miller-Jones"}
    });

    // 6. Check that the input now has changed value
    expect(getByTestId(appointment, 'student-name-input')).toHaveValue("Lydia Miller-Jones");
    
    // 7. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Save'));
    
    // 8. Check that the element with the text "saving" is displayed.
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    
    
    // 9. Wait until the element with "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    // 10. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async() => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));
    
    const appointments = getAllByTestId(container, "appointment");
    
    const appointment = appointments[0];
    
    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: {value: "Lydia Miller-Jones"}
    });
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer")); 

    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, /Saving/i)).toBeInTheDocument();
    
    await waitForElement(() => getByText(appointment, "Error"));

    expect(getByText(appointment, 'ERROR WITH SAVE')).toBeInTheDocument();

  });

  it("shows the delete error when failing to save an appointment", async() => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, 'Delete the appointment?')).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    // 7. Wait for the Error to appear
    await waitForElement(() => getByText(appointment, "Error"));

    // 8. Confirm delete Error message is displayed
    expect(getByText(appointment, 'ERROR WITH DELETE')).toBeInTheDocument();

  });

  /* it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, 'Delete'));
    
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, 'Delete the appointment?')).toBeInTheDocument();
    
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));
    
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();
    
    await waitForElement(() => getByText("Error"));

    expect(getByText(appointment, 'ERROR WITH DELETE')).toBeInTheDocument();
  }); */
})


