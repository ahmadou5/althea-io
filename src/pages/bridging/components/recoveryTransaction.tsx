import styled from "@emotion/styled";
import { formatUnits } from "ethers/lib/utils";
import { PrimaryButton, Text } from "global/packages/src";
import Modal from "global/packages/src/components/molecules/Modal";
import { truncateNumber } from "global/utils/formattingNumbers";
import { useState } from "react";
import { formatAddress } from "../utils/utils";
import acronIcon from "assets/acron.svg";
import ConfirmTxModal, {
  TokenWithIcon,
} from "global/components/modals/confirmTxModal";
import rightArrow from "assets/next.svg";
import { getBridgeExtraDetails } from "./bridgeDetails";
import { ibcOutTx } from "../utils/transactions";
import { TransactionStore } from "global/stores/transactionStore";
import { CantoMainnet } from "global/config/networks";
import { MAINNET_IBC_NETWORKS } from "../config/networks.ts/cosmos";
import { IBCNetwork, RecoveryTransaction } from "../config/bridgingInterfaces";

interface Props {
  transaction: RecoveryTransaction;
  cantoAddress: string;
  txStore: TransactionStore;
}
const RecoveryTransactionBox = ({
  transaction,
  cantoAddress,
  txStore,
}: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isNetworkSelectModalOpen, setNetworkSelectModalOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<IBCNetwork>(
    transaction.defaultNetwork ?? MAINNET_IBC_NETWORKS.Cosmos_Hub
  );
  const [userInputAddress, setUserInputAddress] = useState("");
  const bridgeOutNetworks = MAINNET_IBC_NETWORKS;

  return (
    <Styled>
      <Modal
        title="confirmation"
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <ConfirmTxModal
          title={"CONFIRM"}
          titleIcon={
            <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
              {TokenWithIcon({
                icon: transaction.token.icon,
                name: transaction.token.symbol,
              })}
              <img src={rightArrow} alt="arrow" />
              {TokenWithIcon({
                icon: selectedNetwork.icon,
                name: selectedNetwork.name,
              })}
            </div>
          }
          confirmationValues={[
            { title: "from", value: formatAddress(cantoAddress, 6) },
            { title: "to", value: formatAddress(userInputAddress, 6) },
            {
              title: "amount",
              value:
                truncateNumber(
                  formatUnits(transaction.amount, transaction.token.decimals)
                ) +
                " " +
                transaction.token.symbol,
            },
          ]}
          extraInputs={[
            {
              header: "address",
              placeholder: selectedNetwork.addressBeginning + "1...",
              value: userInputAddress,
              setValue: setUserInputAddress,
            },
          ]}
          disableConfirm={!selectedNetwork.checkAddress(userInputAddress)}
          onConfirm={() => {
            ibcOutTx(
              CantoMainnet.chainId,
              txStore,
              selectedNetwork,
              userInputAddress,
              transaction.token.ibcDenom,
              transaction.amount.toString(),
              {
                symbol: `${transaction.token.symbol} to ${selectedNetwork.name}`,
                amount: formatUnits(
                  transaction.amount,
                  transaction.token.decimals
                ),
              }
            );
          }}
          extraDetails={getBridgeExtraDetails(
            false,
            true,
            formatAddress(cantoAddress, 6),
            selectedNetwork.name
          )}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      </Modal>
      <div
        className="dual-item"
        style={{
          width: "120%",
        }}
      >
        <Text size="text3" align="left">
          origin
        </Text>
        <Text type="title" align="left">
          {transaction.origin}
        </Text>
      </div>

      <div className="dual-item">
        <Text size="text3" align="left">
          amount
        </Text>
        <Text type="title" align="left">
          {transaction.amount + " " + transaction.symbol}
        </Text>
      </div>

      <div className="dual-item">
        <PrimaryButton
          height="normal"
          weight="bold"
          filled
          onClick={() => setModalOpen(true)}
        >
          recover
        </PrimaryButton>
      </div>

      <div
        className="dual-item"
        style={{
          width: "120%",
        }}
      >
        <div className="channel-path">
          <Text size="text3" type="title" align="left">
            channel path :
          </Text>
          {transaction.channelPath.map((path, index) => (
            <>
              {index != 0 && <img src={acronIcon} alt="separator" />}
              <Text size="text3" type="title" align="left" key={index}>
                {path}
              </Text>
            </>
          ))}
        </div>
      </div>

      <div className="dual-item">
        <Text size="text3" align="left">
          channel id
        </Text>
        <Text type="title" align="left">
          {selectedNetwork.channelFromCanto.replace("channel-", "")}
          {/* 5 */}
        </Text>
      </div>
      <div
        role="button"
        tabIndex={0}
        className="network-select"
        onClick={() => setNetworkSelectModalOpen(true)}
      >
        <Text type="title" size="text4" align="left">
          {selectedNetwork.name}
          <Modal
            title="select network"
            open={isNetworkSelectModalOpen}
            onClose={() => {
              setNetworkSelectModalOpen(false);
            }}
          >
            <ChooseNetwork>
              <div className="network-list">
                {Object.entries(bridgeOutNetworks).map(([key, network]) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={key}
                    className="network-item"
                    onClick={() => {
                      setNetworkSelectModalOpen(false);
                      setSelectedNetwork(network);
                    }}
                    style={{
                      background:
                        selectedNetwork.chainId === network.chainId
                          ? "#1d1d1d"
                          : "",
                    }}
                  >
                    <span>
                      <img src={network.icon} />
                      <Text>{network.name}</Text>
                    </span>
                  </div>
                ))}
              </div>
            </ChooseNetwork>
          </Modal>
        </Text>
        <img src={acronIcon} className="separator" alt="separator" />
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1.5fr 1fr 0.8fr;
  grid-template-rows: 1fr 1fr;
  padding: 16px;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  background-color: #010101;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  gap: 1rem;
  .channel-path {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;
    gap: 10px;
    height: 42px;
    background: #111111;
    border: 1px solid #242424;
    border-radius: 4px;
    width: fit-content;
  }

  .network-select {
    display: flex;
    align-items: center;
    background: #111111;
    border: 1px solid #242424;
    border-radius: 4px;
    padding: 8px 16px;
    padding-right: 24px;
    height: 42px;
    p {
      width: 100%;
    }
    .separator {
      transform: rotateZ(90deg);
      padding-bottom: 20px;
    }

    &:hover {
      background: #181818;
      cursor: pointer;
    }
  }

  .row {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }
  .dual-item {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .dual-item:last-child {
    max-width: 6rem;
  }
`;
export const ChooseNetwork = styled.div`
  width: 30rem;
  height: 34rem;
  overflow-y: auto;
  padding: 0 2rem;
  .network-list {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    .network-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      border-radius: 4px;

      padding: 0 14px;
      cursor: pointer;
      img {
        margin: 6px;
        height: 30px;
        width: 30px;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

export default RecoveryTransactionBox;
