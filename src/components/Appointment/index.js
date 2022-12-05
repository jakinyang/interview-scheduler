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
  
  // Mode constants
  const EMPTY = "EMPTY";
  const SHOW  = "SHOW";
  const CREATE  = "CREATE";

  const {mode, transition, back} = useVisualMode(
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
            onEdit={props.onEdit}
            onDelete={props.onDelete}
          />
        )}

        {/* If the mode is CREATE */}
        {mode === CREATE && 
          <Form 
            interviewers={props.interviewers}
            onSave={() => transition(SHOW, true)}
            onCancel={() => back()}
          />
        }
    </article>
  );
}