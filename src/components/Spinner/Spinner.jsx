import React from "react";
import LoaderIcon from "../../assets/icons/Loader-Icon-animated.svg";

import "./Spinner.scss";

function Spinner({ open, overlay, indivisual }) {
  const overlayOption = `overlay-styles ${overlay ? "show" : "hide"} ${
    indivisual ? "indivisual" : ""
  }`;
  if (open) {
    return (
      <div className={overlayOption}>
        <div className="loaderwrap">
          <div className="progress">
            <img className="loader" src={LoaderIcon} alt="loader" />
          </div>
        </div>
      </div>
    );
  }
}

export default Spinner;
