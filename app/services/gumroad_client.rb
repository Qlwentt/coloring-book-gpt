class GumroadClient

  def is_license_valid(key)
    uri = URI('https://api.gumroad.com/v2/licenses/verify')
    request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
    request.body = { product_id: "oa1PhPaH0KlDYkAaGJMH-w==", license_key: key }.to_json
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(request)
    end
    body = JSON.parse(response.body)
    return body.dig("success") && body.dig("uses") == 1 
  end
end