import styled from "@emotion/styled";
import { formatUnits } from "ethers/lib/utils";
import { CantoTransactionType } from "global/config/transactionTypes";
import { PrimaryButton, Text } from "global/packages/src";
import Modal from "global/packages/src/components/molecules/Modal";
import { CantoMainnet } from "global/providers";
import { getShortTxStatusFromState, truncateNumber } from "global/utils/utils";
import { useEffect, useState } from "react";
import { ALL_BRIDGE_OUT_NETWORKS } from "../config/bridgeOutNetworks";
import { BridgeOutNetworks, NativeTransaction } from "../config/interfaces";
import { BridgeTransaction } from "../hooks/useBridgingTransactions";
import { convertSecondsToString, toastBridgeTx } from "../utils/utils";
import ConfirmationModal from "./modals/confirmationModal";

interface Props {
  transaction: NativeTransaction;
  txFactory: () => BridgeTransaction;
  cantoAddress: string;
  ethAddress: string;
}
const MiniTransaction = (props: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const txStats = props.txFactory();
  const isIBCTransfer = txStats.txType == CantoTransactionType.IBC_OUT;
  //just for ibc out
  const [userInputAddress, setUserInputAddress] = useState("");
  const tokenNetworks: BridgeOutNetworks[] =
    props.transaction.token.supportedOutChannels;
  const [selectedNetwork, setSelectedNetwork] = useState(
    ALL_BRIDGE_OUT_NETWORKS[tokenNetworks ? tokenNetworks[0] : 0]
  );

  useEffect(() => {
    toastBridgeTx(txStats.state, txStats.txName);
  }, [txStats.state]);

  return (
    <Styled>
      <Modal
        title="confirmation"
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <ConfirmationModal
          amount={props.transaction.amount}
          token={props.transaction.token}
          tx={txStats}
          from={{
            chain: "canto bridge",
            address: props.cantoAddress,
            chainId: CantoMainnet.chainId,
          }}
          to={{
            chain: isIBCTransfer ? selectedNetwork.name : "canto",
            address: isIBCTransfer ? userInputAddress : props.ethAddress,
          }}
          onClose={() => {
            setModalOpen(false);
          }}
          ibcData={
            isIBCTransfer
              ? {
                  userInputAddress,
                  setUserInputAddress,
                  selectedNetwork,
                  setSelectedNetwork,
                }
              : undefined
          }
        />
      </Modal>

      <div
        className="dual-item"
        style={{
          width: "120%",
        }}
      >
        <Text size="text3" align="left">
          {isIBCTransfer ? "destination" : "origin"}
        </Text>
        <Text type="title" align="left">
          {props.transaction.origin}
        </Text>
      </div>

      <div className="dual-item">
        <Text size="text3" align="left">
          amount
        </Text>
        <Text type="title" align="left">
          {truncateNumber(
            formatUnits(
              props.transaction.amount,
              props.transaction.token.decimals
            ),
            2
          )}
          {" " + props.transaction.token.symbol}
        </Text>
      </div>
      {props.transaction.timeLeft != "0" && (
        <div className="dual-item">
          <Text size="text3" align="left">
            time left
          </Text>
          <Text type="title" align="left" size="text2">
            {convertSecondsToString(props.transaction.timeLeft)}
          </Text>
        </div>
      )}
      {props.transaction.timeLeft == "0" && (
        <div className="dual-item">
          <PrimaryButton
            style={{
              maxWidth: "7rem",
            }}
            height="normal"
            disabled={props.transaction.timeLeft !== "0"}
            weight="bold"
            filled
            onClick={() => {
              if (txStats.state == "Exception" || txStats.state == "Fail")
                txStats.resetState();
              setModalOpen(true);
            }}
          >
            {getShortTxStatusFromState(txStats.state)}
          </PrimaryButton>
        </div>
      )}
    </Styled>
  );
};

const Styled = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;
  background-color: #010101;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;

  .dual-item {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .dual-item:last-child {
    max-width: 6rem;
  }
`;

export default MiniTransaction;
