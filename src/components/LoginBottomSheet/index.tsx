import { Stack } from "@mui/material";
import LogoX from "components/SVGs/LogoX";
import React, { memo, useEffect, useState } from "react";
import styles from "./index.module.scss";

type LoginBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConnectWalletClick: () => void;
};

const LoginBottomSheet = ({
  open,
  onClose,
  onConnectWalletClick,
}: LoginBottomSheetProps) => {
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    if (window.location.pathname !== "/panel") {
      if (open) {
        setClosed(false);
      } else {
        setTimeout(() => {
          setClosed(true);
        }, 290);
      }
    }
  }, [open]);
  if (closed) return null;
  return (
    <>
      <div
        className={`cursor-pointer ${styles["overlay"]} ${
          open ? styles["overlay-on"] : styles["overlay-off"]
        }`}
        onClick={onClose}
      />
      <div
        className={`${styles.container} ${open ? styles.open : styles.close}`}
      >
        <LogoX />
        <span className="text-xl font-bold text-primary mt-10">
          Login to continue
        </span>
        <span className="font-medium text-secondary mt-5">
          Connect with your available wallet or create new wallet to join our
          community
        </span>
        <Stack
          alignItems="center"
          justifyContent="center"
          style={{
            borderRadius: 5,
            backgroundColor: "var(--color-blue)",
            marginTop: 40,
          }}
          height={45}
          width="100%"
          className="cursor-pointer"
          onClick={onConnectWalletClick}
        >
          <span className="font-semibold text-white">Connect Wallet</span>
        </Stack>
      </div>
    </>
  );
};

export default memo(LoginBottomSheet);
