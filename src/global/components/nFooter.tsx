import styled from "@emotion/styled";
import discord from "assets/discord.svg";
import github from "assets/github.svg";
import twitter from "assets/twitter.svg";
import { Text } from "global/packages/src";
import ImageButton from "./ImageButton";

const Footer = () => {
  const img =
    {
      name: 'twitter' , src: './twitter.svg'
    }
  
  return (
    <Styled>
      <div className="links">
        <a href="https://Althea.org/" target="_blank" rel="noreferrer">
          <Text type="text">Althea</Text>
        </a>
        <a href="https://d/" target="_blank" rel="noreferrer">
          <Text type="text">Documentation</Text>
        </a>
        
      </div>

      <div className="links">
        <div className="icon-links">
          <ImageButton
            src={img.src}
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
              window.open("https://github.com/");
            }}
          />
          <ImageButton
            src={twitter}
            alt="twitter"
            height={40}
            onClick={() => {
              window.open("https://twitter.com/Althea");
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
  padding: 1.5rem 0;
  z-index: 2;
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
