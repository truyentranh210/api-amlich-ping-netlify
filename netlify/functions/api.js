import express from "express";
import serverless from "serverless-http";
import axios from "axios";
import moment from "moment-timezone";
import lunar from "moment-lunar"; // thư viện âm lịch

const app = express();

// 🏠 /home
app.get("/home", (req, res) => {
  res.json({
    api: "Âm lịch & Ping API",
    author: "fsdfsdf",
    version: "2.0.0",
    endpoints: {
      "/home": "Thông tin API",
      "/amlich": "Lấy ngày âm & dương lịch hôm nay",
      "/ping?url=https://example.com": "Kiểm tra trạng thái website"
    },
    example: {
      amlich: "https://tênmiền.netlify.app/amlich",
      ping: "https://tênmiền.netlify.app/ping?url=https://example.com"
    }
  });
});

// 📅 /amlich - Trả về ngày âm & dương
app.get("/amlich", (req, res) => {
  const now = moment().tz("Asia/Ho_Chi_Minh");
  const lunarDate = now.lunar(); // tính ngày âm

  res.json({
    status: "success",
    solar_date: now.format("DD/MM/YYYY"),
    lunar_date: `${lunarDate.date()}/${lunarDate.month() + 1}/${lunarDate.year()}`,
    time: now.format("HH:mm:ss"),
    timezone: now.tz(),
  });
});

// 🌐 /ping?url=...
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

export const handler = serverless(app);
