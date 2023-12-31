import {
  CantoTransactionType,
  CosmosTx,
  ExtraProps,
} from "global/config/interfaces/transactionTypes";
import {
  txClaimRewards,
  txRedelegate,
  txStake,
  txUnstake,
} from "./transactionHelpers";
import { Chain, Fee } from "global/config/cosmosConstants";
import {
  MasterValidatorProps,
  StakingTransactionType,
} from "../config/interfaces";
import {
  getCosmosAPIEndpoint,
  getCosmosChainObj,
} from "global/utils/getAddressUtils";
import { claimRewardFee, delegateFee, unbondingFee } from "../config/fees";
import { formatUnits } from "ethers/lib/utils";
import { TxMethod, TransactionStore } from "global/stores/transactionStore";

interface GeneralStakingParams {
  account: string;
  chainId?: number;
  amount: string;
  newOperator?: {
    address: string;
    name: string;
  };
  operator: {
    address: string;
    name: string;
  };
}
export async function stakingTx(
  txStore: TransactionStore,
  txType: StakingTransactionType,
  params: GeneralStakingParams
): Promise<boolean> {
  if (!params.account) {
    txStore.setStatus({ error: "No account found" });
    return false;
  }
  if (!params.chainId) {
    txStore.setStatus({ error: "No chainId found" });
    return false;
  }
  const readableAmount = formatUnits(params.amount, 18);
  const isRedelegate = txType === StakingTransactionType.REDELEGATE;
  return await txStore.addTransactionList(
    [
      isRedelegate
        ? _redelegateTx(
            params.chainId,
            params.account,
            params.operator.address,
            params.newOperator?.address ?? "",
            params.amount,
            getCosmosAPIEndpoint(params.chainId),
            unbondingFee,
            getCosmosChainObj(params.chainId),
            "",
            {
              amount: readableAmount,
              symbol: `from ${params.operator?.name} to ${params.newOperator?.name}`,
            }
          )
        : _delegateTx(
            params.chainId,
            txType === StakingTransactionType.DELEGATE,
            params.account,
            params.operator.address,
            params.amount,
            getCosmosAPIEndpoint(params.chainId),
            delegateFee,
            getCosmosChainObj(params.chainId),
            "",
            {
              amount: readableAmount,
              symbol: params.operator.name,
            }
          ),
    ],
    {
      title: txType,
      txListMethod: TxMethod.COSMOS,
      chainId: params.chainId,
    }
  );
}
export async function claimStakingRewards(
  txStore: TransactionStore,
  chainId: number | undefined,
  account: string,
  userValidators: MasterValidatorProps[]
): Promise<boolean> {
  if (!account) {
    txStore.setStatus({ error: "No account found" });
    return false;
  }
  if (!chainId) {
    txStore.setStatus({ error: "No chainId found" });
    return false;
  }
  return await txStore.addTransactionList(
    [
      {
        chainId,
        txType: CantoTransactionType.CLAIM_REWARDS_STAKING,
        tx: txClaimRewards,
        params: [
          account,
          getCosmosAPIEndpoint(chainId),
          claimRewardFee,
          getCosmosChainObj(chainId),
          "",
          userValidators,
        ],
      },
    ],
    {
      title: "Claim Staking Rewards",
      txListMethod: TxMethod.COSMOS,
      chainId,
    }
  );
}
/**
 * TRANSACTION CREATORS
 * WILL NOT CHECK FOR VALIDITY OF PARAMS, MUST DO THIS BEFORE USING THESE CONSTRUCTORS
 */

//is staking will tell us if this is a delegate or undelegate
const _delegateTx = (
  chainId: number | undefined,
  isStaking: boolean,
  account: string,
  operatorAddress: string,
  amount: string,
  endpoint: string,
  fee: Fee,
  chain: Chain,
  memo: string,
  extraDetails?: ExtraProps
): CosmosTx => ({
  chainId,
  txType: isStaking
    ? CantoTransactionType.DELEGATE
    : CantoTransactionType.UNDELEGATE,
  tx: isStaking ? txStake : txUnstake,
  params: [account, operatorAddress, amount, endpoint, fee, chain, memo],
  extraDetails,
});
const _redelegateTx = (
  chainId: number | undefined,
  account: string,
  fromOperatorAddress: string,
  toOperatorAddress: string,
  amount: string,
  endpoint: string,
  fee: Fee,
  chain: Chain,
  memo: string,
  extraDetails?: ExtraProps
): CosmosTx => ({
  chainId,
  txType: CantoTransactionType.REDELEGATE,
  tx: txRedelegate,
  params: [
    account,
    amount,
    endpoint,
    fee,
    chain,
    memo,
    fromOperatorAddress,
    toOperatorAddress,
  ],
  extraDetails,
});
