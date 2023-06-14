/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }

  namespace JSX {
    interface IntrinsicElements {
      "em-emoji": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        id?: string;
        shortcodes?: string;
        native?: string;
        size?: string | number;
        fallback?: string;
        set?: "native" | "apple" | "facebook" | "google" | "twitter";
        skin?: string | number;
      };
    }
  }
}
