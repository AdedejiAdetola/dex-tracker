import { QUICKNODE_CONFIG } from './config';
import { ethers } from 'ethers';

class QuickNodeStream {
  constructor() {
    this.ws = null;
    this.callbacks = new Map();
    this.isConnected = false;
  }

  connect() {
    const wsUrl = `${QUICKNODE_CONFIG.WSS_ENDPOINT}?apikey=${QUICKNODE_CONFIG.API_KEY}`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      this.isConnected = true;
      this.subscribeToEvents();
      if (this.callbacks.has('connect')) {
        this.callbacks.get('connect')();
      }
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.params?.subscription) {
        this.handleSubscriptionData(data.params);
      }
    };

    this.ws.onerror = (error) => {
      if (this.callbacks.has('error')) {
        this.callbacks.get('error')(error);
      }
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      if (this.callbacks.has('disconnect')) {
        this.callbacks.get('disconnect')();
      }
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribeToEvents() {
    // Subscribe to gas prices
    this.sendSubscription({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_subscribe',
      params: ['newPendingTransactions']
    });

    // Subscribe to new pairs
    this.sendSubscription({
      jsonrpc: '2.0',
      id: 2,
      method: 'eth_subscribe',
      params: [
        'logs',
        {
          address: QUICKNODE_CONFIG.UNISWAP_V2_FACTORY,
          topics: [QUICKNODE_CONFIG.PAIR_CREATED_TOPIC]
        }
      ]
    });
  }

  sendSubscription(subscription) {
    if (this.isConnected) {
      this.ws.send(JSON.stringify(subscription));
    }
  }

  handleSubscriptionData(data) {
    const { subscription, result } = data;
    
    if (this.callbacks.has('data')) {
      this.callbacks.get('data')(subscription, result);
    }
  }

  on(event, callback) {
    this.callbacks.set(event, callback);
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const quickNodeStream = new QuickNodeStream();