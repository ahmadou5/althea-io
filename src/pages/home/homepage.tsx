import styled from "@emotion/styled";
import HelmetSEO from "global/components/seo";
import { pageList } from "global/config/pageList";
import { Text } from "global/packages/src";
import { Mixpanel } from "mixpanel";
import { NavLink } from "react-router-dom";
import bg from "assets/alth1.png";
import { Banner } from "./components/Banner";

const Homepage = () => {
  return (
    <>
      <HelmetSEO
        title="Althea - Home Page"
        description="Althea Layer one Interactive User Interface Explore the althea Blockchain With us"
        link=""
      />
      <Styled>
        <div className="left">
          Welcome to Althea Layer one Interactive Blockchain User Interface Explore the althea Blockchain With us.
          Bridge, Stake, and Provide Liquidity on Althea Blockchain Through Our Aggregator.
        </div>
        <ul className="options" id="routes">
          {/**{pageList.map((page, idx) => {
            return page.showInMenu ? (
              <NavLink
                to={page.link}
                key={page.name}
                id={page.name}
                onClick={() =>
                  Mixpanel.events.landingPageActions.navigatedTo(page.name)
                }
              >
                <Text
                  type="title"
                  size="title1"
                  align="left"
                  className="navLink"
                >
                  {"0" + (idx + 1) + " " + page.name}
                </Text>
              </NavLink>
            ) : null;
          })} **/}
        </ul>
        <div className="right">
        <Banner />
        </div>
        {/* <div className="bg"> </div> */}
      </Styled>
    </>
  );
};
const Styled = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
  height: 100%;
  z-index: 0;

  .left {
    margin-buttom: auto ;
    margin-top: 0px;
    place-items: center;
    margin-left: 33px;
    margin-right: 33px;
    color: #0066FF;
  }
  .right {
    display: grid;
    place-items: center;
  }
  .options {
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 2;
    align-items: flex-start;
    width: 100%;
  }
  .bg {
    position: absolute;
    height: 100vh;
    width: 100vw;
    

    &::after {
      content: " ";
      position: absolute;
      height: 100vh;
      width: 100vw;
      background: (
        90deg,
        #00000015,
        #000000b9,
        #00000013,
        #000000c0
      );
      background-size: 200% 200%;
      animation: movingFade 10s ease infinite;
      @keyframes movingFade {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    }
  }

  a {
    width: 60%;
  }

  .navLink {
    height: 68px;
    transition: all 0.3s ease;
    width: 100%;
    /* padding-left: 1rem; */
    border-radius: 4px;
    transition: background-color 0.6s ease-in;
    transition: transform 0.3s ease-in-out;
    background-color: transparent;
    background-size: 0% 100%;
    &:hover {
      padding-left: 1rem;

      color: wheat;
      background-color: #0066ff ;
      background-repeat: no-repeat;
      background-size: 200% 100%;
      transition: background-size 0.7s, background-color 0.7s;
      transform: scale(1.1);
    }
  }
  @media (max-width: 1000px) {
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    .options {
      width: 100vw;
    }
    .right {
      display: flex;
      width: 100%;
    }
    a {
      width: 80%;
      margin: 0 auto;
    }

    .navLink {
      font-size: 24px;
      width: 100%;
    }
  }
`;
export default Homepage;
