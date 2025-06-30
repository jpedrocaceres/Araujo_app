import * as SecureStore from 'expo-secure-store';

// Chaves para armazenamento seguro
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export interface User {
  id: string;
  email: string;
  name: string;
  // Adicione outros campos conforme necessário
}

export const AuthService = {
  // Salvar token de autenticação
  async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
      throw error;
    }
  },

  // Obter token de autenticação
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  },

  // Salvar dados do usuário
  async saveUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      throw error;
    }
  },

  // Obter dados do usuário
  async getUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  },

  // Limpar dados de autenticação (logout)
  async clearAuth(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Erro ao limpar dados de autenticação:', error);
      throw error;
    }
  },

  // Verificar se o usuário está autenticado
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}; 