class TopController < ApplicationController
  def index
    tokyo_code = '130010'
    uri = URI.parse("http://weather.livedoor.com/forecast/webservice/json/v1?city=#{tokyo_code}")
    json = Net::HTTP.get(uri)
    @tokyo_result = JSON.parse(json)

    ishikawa_code = '170010'
    uri = URI.parse("http://weather.livedoor.com/forecast/webservice/json/v1?city=#{ishikawa_code}")
    json = Net::HTTP.get(uri)
    @ishikawa_result = JSON.parse(json)

    okinawa_code = '471010'
    uri = URI.parse("http://weather.livedoor.com/forecast/webservice/json/v1?city=#{okinawa_code}")
    json = Net::HTTP.get(uri)
    @okinawa_result = JSON.parse(json)
  end
end
