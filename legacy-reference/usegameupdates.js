import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const generateUniqueId = () => {
  return 'client-' + Math.random().toString(36).substring(2, 10);
};

const useGameUpdates = (roomId, onCardUpdate) => {
  useEffect(() => {
    if (!roomId || typeof onCardUpdate !== 'function') return;

    const clientId = generateUniqueId(); // <-- Store clientId for this session
    const socket = new SockJS('http://192.168.1.29:7075/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: () => {},
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('✅ Connected to WebSocket');
        console.log(`🔔 Subscribed to room: /topic/room/${roomId}`);
        console.log(`🙋 Local player ID: ${clientId}`);

        stompClient.publish({
          destination: `/app/room/${roomId}/joined`,
          body: JSON.stringify({
            type: 'JOINED',
            clientId,
            timestamp: new Date().toISOString(),
          }),
        });

        // Listen for updates from the room
        stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
          if (message.body) {
            try {
              const data = JSON.parse(message.body);

              // Check if it's a JOINED message
              if (data.type === 'JOINED') {
                console.log(`🎉 Player joined: ${data.clientId}`);
              }

              // Send update to app
              onCardUpdate(data);
            } catch (err) {
              console.error('❌ Failed to parse message body:', err);
            }
          } else {
            console.warn('⚠️ Received message with no body');
          }
        });
      },

      onStompError: (frame) => {
        console.error('💥 STOMP Error:', frame.headers['message']);
      },
    });

    stompClient.activate();

    return () => {
      console.log('🔌 Disconnecting WebSocket...');
      stompClient.deactivate();
    };
  }, [roomId, onCardUpdate]);
};

export default useGameUpdates;
