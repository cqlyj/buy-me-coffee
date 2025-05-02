import {
  createWalletClient,
  custom,
  createPublicClient,
  parseEther,
  defineChain,
} from "https://esm.sh/viem";

import { contractAddress, abi } from "./constants-js.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");

let walletClient;
let publicClient;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    await walletClient.requestAddresses();
    connectButton.innerHTML = "Connected";
  } else {
    alert("Please install MetaMask to use this feature.");
  }
}

async function fund() {
  const ethAmount = ethAmountInput.value;
  console.log("Funding with amount:", ethAmount);

  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    const [connectedAccount] = await walletClient.requestAddresses();

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: abi,
      functionName: "fund",
      account: connectedAccount,
      chain: await getCurrentChain(walletClient),
      value: parseEther(ethAmount),
    });
    const hash = await walletClient.writeContract(request);
    console.log("Transaction hash:", hash);
  } else {
    alert("Please install MetaMask to use this feature.");
  }
}

async function getCurrentChain(client) {
  const chainId = await client.getChainId();
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  });
  return currentChain;
}

connectButton.onclick = connect;
fundButton.onclick = fund;
