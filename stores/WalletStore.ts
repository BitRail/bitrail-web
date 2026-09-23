import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { connect, disconnect, isConnected } from '@stacks/connect';
import { getCurrentNetwork, type NetworkType } from '@/lib/stacks/config';
import { fetchBlockHeight } from '@/lib/stacks/blockheight';

// Define the types for the store's state and actions
interface AddressData {
  address: string;
  publicKey?: string;
  symbol?: string;
}

interface UserData {
  profile: {
    stxAddress: {
      mainnet: string;
      testnet: string;
    };
    btcAddress: {
      [key: string]: string;
    };
    addresses?: AddressData[];
    [key: string]: any;
  };
  [key: string]: any;
}

interface WalletStoreState {
  userData: UserData | null;
  network: NetworkType;
  isConnected: boolean;
  publicKey: string;
  currentAddress: string;
  blockHeight: number;
  balance: {
    sbtc: number;
    stx: number;
  };
}

interface WalletStoreActions {
  setUserData: (userData: UserData | null) => void;
  setNetwork: (network: NetworkType) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  handleNetworkChange: (network: NetworkType) => void;
  fetchBalance: (address: string) => Promise<void>;
  fetchBlockHeight: () => Promise<void>;
  setCurrentAddress: (address: string) => void;
}

type WalletStore = WalletStoreState & WalletStoreActions;

const useWalletStore = create(
  persist<WalletStore>(
    (set, get) => ({
      // Initial state
      userData: null,
      network: getCurrentNetwork(),
      isConnected: false,
      publicKey: '',
      currentAddress: '',
      blockHeight: 0,
      balance: {
        sbtc: 0,
        stx: 0
      },

      // Actions
      setUserData: (userData) => set({ userData, isConnected: !!userData }),
      
      setNetwork: (network) => set({ network }),
      
      setCurrentAddress: (address) => set({ currentAddress: address }),

      connectWallet: async () => {
        try {
          const networkType = get().network;

          // connect() shows the wallet selection modal (Xverse, Leather, etc.)
          const response = await connect({
            appDetails: {
              name: 'Lava',
              icon: typeof window !== 'undefined' ? window.location.origin + '/icon.png' : '/icon.png',
            },
          });

          if (!response?.addresses || response.addresses.length === 0) {
            throw new Error('No addresses returned from wallet');
          }

          let mainnetAddress = '';
          let testnetAddress = '';

          response.addresses.forEach((a: any) => {
            if (a.address?.startsWith('SP')) mainnetAddress = a.address;
            if (a.address?.startsWith('ST')) testnetAddress = a.address;
          });

          // Network mismatch checks
          if (networkType === 'testnet' && mainnetAddress && !testnetAddress) {
            alert('⚠️ Mainnet wallet detected. Please connect a testnet wallet (address starts with "ST").');
            throw new Error('Mainnet wallet not supported on testnet');
          }
          if (networkType === 'mainnet' && testnetAddress && !mainnetAddress) {
            alert('⚠️ Testnet wallet detected. Please connect a mainnet wallet (address starts with "SP").');
            throw new Error('Testnet wallet not supported on mainnet');
          }

          const currentAddress = networkType === 'testnet'
            ? (testnetAddress || mainnetAddress)
            : (mainnetAddress || testnetAddress);

          if (!currentAddress) {
            throw new Error('No compatible Stacks address found in wallet');
          }

          const newUserData: UserData = {
            profile: {
              stxAddress: { mainnet: mainnetAddress, testnet: testnetAddress },
              btcAddress: {},
              addresses: response.addresses,
            },
          };

          set({
            userData: newUserData,
            isConnected: true,
            currentAddress,
            publicKey: response.addresses[0]?.publicKey || '',
          });

          get().fetchBalance(currentAddress);

        } catch (error) {
          console.error('Error connecting wallet:', error);
          throw error;
        }
      },

      disconnectWallet: () => {
        disconnect();
        set({ 
          userData: null, 
          isConnected: false, 
          currentAddress: '',
          publicKey: '',
          balance: { sbtc: 0, stx: 0 }
        });
      },

      handleNetworkChange: (network) => {
        const userData = get().userData;
        set({ network });
        
        if (userData) {
          // Update current address based on new network
          const mainnetAddress = userData.profile.stxAddress.mainnet;
          const testnetAddress = userData.profile.stxAddress.testnet;
          
          // Check for network mismatch only when user has ONLY the wrong network address
          if (network === 'testnet' && mainnetAddress && !testnetAddress) {
            console.log('Network change: Disconnecting mainnet-only wallet on testnet');
            alert(
              '⚠️ Mainnet Wallet Detected!\n\n' +
              'You switched to testnet but your connected wallet only has a mainnet address (starts with "SP").\n\n' +
              'Please disconnect and reconnect with a testnet wallet (address starts with "ST").'
            );
            
            get().disconnectWallet();
            return;
          }
          
          if (network === 'mainnet' && testnetAddress && !mainnetAddress) {
            console.log('Network change: Disconnecting testnet-only wallet on mainnet');
            alert(
              '⚠️ Testnet Wallet Detected!\n\n' +
              'You switched to mainnet but your connected wallet only has a testnet address (starts with "ST").\n\n' +
              'Please disconnect and reconnect with a mainnet wallet (address starts with "SP").'
            );
            
            get().disconnectWallet();
            return;
          }
          
          const newAddress = network === 'mainnet' 
            ? mainnetAddress 
            : testnetAddress;
          
          set({ currentAddress: newAddress });
          
          // Fetch balance for new network
          if (newAddress) {
            get().fetchBalance(newAddress);
          }
        }
      },

      fetchBalance: async (address) => {
        if (!address) return;
        
        try {
          const network = get().network;
          
          // Fetch STX balance from Stacks API
          const stxApiUrl = network === 'mainnet'
            ? 'https://api.stacks.co'
            : 'https://api.testnet.stacks.co';
          
          const stxResponse = await fetch(`${stxApiUrl}/extended/v1/address/${address}/balances`);
          let stxBalance = 0;
          
          if (stxResponse.ok) {
            const stxData = await stxResponse.json();
            stxBalance = parseInt(stxData.stx?.balance || '0') / 1_000_000;
          }
          
          // Fetch sBTC balance from our API (which uses Hiro API)
          const sbtcResponse = await fetch(`/api/v1/public/balance/${address}`);
          let sbtcBalance = 0;
          
          if (sbtcResponse.ok) {
            const sbtcData = await sbtcResponse.json();
            sbtcBalance = sbtcData.sbtc_amount || 0;
          }
          
          set({ 
            balance: { 
              stx: stxBalance, 
              sbtc: sbtcBalance 
            } 
          });
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      },

      fetchBlockHeight: async () => {
        try {
          const network = get().network;
          const blockHeight = await fetchBlockHeight(network);
          set({ blockHeight });
        } catch (error) {
          console.error('Error fetching block height:', error);
        }
      }
    }),
    {
      name: 'wallet-storage'
    }
  )
);

export default useWalletStore;