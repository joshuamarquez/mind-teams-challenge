import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/auth/';

class AuthService {
  login(email: string, password: string) {
    return axios
      .post(API_URL + 'login', {
        email,
        password
      })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem('user', JSON.stringify({
            ...response.data.user,
            isAdmin: ['admin', 'super'].includes(response.data?.user?.role),
            access_token: response.data.access_token
          }));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(name: string, email: string, password: string, role: string) {
    return axios.post(API_URL + 'signup', {
      name,
      email,
      password,
      role,
    }, { headers: authHeader() });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
