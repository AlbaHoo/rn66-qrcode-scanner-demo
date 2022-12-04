import moment from 'moment';
import parseDate from './parseDate';

export default function formatDate(value: Date | string | null, format = 'MM-DD HH:mm') {
  const date = parseDate(value);
  moment.locale('zh-cn');
  return value ? moment(value).local().format(format) : '';
}

export const dateFromNow = (date) => {
  if (!date) {
    return '没有启动';
  }
  moment.locale('zh-cn');
  return moment(date).fromNow();
}
