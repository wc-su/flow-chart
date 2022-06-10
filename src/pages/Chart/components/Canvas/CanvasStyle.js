import React, { useContext, useEffect, useRef, useState } from "react";

import { DataContext } from "../../index";

const CanvasStyle = ({ chartIndex }) => {
  console.log("CanvasStyle");
  const { data, setData } = useContext(DataContext);

  const preIndex = useRef(-1);
  const [render, setRender] = useState(false);
  const initCheck = useRef({ fill: false, stroke: false });

  // const [decorate, setDecorate] = useState({});
  const decorate = useRef({});

  let hasFocus = false;
  let focusData = null;

  const regexColor = /[A-F|a-f|\d]{6}/g;

  if (chartIndex.current !== -1 && preIndex.current !== chartIndex.current) {
    // console.log(data);
    focusData = data.filter((item) => item.index === chartIndex.current);
    // focusData = data.filter((item) => (item.index === "xxxx"));
    // console.log("ssss", chartIndex.current, focusData);
    if (focusData.length > 0) {
      focusData = focusData[0];
      hasFocus = true;
      const initDecorate = { ...focusData.decorate };
      initDecorate.fill = initDecorate.fill.replace("#", "");
      initDecorate.stroke = initDecorate.stroke.replace("#", "");
      // setDecorate(initDecorate);
      decorate.current = initDecorate;
      preIndex.current = chartIndex.current;
      initCheck.current.fill = true;
      initCheck.current.stroke = true;
      setRender((preData) => !preData);
      // console.log(focusData, initDecorate);
    } else {
      focusData = null;
    }
  }

  function changeStyle() {
    console.log("click");
    if (fill.length === 6 && regexColor.test(fill)) {
      console.log("fill ok");
    } else {
      console.log("fill error");
    }
    if (stroke.length === 6 && regexColor.test(stroke)) {
      console.log("stroke ok");
    } else {
      console.log("stroke error");
    }
  }

  return (
    <div className="canvasStyle">
      <div>
        <FillArea decorate={decorate} initCheck={initCheck} />
      </div>
      <div>
        <StrokeArea decorate={decorate} initCheck={initCheck} />
      </div>
      <div className="canvasStyle__container">
        <input type="submit" value="APPLY" onClick={changeStyle} />
      </div>
    </div>
  );
};

const FillArea = ({ decorate, initCheck }) => {
  const [fill, setFill] = useState("");

  if (initCheck.current.fill) {
    // console.log("init fill", decorate.current.fill, fill);
    initCheck.current.fill = false;
    // if (decorate.current.fill && decorate.current.fill !== fill) {
    setFill(decorate.current.fill);
    // }
  }

  function handleFillChange(e) {
    setFill(e.target.value);
  }

  return (
    <>
      <div className="canvasStyle__container">
        {/* <input type="checkbox" id="fill-checkBox" /> */}
        <label htmlFor="fill-checkBox">Fill</label>
      </div>
      <div className="canvasStyle__container">
        {/* <div className="canvasStyle__color"></div> */}
        <div className="canvasStyle__container">
          <input
            className="canvasStyle__color-code-prefix"
            type="text"
            value="#"
            disabled
          ></input>
          <input
            className="canvasStyle__color-code"
            type="text"
            maxLength="6"
            value={fill}
            onChange={handleFillChange}
          ></input>
        </div>
      </div>
    </>
  );
};

const StrokeArea = ({ decorate, initCheck }) => {
  const innerChange = useRef(true);
  // const [strokeA, setStrokeA] = useState("");
  const [strokeA, setStrokeA] = useState(decorate.current.stroke);
  console.log(
    "StrokeArea",
    initCheck.current.stroke,
    innerChange.current,
    strokeA,
    decorate.current.stroke
  );
  innerChange.current = false;

  // useEffect(() => {
  //   console.log();
  //   setStrokeA(decorate.current.stroke);
  // }, [decorate.current.stroke]);

  useEffect(() => {
    // console.log();
    initCheck.current.stroke = false;
    setStrokeA(decorate.current.stroke);
  }, [initCheck.current.stroke]);

  // console.log("uuuu", initCheck.current.stroke, decorate.current.stroke);

  // if (initCheck.current.stroke) {
  // //   console.log("init stroke", decorate.current.stroke, strokeA);
  //   initCheck.current.stroke = false;
  //   if(innerChange.current) {
  //     innerChange.current = false;
  //     console.log("set", strokeA, decorate.current.stroke);
  //     setStrokeA(decorate.current.stroke);
  //   }
  // //   if (decorate.current.stroke && decorate.current.stroke !== strokeA) {
  // //     test(decorate.current.stroke);
  // //   // setStrokeA(decorate.current.stroke);
  // //   }
  // }

  //   useEffect(()=> {
  // // console.log("check", strokeA);
  //   });

  useEffect(() => {
    console.log("stroke useEffect:", strokeA, initCheck);
    // if(innerChange.current) {
    //   innerChange.current = false;
    // } else {
    //   console.log("www", decorate.current.stroke);
    //   // setStrokeA(decorate.current.stroke);
    // }
  }, [strokeA]);

  function handleStrokeChange(e) {
    innerChange.current = true;
    setStrokeA(e.target.value);
  }

  function test(changeStroke) {
    console.log("dddd");
    setStrokeA(changeStroke);
    console.log("wwwww");
  }

  return (
    <>
      <div className="canvasStyle__container">
        {/* <input type="checkbox" id="stroke-checkbox" /> */}
        <label htmlFor="stroke-checkbox">Stroke</label>
      </div>
      <div className="canvasStyle__container">
        {/* <select name="stroke-style">
            <option className="stroke-style--solid" value="solid"></option>
            <option className="stroke-style--dashed" value="dashed"></option>
          </select> */}
      </div>
      <div className="canvasStyle__container">
        {/* <div className="canvasStyle__color"></div> */}
        <div className="canvasStyle__container">
          <input
            className="canvasStyle__color-code-prefix"
            type="text"
            value="#"
            disabled
          ></input>
          <input
            className="canvasStyle__color-code"
            type="text"
            maxLength="6"
            value={strokeA}
            onChange={handleStrokeChange}
          ></input>
        </div>
      </div>
    </>
  );
};

export default CanvasStyle;
