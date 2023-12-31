import styled from "@emotion/styled";
import LendingSwitch from "./lendingSwitch";
import { noteSymbol } from "global/config/tokenInfo";
import React from "react";
import { formatLiquidity } from "global/utils/formattingNumbers";
import cantoIcon from "assets/logo.svg";
import Popup from "reactjs-popup";
import { ToolTipL } from "./Styled";
import { Text } from "global/packages/src";

interface BorrowingProps {
  borrowing: boolean;
  assetName: string;
  assetIcon: string;
  apy: string;
  amount: string;
  amountInNote: string;
  symbol?: string;
  liquidity: number;
  onClick: () => void;
  sortableProps?: unknown[];
}
interface SupplyProps {
  supplying: boolean;
  assetName: string;
  assetIcon: string;
  apy: string;
  distAPY: string;
  symbol?: string;
  collateral?: boolean;
  amount: string;
  amountInNote: string;
  onToggle: (state: boolean) => void;
  onClick?: () => void;
  collaterable: boolean;
  rewards?: string;
  sortableProps?: unknown[];
}

interface TransactionProps {
  name: string;
  icon: string;
  status: string;
  onClick?: () => void;
  date: Date;
}

interface ItemProps {
  top: string;
  bottom: string;
}

const DualRow = ({ top, bottom }: ItemProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        lineHeight: "1.5rem",
      }}
    >
      <p>{top}</p>
      <p
        style={{
          opacity: 0.5,
        }}
      >
        {bottom}
      </p>
    </div>
  );
};

const BorrowRow = (props: BorrowingProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img src={props.assetIcon} alt="" /> <span>{props.assetName}</span>
      </td>
      <td>{props.apy + " %"}</td>
      {props.borrowing ? (
        <React.Fragment>
          <td>
            <DualRow
              top={props.amount}
              bottom={noteSymbol + props.amountInNote}
            ></DualRow>
          </td>
          <td>{props.liquidity.toFixed(0) + " %"}</td>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <td>{props.amount}</td>
          {props.assetName == "NOTE" ? (
            <td>
              {" "}
              <Popup
                trigger={<span>N/A</span>}
                position="bottom center"
                on={["hover", "focus"]}
                arrow={true}
                arrowStyle={{
                  color: "rgba(217, 217, 217, 0.25)",
                  backdropFilter: "blur(35px)",
                }}
              >
                <ToolTipL>
                  <Text type="text" size="text4">
                    this asset cannot
                    <br /> be collateralised
                  </Text>
                </ToolTipL>
              </Popup>
            </td>
          ) : (
            // <ToolTip as={"td"} data-tooltip="Note Liquidity Is Infinite">

            // </ToolTip>
            <td>
              {noteSymbol}
              {formatLiquidity(props.liquidity)}
            </td>
          )}
        </React.Fragment>
      )}
    </tr>
  );
};

const SupplyRow = (props: SupplyProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img
          style={{
            padding: props.assetName.slice(-2) == "LP" ? "0" : "0 10px",
          }}
          src={props.assetIcon}
          alt=""
        />{" "}
        <span>{props.assetName}</span>
      </td>
      <td>
        <DualRow top={props.apy + " %"} bottom={props.distAPY + "%"}></DualRow>
      </td>
      {props.supplying ? (
        <>
          <td>
            {Number(props.rewards).toFixed(2)}{" "}
            <img
              src={cantoIcon}
              alt="canto"
              style={{ height: "14px", paddingTop: "3px" }}
            />
          </td>
          <td>
            <DualRow
              top={props.amount}
              bottom={noteSymbol + props.amountInNote}
            ></DualRow>
          </td>
        </>
      ) : (
        <td>{props.amount}</td>
      )}

      <td>
        {
          <LendingSwitch
            checked={props.collateral ?? false}
            disabled={!props.collaterable}
            onChange={() => {
              props.onToggle(!props.collateral);
            }}
          />
        }
      </td>
    </tr>
  );
};

const TransactionRow = (props: TransactionProps) => {
  return (
    <tr onClick={props.onClick}>
      <td>
        <img src={props.icon} /> <span>{props.name}</span>
      </td>
      <td>{props.status}</td>
      <td>{props.date.toDateString()}</td>
    </tr>
  );
};

const LoadingRow = styled.td`
  display: table-cell !important;
  text-transform: lowercase !important;
  text-align: center !important;
`;

export { SupplyRow, BorrowRow, TransactionRow, LoadingRow };
