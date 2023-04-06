import styled from "@emotion/styled";
import { PrimaryButton, Text } from "global/packages/src";
import { ALL_BRIDGE_OUT_NETWORKS } from "pages/bridging/config/bridgeOutNetworks";
import { NativeToken } from "pages/bridging/config/interfaces";
import { copyAddress, formatAddress } from "pages/bridging/utils/utils";
import CopyToClipboard from "react-copy-to-clipboard";
import CopyIcon from "assets/copy.svg";
import { ReactNode, useState } from "react";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { coin, SigningStargateClient, GasPrice } from "@cosmjs/stargate";
import { getBlockTimestamp } from "pages/bridging/utils/IBC/IBCTransfer";
import { CInput } from "global/packages/src/components/atoms/Input";
import { TransactionState } from "@usedapp/core";
import { CantoMainnet } from "global/config/networks";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";
import { truncateNumber } from "global/utils/utils";
import { formatUnits, parseUnits } from "ethers/lib/utils";

interface IBCGuideModalProps {
  token: NativeToken;
  cantoAddress: string;
}
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {
    ethereum: import("ethers").providers.ExternalProvider;
  }
}

const IBCGuideModal = (props: IBCGuideModalProps) => {
  const [userKeplrAddress, setUserKeplrAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [keplrClient, setKeplrClient] = useState<SigningStargateClient>();
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState<TransactionState>("None");
  const network = ALL_BRIDGE_OUT_NETWORKS[props.token.supportedOutChannels[0]];

  async function setKeplrAddressAndBalance() {
    if (!window.keplr) {
      //show user link to download keplr
      console.error("no keplr installed");
    } else {
      await window.keplr.enable(network.chainId);
      const offlineSinger = window.keplr.getOfflineSigner(network.chainId);
      const accounts = await offlineSinger.getAccounts();
      setUserKeplrAddress(accounts[0].address);
      const client = await SigningStargateClient.connectWithSigner(
        network.rpcEndpoint,
        offlineSinger,
        {
          gasPrice: GasPrice.fromString("300000" + network.nativeDenom),
        }
      );
      setKeplrClient(client);
      const balance = await client.getBalance(
        accounts[0].address,
        props.token.nativeName
      );
      setBalance(balance.amount);
    }
  }
  async function createIBCMsg() {
    const blockTimestamp = await getBlockTimestamp(
      CantoMainnet.cosmosAPIEndpoint
    );
    setTxStatus("PendingSignature");
    try {
      //if injective or emvos, we cannot use stargate client
      if (network.chainId === "evmos_9001-2" && window.keplr) {
        // await newEvmosIBC();
        // const tx = await sign(
        //   network.restEndpoint,
        //   keplrClient,
        //   window.keplr.getOfflineSigner(network.chainId),
        //   network.chainId,
        //   userKeplrAddress,
        //   network.networkChannel,
        //   coin(amount, props.token.nativeName),
        //   props.cantoAddress,
        //   Number(blockTimestamp),
        //   network.nativeDenom
        // );
        // const mode = "block" as BroadcastMode;
        // const response = window.keplr?.sendTx(network.chainId, tx, mode);
      } else if (network.chainId === "injective-1" && window.keplr) {
        // ibcInjective(userKeplrAddress);
        // injectiveIBC(
        //   window.keplr.getOfflineSigner(network.chainId),
        //   network.networkChannel,
        //   coin(amount, props.token.nativeName),
        //   userKeplrAddress,
        //   props.cantoAddress,
        //   Number(blockTimestamp)
        // );
      } else {
        const ibcResponse = await keplrClient?.sendIbcTokens(
          userKeplrAddress,
          props.cantoAddress,
          coin(
            parseUnits(amount, props.token.decimals).toString(),
            props.token.nativeName
          ),
          "transfer",
          network.networkChannel,
          undefined,
          Number(blockTimestamp),
          "auto",
          "ibc transfer" //memo
        );
        if (ibcResponse?.code === 0) {
          setTxStatus("Success");
        } else {
          setTxStatus("Fail");
        }
      }
    } catch (error) {
      console.error(error);
      setTxStatus("Fail");
    }
  }

  return (
    <Styled>
      {txStatus != "None" && (
        <GlobalLoadingModal
          onClose={() => {
            null;
          }}
          transactionType={CantoTransactionType.IBC_IN}
          status={txStatus}
        />
      )}
      <div>
        <img height={50} src={props.token.icon} alt={props.token.name} />
        <Text type="title" size="title3">
          {props.token.name}
        </Text>
      </div>
      <div className="values">
        <ConfirmationRow
          title="network"
          value={<Text type="title">{network.name} </Text>}
        />
        <ConfirmationRow
          title="channel"
          value={<Text type="title">{network.networkChannel} </Text>}
        />
        <ConfirmationRow
          title="balance"
          value={
            <Text type="title">
              {userKeplrAddress.length > 10
                ? truncateNumber(formatUnits(balance, props.token.decimals), 6)
                : "..."}
            </Text>
          }
        />

        <ConfirmationRow
          title="from"
          value={
            <CopyToClipboard text={userKeplrAddress} onCopy={copyAddress}>
              <Text type="title" style={{ cursor: "pointer" }}>
                {formatAddress(userKeplrAddress, 6)}
                <img
                  src={CopyIcon}
                  style={{
                    height: "18px",
                    position: "relative",
                    top: "5px",
                    left: "4px",
                  }}
                />
              </Text>
            </CopyToClipboard>
          }
        />
        <ConfirmationRow
          title="to"
          value={
            <CopyToClipboard text={props.cantoAddress} onCopy={copyAddress}>
              <Text type="title" style={{ cursor: "pointer" }}>
                {formatAddress(props.cantoAddress, 6)}
                <img
                  src={CopyIcon}
                  style={{
                    height: "18px",
                    position: "relative",
                    top: "5px",
                    left: "4px",
                  }}
                />
              </Text>
            </CopyToClipboard>
          }
        />
      </div>
      <Text size="text3" align="left" color="primaryDark">
        To bridge &quot;{props.token.name}&quot; from the &quot;{network.name}{" "}
        network&quot; into &quot;canto network&quot;. You need to do an IBC
        transfer, learn more about the{" "}
        <a
          role="button"
          tabIndex={0}
          onClick={() =>
            window.open(
              "https://docs.canto.io/user-guides/bridging-assets/to-canto#from-cosmos-hub-or-other-ibc-enabled-chain",
              "_blank"
            )
          }
          style={{
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          IBC process
        </a>
      </Text>
      <div className="expand"></div>
      <div className="amount">
        <CInput
          style={{
            backgroundColor: "transparent",
            width: "100%",
            height: "54px",
          }}
          placeholder={`amount :  ${truncateNumber(
            formatUnits(balance, props.token.decimals),
            6
          )} `}
          value={amount}
          onChange={(val) => {
            setAmount(val.target.value);
          }}
        />
        <button
          className="maxBtn"
          onClick={() => {
            setAmount(
              truncateNumber(formatUnits(balance, props.token.decimals), 6)
            );
          }}
        >
          <Text>max</Text>
        </button>
      </div>
      {/* <div className="header">amount :</div>
      <div className="value">
        <CInput
          style={{
            border: "1px solid #282828",
            backgroundColor: "transparent",
            width: "16rem",
          }}
          placeholder={"0"}
          value={amount}
          onChange={(val) => {
            setAmount(val.target.value);
          }}
        />
      </div> */}
      {/* {"balance: " + balance} */}
      {
        //if keplr plugin exists
        window.keplr ? (
          //if we have keplr address
          userKeplrAddress.length > 10 ? (
            <PrimaryButton
              disabled={
                Number(amount) <= 0 ||
                Number(amount) >
                  Number(formatUnits(balance, props.token.decimals))
              }
              onClick={createIBCMsg}
              filled
              height="big"
              weight="bold"
            >
              {Number(amount) <= 0
                ? "Enter Amount "
                : Number(amount) >
                  Number(formatUnits(balance, props.token.decimals))
                ? "Amount Exceeds Max"
                : "IBC IN"}
            </PrimaryButton>
          ) : (
            //if keplr address doesn't exist, connect and retrive it
            <PrimaryButton
              onClick={setKeplrAddressAndBalance}
              filled
              height="big"
              weight="bold"
            >
              Connect to keplr
            </PrimaryButton>
          )
        ) : (
          //if keplr wallet doesn't exist
          <PrimaryButton
            filled
            height="big"
            weight="bold"
            onClick={() => {
              window.open("https://www.keplr.app/download", "_blank");
            }}
          >
            Install keplr
          </PrimaryButton>
        )
      }
    </Styled>
  );
};
interface ConfirmationRowProps {
  title: string;
  value: ReactNode;
}
const ConfirmationRow = ({ title, value }: ConfirmationRowProps) => {
  return (
    <div className="row">
      <div className="header">{title} :</div>
      <div className="value">{value}</div>
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
  text-align: center;

  .expand {
    flex-grow: 2;
  }
  .amount {
    height: 58px;
    background: #060606;
    border: 1px solid #2e2d2d;
    border-radius: 4px;
    display: flex;
    align-items: center;
    min-width: 18rem;
    width: 100%;
  }

  .maxBtn {
    height: 100%;
    width: 7rem;
    margin-left: 3px;
    background-color: #252525;

    border: none;
    &:hover {
      background-color: #333;
      cursor: pointer;
      p {
        color: white;
      }
    }

    p {
      color: #999;
    }
  }
  .values {
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
`;
export default IBCGuideModal;
