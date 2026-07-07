import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/network`
  : 'http://localhost:8080/api/network';

export const getNodeStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/status`);
  return response.data;
};

export const triggerHandshake = async () => {
  const response = await axios.post(`${API_BASE_URL}/handshake`);
  return response.data;
};

export const getHandshakeLogs = async () => {
  const response = await axios.get(`${API_BASE_URL}/logs`);
  return response.data;
};

export const corruptNode = async (nodeId) => {
  const response = await axios.post(`${API_BASE_URL}/corrupt/${nodeId}`);
  return response.data;
};

export const restoreNode = async (nodeId) => {
  const response = await axios.post(`${API_BASE_URL}/restore/${nodeId}`);
  return response.data;
};
export const loginUser = async (username, password) => {
  const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/login`, {
    username,
    password,
  });
  return response.data;
};

export const registerUser = async (username, password) => {
  const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/register`, {
    username,
    password,
  });
  return response.data;
};