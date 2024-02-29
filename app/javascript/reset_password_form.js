import * as Validates from './validates.js';
import * as Consts from './consts.js';

export function sendResetPasswordOTP() {

  let sendButton = document.getElementById('send-otp-btn')

  let emailInput = document.getElementById('reset-pw-email-input');

  let statusElement = document.getElementById('reset-pw-email-checked-status');

  if (!Validates.validateEmail(emailInput.value)) {
    statusElement.innerHTML = '有効的なメールアドレスを入力してください！';
    statusElement.style.color = 'grey'
    statusElement.style.display = 'block'
    return
  }

  sendButton.disabled = true

  fetch(Consts.API_HOST + '/auth/send-reset-pw-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: emailInput.value,  // Thay đổi giá trị tùy theo thông tin người dùng
    }),
  })
  .then(response => {

    if (response.status == 201) {
      statusElement.innerHTML = 'OTPを送信しました';
      statusElement.style.color = 'green';
      statusElement.style.display = 'block';
      emailInput.readOnly = true;
      startCountdown(sendButton);
    }
    else if (response.status == 409) {
      statusElement.innerHTML = '有効OTPは既存しています。メールでチェックしてください！';
      statusElement.style.color = 'red';
      statusElement.style.display = 'block';
      sendButton.disabled = false
    }
    else if (response.status == 401) {
      statusElement.innerHTML = 'メールは登録されていません！';
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
