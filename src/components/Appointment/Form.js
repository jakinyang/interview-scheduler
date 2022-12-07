import React from "react";
import { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const [student, setStudent] = useState(props.student || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState('');
  const reset = () => {
    setStudent('');
    setInterviewer(null);
  }

  const cancel = () => {
    reset();
    return props.onCancel();
  }

  function validate(student, interviewer) {
    if (student === "") {
      setError("Student name cannot be blank");
      return;
    }
    if (interviewer === null) {
      setError("Please select an interviewer");
      return;
    }
    props.onSave(student, interviewer);
  }

    return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form
          autoComplete="off"
          onSubmit={(event) => event.preventDefault()} >
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            data-testid="student-name-input"
            value={student}
            onChange={(event) => {
              setStudent(event.target.value);
            }}
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList
          onClick={setInterviewer}
          interviewer={interviewer}
          interviewers={props.interviewers}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={() => cancel()}>Cancel</Button>
          <Button confirm onClick={() => validate(student, interviewer)}>Save</Button>
        </section>
      </section>
    </main>
  );
}