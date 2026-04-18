import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

let socket = null;

/**
 * Get or create the Socket.io connection.
 */
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('🔌 Connected to Socket.io server:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from Socket.io:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('⚠️ Socket.io connection error:', err.message);
    });
  }
  return socket;
}

/**
 * Listen for HOTSPOT_ALERT events.
 * @param {Function} callback - Called with { category, count, timestamp, message }
 * @returns {Function} unsubscribe function
 */
export function onHotspotAlert(callback) {
  const s = getSocket();
  s.on('HOTSPOT_ALERT', callback);
  return () => s.off('HOTSPOT_ALERT', callback);
}

/**
 * Listen for NEW_COMPLAINT events.
 * @param {Function} callback - Called with { complaint, mlCategory, mlConfidence, timestamp }
 * @returns {Function} unsubscribe function
 */
export function onNewComplaint(callback) {
  const s = getSocket();
  s.on('NEW_COMPLAINT', callback);
  return () => s.off('NEW_COMPLAINT', callback);
}

/**
 * Listen for COMPLAINT_UPDATED events.
 * @param {Function} callback - Called with { complaint, timestamp }
 * @returns {Function} unsubscribe function
 */
export function onComplaintUpdated(callback) {
  const s = getSocket();
  s.on('COMPLAINT_UPDATED', callback);
  return () => s.off('COMPLAINT_UPDATED', callback);
}

/**
 * Disconnect the socket.
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
