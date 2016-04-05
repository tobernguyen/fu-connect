import $ from 'jquery';

export const NETWORK_STATUS = {
  CHECKING: -1,
  NETWORK_PROBLEM: 0,
  FU_NETWORK_NOT_LOGGED_IN: 1,
  FU_NETWORK_CONNECTING: 2,
  FU_NETWORK_LOGIN_FAILED: 3,
  INTERNET_READY: 4
};

export function checkNetworkStatus(onUp, onDown) {
  var dfd = $.Deferred();

  $.ajax({
    url: `http://210.245.14.84/robots.txt?_=${(new Date()).getTime()}`,
    timeout: 3000
  }).then((data) => {
    if (~data.indexOf('User-agent:')) {
      onUp();
    } else if (~data.indexOf('FPT Telecom')) {
      onDown(NETWORK_STATUS.FU_NETWORK_NOT_LOGGED_IN);
    }
  }, (data) => {
    onDown(NETWORK_STATUS.NETWORK_PROBLEM);
  });

  return dfd.promise();
}
