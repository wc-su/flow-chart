import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { chartActions } from "../../../model/chartReducer";
import { useDispatch } from "react-redux";
// context
import { DrawTypeContext } from "../index";
import { ActiveButtonContext } from "./CanvasToolBar";
//images
import iconSelectDown from "../images/down.png";

const CanvasToolItem = ({
  children,
  purpose,
  data,
  changeSelected,
  disabled,
}) => {
  const dispatch = useDispatch();
  const isMounted = useRef(false);

  const { setDrawType } = useContext(DrawTypeContext);
  const { activeButton, setActiveButton, toolBarPop, setToolBarPop } =
    useContext(ActiveButtonContext);

  const navigate = useNavigate();

  let feature = data.info[data.selected].feature;
  const imgUrl = data.info[data.selected].imgUrl;
  const altText = data.info[data.selected].text;

  const buttonClass = classNames("toolItem", {
    "toolItem--active":
      activeButton.purpose === purpose && activeButton.feature === feature,
    "toolItem--unactive": disabled,
    "toolItem--hasDropdown": data.info.length > 1,
  });

  useEffect(() => {
    if (isMounted.current) {
      changeActiveButton();
      isMounted.current = false;
    }
  }, [toolBarPop]);

  function handleItemclick(e) {
    e.stopPropagation();
    if (disabled) {
    } else {
      changeActiveButton();
      setToolBarPop("");
      if (purpose === "back") {
        dispatch(chartActions.clear());
        navigate("/Files");
      }
    }
  }

  function changeActiveButton() {
    if (purpose === "draw") {
      setDrawType(feature);
    } else {
      setDrawType("");
    }
    if (activeButton.purpose === purpose && activeButton.feature === feature) {
      setActiveButton({});
      setDrawType("");
    } else {
      setActiveButton(() => ({ purpose: purpose, feature: feature }));
    }
  }

  function popDropdownList(e) {
    e.stopPropagation();
    setToolBarPop((preData) => {
      if (preData) {
        return preData === purpose ? "" : purpose;
      } else {
        return purpose;
      }
    });
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
        <div className="toolItem__dropdown">
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

const ToolDropdownItem = ({
  children,
  index,
  changeSelected,
  setToolBarPop,
  isMounted,
}) => {
  function handleDropItemClick(e) {
    e.stopPropagation();
    if (changeSelected) {
      isMounted.current = true;
      changeSelected(index);
      setToolBarPop("");
    }
  }

  return (
    <div className="toolItem__container" onClick={handleDropItemClick}>
      {children}
    </div>
  );
};

export default CanvasToolItem;
