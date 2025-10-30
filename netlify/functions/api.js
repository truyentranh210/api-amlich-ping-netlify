import express from "express";
import serverless from "serverless-http";
import fetch from "node-fetch"; // thay axios = fetch

const app = express();

// 🎯 Hàm chuyển dương → âm (đơn giản)
function solarToLunar(date = new Date()) {
  const baseDate = new Date(2000, 0, 6, 14, 14);
  const diff = (date - baseDate) / 86400000;
  const lunations = diff / 29.530588853;
  const lunarDays = (lunations - Math.floor(lunations)) * 29.530588853;
  const lunarDay = Math.round(lunarDays) || 1;
  return { day: lunarDay, month: date.getMonth() + 1, year: date.getFullYear() };
}

// 🏠 /home
app.get("/home", (req, res) => {
  res.json({
    api: "Âm lịch & Ping API (No Axios)",
    version: "3.3.0",
    author: "fsdfsdf",
    endpoints: {
      "/home": "Thông tin API",
      "/amlich": "Ngày âm & dương hiện tại",
      "/ping?url=https://example.com": "Kiểm tra trạng thái website"
    }
  });
});

// 📅 /amlich
app.get("/amlich", (req, res) => {
  const now = new Date();
  const lunar = solarToLunar(now);
  res.json({
    status: "success",
    solar_date: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
    lunar_date: `${lunar.day}/${lunar.month}/${lunar.year}`,
    time: now.toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
  });
});

// 🌐 /ping
app.get("/ping", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "Thiếu ?url=" });

  try {
    const { hostname, port, protocol } = new URL(targetUrl);
    const response = await fetch(targetUrl, { method: "GET" });
    res.json({
      status: "online",
      code: response.status,
      protocol,
      hostname,
      port: port || (protocol === "https:" ? 443 : 80)
    });
  } catch (err) {
    res.json({
      status: "offline",
      message: err.message
    });
  }
});

export const handler = serverless(app);
