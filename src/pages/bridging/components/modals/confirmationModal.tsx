import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import { formatUnits } from "ethers/lib/utils";
import LoadingModal from "global/components/modals/loading2";
import { PrimaryButton, Text } from "global/packages/src";
import { CInput } from "global/packages/src/components/atoms/Input";
import { truncateNumber } from "global/utils/utils";
import { BridgeModal } from "pages/bridging/config/interfaces";
import { formatAddress } from "pages/bridging/utils/utils";
import lockIcon from "assets/icons/lock.svg";

const ConfirmationModal = (props: BridgeModal) => {
  const networkID = useEthers().chainId;
  const { switchNetwork } = useEthers();
  const canConfirm =
    !props.ibcData ||
    props.ibcData.selectedNetwork.checkAddress(props.ibcData.userInputAddress);
  return (
    <Styled>
      {/* render switch network if netword ID is not undefined and value is not the same */}
      {props.from.chainId != networkID && networkID != undefined && (
        <div className="network-change">
          <Text type="title">Oops, you seem to be on a wrong network.</Text>
          <PrimaryButton
            onClick={() => {
              switchNetwork(props.from.chainId);
            }}
          >
            Switch Network
          </PrimaryButton>
        </div>
      )}

      {/* render loading modal which takes care of rest of the states*/}
      {props.tx.state != "None" &&
        (props.from.chainId == networkID || networkID == undefined) && (
          <div className="loading">
            <LoadingModal
              transactionType={props.tx.txType}
              status={props.tx.state}
              tokenName={props.token.name}
              onClose={() => {
                false;
              }}
            />
          </div>
        )}
      {/* render content */}
      {props.tx.state == "None" &&
        (props.from.chainId == networkID || networkID == undefined) &&
        (props.tx.txName == "approve token" ? (
          <>
            <div
              style={{
                marginTop: "1rem",
              }}
            ></div>
            <div className="locked">
              <img src={lockIcon} alt="token locked" />
              <span className="icons">
                <img
                  src={props.token.icon}
                  height={40}
                  alt={props.token.name}
                />
              </span>
            </div>
            <div className="info">
              <Text
                type="title"
                align="left"
                size="title2"
                style={{
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                {`You need to enable ${props.token.name}`}
              </Text>
            </div>
          </>
        ) : (
          <>
            <Text type="title" size="title2">
              {props.tx.txName}{" "}
            </Text>
            <div className="expanded">
              <>
                <img
                  height={50}
                  src={props.token.icon}
                  alt={props.token.name}
                />
                <Text type="title" size="title3">
                  {props.token.name}
                </Text>
              </>
            </div>
            <div className="transactions">
              {props.tx.txName != "approve token" && (
                <>
                  <ConfirmationRow
                    title="from"
                    value={`${formatAddress(props.from.address, 6)}`}
                  />
                  <ConfirmationRow
                    title="to"
                    value={`${formatAddress(props.to.address, 6)}`}
                  />
                  <ConfirmationRow
                    title="amount"
                    value={
                      truncateNumber(
                        formatUnits(props.amount, props.token.decimals)
                      ) +
                      " " +
                      props.token.symbol
                    }
                  />
                </>
              )}
            </div>

            {props.ibcData && (
              <div className="transactions">
                <div
                  className="row"
                  style={{
                    margin: "8px 0",
                  }}
                >
                  <div className="header">address :</div>
                  <div className="value">
                    <CInput
                      style={{
                        border: "1px solid #282828",
                        backgroundColor: "transparent",
                        width: "16rem",
                      }}
                      placeholder={
                        props.ibcData.selectedNetwork.addressBeginning + "1..."
                      }
                      value={props.ibcData.userInputAddress}
                      onChange={(val) => {
                        props.ibcData?.setUserInputAddress(val.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {!!props.extraDetails && (
              <Text size="text4" align="left" style={{ color: "#474747" }}>
                {props.extraDetails}
              </Text>
            )}
          </>
        ))}
      <div className="expanded"></div>
      <PrimaryButton
        filled
        height="big"
        weight="bold"
        onClick={() => {
          if (props.ibcData) {
            props.tx.send(
              props.amount.toString(),
              props.ibcData.userInputAddress,
              props.ibcData.selectedNetwork
            );
          } else {
            props.tx.send(props.amount.toString());
          }
        }}
        disabled={!canConfirm}
      >
        confirm
      </PrimaryButton>
    </Styled>
  );
};

interface ConfirmationRowProps {
  title: string;
  value: string;
}
const ConfirmationRow = ({ title, value }: ConfirmationRowProps) => {
  return (
    <div className="row">
      <div className="header">{title} :</div>
      <div className="value">
        <Text type="title">{value}</Text>
      </div>
    </div>
  );
};
const Styled = styled.div`
  min-height: 36rem;
  width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 0 40px;
  padding-bottom: 2rem;
  gap: 1rem;

  .expanded {
    flex-grow: 1;
  }

  .loading {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .expanded {
    flex-grow: 2;
    display: grid;
    place-items: center;
  }

  .network-change {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 100%;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
  }

  .transactions {
    background: #0b0b0b;
    border: 1px solid #2f2f2f;
    border-radius: 4px;
    width: 100%;
    padding: 1rem;
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 2rem;

      .header {
        color: #9b9b9b;
      }
    }
  }

  .locked {
    position: relative;
    margin: 2rem 0;
    .icons {
      position: absolute;
      bottom: -10px;
      left: 60px;
      border: 1px solid var(--primary-color);
      border-radius: 50px;
      background-color: #111;
      padding: 2px 4px;

      img {
        transform: translateY(3px);
      }
    }
  }
`;
export default ConfirmationModal;
