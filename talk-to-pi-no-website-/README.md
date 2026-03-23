![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-5-C51A4A?style=for-the-badge&logo=raspberrypi&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-Local%20AI-black?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
# 🎙️ Talk to Pi (No Website)

A purely terminal-based voice assistant running on a Raspberry Pi 5. You speak, the Pi listens, thinks, and responds with both voice and text — no browser, no interface, just you and the Pi.

---

## What It Does

Speak into the microphone and the Pi responds out loud and prints the response to the terminal at the same time. Everything runs locally on the Pi — no website, no app, no internet needed.

It's the rawest version of a voice assistant — just the pipeline, nothing else.

---

## 🛠️ How It Works

1. **You speak** — microphone captures your voice input
2. **Speech-to-text** — converts your speech into text
3. **LLM processing** — local language model via Ollama generates a response
4. **Text-to-speech** — the Pi speaks the response out loud
5. **Terminal output** — the response is also printed as text in the terminal

---

## ▶️ Run It

```bash
python talk_to_pi.py
```

Make sure your microphone and speaker are connected before running.

---

## 📦 Requirements

- Raspberry Pi 5
- Microphone (USB or 3.5mm)
- Speaker or headphones
- Python 3
- Ollama (local LLM)
- SpeechRecognition (`pip install SpeechRecognition`)
- pyttsx3 or equivalent TTS library

---

## 💡 Why No Website?

This is the stripped-down version of the voice assistant — built to prove the core pipeline works with zero UI overhead. Just pure voice in, voice + text out, running entirely at the edge.

---

*Built by [Laksh Kadam](https://github.com/Laksh39) during the AI Pro-Builder Bootcamp Spring 2026 🫐*
