import { BigNumber } from "ethers";
import { getPairsForChainId } from "./pairs";
import { Token } from "global/config/interfaces/tokens";

export interface PAIR {
  address: string;
  cLPaddress: string;
  token1: Token;
  token2: Token;
  decimals: number;
  cDecimals: number;
  stable: boolean;
}
export interface LPPairInfo {
  basePairInfo: PAIR;
  totalSupply: {
    totalLP: BigNumber;
    tvl: BigNumber;
    token1: BigNumber;
    token2: BigNumber;
    //ratio uses bignumber division, so we have to know what the ratio is since could be 0 if dividing the wrong way
    ratio: {
      //if true, ratio is a/b otherwise it is b/a
      aTob: boolean;
      ratio: BigNumber;
    };
  };
  prices: {
    //prices are in terms of Note for 1 unit of token (scaled by decimals)
    token1: BigNumber;
    token2: BigNumber;
    LP: BigNumber;
  };
}

export interface UserLPPairInfo extends LPPairInfo {
  userSupply: {
    totalLP: BigNumber;
    token1: BigNumber;
    token2: BigNumber;
    percentOwned: number;
  };
  balances: {
    token1: BigNumber;
    token2: BigNumber;
  };

  allowance: {
    token1: BigNumber;
    token2: BigNumber;
    LPtoken: BigNumber;
  };
}

export const EmptyUserLPPairInfo = {
  userSupply: {
    totalLP: BigNumber.from(0),
    token1: BigNumber.from(0),
    token2: BigNumber.from(0),
    percentOwned: 0,
  },
  balances: {
    token1: BigNumber.from(0),
    token2: BigNumber.from(0),
  },
  allowance: {
    token1: BigNumber.from(0),
    token2: BigNumber.from(0),
    LPtoken: BigNumber.from(0),
  },
};
export const EmptySelectedLPToken = {
  basePairInfo: getPairsForChainId()[0],
  totalSupply: {
    totalLP: BigNumber.from(0),
    tvl: BigNumber.from(0),
    token1: BigNumber.from(0),
    token2: BigNumber.from(0),
    //ratio uses bignumber division, so we have to know what the ratio is since could be 0 if dividing the wrong way
    ratio: {
      //if true, ratio is a/b otherwise it is b/a
      aTob: true,
      ratio: BigNumber.from(0),
    },
  },
  prices: {
    //prices are in terms of Note for 1 unit of token (scaled by decimals)
    token1: BigNumber.from(0),
    token2: BigNumber.from(0),
    LP: BigNumber.from(0),
  },
  ...EmptyUserLPPairInfo,
};

export enum LPTransaction {
  ADD_LIQUIDITY = "Add Liquidity",
  REMOVE_LIQUIDITY = "Remove Liquidity",
  STAKE = "Stake",
  ADD_LIQUIDITY_AND_STAKE = "Add Liquidity and Stake",
  REMOVE_LIQUIDITY_AND_UNSTAKE = "Remove Liquidity and Unstake",
}
