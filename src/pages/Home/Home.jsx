import { Link } from 'react-router';
import { useSelector } from 'react-redux';

import './Home.scss';
import { USER_STATUS } from '../../redux/userSlice';

// images
import heroImg from './images/hero.svg';
import githubIcon from './images/github.png';
import step1Img from './images/step1.svg';
import step2Img from './images/step2.svg';
import step3Img from './images/step3.svg';

const GITHUB_URL = 'https://github.com/wc-su/flow-chart';

const features = [
  {
    title: '選擇圖形',
    content: '從工具列挑選圖形，直接在畫布上畫出',
    decorationLine: {
      borderColor: '#0081a7',
      skewDeg: 6,
      translateY: 25,
    },
  },
  {
    title: '拖移縮放',
    content: '自由拖曳位置，或拉動邊角調整大小',
    decorationLine: {
      borderColor: '#c8b6ff',
      skewDeg: -5,
      translateY: 15,
    },
  },
  {
    title: '刪除圖形',
    content: '選取不需要的圖形，一鍵移除',
    decorationLine: {
      borderColor: '#bee3db',
      skewDeg: 4,
      translateY: 15,
    },
  },
  {
    title: '上一步／下一步',
    content: '畫錯也不怕，隨時復原或重做',
    decorationLine: {
      borderColor: '#ffba08',
      skewDeg: -10,
      translateY: 20,
    },
  },
];

const steps = [
  {
    img: step1Img,
    title: '構想流程圖',
    content: '先把工作拆解成不同的步驟',
  },
  {
    img: step2Img,
    title: '畫出流程圖',
    content: '用不同圖形代表各種事件，再用箭頭串起每個步驟',
  },
  {
    img: step3Img,
    title: '註冊並儲存',
    content: '資料存放在雲端，不同瀏覽器也能繼續編輯',
  },
];

const Home = () => {
  const { status } = useSelector((state) => state.user);

  const startPath = status === USER_STATUS.LOGGED_IN ? '/files' : '/chart';

  return (
    <div className="home">
      <main>
        <div className="home-hero">
          <div className="home-hero__container">
            <div className="home-hero__content">
              <h1 className="home-hero__title">
                Draw a <span className="home-hero__highlight">Flowchart</span>
                <br />
                簡單又直覺
              </h1>
              <p className="home-hero__subtitle">不用安裝任何軟體，打開瀏覽器就能畫出清楚的流程圖，讓想法一目了然。</p>
              <Link className="home-hero__startLink" to={startPath}>
                免費開始使用
              </Link>
            </div>
            <div className="home-hero__imgWrap">
              <img className="home-hero__img" src={heroImg} alt="" />
            </div>
          </div>
        </div>
        <section className="home-feature">
          <h2 className="home-feature__title">你可以做到</h2>
          <p className="home-feature__subtitle">常用的編輯功能都準備好了</p>
          <ul className="home-feature__list">
            {features.map((feature, i) => (
              <li key={i} className="home-feature__item">
                <h3 className="home-feature__itemTitle">{feature.title}</h3>
                <p className="home-feature__itemContent">{feature.content}</p>
                <div
                  className="home-feature__itemDecorationLine"
                  style={{
                    '--border-color': feature.decorationLine.borderColor,
                    '--skew-deg': `${feature.decorationLine.skewDeg}deg`,
                    '--translate-y': `${feature.decorationLine.translateY}px`,
                  }}
                ></div>
              </li>
            ))}
          </ul>
        </section>
        <section className="home-steps">
          <div className="home-steps__container">
            <h2 className="home-steps__title">三步驟完成流程圖</h2>
            <ul className="home-steps__list">
              {steps.map((step, i) => (
                <li key={i} className="home-steps__item">
                  <img className="home-steps__itemImg" src={step.img} alt="" />
                  <span className="home-steps__itemStep">{i + 1}</span>
                  <h3 className="home-steps__itemTitle">{step.title}</h3>
                  <p className="home-steps__itemContent">{step.content}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="home-cta">
          <h2 className="home-cta__title">準備好開始畫了嗎？</h2>
          <p className="home-cta__subtitle">免註冊即可試用，註冊後還能把作品存到雲端。</p>
          <Link className="home-cta__startLink" to={startPath}>
            立即開始
          </Link>
        </section>
      </main>
      <footer className="home-footer">
        <div className="home-footer__container">
          <Link to="/" className="home-footer__logo">
            <img className="home-footer__logoImg" src="/favicon.svg" alt="" />
            <span className="home-footer__logoText">FlowChart</span>
          </Link>
          <small className="home-footer__copyright">© 2022–2026 Eric Su</small>
          <a className="home-footer__socialLink" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <img className="home-footer__socialLinkIcon" src={githubIcon} alt="GitHub（另開新分頁）" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
