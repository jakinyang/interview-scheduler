import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss"

export default function DayListItem(props) {
  const itemClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': !props.spots
  })
  const formatSpots = (spotsNum) => {
    return spotsNum ?
      spotsNum === 1 ?
        `${spotsNum} spot remaining`
        :
        `${spotsNum} spots remaining`
      :
      'no spots remaining'
  }
  return (
    <li key={props.key} className={itemClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}