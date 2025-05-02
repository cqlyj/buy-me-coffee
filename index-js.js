import { createWalletClient, custom } from "https://esm.sh/viem";

const connectButton = document.getElementById("connectButton");

let walletClient;

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

connectButton.onclick = connect;
