import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "./index.scss";
import { auth } from "../../firebase/auth";
import { userActionContext } from "../../components/Context/UserProvider";

const Home = () => {
  const { setUserAction } = useContext(userActionContext);

  function linkToChart(e) {
    // if (!auth.currentUser) {
    //   e.preventDefault();
    //   setUserAction("login");
    // }
  }

  return (
    <div className="Home">
      <div className="main">
        <div className="banner">
          <div className="banner__bg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 828.05 684.69">
              <defs xmlns="http://www.w3.org/2000/svg">
                <style>{`.cls-1{fill:#f0f0f0;}.heavy{font:bold 50px sans-serif;}`}</style>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="vector">
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    className="cls-1"
                    d="M474.51,571.6c-79.18,4.15-154,30.44-221.67,11.94s-127.93-82-139.35-152.5c-11.43-70.29,25.78-147.55,74-199.83,48-52.29,107.1-79.59,164.23-100.32S464,95.9,535.39,92.26s158.87,3.54,187.19,49.25-2.43,129.64-12.64,213.07.2,166.05-36.41,198.42S553.7,567.46,474.51,571.6Z"
                  />
                  <text x="220" y="300" className="heavy">
                    Easy
                  </text>
                  <text x="355" y="300" className="heavy">
                    to
                  </text>
                  <text x="220" y="360" className="heavy">
                    Draw
                  </text>
                  <text x="220" y="420" className="heavy">
                    Flow chart
                  </text>
                </g>
              </g>
            </svg>
            <div className="banner__bg-img">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 942.98 904.96"
              >
                <defs>
                  <style>
                    {`.cls-1{fill:#f0f0f0;}.cls-2{fill:#fff;}.cls-3,.cls-5{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:4.78px;}.cls-3{stroke:#1b3c87;}.cls-4{fill:#46dbc9;}.cls-5{stroke:#b6c6fc;}.cls-6{fill:#1b3c87;}.cls-7{fill:#fb5d64;}`}
                  </style>
                </defs>
                <title>drawkit-grape-pack-illustration-20</title>
                <g id="Layer_2" data-name="Layer 2">
                  <g id="Layer_2-2" data-name="Layer 2">
                    {/* <path
                      className="cls-1"
                      d="M845.58,9.7c67.88,36,62.29,180.44,65.08,307s14,235.19-17.59,346.92S787.2,890.11,693.63,903.52c-93.85,13.69-207.25-73.74-335.46-120.38S87,730.62,30.25,661.07,3.44,458.29,63.21,367c60.05-91.34,150-140.5,227.09-174.85,76.81-34.36,141.05-53.91,243.56-100C636.65,46.29,777.71-26.33,845.58,9.7Z"
                    /> */}
                    <path
                      className="cls-2"
                      d="M95.5,532.46c-7-2-28-15-32-20S50,519.59,67.25,536"
                    />
                    <path
                      className="cls-3"
                      d="M87.5,524.46c-7-2-28-15-32-20S42,511.59,59.25,528"
                    />
                    <path
                      className="cls-2"
                      d="M175.5,563.46c-5-6-22-31-25-39s-23.43-16-10.22,39"
                    />
                    <path
                      className="cls-3"
                      d="M165.5,553.46c-5-6-22-31-25-39-2.59-6.89-18.1-13.78-13.91,19.6"
                    />
                    <path
                      className="cls-2"
                      d="M286.88,654.22c-6.38,13.24-34.38,65.24-34.38,65.24s-64-137-71-140-114-40-134-51c-8-4-32,3,12,32s87,53,92,63,41,165,41,165H326.62c8.88,0,38.88-98,38.88-98S294.27,646,286.88,654.22Z"
                    />
                    <path
                      className="cls-3"
                      d="M172.89,737.54c5.56,23.52,9.61,40.92,9.61,40.92H316.62c8.88,0,38.88-98,38.88-98S284.27,636,276.88,644.22c-6.38,13.24-34.38,65.24-34.38,65.24s-64-137-71-140c-2.16-.92-13.8-5.07-29.46-10.69"
                    />
                    <path
                      className="cls-3"
                      d="M76.38,567.76c33.3,21,61.15,37.77,65.12,45.7,2.63,5.27,13.89,50.86,23.94,92.78"
                    />
                    <path
                      className="cls-3"
                      d="M115.79,549.3c-31.9-11.59-67.58-24.95-78.29-30.84-7.29-3.64-27.84,1.84,1.77,24.75"
                    />
                    <path
                      className="cls-4"
                      d="M468.06,490.46c59.94,31.12-7.15,186-44,225.2-30.17,6.54-136.6-44.58-149.75-78.52C285.37,603.69,382.64,446.1,468.06,490.46Z"
                    />
                    <polygon
                      className="cls-5"
                      points="880.73 217.46 940.59 354.75 696.5 396.31 880.73 217.46"
                    />
                    <rect
                      className="cls-5"
                      x="109.83"
                      y="254.72"
                      width="182.84"
                      height="160.86"
                      transform="translate(-184.78 273.45) rotate(-49.93)"
                    />
                    <path
                      className="cls-3"
                      d="M346.88,511.32c33.8-30.84,73.63-50.36,111.18-30.86,59.94,31.12-7.15,186-44,225.2-30.17,6.54-136.6-44.58-149.75-78.52,3.45-10.45,15.32-33,32.62-57.78"
                    />
                    <path
                      className="cls-3"
                      d="M454.3,454.13c24.16-16.19,52.34-25.67,85.2-25.67,124,0,176,164,179,351"
                    />
                    <path
                      className="cls-3"
                      d="M347.86,623.4c16-51.75,38.73-101.52,70.9-137.81"
                    />
                    <path
                      className="cls-3"
                      d="M316.61,778.62c2.58-22.47,6.19-47.6,11.21-73.81"
                    />
                    <path
                      className="cls-4"
                      d="M728.26,778.46c-4.84-182.38-57.2-340-178.76-340-154.21,0-205.33,208.84-221.68,340Z"
                    />
                    <path
                      className="cls-3"
                      d="M797.54,706.23l-29-67.77-111,68c3.4,12.24,15.12,49.44,22.27,72"
                    />
                    <path
                      className="cls-2"
                      d="M797,779V691.63l-18.5-43.17-111,68c3,10.64,12.2,40.15,19.26,62.5Z"
                    />
                    <path
                      className="cls-4"
                      d="M648.5,479.46c61-29,144,118,153,171-13,28-118,82-153,72C628.5,693.46,561.57,520.79,648.5,479.46Z"
                    />
                    <path
                      className="cls-3"
                      d="M699.2,485.59c44.94,37.56,86.11,118.43,92.3,154.87-13,28-118,82-153,72A104.61,104.61,0,0,1,631.94,701"
                    />
                    <path
                      className="cls-3"
                      d="M602.12,615c-11.88-53.55-12.5-113.55,27.14-140.26"
                    />
                    <polyline
                      className="cls-3"
                      points="762.88 156.46 797.5 156.46 797.5 778.46 175.5 778.46 175.5 748.57"
                    />
                    <polyline
                      className="cls-3"
                      points="175.5 204.63 175.5 156.46 629.26 156.46"
                    />
                    <line
                      className="cls-3"
                      x1="175.5"
                      y1="574.6"
                      x2="175.5"
                      y2="356.76"
                    />
                    <path
                      className="cls-2"
                      d="M596,344c-5,20-14,63-11,121-17,15-74,18-100-2,5-31,5-61,4-81S596,344,596,344Z"
                    />
                    <path
                      className="cls-3"
                      d="M477,455c5-31,5-61,4-81s107-38,107-38c-5,20-14,63-11,121-10.07,8.88-34.14,13.55-57.51,11.74"
                    />
                    <ellipse
                      className="cls-2"
                      cx="517"
                      cy="274.46"
                      rx="103.5"
                      ry="132"
                    />
                    <path
                      className="cls-3"
                      d="M555.21,382.6A85.44,85.44,0,0,1,509,396.46c-31.74,0-60.14-18.22-79.13-46.91"
                    />
                    <path
                      className="cls-3"
                      d="M410.87,306.55a165.42,165.42,0,0,1-5.37-42.09c0-72.9,46.33-132,103.5-132s103.5,59.1,103.5,132a163.55,163.55,0,0,1-7.94,50.78"
                    />
                    <path
                      className="cls-3"
                      d="M466.5,252.46c-1,10-14,38-24,48"
                    />
                    <path className="cls-3" d="M473.5,340.46c5,0,15-2,23-14" />
                    <ellipse
                      className="cls-6"
                      cx="437.25"
                      cy="260.21"
                      rx="10.25"
                      ry="4.75"
                      transform="translate(108.26 648.36) rotate(-80.47)"
                    />
                    <path
                      className="cls-7"
                      d="M640.5,220.46c0-53-58-89-97-101-31.53-9.7-81-25-107-25-32,0-57,33-57,66,0,36,19,63,42,69,4-12,6-17,6-17,4,5,111,18,147,17-3,13-5,59,15,60C600.5,290.46,640.5,302.46,640.5,220.46Z"
                    />
                    <path
                      className="cls-3"
                      d="M568,124.46a179.28,179.28,0,0,0-34.52-15c-31.53-9.7-81-25-107-25-24.87,0-45.51,19.92-53.47,44.29"
                    />
                    <path
                      className="cls-3"
                      d="M564.5,219.46c-3,13-5,59,15,60,11,1,51,13,51-69,0-23.74-11.64-44.06-28-60.35"
                    />
                    <path
                      className="cls-3"
                      d="M372,172.56c5.92,24.66,21.46,42.2,39.46,46.9,4-12,6-17,6-17,2.86,3.58,58.57,11.27,103.18,15"
                    />
                    <circle className="cls-2" cx="596.5" cy="292.46" r="27" />
                    <path
                      className="cls-3"
                      d="M561.5,284.46a27,27,0,0,1,18.87-25.76"
                    />
                    <path
                      className="cls-3"
                      d="M580.37,258.7a27,27,0,1,1,8.13,52.76,27.34,27.34,0,0,1-6.76-.85"
                    />
                  </g>
                </g>
              </svg>
            </div>
            <div className="banner__bg-link">
              {/* <Link to="/Chart" className="link"> */}
              <Link to="/Chart" className="link" onClick={linkToChart}>
                Try it free
              </Link>
            </div>
          </div>
        </div>
        {/* <Link to="/Chart" className="link" onClick={linkToChart}>
          Try it free
        </Link> */}
        <div className="intro">
          {/* <ul className="list">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div className="detail"></div> */}
        </div>
      </div>
      {/* <div className="footer"></div> */}
    </div>
  );
};

export default Home;
