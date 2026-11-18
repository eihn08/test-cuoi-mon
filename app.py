# -*- coding: utf-8 -*-
"""
BI DATA CLEANING & HUMAN-IN-THE-LOOP AI AGENT SYSTEM
Đồ án Cuối môn AI Agent - Hệ thống Xử lý, Làm sạch, Kiểm duyệt & Phân tích Dữ liệu BI
Chạy trên Localhost (FastAPI + Pandas + Gemini/OpenAI Agent)
"""

import os
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

import requests
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).resolve().parent
STATIC_DIR = ROOT_DIR / "static"
DATA_DIR = ROOT_DIR / "data"
STATE_FILE = DATA_DIR / "pipeline_state.json"

app = FastAPI(
    title="BI Data Cleaning & Human-in-the-Loop AI Agent System",
    description="Hệ thống Làm sạch Dữ liệu, Kiểm duyệt Con người (HITL) và Phân tích BI tự động",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SAMPLES = {
    "retail": {
        "id": "retail",
        "name": "Bán lẻ & TMĐT (Retail Sales)",
        "description": "32 bản ghi đơn hàng có lỗi trùng mã đơn, thiếu tên/email/chiết khấu, sai ngày tháng, tiền tệ lẫn chữ, số lượng âm & giá ngoại lai.",
        "domain": "E-Commerce / Retail BI",
        "filename": "sample_retail_dirty.csv",
        "path": str(DATA_DIR / "sample_retail_dirty.csv"),
    },
    "hr": {
        "id": "hr",
        "name": "Nhân sự & Lương thưởng (HR & Payroll)",
        "description": "16 bản ghi nhân sự có lỗi trùng mã NV, phòng ban không đồng nhất (IT/cntt/Công nghệ thông tin), lương âm, điểm KPI vượt thang 100.",
        "domain": "HR Analytics / People BI",
        "filename": "sample_hr_dirty.csv",
        "path": str(DATA_DIR / "sample_hr_dirty.csv"),
    },
    "marketing": {
        "id": "marketing",
        "name": "Chiến dịch Marketing Đa kênh (Marketing ROI)",
        "description": "13 chiến dịch quảng cáo có lỗi tên kênh (FB/fb_ads/Facebook Ads), chi phí âm, doanh thu ngoại lai 999 triệu, ngày không hợp lệ.",
        "domain": "Marketing Performance BI",
        "filename": "sample_marketing_dirty.csv",
        "path": str(DATA_DIR / "sample_marketing_dirty.csv"),
    },
}


@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "role": "BI Specialist & AI Data Cleaning Agent (FastAPI Engine)",
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/api/samples")
async def get_samples(id: Optional[str] = None):
    if id and id in SAMPLES:
        info = dict(SAMPLES[id])
        file_path = Path(info["path"])
        info["csv"] = file_path.read_text(encoding="utf-8") if file_path.exists() else ""
        return info

    result = []
    for s in SAMPLES.values():
        item = dict(s)
        p = Path(item["path"])
        item["csv"] = p.read_text(encoding="utf-8") if p.exists() else ""
        result.append(item)
    return {"samples": result}


@app.get("/api/audit")
async def get_audit():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {"logs": []}


@app.post("/api/audit")
async def save_audit(request: Request):
    payload: Dict[str, Any] = await request.json()
    existing = json.loads(STATE_FILE.read_text(encoding="utf-8")) if STATE_FILE.exists() else {"logs": []}
    logs = existing.get("logs", [])
    payload["server_time"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    logs.insert(0, payload)
    existing["logs"] = logs[:100]
    STATE_FILE.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"ok": True, "logs": existing["logs"]}


@app.post("/api/ai")
async def ai_consult(request: Request):
    body = await request.json()
    provider = body.get("provider", "gemini")
    api_key = (body.get("apiKey") or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY") or "").strip()
    prompt = body.get("prompt", "")
    system_instruction = body.get(
        "systemInstruction",
        "Bạn là Chuyên viên Phân tích Nghiệp vụ (BI Specialist) và Kỹ sư Dữ liệu cao cấp.",
    )

    if not api_key:
        return {
            "ok": False,
            "fallback": True,
            "message": "Chưa cấu hình API Key bên ngoài — Sử dụng Local BI Expert Agent Engine.",
        }

    try:
        if provider == "gemini":
            model = body.get("model", "gemini-2.0-flash")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            resp = requests.post(
                url,
                json={
                    "system_instruction": {"parts": [{"text": system_instruction}]},
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.3},
                },
                timeout=30,
            )
            data = resp.json()
            if resp.status_code == 200 and "candidates" in data and data["candidates"]:
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {"ok": True, "provider": "gemini", "text": text}
            return {"ok": False, "fallback": True, "error": data.get("error", {}).get("message", "API Error")}

        elif provider == "openai":
            model = body.get("model", "gpt-4o-mini")
            resp = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.3,
                },
                timeout=30,
            )
            data = resp.json()
            if resp.status_code == 200 and "choices" in data and data["choices"]:
                text = data["choices"][0]["message"]["content"]
                return {"ok": True, "provider": "openai", "text": text}
            return {"ok": False, "fallback": True, "error": data.get("error", {}).get("message", "API Error")}

    except Exception as e:
        return {"ok": False, "fallback": True, "error": str(e)}


app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8080"))
    print(f"🚀 BI Data Cleaning & AI Agent Studio running at http://localhost:{port}")
    uvicorn.run(app, host="127.0.0.1", port=port)
