"use client";

import { useEffect, useState } from "react";
import useWalletStore from "@/stores/WalletStore";
import type { User } from "@/lib/db/schema";

/**
 * Stacks Wallet Authentication Hook (@stacks/connect v8 compatible)
 * Reads wallet state from WalletStore — no getLocalStorage needed.
 */
export function useWalletAuth() {
  const { currentAddress, isConnected: storeConnected } = useWalletStore();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const address = storeConnected ? currentAddress || null : null;

  useEffect(() => {
    if (!address) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const authenticateUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to authenticate user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    authenticateUser();
  }, [address]);

  return { user, isConnected: !!address, isLoading, address };
}
