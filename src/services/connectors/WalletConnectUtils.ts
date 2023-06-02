import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import api from "api";
import AppConfig from "common/AppConfig";
import { ethers, utils } from "ethers";
import { toast } from "react-hot-toast";
import MinABI from "./MinABI";

class WalletConnectUtils {
  connector: WalletConnect | null = null;

  init(onDisconnect: () => void) {
    return new Promise((resolve) => {
      this.connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org", // Required
        qrcodeModal: QRCodeModal,
      });
      if (this.connector.connected) {
        this.connector.on("disconnect", onDisconnect);
        return resolve(true);
      } else {
        return resolve(false);
      }
    });
  }

  async connect(onConnect: () => void, onDisconnect: () => void) {
    this.connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });
    if (this.connector.connected) {
      await this.connector.killSession();
      this.connector.on("disconnect", onDisconnect);
      this.connector.on("connect", onConnect);
      // create new session
      this.connector.createSession();
    } else {
      this.connector.on("disconnect", onDisconnect);
      this.connector.on("connect", onConnect);
      // create new session
      this.connector.createSession();
    }
  }

  disconnect() {
    if (this.connector?.connected) {
      this.connector.killSession();
    }
  }

  async payment(price: number, fromAddress: string) {
    if (!this.connector) {
      const success = await this.init(() => {});
      if (!success) {
        toast.error("Can not connect to your wallet!");
        return null;
      }
    }
    try {
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
      const customRequest = {
        id: 1337,
        jsonrpc: "2.0",
        method: "eth_sendTransaction",
        params: [transactionParameters],
      };
      const res = await this.connector?.sendCustomRequest(customRequest);
      const hash = res?.hash || res;
      if (!hash) {
        toast.error(
          res ? JSON.stringify(res) : "Something wrong, please try again later!"
        );
        return null;
      }
      return {
        hash: res?.hash || res,
        transactionParameters,
      };
    } catch (error: any) {
      toast.error(error?.message || error);
      return null;
    }
  }
}

export default new WalletConnectUtils();
