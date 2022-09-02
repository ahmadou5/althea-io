import { CantoMainnet, NodeAddresses } from "cantoui";
import { ethers } from "ethers";

export function addNetwork() {
  //@ts-ignore
  window.ethereum
    .request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x" + CantoMainnet.chainId.toString(16),
          chainName: "Canto",
          nativeCurrency: {
            name: "Canto Coin",
            symbol: "CANTO",
            decimals: 18,
          },
          rpcUrls: [NodeAddresses.CantoMainnet.ChandraRPC],
          blockExplorerUrls: [CantoMainnet.blockExplorerUrl],
        },
      ],
    })
    .catch((error: any) => {
      console.log(error);
    });
}

export async function getChainIdandAccount(): Promise<string[] | undefined[]> {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    await window.ethereum.request({ method: "eth_requestAccounts" });
    //@ts-ignore
    return [window.ethereum.networkVersion, window.ethereum.selectedAddress];
  }
  return [undefined, undefined];
}
export async function connect() {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.request({ method: "eth_requestAccounts" });
    addNetwork();
  }
}

export async function getAccountBalance(account: string | undefined) {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
    return ethers.utils.formatEther(balance);
  }
  return "0";
}

export async function getCantoAddressFromMetaMask(address: string | undefined) {
  const nodeURLMain = CantoMainnet.cosmosAPIEndpoint;
  const result = await fetch(
    nodeURLMain + "/ethermint/evm/v1/cosmos_account/" + address,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  console.log("setting canto address");
  return (await result.json()).cosmos_address;
}

export function addEthMainToWallet() {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x1",
        },
      ],
    });
  }
}
