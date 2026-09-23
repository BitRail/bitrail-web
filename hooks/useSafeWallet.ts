import { useState, useEffect } from "react";
import useWalletStore from "@/stores/WalletStore";

/**
 * Safe wallet hook — reads address from WalletStore (v8 compatible)
 */
export function useSafeWallet() {
  const { currentAddress, isConnected } = useWalletStore();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    setAddress(isConnected ? currentAddress || null : null);
  }, [currentAddress, isConnected]);

  return { address };
}
