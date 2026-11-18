#!/usr/bin/env ruby --disable-gems
# encoding: utf-8
# ==============================================================================
# BI DATA CLEANING & HUMAN-IN-THE-LOOP AI AGENT SYSTEM - LOCALHOST SERVER
# Chuyên viên BI: Hệ thống Xử lý, Làm sạch, Kiểm duyệt & Phân tích Dữ liệu
# ==============================================================================

require 'webrick'
require 'json'
require 'csv'
require 'net/http'
require 'uri'
require 'openssl'
require 'time'

PORT = (ENV['PORT'] || 8080).to_i
ROOT_DIR = File.expand_path(File.dirname(__FILE__))
STATIC_DIR = File.join(ROOT_DIR, 'static')
DATA_DIR = File.join(ROOT_DIR, 'data')
STATE_FILE = File.join(DATA_DIR, 'pipeline_state.json')

# Ensure UTF-8 default encoding
Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8

server = WEBrick::HTTPServer.new(
  Port: PORT,
  BindAddress: '127.0.0.1',
  AccessLog: [[File.open(File::NULL, 'w'), WEBrick::AccessLog::COMMON_LOG_FORMAT]],
  Logger: WEBrick::Log.new($stdout, WEBrick::Log::INFO)
)

MIME_TYPES = {
  '.html' => 'text/html; charset=utf-8',
  '.css'  => 'text/css; charset=utf-8',
  '.js'   => 'application/javascript; charset=utf-8',
  '.json' => 'application/json; charset=utf-8',
  '.csv'  => 'text/csv; charset=utf-8',
  '.svg'  => 'image/svg+xml',
  '.png'  => 'image/png',
  '.jpg'  => 'image/jpeg',
  '.ico'  => 'image/x-icon'
}

# Serve static files using in-memory string body to avoid macOS sendfile EPERM
server.mount_proc '/' do |req, res|
  req_path = req.path == '/' ? '/index.html' : req.path
  safe_rel = File.expand_path('.' + req_path, '/')
  full_path = File.join(STATIC_DIR, safe_rel)

  if File.exist?(full_path) && !File.directory?(full_path)
    ext = File.extname(full_path).downcase
    res.status = 200
    res['Content-Type'] = MIME_TYPES[ext] || 'application/octet-stream'
    res['Cache-Control'] = 'no-cache'
    res.body = File.binread(full_path)
  else
    res.status = 404
    res['Content-Type'] = 'text/plain; charset=utf-8'
    res.body = '404 Not Found'
  end
end

def json_response(res, data, status = 200)
  res.status = status
  res['Content-Type'] = 'application/json; charset=utf-8'
  res['Access-Control-Allow-Origin'] = '*'
  res.body = JSON.generate(data)
end

# API: Health check & Server Info
server.mount_proc '/api/health' do |req, res|
  json_response(res, {
    status: 'ok',
    role: 'BI Specialist & AI Data Cleaning Agent',
    timestamp: Time.now.iso8601,
    port: PORT
  })
end

# API: Get Sample Datasets
server.mount_proc '/api/samples' do |req, res|
  samples = {
    'retail' => {
      id: 'retail',
      name: 'Bán lẻ & TMĐT (Retail Sales)',
      description: '32 bản ghi đơn hàng có lỗi trùng mã đơn, thiếu tên/email/chiết khấu, sai ngày tháng, tiền tệ lẫn chữ, số lượng âm & giá ngoại lai.',
      domain: 'E-Commerce / Retail BI',
      filename: 'sample_retail_dirty.csv',
      path: File.join(DATA_DIR, 'sample_retail_dirty.csv')
    },
    'hr' => {
      id: 'hr',
      name: 'Nhân sự & Lương thưởng (HR & Payroll)',
      description: '16 bản ghi nhân sự có lỗi trùng mã NV, phòng ban không đồng nhất (IT/cntt/Công nghệ thông tin), lương âm, điểm KPI vượt thang 100.',
      domain: 'HR Analytics / People BI',
      filename: 'sample_hr_dirty.csv',
      path: File.join(DATA_DIR, 'sample_hr_dirty.csv')
    },
    'marketing' => {
      id: 'marketing',
      name: 'Chiến dịch Marketing Đa kênh (Marketing ROI)',
      description: '13 chiến dịch quảng cáo có lỗi tên kênh (FB/fb_ads/Facebook Ads), chi phí âm, doanh thu ngoại lai 999 triệu, ngày không hợp lệ.',
      domain: 'Marketing Performance BI',
      filename: 'sample_marketing_dirty.csv',
      path: File.join(DATA_DIR, 'sample_marketing_dirty.csv')
    }
  }

  sample_id = req.query['id']
  if sample_id && samples[sample_id]
    info = samples[sample_id]
    csv_text = File.read(info[:path], encoding: 'UTF-8')
    json_response(res, info.merge(csv: csv_text))
  else
    list = samples.values.map do |s|
      csv_text = File.exist?(s[:path]) ? File.read(s[:path], encoding: 'UTF-8') : ''
      s.merge(csv: csv_text)
    end
    json_response(res, { samples: list })
  end
