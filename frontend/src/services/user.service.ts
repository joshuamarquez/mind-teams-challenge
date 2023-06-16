import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL);
  }

  getUsers() {
    return axios.get(API_URL + 'users', { headers: authHeader() });
  }

  getUsersFromAccount(accountId: number) {
    return axios.get(API_URL + `account/${accountId}/users`, { headers: authHeader() });
  }

  getLogs(params?: Object) {
    return axios.get(API_URL + 'logs', { headers: authHeader(), params });
  }

  getAccounts() {
    return axios.get(API_URL + 'account', { headers: authHeader() });
  }

  getAccount(accountId: number) {
    return axios.get(API_URL + `account/${accountId}`, { headers: authHeader() });
  }

  createAccount(name: string) {
    return axios.post(API_URL + 'account', { name }, { headers: authHeader() });
  }

  addToAccount(userId: number, accountId: number) {
    return axios.post(API_URL + `users/${userId}/addToAccount/${accountId}`, {}, { headers: authHeader() });
  }

  getProfile() {
    return axios.get(API_URL + 'auth/profile', { headers: authHeader() })
  }
}

export default new UserService();
