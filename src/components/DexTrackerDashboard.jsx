import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Bell, AlertTriangle } from 'lucide-react';
import { useQuickNode } from '../hooks/useQuickNode';

const DexTrackerDashboard = () => {
  const { gasPrice, tokenPairs, isConnected, error } = useQuickNode();
  const [alerts, setAlerts] = useState([]);
  const [gasPriceThreshold, setGasPriceThreshold] = useState(50);

  useEffect(() => {
    // Check for alerts when gas price updates
    const latestGasPrice = gasPrice[gasPrice.length - 1];
    console.log('l', latestGasPrice)
    if (latestGasPrice?.price > gasPriceThreshold) {
      setAlerts(prev => [{
        type: 'gas',
        message: `Gas price above ${gasPriceThreshold} Gwei: Current ${latestGasPrice.price.toFixed(2)} Gwei`,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5));
    }
  }, [gasPrice, gasPriceThreshold]);

  if (error) {
    return (
      
        <div>Error connecting to QuickNode: {error}</div>
      
    );
  }

  if (!isConnected) {
    return (
      
        <div>Connecting to QuickNode...</div>
      
    );
  }

  console.log('is', isConnected)


  return (
    
      
    //     {/* Gas Price Chart */}
        
          
            
    //           Real-time Gas Price
              
            
          
          
            
              
              
              
              
              
            
          
        

    //     {/* New Token Pairs */}
        
          
    //         New Token Pairs
          
          
            
    //           {tokenPairs.map((pair, index) => (
                
                  
    //                 {pair.token0}/{pair.token1}
    //                 {pair.timestamp}
                  
                
    //           ))}
            
          
        
      

    //   {/* Alerts Section */}
      
        
          
            
    //         Recent Alerts
          
        
        
          
    //         {alerts.map((alert, index) => (
              
                
    //               {alert.message} - {alert.timestamp}
                
              
    //         ))}
          
        

    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gas Price Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Real-time Gas Price</span>
              <Bell className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={400} height={200} data={gasPrice}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
          </CardContent>
        </Card>

        {/* New Token Pairs */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>New Token Pairs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tokenPairs.map((pair, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">{pair.token0}/{pair.token1}</span>
                    <span className="text-gray-500">${pair.liquidityUSD.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-500">{pair.timestamp}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index}>
                <AlertDescription>
                  {alert.message} - {alert.timestamp}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
      
    
  );
};

export default DexTrackerDashboard;