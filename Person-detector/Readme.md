# 👁️ Person Detector

A real-time person detection system running on a Raspberry Pi 5 that watches a live camera feed and notifies a website the moment a person has been in frame for 3 seconds or more.

---

## What It Does

The camera runs continuously in the background. When a person is detected and stays in frame for at least **3 seconds**, the system sends a notification to a connected website — giving you a live alert that someone is there.

Short appearances (under 3 seconds) are ignored, so you only get notified when someone is actually present, not just passing by.

---

## 🛠️ How It Works

1. **Camera feed** — captures live video on the Raspberry Pi
2. **Person detection** — analyses each frame to check for a person
3. **Timer** — starts a 3-second countdown when a person is first detected
4. **Notification** — if the person stays for 3+ seconds, the website is notified in real time
5. **Reset** — timer resets if the person leaves frame before 3 seconds

---

## ▶️ Run It

```bash
python person_detector.py
```

Make sure your camera is connected and the website endpoint is configured before running.

---

## 📦 Requirements

- Raspberry Pi 5
- Camera module or USB webcam
- Python 3
- Connected website or server to receive notifications

---

## 💡 Use Cases

- Know when someone enters a room
- Detect when your boss walks by 👀
- Lightweight security alerting without cloud dependency

---

*Built by [Laksh Kadam](https://github.com/Laksh39) during the AI Pro-Builder Bootcamp Spring 2026 🫐*