end

# API: Save / Load Audit Trail & Pipeline State
server.mount_proc '/api/audit' do |req, res|
  if req.request_method == 'POST'
    begin
      payload = JSON.parse(req.body.force_encoding('UTF-8'))
      existing = File.exist?(STATE_FILE) ? JSON.parse(File.read(STATE_FILE, encoding: 'UTF-8')) : { 'logs' => [] }
      existing['logs'] ||= []
      existing['logs'].unshift(payload.merge('server_time' => Time.now.strftime('%Y-%m-%d %H:%M:%S')))
      existing['logs'] = existing['logs'].first(100)
      File.write(STATE_FILE, JSON.pretty_generate(existing), encoding: 'UTF-8')
      json_response(res, { ok: true, logs: existing['logs'] })
    rescue => e
      json_response(res, { ok: false, error: e.message }, 400)
    end
  else
    existing = File.exist?(STATE_FILE) ? JSON.parse(File.read(STATE_FILE, encoding: 'UTF-8')) : { 'logs' => [] }
    json_response(res, existing)
  end
end

# API: AI Agent Proxy (Supports Gemini API & OpenAI API)
server.mount_proc '/api/ai' do |req, res|
  if req.request_method != 'POST'
    json_response(res, { error: 'Method not allowed' }, 405)
    next
  end

  begin
    body = JSON.parse(req.body.force_encoding('UTF-8'))
    provider = body['provider'] || 'gemini'
    api_key = (body['apiKey'] || ENV['GEMINI_API_KEY'] || ENV['OPENAI_API_KEY'] || '').strip
    prompt = body['prompt'] || ''
    system_instruction = body['systemInstruction'] || 'Bạn là Chuyên viên Phân tích Nghiệp vụ (BI Specialist) và Kỹ sư Dữ liệu cao cấp.'

    if api_key.empty?
      json_response(res, {
        ok: false,
        fallback: true,
        message: 'Chưa cấu hình API Key bên ngoài — Sử dụng Local BI Expert Agent Engine.'
      })
      next
    end

    if provider == 'gemini'
      model = body['model'] || 'gemini-2.0-flash'
      uri = URI("https://generativelanguage.googleapis.com/v1beta/models/#{model}:generateContent?key=#{api_key}")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.read_timeout = 30
      request = Net::HTTP::Post.new(uri.request_uri, { 'Content-Type' => 'application/json' })
      request.body = JSON.generate({
        system_instruction: { parts: [{ text: system_instruction }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 }
      })
      response = http.request(request)
      parsed = JSON.parse(response.body.force_encoding('UTF-8'))
      if response.code.to_i == 200 && parsed['candidates'] && parsed['candidates'][0]
        text = parsed['candidates'][0].dig('content', 'parts', 0, 'text') || ''
        json_response(res, { ok: true, provider: 'gemini', text: text })
      else
        err_msg = parsed.dig('error', 'message') || "HTTP #{response.code}"
        json_response(res, { ok: false, fallback: true, error: err_msg })
      end
    elsif provider == 'openai'
      model = body['model'] || 'gpt-4o-mini'
      uri = URI('https://api.openai.com/v1/chat/completions')
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.read_timeout = 30
      request = Net::HTTP::Post.new(uri.request_uri, {
        'Content-Type' => 'application/json',
        'Authorization' => "Bearer #{api_key}"
      })
      request.body = JSON.generate({
        model: model,
        messages: [
          { role: 'system', content: system_instruction },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
      response = http.request(request)
      parsed = JSON.parse(response.body.force_encoding('UTF-8'))
      if response.code.to_i == 200 && parsed['choices'] && parsed['choices'][0]
        text = parsed['choices'][0].dig('message', 'content') || ''
        json_response(res, { ok: true, provider: 'openai', text: text })
      else
        err_msg = parsed.dig('error', 'message') || "HTTP #{response.code}"
        json_response(res, { ok: false, fallback: true, error: err_msg })
      end
    else
      json_response(res, { ok: false, fallback: true, error: 'Unsupported provider' })
    end
  rescue => e
    json_response(res, { ok: false, fallback: true, error: e.message })
  end
end

trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }

puts "=================================================================="
puts "🚀 BI DATA CLEANING & AI AGENT STUDIO ĐANG CHẠY TRÊN LOCALHOST"
puts "👉 Địa chỉ Web App: http://localhost:#{PORT}"
puts "=================================================================="

server.start
