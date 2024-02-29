require 'net/http'
require 'json'

class APIService

  class_attribute :host, :port

  self.host = 'localhost'
  self.port = 3000

  def self.perform_request(request)
    http = Net::HTTP.new(self.host, self.port)
    #http.use_ssl = (self.host.scheme == 'https')

    response = http.request(request)
  end

  def self.get(path, params = {}, headers = {})
    path += "?" + params.to_query if params.present?

    request = Net::HTTP::Get.new(path)

    headers.each { |key, value| request.add_field(key.to_s, value) }

    perform_request(request)
  end

  def self.post(path, params = {}, headers = {})
    request = Net::HTTP::Post.new(path, 'Content-Type' => 'application/json')

    headers.each { |key, value| request.add_field(key.to_s, value) }

    request.body = params.to_json

    perform_request(request)
  end
end
