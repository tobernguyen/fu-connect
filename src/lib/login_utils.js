import $ from 'jquery';

const LOGIN_PAGE_TEXT = "FPT Telecom";

export const FAIL_PATTERN = {
  WRONG_PASSWORD: "Khong dung mat khau",
  ACCOUNT_NOT_AVAILABLE: "Tai khoan khong ton tai",
  PC_LIMIT: "vuot qua gioi han",
  ACCOUNT_EXPIRED: "het han",
  TRY_AGAIN_IN_20_SEC: "Quy khach vui long thu lai sau 20s",
  UNKNOWN: "unknown",
}

const getFailReason = function(response) {
  if (~response.indexOf(FAIL_PATTERN.WRONG_PASSWORD)) {
    return FAIL_PATTERN.WRONG_PASSWORD;
  } else if (~response.indexOf(FAIL_PATTERN.ACCOUNT_NOT_AVAILABLE)) {
    return FAIL_PATTERN.ACCOUNT_NOT_AVAILABLE;
  } else if (~response.indexOf(FAIL_PATTERN.PC_LIMIT)) {
    return FAIL_PATTERN.PC_LIMIT;
  } else if (~response.indexOf(FAIL_PATTERN.ACCOUNT_EXPIRED)) {
    return FAIL_PATTERN.ACCOUNT_EXPIRED;
  } else if (~response.indexOf(FAIL_PATTERN.TRY_AGAIN_IN_20_SEC)) {
    return FAIL_PATTERN.TRY_AGAIN_IN_20_SEC;
  } else {
    return FAIL_PATTERN.UNKNOWN;
  }
}

export function LoginWithInfo(username, password) {
  var dfd = $.Deferred();

  $.ajax({
    url: "http://210.245.14.84/"
  }).then((data) => {
    var loginPage = data;
    var regex = /(<form[^]*<\/form>)/;
    var formInString = loginPage.match(regex)[1];
    var $loginForm = $("<div/>").html(formInString).contents();
    $loginForm.find("input[name='auth_user']").val(username);
    $loginForm.find("input[name='auth_pass']").val(password);
    $loginForm.find("input[name='redirurl']").val("https://www.google.com/")
    return $.post( "http://192.168.100.2:8000/", $loginForm.serialize()+"&accept=.");
  }).then((data, textStatus, request) => {
    if (~data.indexOf(LOGIN_PAGE_TEXT)) {
      var failReason = getFailReason(data);
      console.log("Login Failed");
      console.log("Fail reason: %s", failReason);
      return dfd.reject(failReason);
    } else {
      console.log("Login Success");
      return dfd.resolve("Login Success");
    }
  }, (data, textStatus, request) => {
    return dfd.reject(data);
  });

  return dfd.promise();
}
