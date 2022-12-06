import React, { Fragment } from "react";
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

  // Save Interview
  const save = function (name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    }
    console.log('Interview Obj from Save', interview)
    if (!interview.interviewer || !interview.student) {
      return transition(ERROR_INPUT);
    };
    transition(SAVING, true);
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW, true);
      })
      .catch((err) => {
        console.log(err.message);
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
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((err) => {
        console.log(err.message);
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
  const ERROR_INPUT = "ERROR_INPUT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const EDIT = "EDIT";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article className="appointment">
      <Header time={props.time} />

      {/* If the mode is EMPTY */}
      {mode === EMPTY && (
        <Empty onAdd={() => transition(CREATE)} />
      )}

      {/* If the mode is SHOW */}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => edit()}
          onDelete={() => deleting()}
        />
      )}

      {/* If the mode is CREATE */}
      {mode === CREATE &&
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      }
      {/* If the mode is EDIT */}
      {mode === EDIT &&
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      }
      {/* If the mode is SAVING */}
      {mode === SAVING &&
        <Status
          message='saving'
        />
      }
      {/* If the mode is DELETING */}
      {mode === DELETING &&
        <Status
          message='deleting'
        />
      }
      {/* If the mode is CONFRIM */}
      {mode === CONFRIM &&
        <Confirm
          onCancel={() => back()}
          onConfirm={() => confirmDelete()}
        />
      }
      {mode === ERROR_INPUT &&
        <Error
          message='MISSING FORM FIELDS: INPUT BOTH STUDENT AND INTERVIEWER'
          onClose={() => back()}
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