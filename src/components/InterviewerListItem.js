import React from "react";
import classNames from "classnames";
import "components/InterviewerListItem.scss"

export default function InterviewerListItem(props) {
  const itemClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected,
  })

  const nameDisplay = props.selected ? props.name : null;

  return (
    <li className={itemClass} onClick={props.setInterviewer}
    >
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {nameDisplay}
    </li>
  );
}