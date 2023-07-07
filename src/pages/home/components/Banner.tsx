import styled from "@emotion/styled";
import { OutlinedButton, Text } from "global/packages/src";
import bannerImg from "assets/alth1.png";
export const Banner = () => {
  return (
    <Styled>
      <Text type="title" size="title2" align="left">
        The World's First iFi Hackathon
      </Text>
      <Text align="left">/chapter 1 : season 8</Text>
      <Text align="left">/july 1 - august 30</Text>
      <Text align="left">
        Join the Canto Online Hackathon for apps, infrastructure, and original
        work.
      </Text>
      <div className="spacer"></div>
      <OutlinedButton
        onClick={() => {
          window.open("https://https://dorahacks.io/hackathon/althea-ifi-hackathon.build/");
        }}
      >
        Apply to hack &gt;
      </OutlinedButton>
    </Styled>
  );
};

const Styled = styled.div`
  width: 400px;
  height: 500px;
  border-radius: 4px;
  padding: 1rem;
  border: 1px solid #0066ff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-image: url(${bannerImg});
  background-size: cover;
  .spacer {
    flex-grow: 1;
  }
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 1000px) {
    width: 100%;
    margin: 0 1.4rem;
  }
`;
