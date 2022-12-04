import React, { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  NativeModules,
  Text,
  View,
  Alert,
  StyleSheet,
} from 'react-native';
import {Button, InputItem} from '@ant-design/react-native';
import {API_ORIGIN, Theme} from '_src/constants';
import store from '_src/utils/store';
import formatErrors from '_src/utils/formatErrors';

import Logger from '_src/logger';
const logger = new Logger('LoginPage');

const checkStatus = async response => {
  logger.info(response);
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = await response.json();
    throw error;
  }
};

const styles = StyleSheet.create({
  LoginPage: {
    backgroundColor: Theme.pGreen,
    width: '100%',
  },
  portrait: {
    height: '100%',
    marginLeft: 0,
    marginRight: 0,
    padding: 10,
    paddingTop: 50,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
  },
  landscape: {
    height: '100%',
    marginLeft: '20%',
    marginRight: '20%',
    padding: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  form: {
    width: '100%',
  },
  landingText: {
    paddingBottom: 50,
    fontSize: 50,
    color: Theme.pGreen,
    fontWeight: 'bold'
  },
  loginBtn: {
    marginTop: 20,
    width: '100%',
    // textAlign: 'center',
    backgroundColor: Theme.pGreen,
  },
});

export default function LoginPage() {
  // const { height, width } = useWindowDimensions();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const isPortrait = height > width;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    return fetch(`${API_ORIGIN}/api/v1/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          attributes: {
            email: email,
            password: password,
          },
        },
      }),
    })
  };

  const handleLogin = async () => {
    // const digest = btoa(`email/${email}:${password}`);
    const parseJSON = response => response.json();

    // 'Authorization': `Basic ${digest}`,
    setLoading(true);
    try {
      const res = await login();
      const checkedStatus = await checkStatus(res);
      const data = await parseJSON(checkedStatus);

      const authToken = data.data.attributes.auth_token;
      const userId = data.data.attributes.user_id;
      const userRole = data.data.attributes.role;
      NativeModules.MPush.bindAccount(userId, function(message) {
        logger.info(message);
      });
      // cache authToken and userId
      await store.setSession(authToken, userId, userRole);
      if (userRole === 'tester') {
      } else if (userRole === 'mobile') {
      }
    } catch (error) {
      const errors = error?.response?.errors;
      const message = errors
        ? formatErrors(errors)
        : '无法连接到服务器, 请联系管理员';
      Alert.alert('错误', message);
    }
    setLoading(false);
  };

  const renderContent = () => {
    return (
      <View style={styles.LoginPage}>
        <View style={isPortrait ? styles.portrait : styles.landscape}>
          <View style={styles.form}>
            <Text style={styles.landingText}>欢迎登陆</Text>
            <InputItem
              clear
              disabled={loading}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="请输入邮箱">
              邮箱
            </InputItem>

            <InputItem
              clear
              disabled={loading}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="请输入密码">
              密码
            </InputItem>
            <Button
              style={styles.loginBtn}
              loading={loading}
              onPress={handleLogin}>
              <Text style={{color: '#fff'}}>登陆</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={"height"}
      keyboardVerticalOffset={20}
      enabled={true}>
      {renderContent()}
    </KeyboardAvoidingView>
  );
}

