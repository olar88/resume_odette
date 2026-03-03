import React from "react";

export default function TextButton(props: {
  text: React.ReactNode;
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
