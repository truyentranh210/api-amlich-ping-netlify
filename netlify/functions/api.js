import express from "express";
import serverless from "serverless-http";
import axios from "axios";
import { SolarDate, convertSolar2Lunar } from "amlich-js";

const app = express();

// 🏠 /home - Trang giới thiệu API
app.get("/home", (req, res) => {
  res.json({
    api: "Âm lịch & Ping API",
    author: "fsdfsdf",
    version: "1.0.0",
    endpoints: {
      "/home": "Thông tin API",
      "/amlich": "Lấy ngày âm lịch và dương lịch hôm nay",
      "/ping?url=https://example.com": "Kiểm tra trạng thái website"
    },
    example: {
      amlich: "https://tênmiền.netlify.app/amlich",
      ping: "https://tênmiền.netlify.app/ping?url=https://example.com"
    }
  });
});

// 📅 /amlich - Ngày âm & dương lịch
app.get("/amlich", (req, res) => {
  const now = new Date();
  const solar = new SolarDate(now.getDate(), now.getMonth() + 1, now.getFullYear());
  const lunar = convertSolar2Lunar(solar);
  res.json({
    status: "success",
    solar_date: `${solar.day}/${solar.month}/${solar.year}`,
    lunar_date: `${lunar.day}/${lunar.month}/${lunar.year}`,
  });
});

// 🌐 /ping?url=... - Kiểm tra website
app.get("/ping", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Thiếu tham số ?url=" });
  }

  try {
    const { hostname, port, protocol } = new URL(targetUrl);
    const response = await axios.get(targetUrl, { timeout: 5000 });
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

// ✅ Export cho Netlify
export const handler = serverless(app);
