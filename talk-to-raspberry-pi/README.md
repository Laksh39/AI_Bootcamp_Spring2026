# 🌐 Talk to Raspberry Pi

A full-stack web interface for your Raspberry Pi 5. Send messages, monitor system stats, and receive live alerts from the Person Detector — all from a browser.

---

## What It Does

A website that gives you a live window into your Raspberry Pi. You can chat with it, check how it's doing under the hood, and get notified the moment the Boss Detector spots someone — all in one place.

---

## ✨ Features

**💬 Send Messages to the Pi**
Type a message in the website and the Pi receives and responds to it in real time.

**📊 System Monitoring**
Live readouts of key Pi stats directly in the browser:
- RAM usage
- CPU temperature
- And more

**🚨 Boss Detector Alerts**
When the Person Detector sees someone for 3+ seconds, an alert is pushed to the website instantly — so you always know when someone's around.

---

## 🛠️ How It Works

1. **Website** — front-end interface running in the browser
2. **Pi server** — a lightweight server running on the Raspberry Pi handles incoming messages and pushes stats and alerts
3. **Real-time communication** — the website and Pi talk to each other live
4. **Person Detector integration** — receives alerts from the Boss Detector when a person is detected

---

## ▶️ Run It

On the Raspberry Pi:
```bash
python server.py
```

Then open the website in your browser and connect to the Pi's local IP address.

---

## 📦 Requirements

- Raspberry Pi 5
- Python 3
- A browser on any device on the same network
- Person Detector running for alerts (`../Person-detector`)

---

*Built by [Laksh Kadam](https://github.com/Laksh39) during the AI Pro-Builder Bootcamp Spring 2026 🫐*
