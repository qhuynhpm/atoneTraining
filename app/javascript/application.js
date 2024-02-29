// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import * as bootstrap from "bootstrap"
import * as ResetPasswordForm from './reset_password_form.js';
import * as VerifyEmail from './verify_email_form.js';
import * as Follow from './follow.js';
import jquery from "jquery";

window.jQuery = jquery;

window.$ = jquery;


window.sendResetPasswordOTP = function() {
  ResetPasswordForm.sendResetPasswordOTP();
};

window.sendVerifyEmailOTP = function() {
  VerifyEmail.sendVerifyEmailOTP();
};

window.addEventListener('load', function() {
  if (window.location.pathname == '/verify-email') {
    sendVerifyEmailOTP();
  }
});


document.addEventListener('turbo:load', function() {
  // Xử lý sự kiện khi người dùng nhập từ khoá
  $('#search-input').on('input', function() {
    var keyword = $(this).val();

    // Gọi API tìm kiếm với từ khoá
    $.ajax({
      url: 'http://localhost:3000/user/search?keyword=' + keyword,  // Thay thế đường dẫn API thực tế của bạn
      method: 'GET',
      headers: { 'Authorization': VerifyEmail.getAuthToken().replace('+', ' ') },
      success: function(data) {
        // Hiển thị kết quả trong dropdown
        displaySearchResults(data["users"]);
      },
      error: function(error) {
        console.error('Lỗi khi gọi API tìm kiếm:', error);
      }
    });
  });

  // Hiển thị kết quả tìm kiếm trong dropdown
  function displaySearchResults(results) {
    var resultsContainer = $('#search-results');
    resultsContainer.empty();

    // Xử lý dữ liệu kết quả và thêm vào dropdown
    results.forEach(function(result) {
      var resultItem = $('<div class="result-item"></div>');
      resultItem.text(result.display_name);  // Thay thế 'name' bằng trường dữ liệu phù hợp từ kết quả API

      // Xử lý sự kiện khi một kết quả được chọn
      resultItem.click(function() {
        // Thực hiện hành động khi một kết quả được chọn (ví dụ: chuyển hướng đến trang chi tiết)
        window.location.href = '/profile?id=' + result.id;  // Thay thế 'id' bằng trường dữ liệu phù hợp từ kết quả API
      });

      resultsContainer.append(resultItem);
    });

    // Hiển thị dropdown
    resultsContainer.show();
  }

  // Ẩn dropdown khi click ra khỏi ô tìm kiếm
  $(document).on('click', function(event) {
    if (!$(event.target).closest('#search-form').length) {
      $('#search-results').hide();
    }
  });
});



