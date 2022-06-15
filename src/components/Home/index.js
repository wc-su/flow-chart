import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import "./index.scss";
import { UserContext } from "../../context/UserProvider";
import { LoadingContext } from "../../context/LoadingProvider";

// images
import header1 from "./images/header-1.png";
import icon4 from "./images/logo-icon.png";
import githubIcon from "./images/github.png";
import linkedinIcon from "./images/linkedin.png";
import feature1 from "./images/feature-1.png";
import feature2 from "./images/feature-2.png";
import feature3 from "./images/feature-3.png";

const githubHref = "https://github.com/wc-su/flow-chart";
const linkedinHref =
  "https://www.linkedin.com/in/%E9%9F%8B%E4%B8%9E-%E8%98%87-b14942126/";

const Home = () => {
  const { userLogin } = useContext(UserContext);
  const { setMessage } = useContext(LoadingContext);

  useEffect(() => {
    if (userLogin === 0) {
      setMessage("載入中，請稍候...");
    } else {
      setMessage("");
    }
  }, [userLogin]);

  return (
    <div className="Home">
      <div className="main">
        <div className="header">
          <div className="header__container">
            <div className="header__img">
              <img src={header1}></img>
            </div>
            <div className="header__content">
              <div className="header__title">
                <p>Draw a Flowchart</p>
              </div>
              <div className="header__link">
                <Link to={userLogin === 1 ? "/Files" : "/Chart"}>
                  Try it free
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="feature">
          <ul className="feature__list">
            <li className="feature__item">
              <p>
                選擇圖形
                <br />
                在畫布上畫出
              </p>
              <div></div>
            </li>
            <li className="feature__item">
              <p>
                將圖形拖移
                <br />
                或進行縮放
              </p>
              <div></div>
            </li>
            <li className="feature__item">
              <p>
                刪除
                <br />
                不需要的圖形
              </p>
              <div></div>
            </li>
            <li className="feature__item">
              <p>
                使用
                <br />
                上一步/下一步
                <br />
                調整
              </p>
              <div></div>
            </li>
          </ul>
        </div>
        <div className="direction">
          <ul className="direction__list">
            <li className="direction__item">
              <img src={feature1} alt="feature 1"></img>
              <h3>1.構想流程圖</h3>
              <p>將工作拆解成不同流程</p>
            </li>
            <li className="direction__item">
              <img src={feature2} alt="feature 2"></img>
              <h3>2.畫出流程圖</h3>
              <p>
                使用不同圖形表示各獨特事件
                <br />
                使用箭頭來描述一連串步驟
              </p>
            </li>
            <li className="direction__item">
              <img src={feature3} alt="feature 3"></img>
              <h3>3.註冊將資料儲存</h3>
              <p>
                將資料儲存於雲端
                <br />
                方便於不同瀏覽器之間做編輯
              </p>
            </li>
          </ul>
        </div>
        <div className="startArea">
          <p>Start drawing</p>
          <Link to={userLogin === 1 ? "/Files" : "/Chart"} className="link">
            Try it free
          </Link>
        </div>
      </div>
      <div className="footer">
        <div className="footer__content">
          <Link to="/" className="footer__content-logo">
            <img src={icon4} alt="logo" />
          </Link>
        </div>
        <div className="footer__copyright">
          <p>Copyright © 2022 Eric Su</p>
        </div>
        <div className="footer__social">
          <a href={githubHref} target="_blank">
            <img src={githubIcon} alt="github icon" />
          </a>
          <a href={linkedinHref} target="_blank">
            <img src={linkedinIcon} alt="linkedin icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
