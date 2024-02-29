import * as Validates from './validates.js';
import * as Consts from './consts.js';

export function sendVerifyEmailOTP() {

  let sendButton = document.getElementById('send-verify-email-otp-btn')

  let statusElement = document.getElementById('otp-send-status');

  sendButton.disabled = true

  fetch(Consts.API_HOST + '/auth/verify/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthToken().replace('+', ' ')
    }
  })
  .then(response => {

    if (response.status == 201) {
      statusElement.innerHTML = 'OTPを再送信しました';
      statusElement.style.color = 'green';
      statusElement.style.display = 'block';
      startCountdown(sendButton);
    }
    else if (response.status == 409) {
      statusElement.innerHTML = '有効OTPは既存しています。メールでチェックしてください！';
      statusElement.style.color = 'red';
      statusElement.style.display = 'block';
      sendButton.disabled = false
    }
    else {
      statusElement.innerHTML = 'OTP送信が失敗でした。再度試してください！';
      statusElement.style.color = 'red';
      statusElement.style.display = 'block';
      sendButton.disabled = false
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Đã xảy ra lỗi khi gửi OTP');
  });
};

export function getAuthToken() {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'nppoker_auth_token') {
      return value;
    }
  }
  return null;
}

function startCountdown(btn) {
  var myButton = btn;
  var countdownTime = 120;

  myButton.innerHTML = formatTime(countdownTime);

  var countdownInterval = setInterval(function() {
    countdownTime--;

    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
      myButton.innerHTML = 'OTPを送信する';
      myButton.disabled = false;
    } else {
      myButton.innerHTML = formatTime(countdownTime);
    }
  }, 1000);
}

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
