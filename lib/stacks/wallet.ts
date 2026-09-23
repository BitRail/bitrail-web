import { connect, disconnect, isConnected } from '@stacks/connect';
import { getCurrentNetwork, type NetworkType } from './config';

export interface WalletConfig {
  appName?: string;
  appIcon?: string;
  network?: NetworkType;
}

export interface WalletConnectionResult {
  userAddress: string;
  mainnetAddress: string;
  testnetAddress: string;
  network: string;
}

export const connectWallet = async (config: WalletConfig = {}): Promise<WalletConnectionResult> => {
  const networkType = config.network || getCurrentNetwork();

  // connect() shows the multi-wallet selection modal (Xverse, Leather, etc.)
  const response = await connect({
    appDetails: {
      name: config.appName || 'Lava',
      icon: config.appIcon || '/icon.png',
    },
  });

  if (!response?.addresses?.length) {
    throw new Error('No addresses returned from wallet');
  }

  let mainnetAddress = '';
  let testnetAddress = '';

  response.addresses.forEach((a: any) => {
    if (a.address?.startsWith('SP')) mainnetAddress = a.address;
    if (a.address?.startsWith('ST')) testnetAddress = a.address;
  });

  const userAddress = networkType === 'mainnet'
    ? (mainnetAddress || testnetAddress)
    : (testnetAddress || mainnetAddress);

  if (!userAddress) {
    throw new Error('No compatible Stacks address found in wallet');
  }

  return { userAddress, mainnetAddress, testnetAddress, network: networkType };
};

export const checkConnection = (): boolean => {
  try {
    return isConnected();
  } catch {
    return false;
  }
};

export const disconnectWallet = (): void => {
  disconnect();
};
