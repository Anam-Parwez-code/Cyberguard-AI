import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url, options = {}) => {
  const { reconnect = true, reconnectDelay = 3000, onMessage = null } = options;
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  
  useEffect(() => {
    const connect = () => {
      try {
        ws.current = new WebSocket(url);
        
        ws.current.onopen = () => {
          setConnected(true);
          setError(null);
        };
        
        ws.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            setData(message);
            if (onMessage) onMessage(message);
          } catch (err) {
            console.error('WebSocket parse error:', err);
          }
        };
        
        ws.current.onclose = () => {
          setConnected(false);
          if (reconnect) {
            reconnectTimeout.current = setTimeout(connect, reconnectDelay);
          }
        };
        
        ws.current.onerror = () => {
          setError('WebSocket connection failed');
        };
      } catch (err) {
        setError(err.message);
      }
    };
    
    connect();
    
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current) ws.current.close();
    };
  }, [url, reconnect, reconnectDelay]);
  
  const send = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };
  
  return { data, connected, error, send };
};