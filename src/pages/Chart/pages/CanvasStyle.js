import React from "react";
import { IoCheckbox } from "react-icons/io5";

const CanvasStyle = () => {
  return (
    <div className="canvasStyle">
      <div>
        <div className="canvasStyle__container">
          <input type="checkbox" id="fill-checkBox" />
          <label htmlFor="fill-checkBox">Fill</label>
        </div>
        <div className="canvasStyle__container">
          <div className="canvasStyle__color"></div>
          <div className="canvasStyle__container">
            <input
              className="canvasStyle__color-code-prefix"
              type="text"
              value="#"
              disabled
            ></input>
            <input className="canvasStyle__color-code" type="text"></input>
          </div>
        </div>
      </div>
      <div>
        <div className="canvasStyle__container">
          <input type="checkbox" id="stroke-checkbox" />
          <label htmlFor="stroke-checkbox">Stroke</label>
        </div>
        <div className="canvasStyle__container">
          <select name="stroke-style">
            {/* <option value="">--Please choose an option--</option> */}
            <option className="stroke-style--solid" value="solid"></option>
            <option className="stroke-style--dashed" value="dashed">
            </option>
          </select>
        </div>
        <div className="canvasStyle__container">
          <div className="canvasStyle__color"></div>
          <div className="canvasStyle__container">
            <input
              className="canvasStyle__color-code-prefix"
              type="text"
              value="#"
              disabled
            ></input>
            <input className="canvasStyle__color-code" type="text"></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasStyle;
