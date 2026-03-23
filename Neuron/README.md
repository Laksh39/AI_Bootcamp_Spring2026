![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-5-C51A4A?style=for-the-badge&logo=raspberrypi&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
# 🧠 Neuron

A bare-bones implementation of a single artificial neuron trained from scratch in Python. No ML libraries — just math, weights, and learning.

---

## What It Does

Trains a single neuron on a dataset over multiple epochs. With each pass through the data, the neuron adjusts its weights based on the error, gradually learning to make better predictions.

It's the foundation of every neural network ever built — stripped down to its simplest form so you can actually see what's happening under the hood.

---

## 🛠️ How It Works

1. **Initialize** — the neuron starts with random weights
2. **Forward pass** — input data is multiplied by weights and passed through an activation function
3. **Calculate error** — compare the output to the expected result
4. **Update weights** — adjust weights to reduce the error
5. **Repeat** — run for multiple epochs until the neuron converges

---

## ▶️ Run It

```bash
python neuron.py
```

---

## 📚 Why I Built This

Understanding a single neuron is the first step to understanding all of deep learning. Before using frameworks like TensorFlow or PyTorch, I wanted to build one from scratch and watch it actually learn.

---

*Built by [Laksh Kadam](https://github.com/Laksh39) during the AI Pro-Builder Bootcamp Spring 2026 🫐*
