import React, { useContext, useState, useEffect, useRef } from "react";
import classNames from "classnames";
// context
import { DrawTypeContext } from "../../../index";
import { ActiveButtonContext } from "../index";
// components
import ToolDropdownItem from "./ToolDropdownItem";
//images
import iconSelectDown from "../../../images/down.png";

const ToolItem = ({ children, purpose, data, changeSelected, disabled }) => {
  const isMounted = useRef(false);

  const { setDrawType } = useContext(DrawTypeContext);
  const { activeButton, setActiveButton, toolBarPop, setToolBarPop } =
    useContext(ActiveButtonContext);

  let feature = data.info[data.selected].feature;
  const imgUrl = data.info[data.selected].imgUrl;
  const altText = data.info[data.selected].text;

  const buttonClass = classNames("toolItem", {
    "toolItem--active":
      activeButton.purpose === purpose && activeButton.feature === feature,
    "toolItem--unactive": disabled,
    "toolItem--hasDropdown": data.info.length > 1,
  });

  // useEffect(()=>{
  //   if(purpose==="draw") {
  // console.log("poppppppppp", pop, data.selected);
  //   }
  // });

  useEffect(() => {
    // if (purpose === "draw") {
    // console.log("ToolItem.js -> useEffect pop:", pop);
    // }
    if (isMounted.current) {
      // feature =  data.info[data.selected].feature;
      // console.log("xxxxx", feature);
      // if(!false) {
      changeActiveButton();
      isMounted.current = false;
      // }
    }
  }, [toolBarPop]);

  function handleItemclick(e) {
    // console.log("handleItem:", purpose, feature);
    e.stopPropagation();
    if (disabled) {
    } else {
      // setBtnClick((preSatae) => !preSatae);
      // console.log(purpose, feature);
      // if (purpose === "draw") {
      //   setDrawType(feature);
      // } else {
      //   setDrawType("");
      // }
      changeActiveButton();
      setToolBarPop("");
    }
  }

  function changeActiveButton() {
    // console.log("wwww", activeButton, purpose, feature);
    if (purpose === "draw") {
      setDrawType(feature);
    } else {
      setDrawType("");
    }
    if (activeButton.purpose === purpose && activeButton.feature === feature) {
      // console.log("zzzzz");
      setActiveButton({});
      setDrawType("");
    } else {
      // console.log("yyyyy", purpose, feature);
      setActiveButton(() => ({ purpose: purpose, feature: feature }));
    }
  }

  function popDropdownList(e) {
    // console.log("popDropdown", e.target);
    e.stopPropagation();
    setToolBarPop((preData) => {
      if (preData) {
        return preData === purpose ? "" : purpose;
      } else {
        return purpose;
      }
    });
    // setToolBarPop(purpose);
  }

  function handlelDropListClick(e) {
    console.log("handlelDropList:", e.target, purpose, feature);
  }

  return (
    <div className={buttonClass} onClick={handleItemclick}>
      <div className="toolItem__container">
        {feature === "percent" && children ? (
          <>{children}</>
        ) : (
          <img className="toolItem__img" src={imgUrl} alt={altText}></img>
        )}
      </div>
      {data.info.length > 1 && (
        <div className="toolItem__container" onClick={popDropdownList}>
          <img
            className="toolItem__img toolItem__img-dropdown"
            src={iconSelectDown}
            alt="select"
          ></img>
        </div>
      )}
      {data.info.length > 1 && toolBarPop === purpose && (
        <div className="toolItem__dropdown" onClick={handlelDropListClick}>
          {data.info.map((item, index) => {
            return (
              <ToolDropdownItem
                key={item.text}
                index={index}
                changeSelected={changeSelected}
                setToolBarPop={setToolBarPop}
                isMounted={isMounted}
              >
                <img
                  className="toolItem__img"
                  src={item.imgUrl}
                  alt={item.text}
                ></img>
                <p>{item.text}</p>
              </ToolDropdownItem>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ToolItem;
