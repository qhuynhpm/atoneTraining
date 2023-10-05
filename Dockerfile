# Sử dụng ảnh Ruby chính thức
FROM ruby:3.2.2 AS rails-poker

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép Gemfile và Gemfile.lock vào thư mục làm việc
COPY Gemfile Gemfile.lock ./

# Cài đặt các gem
RUN bundle install

# Sao chép tất cả tệp vào thư mục làm việc
COPY . .

ENV RAILS_ENV=production

# Expose cổng 3000 để ứng dụng Rails có thể lắng nghe
EXPOSE 3000

# Chạy lệnh Rails server khi container khởi động
CMD ["rails", "server", "-b", "0.0.0.0"]
