import React from "react";

export default function TextButton(props: {
  text: string;
  onClick: () => void;
}) {
  return (
    <React.Fragment>
      <div className="textButton" onClick={() => props.onClick()}>
        {props.text}
      </div>
    </React.Fragment>
  );
}
