export const DEVICE_NAMES = {
  N1: { name: 'Smart Camera', icon: '📷' },
  N2: { name: 'Door Lock', icon: '🔒' },
  N3: { name: 'Temp Sensor', icon: '🌡️' },
  N4: { name: 'Network Router', icon: '📡' },
  N5: { name: 'Security Alarm', icon: '🚨' },
};

export const getDeviceName = (nodeId) => {
  return DEVICE_NAMES[nodeId]?.name || nodeId;
};

export const getDeviceIcon = (nodeId) => {
  return DEVICE_NAMES[nodeId]?.icon || '📦';
};