import { Web3Auth } from "@web3auth/modal";

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
}

export default new Web3AuthUtils();
