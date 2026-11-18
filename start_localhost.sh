#!/bin/zsh
# ==============================================================================
# KHỞI ĐỘNG HỆ THỐNG BI DATA CLEANING & HUMAN-IN-THE-LOOP AI AGENT TRÊN LOCALHOST
# ==============================================================================

cd "$(dirname "$0")"
PORT=${PORT:-8080}

echo "=================================================================="
echo "🚀 Đang khởi động BI Data Cleaning & AI Agent Studio..."
echo "👉 Mở trình duyệt tại: http://localhost:$PORT"
echo "=================================================================="

# Tự động kiểm tra nếu môi trường Python + FastAPI khả dụng thì chạy app.py,
# nếu chưa cài Xcode/Python packages thì chạy ngay server.rb tích hợp sẵn trên macOS!
if command -v uvicorn >/dev/null 2>&1; then
  uvicorn app:app --host 127.0.0.1 --port "$PORT"
else
  /usr/bin/ruby --disable-gems server.rb
fi
