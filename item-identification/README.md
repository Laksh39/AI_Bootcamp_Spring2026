![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-5-C51A4A?style=for-the-badge&logo=raspberrypi&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![YOLO](https://img.shields.io/badge/YOLO-Object%20Detection-00FFFF?style=for-the-badge)
# 📦 Item Identification

A real-time object detection system running on a Raspberry Pi 5 that uses **YOLO** to identify and label items through a live camera feed — directly on screen, no cloud required.

---

## What It Does

Point the camera at anything and YOLO gets to work — detecting objects in the frame, drawing bounding boxes around them, and labeling what they are in real time. Fast, local, and surprisingly accurate for running on a Pi.

---

## 🛠️ How It Works

1. **Camera feed** — captures live video from the Raspberry Pi camera
2. **YOLO inference** — runs object detection on each frame locally
3. **Labeling** — draws bounding boxes and class labels directly on the video output
4. **Display** — shows the annotated feed on screen in real time

---

## ▶️ Run It

```bash
python item_identification.py
```

Make sure your camera module is connected before running.

---

## 📦 Requirements

- Raspberry Pi 5
- Camera module or USB webcam
- Python 3
- YOLOv8 (`pip install ultralytics`)
- OpenCV (`pip install opencv-python`)

---

## 💡 What It Can Detect

YOLO is trained on 80 common object classes out of the box, including:
- People, animals
- Everyday objects (bottles, chairs, phones, laptops)
- Vehicles, food, and more

---

*Built by [Laksh Kadam](https://github.com/Laksh39) during the AI Pro-Builder Bootcamp Spring 2026 🫐*
