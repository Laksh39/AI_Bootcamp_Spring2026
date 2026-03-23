# 🌤️ Why Is The Sky Blue?

A one-file Python script that asks a local LLM a simple question — and gets a simple answer. No cloud, no API key, no internet. Just Ollama running a model on your own machine.

---

## What It Does

Sends the question *"Explain why the sky is blue like I am 5 years old"* to a locally running **Llama 3.2 (1B)** model via Ollama and prints the response to the terminal.

It's the simplest possible proof that you can run an AI model completely locally — no subscriptions, no data leaving your machine.

---

## ▶️ Run It

```bash
python why_is_the_sky_blue.py
```

Expected output:
```
------------------------------
LOCAL BRAIN SAYS:
[Llama's explanation here]
------------------------------
```

---

## 📦 Requirements

- Python 3
- Ollama installed and running
- Llama 3.2 1B model pulled (`ollama pull llama3.2:1b`)

---

## 💡 Why I Built This

This was my first experiment running a language model completely locally. Before building the full voice assistant, I wanted to see if I could get a model to just... answer a question. On my own hardware. With no internet.

It worked. That was the moment everything clicked.

---

*Built by [Laksh Kadam](https://github.com/Laksh39) during the AI Pro-Builder Bootcamp Spring 2026 🫐*
