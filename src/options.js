import $ from 'jquery';

var username, password;
var $usernameInput = $('#login-form > .username'),
    $passwordInput = $('#login-form > .password');

chrome.storage.sync.get(["username", "password"], function(items){
  username = items.username;
  password = items.password;
  $usernameInput.val(username);
  $passwordInput.val(password);
});

$('#login-form').on('submit', (e) => {
  e.preventDefault();
  let username = $usernameInput.val();
  let password = $passwordInput.val();
  chrome.storage.sync.set({ "username": username, "password": password }, function(items){
      console.log('Account information saved');
  });
});
