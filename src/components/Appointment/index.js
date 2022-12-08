import React, { useEffect } from "react";
import "components/Appointment/styles.scss";

// Hooks
import useVisualMode from "hooks/useVisualMode";

/* Subcomponents */
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Confirm from "./Confirm";
import Status from "./Status";
import Error from "./Error";
import Form from "./Form";

export default function Appointment(props) {
  const {id, time, interview, interviewers, bookInterview, cancelInterview} = props;
  // Save Interview
  const save = function (name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    }
    transition(SAVING, true);
    bookInterview(id, interview)
      .then(() => {
        transition(SHOW, true);
      })
      .catch((err) => {
        console.log(err);
        transition(ERROR_SAVE, true);
      });
  }

  // Edit Interview
  const edit = function () {
    transition(EDIT);
  }

  // Deleting Interview
  const deleting = function () {
    transition(CONFRIM);
  }

  // Confirming Delete Interview
  const confirmDelete = function () {
    transition(DELETING, true);
    cancelInterview(id, null)
      .then(() => {
        transition(EMPTY);
      })
      .catch((err) => {
        console.log(err);
        transition(ERROR_DELETE, true)
      });
  }

  // Mode constants
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFRIM = "CONFRIM";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const EDIT = "EDIT";

  
  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
    );

    useEffect(() => {
      if(interview && mode === EMPTY) {
        transition(SHOW);
      }
      if(interview === null && mode === SHOW) {
        transition(EMPTY);
      }
    })

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={time} />

      {mode === EMPTY && (
        <Empty onAdd={() => transition(CREATE)} />
      )}

      {mode === SHOW && interview && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onEdit={() => edit()}
          onDelete={() => deleting()}
        />
      )}

      {mode === CREATE &&
        <Form
          interviewers={interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      }
      {mode === EDIT &&
        <Form
          student={interview.student}
          interviewer={interview.interviewer.id}
          interviewers={interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      }
      {mode === SAVING &&
        <Status
          message='saving'
        />
      }
      {mode === DELETING &&
        <Status
          message='deleting'
        />
      }
      {mode === CONFRIM &&
        <Confirm
          onCancel={() => back()}
          onConfirm={() => confirmDelete()}
        />
      }
      {mode === ERROR_SAVE &&
        <Error
          message='ERROR WITH SAVE'
          onClose={() => back()}
        />
      }
      {mode === ERROR_DELETE &&
        <Error
          message='ERROR WITH DELETE'
          onClose={() => back()}
        />
      }
    </article>
  );
}