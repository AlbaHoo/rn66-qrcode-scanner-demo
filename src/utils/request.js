import store from '_src/utils/store';
import {API_ORIGIN} from '_src/constants';
import {Actions} from 'react-native-router-flux';
import Logger from '_src/logger';
const logger = new Logger('request');

const checkStatus = async response => {
  if (response.status === 204) {
    return response;
  } else if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else if (response.status === 401) {
    // const error = new Error("错误401");
    // error.response = await response.json();
    // throw error;
    store.clearSession().then(() => {
      logger.info('401');
      Actions.reset('login');
    });
  } else {
    const error = new Error(`错误${response.status}`);
    error.response = await response.json();
    throw error;
  }
};

async function request({url, path, method, body}) {
  const authToken = await store.getAuthToken();

  const formattedUrl = url || `${API_ORIGIN}${path}`;
  logger.info(formattedUrl);
  const res = await fetch(formattedUrl, {
    method,
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body,
  });

  const data = await checkStatus(res);
  return {
    data,
    attributes: data?.data?.attributes,
    collection: data?.data,
    included: data?.included,
    id: data?.data?.id,
    meta: data?.meta,
  };
}

export default request;
