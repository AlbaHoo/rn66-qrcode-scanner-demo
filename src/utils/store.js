// import * as jwtDecode from 'jwt-decode';
// import {get} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Store {
  isValid = async () => {
    const authToken = await this.getAuthToken();
    return !!authToken;
  };

  clearSession = async () => {
    await AsyncStorage.clear();
  };

  setAuthToken = async authToken => {
    // const payload = jwtDecode(authToken);
    // await AsyncStorage.setItem('userId', get(payload, 'user_id'));
    await AsyncStorage.setItem('authToken', authToken);
  };

  setSession = async (authToken, userId, userRole) => {
    // const payload = jwtDecode(authToken);
    await AsyncStorage.setItem('userId', userId);
    await AsyncStorage.setItem('authToken', authToken);
    await AsyncStorage.setItem('userRole', userRole);
  };

  getAuthToken = async () => {
    return await AsyncStorage.getItem('authToken');
  };

  getUserId = async () => {
    return await AsyncStorage.getItem('userId');
  };

  getUserRole = async () => {
    return await AsyncStorage.getItem('userRole');
  };

  setDevices = async (devices) => {
    await AsyncStorage.setItem('devices', JSON.stringify(devices));
  };

  getDevices = async () => {
    const jsonString = await AsyncStorage.getItem('devices');
    return JSON.parse(jsonString);
  };
}

export default new Store();
