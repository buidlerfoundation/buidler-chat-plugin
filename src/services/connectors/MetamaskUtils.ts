import api from "api";
import AppConfig from "common/AppConfig";
import { ethers, utils } from "ethers";
import { toast } from "react-hot-toast";
import MinABI from "./MinABI";

class MetamaskUtils {
  connected = false;
  init(
    onDisconnect: () => void,
    onUpdate: (data: any) => void,
    onConnected: () => void
  ) {
    if (window.ethereum?.isConnected()) {
      onConnected();
      this.metamaskListener(onDisconnect, onUpdate);
    } else {
      window.ethereum?.on("connect", () => {
        onConnected();
        this.metamaskListener(onDisconnect, onUpdate);
      });
    }
  }

  metamaskListener(onDisconnect: () => void, onUpdate: (data: any) => void) {
    window.ethereum?.on("disconnect", onDisconnect);
    window.ethereum?.on("accountsChanged", onUpdate);
    window.ethereum?.on("chainChanged", onUpdate);
  }

  async payment(price: number, fromAddress: string) {
    try {
      if (!window.ethereum?.selectedAddress) {
        await window.ethereum?.request({
          method: "eth_requestAccounts",
        });
      }
      const amount = ethers.BigNumber.from(
        `${Math.floor(
          parseFloat(`${price}`) * Math.pow(10, AppConfig.contractDecimal)
        ).toLocaleString("fullwide", { useGrouping: false })}`
      );
      const inf = new utils.Interface(MinABI);
      const transferData = inf.encodeFunctionData("transfer", [
        AppConfig.recipientAddress,
        amount.toHexString(),
      ]);
      const gasPriceRes = await api.user.getGasPrice();
      const gasPrice = ethers.BigNumber.from(
        `${gasPriceRes.data || 0}`
      ).toHexString();
      const estimateGasLimitRes = await api.user.getGasLimit({
        from: fromAddress,
        gasPrice,
        data: transferData,
        to: AppConfig.contractAddress,
      });
      const gasLimit = ethers.BigNumber.from(
        `${estimateGasLimitRes.data || 85000}`
      ).toHexString();
      const transactionParameters = {
        gasPrice,
        gas: gasLimit,
        to: AppConfig.contractAddress,
        from: fromAddress,
        value: "0x0",
        data: transferData,
      };

      const res = await window.ethereum?.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      return {
        hash: res,
        transactionParameters,
      };
    } catch (error: any) {
      toast.error(error?.message || error);
      return null;
    }
  }
}

export default new MetamaskUtils();
