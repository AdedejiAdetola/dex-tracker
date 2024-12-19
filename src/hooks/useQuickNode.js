import { useState, useEffect } from 'react';
import { quickNodeStream } from '../services/quicknode/streams';
import { ethers } from 'ethers';

export const useQuickNode = () => {
  const [gasPrice, setGasPrice] = useState([]);
  const [tokenPairs, setTokenPairs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGasPrice = async (transaction) => {
      const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_QUICKNODE_HTTP_ENDPOINT);
      const gasPrice = await provider.getFeeData();
      const gasPriceGwei = ethers.formatUnits(gasPrice.gasPrice, 'gwei');

      console.log('p', provider)
      
      setGasPrice(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        price: parseFloat(gasPriceGwei)
      }].slice(-20));
    };

    const handleNewPair = (pairData) => {
      const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
        ['address', 'address', 'address'],
        ethers.dataSlice(pairData.data, 0)
      );

      const newPair = {
        token0: decodedData[0],
        token1: decodedData[1],
        pairAddress: decodedData[2],
        timestamp: new Date().toLocaleTimeString()
      };

      setTokenPairs(prev => [newPair, ...prev].slice(0, 5));
    };

    quickNodeStream.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    quickNodeStream.on('disconnect', () => {
      setIsConnected(false);
    });

    quickNodeStream.on('error', (err) => {
      setError(err.message);
    });

    quickNodeStream.on('data', (subscription, result) => {
      if (subscription === '1') { // Gas price subscription
        handleGasPrice(result);
      } else if (subscription === '2') { // New pair subscription
        handleNewPair(result);
      }
    });

    quickNodeStream.connect();

    return () => {
      quickNodeStream.close();
    };
  }, []);

  return {
    gasPrice,
    tokenPairs,
    isConnected,
    error
  };
};