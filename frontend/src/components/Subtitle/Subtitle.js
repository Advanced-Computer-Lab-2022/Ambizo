import React from "react";

function Subtitle(props) {

    let hours;
    let minutes
    if(props.duration > 60) {
        hours = (props.duration / 60).toFixed(0);
        minutes = props.duration % 60;
    }

    return (
        <div className="subtitle">
            <div className="arrow"></div>
            <p className="subtitle--name">{props.subtitle}</p>
            {hours && <span className="subtitle--duration">{hours}hr {minutes}min</span>}
            {!hours && <span className="subtitle--duration">{props.duration}min</span>}
        </div>
    )
}

export default Subtitle;