## Wallet folder
The wallet folder for this module handles networking switching using the MetaMask provider. The user will be prompted by the MetaMask extension or application to switch networks if they are not on the currently configured one. 

The configured network can be modified in the WalletStore found in the stores folder. Here, the current network is set to 'Rinkeby' but these values can be changed according to the application's needs.
```ts
getEthereumChainParameters = () => {
        return {
            chainId: '0x4', // A 0x-prefixed hexadecimal string
            chainName: 'Rinkeby',
            nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH', // 2-6 characters long
                decimals: 18,
            },
            rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
        };
    };
```

## Automated Chain Switching
To improve user experience, automatic **adding** and **switching** of custom blockchain networks is used. 

The code that handles the adding and switching of networks is done in `/wallet/handleNetworkSwtich.ts`, by calling the `handleNetworkSwitch()` function.

### **Network Switching Flow**
When initiated, the current network the user is connected to on Metamask is checked. If it differs from set network parameters, the user is shown a **popup** requesting the user to switch chains.

If however, the network has not been added by the user before, the user will instead be first prompted to **add** the custom network specified, before another popup requesting the user to switch.

The user can choose to reject the requests at any time, which will result in them not being able to interact with the dApps.

```javascript
// Network switching psuedo-code
async function handleNetworkSwitch() {
    try {
        // Try to switch network first
        switchNetwork();
    } catch (err) {
        // Network to switch to does not exist
        addNetwork();
    }
}
```

### **Implementation**
Network switching on Metamask is done via the `wallet_switchEthereumChain` and `wallet_addEthereumChain` methods. 

- SwitchEthereumChain documentation: [Link](https://docs.metamask.io/guide/rpc-api.html#usage-with-wallet-switchethereumchain)
- AddEthereumChain documentation: [Link](https://docs.metamask.io/guide/rpc-api.html#wallet-addethereumchain)

_Example Usage_
```javascript
// Prompt user to switch Ethereum chain
await metamaskProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [ethereumChainParameters],
        });

// Prompt user to add Ethereum chain
await metamaskProvider.request({
            method: 'wallet_addEthereumChain',
            params: [ethereumChainParameters],
        });
```

The `ethereumChainParameters` defines the network settings of the custom blockchain network to be added.

```javascript
interface EthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[]; 
}
```
| Variable      | Description |
| ----------- | ----------- |
| chainId      | Chain ID of the blockchain network. **Must** be in **hexadecimal** string form. **Cannot collide** with default Metamask chain IDs _(e.g Mainnet, Rinkeby etc)_       |
| chainName      | The name of the network that will be displayed on the user's metamask when added       |
| nativeCurrency      | **name** - Name of currency; **symbol** - Symbol that will be displayed next to currency balance; **decimals** - Number of decimals a single token can be divided into. 18 is the default as 1 ETH = 10^18 Wei       |
| rpcUrls      | Blockchain network URL to connect to. **Must** be secured **HTTPS** url for adding/switching networks on Metamask Mobile       |
| blockExplorerUrls      | Unused in our implementation as Epirus Blockchain Explorer is used       |

Network information is set in `walletStore` under `getEthereumChainParameters()` function.

### **Deviation From Metamask Documentation**
In the official Metamask documentation, it is recommended to only start the `wallet_addEthereumChain` request when catching an error with `error.code === 4902`, as a user initated **rejection** throws a `error.code` of `4001`. 

While this is ideal, the **mobile** version of Metamask **does not throw** the same error codes. As such, if the checking of error codes was used, the adding and switching of ethereum chains will **not work** on mobile Metamask.

_This issue still exists as of 20 October 2021_

---
