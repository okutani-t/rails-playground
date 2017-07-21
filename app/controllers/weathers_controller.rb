class WeathersController < ApplicationController
  TOKYO_CODE = '130010'.freeze
  ISHIKAWA_CODE = '170010'.freeze
  OKINAWA_CODE = '471010'.freeze
  def index
    uri = URI.parse("http://weather.livedoor.com/forecast/webservice/json/v1?city=#{TOKYO_CODE}")
    json = Net::HTTP.get(uri)
    @tokyo_result = JSON.parse(json)
    uri = URI.parse("http://weather.livedoor.com/forecast/webservice/json/v1?city=#{ISHIKAWA_CODE}")
    json = Net::HTTP.get(uri)
    @ishikawa_result = JSON.parse(json)
    uri = URI.parse("http://weather.livedoor.com/forecast/webservice/json/v1?city=#{OKINAWA_CODE}")
    json = Net::HTTP.get(uri)
    @okinawa_result = JSON.parse(json)
  end
end
