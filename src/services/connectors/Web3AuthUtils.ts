import { Web3Auth } from "@web3auth/modal";
import api from "api";
import AppConfig from "common/AppConfig";
import { ethers, utils } from "ethers";
import { toast } from "react-hot-toast";
import MinABI from "./MinABI";

class Web3AuthUtils {
  web3auth: Web3Auth | null = null;
  provider: any = null;

  async init() {
    this.web3auth = new Web3Auth({
      clientId: process.env.NEXT_PUBLIC_WEB_3_AUTH_CLIENT_ID || "",
      chainConfig: {
        chainNamespace: "eip155",
        chainId: `0x${process.env.NEXT_PUBLIC_CHAIN_ID}`,
      },
    });
    await this.web3auth?.initModal();
  }

  async disconnect() {
    await this.web3auth?.logout();
  }

  async payment(price: number, fromAddress: string) {
    try {
      if (!this.provider || !this.web3auth) {
        await this.init();
        const web3authProvider = await this.web3auth?.connect();
        if (!web3authProvider) return;
        this.provider = new ethers.providers.Web3Provider(web3authProvider);
      }
      const signer = this.provider.getSigner();
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
        gasLimit,
        to: AppConfig.contractAddress,
        from: fromAddress,
        value: "0x0",
        data: transferData,
      };
      const res = await signer.sendTransaction(transactionParameters);
      if (!res?.hash) {
        toast.error(
          res ? JSON.stringify(res) : "Something wrong, please try again later!"
        );
        return null;
      }
      return {
        hash: res?.hash,
        transactionParameters,
      };
    } catch (error: any) {
      toast.error(error?.message || error);
      return null;
    }
  }
}

export default new Web3AuthUtils();
