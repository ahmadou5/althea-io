import styled from "@emotion/styled";
import discord from "assets/discord.svg";
import github from "assets/github.svg";
import twitter from "assets/twitter.svg";
import { Text } from "global/packages/src";
import ImageButton from "./ImageButton";

const Footer = () => {
  return (
    <Styled>
      <div className="links">
        <a href="https://canto.canny.io/">
          <Text type="text">report bug</Text>
        </a>
        <a href="https://docs.canto.io/">
          <Text type="text">docs</Text>
        </a>
        <a href="https://docs.canto.io/">
          <Text type="text">about canto</Text>
        </a>
      </div>

      <div className="links">
        <Text
          style={{
            color: "var(--primary-darker-color)",
          }}
          type="text"
        >
          all rights reserved 2021-2022
        </Text>
        <div className="icon-links">
          <ImageButton
            src={discord}
            alt="discord"
            height={40}
            onClick={() => {
              window.open("https://discord.gg/ucRX6XCFbr");
            }}
          />
          <ImageButton
            src={github}
            alt="github"
            height={40}
            onClick={() => {
              window.open("https://github.com/Canto-Network");
            }}
          />
          <ImageButton
            src={twitter}
            alt="twitter"
            height={40}
            onClick={() => {
              window.open("https://twitter.com/CantoPublic");
            }}
          />
        </div>
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  max-width: 1200px;
  width: 100%;
  border-top: 1px solid var(--primary-color);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  .links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .icon-links {
    display: flex;

    gap: 1rem;
  }

  @media (max-width: 1000px) {
    flex-direction: column;

    .links {
      margin-top: 1rem;
      flex-direction: column;
      gap: 1rem;
    }
  }
`;

export default Footer;
