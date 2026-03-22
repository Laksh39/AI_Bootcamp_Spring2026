#!/usr/bin/env python3
"""
=======================================================
  SINGLE NEURON TRAINER  —  Perceptron from Scratch
  do nano neuron.py in the terminal of your raspberry pi and paste this in
  Run on your Raspberry Pi: python3 neuron.py
=======================================================

How it works:
  A single neuron has one WEIGHT per input feature and one BIAS.
  For each training example it:
    1. Multiplies each input by its weight and sums them up  (dot product)
    2. Adds the bias
    3. Passes the result through a sigmoid to get a 0-1 prediction
    4. Compares to the correct answer and calculates the ERROR
    5. Nudges every weight (and the bias) a tiny bit in the right direction
  Repeat thousands of times → the neuron "learns".
"""

import math
import random
import os

# ── Colours for the terminal ──────────────────────────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

# ── Activation function ───────────────────────────────────────────────────────
def sigmoid(x):
    """Squashes any number into the range (0, 1)."""
    return 1.0 / (1.0 + math.exp(-x))

def sigmoid_derivative(output):
    """Gradient of sigmoid — used during weight update."""
    return output * (1.0 - output)

# ── The Neuron ─────────────────────────────────────────────────────────────────
class Neuron:
    def __init__(self, n_inputs, learning_rate=0.1):
        # Random small starting weights and bias
        self.weights = [random.uniform(-0.5, 0.5) for _ in range(n_inputs)]
        self.bias    = random.uniform(-0.5, 0.5)
        self.lr      = learning_rate
        self._last_output = None   # cached for backprop

    def predict(self, inputs):
        """Forward pass: weighted sum → sigmoid."""
        total = sum(w * x for w, x in zip(self.weights, inputs)) + self.bias
        self._last_output = sigmoid(total)
        return self._last_output

    def train_one(self, inputs, target):
        """
        One training step (stochastic gradient descent).
        Returns the error BEFORE the update so we can track progress.
        """
        output = self.predict(inputs)
        error  = target - output                          # how wrong are we?
        delta  = error * sigmoid_derivative(output)       # gradient

        # Update every weight
        for i in range(len(self.weights)):
            self.weights[i] += self.lr * delta * inputs[i]
        self.bias += self.lr * delta

        return error

    def train_epochs(self, dataset, epochs, silent=False):
        """Train for a fixed number of epochs over the whole dataset."""
        for epoch in range(1, epochs + 1):
            total_loss = 0.0
            random.shuffle(dataset)                        # shuffle each epoch
            for inputs, target in dataset:
                err = self.train_one(inputs, target)
                total_loss += err ** 2                     # mean-squared error
            mse = total_loss / len(dataset)

            if not silent and (epoch % max(1, epochs // 10) == 0 or epoch == 1):
                bar_len  = 20
                filled   = int(bar_len * (1 - mse))       # rough quality bar
                bar      = "█" * filled + "░" * (bar_len - filled)
                colour   = GREEN if mse < 0.05 else (YELLOW if mse < 0.15 else RED)
                print(f"  Epoch {epoch:>6} / {epochs}  [{colour}{bar}{RESET}]  MSE = {mse:.5f}")

        return mse

# ── Pretty helpers ─────────────────────────────────────────────────────────────
def clear():
    os.system("clear")

def header():
    print(f"""
{BOLD}{CYAN}╔══════════════════════════════════════════════════╗
║        🧠  SINGLE NEURON TRAINER  🧠              ║
║     Weights update until the neuron is smart!    ║
╚══════════════════════════════════════════════════╝{RESET}
""")

def show_weights(neuron, feature_names):
    print(f"\n{BOLD}Current neuron state:{RESET}")
    for name, w in zip(feature_names, neuron.weights):
        bar_val  = int(abs(w) * 20)
        sign_col = GREEN if w >= 0 else RED
        print(f"  {name:<20} weight = {sign_col}{w:+.4f}{RESET}  {'▓' * bar_val}")
    print(f"  {'bias':<20} weight = {neuron.bias:+.4f}")

def get_int(prompt, lo, hi):
    while True:
        try:
            v = int(input(prompt))
            if lo <= v <= hi:
                return v
            print(f"  Please enter a number between {lo} and {hi}.")
        except ValueError:
            print("  That doesn't look like a number — try again.")

def get_float(prompt):
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("  Enter a decimal number (e.g. 7.2).")

def get_label(prompt):
    while True:
        v = input(prompt).strip()
        if v in ("0", "1"):
            return int(v)
        print("  Enter 0 or 1.")

# ── Prebuilt demos ─────────────────────────────────────────────────────────────
PRESETS = {
    "1": {
        "name"    : "Diabetes Risk (Sugar + BMI)",
        "features": ["Sugar Level (mmol/L)", "BMI"],
        "dataset" : [
            # [sugar, bmi], label  (1 = at risk, 0 = not at risk)
            ([4.5, 21.0], 0), ([5.0, 23.0], 0), ([5.2, 22.5], 0),
            ([5.5, 24.0], 0), ([5.8, 25.0], 0), ([6.0, 26.0], 0),
            ([6.5, 28.0], 1), ([7.0, 30.0], 1), ([7.5, 32.0], 1),
            ([8.0, 33.0], 1), ([8.5, 35.0], 1), ([9.0, 36.0], 1),
            ([5.9, 27.5], 0), ([6.8, 29.0], 1), ([7.2, 31.5], 1),
            ([5.3, 23.8], 0), ([6.1, 28.5], 1), ([4.8, 20.5], 0),
        ],
    },
    "2": {
        "name"    : "Pass / Fail Exam (Study Hours + Sleep)",
        "features": ["Study Hours", "Sleep Hours"],
        "dataset" : [
            ([1.0, 4.0], 0), ([2.0, 5.0], 0), ([1.5, 3.5], 0),
            ([3.0, 6.0], 0), ([2.5, 5.5], 0), ([1.0, 7.0], 0),
            ([5.0, 7.0], 1), ([6.0, 8.0], 1), ([7.0, 7.5], 1),
            ([8.0, 6.5], 1), ([6.5, 8.5], 1), ([5.5, 7.0], 1),
            ([3.5, 6.5], 0), ([4.0, 7.5], 1), ([4.5, 6.0], 0),
            ([7.5, 5.5], 1), ([3.0, 8.0], 0), ([6.0, 6.0], 1),
        ],
    },
    "3": {
        "name"    : "Plant Healthy? (Water ml + Sunlight hrs)",
        "features": ["Water (ml/day)", "Sunlight (hrs/day)"],
        "dataset" : [
            ([50,  2], 0), ([60,  3], 0), ([40,  1], 0),
            ([80,  4], 0), ([70,  3], 0), ([55,  2], 0),
            ([200, 6], 1), ([250, 7], 1), ([180, 6], 1),
            ([220, 8], 1), ([300, 7], 1), ([210, 6], 1),
            ([100, 4], 0), ([150, 5], 1), ([130, 5], 0),
            ([270, 7], 1), ([90,  3], 0), ([160, 6], 1),
        ],
    },
}

# ── Custom dataset builder ─────────────────────────────────────────────────────
def build_custom_dataset():
    print(f"\n{BOLD}Custom Dataset Builder{RESET}")
    n_feat = get_int("  How many input features? (1–4): ", 1, 4)
    feature_names = []
    for i in range(n_feat):
        name = input(f"  Name of feature {i+1}: ").strip() or f"Feature {i+1}"
        feature_names.append(name)

    print(f"\n  Now enter your training examples.")
    print(f"  Label 1 = YES / positive, 0 = NO / negative.\n")

    dataset = []
    while True:
        print(f"  Example {len(dataset)+1}  (or press Enter with no input to finish):")
        inputs = []
        abort  = False
        for name in feature_names:
            raw = input(f"    {name}: ").strip()
            if raw == "":
                abort = True
                break
            try:
                inputs.append(float(raw))
            except ValueError:
                print("    Not a number — skipping this example.")
                abort = True
                break
        if abort:
            break
        label = get_label(f"    Label (0 or 1): ")
        dataset.append((inputs, label))
        print(f"    {GREEN}✓ Added.{RESET}")

    if len(dataset) < 2:
        print(f"  {RED}Need at least 2 examples. Using preset 1 instead.{RESET}")
        return PRESETS["1"]

    return {"name": "Custom Dataset", "features": feature_names, "dataset": dataset}

# ── Normalise dataset column-wise to [0, 1] ────────────────────────────────────
def normalise(dataset, n_features):
    mins = [min(row[0][i] for row in dataset) for i in range(n_features)]
    maxs = [max(row[0][i] for row in dataset) for i in range(n_features)]
    ranges = [mx - mn if mx != mn else 1.0 for mn, mx in zip(mins, maxs)]

    normed = []
    for inputs, label in dataset:
        new_inputs = [(inputs[i] - mins[i]) / ranges[i] for i in range(n_features)]
        normed.append((new_inputs, label))

    return normed, mins, maxs, ranges

def normalise_single(inputs, mins, ranges):
    return [(inputs[i] - mins[i]) / ranges[i] for i in range(len(inputs))]

# ── Main program ───────────────────────────────────────────────────────────────
def main():
    clear()
    header()

    # ── Pick dataset ──
    print(f"{BOLD}Choose a dataset:{RESET}")
    for k, v in PRESETS.items():
        print(f"  {k}. {v['name']}")
    print(f"  4. Build my own")
    choice = get_int("\nYour choice (1–4): ", 1, 4)

    if choice == 4:
        config = build_custom_dataset()
    else:
        config = PRESETS[str(choice)]

    feature_names = config["features"]
    dataset       = config["dataset"]
    n_feat        = len(feature_names)

    # ── Normalise ──
    norm_dataset, mins, maxs, ranges = normalise(dataset, n_feat)

    # ── Hyperparameters ──
    print(f"\n{BOLD}Training settings:{RESET}")
    lr     = float(input("  Learning rate (e.g. 0.1 — higher = faster but can overshoot): ") or "0.1")
    epochs = get_int("  Training epochs (e.g. 1000): ", 10, 100_000)

    # ── Create & train ──
    neuron = Neuron(n_feat, learning_rate=lr)

    print(f"\n{BOLD}Weights BEFORE training:{RESET}")
    show_weights(neuron, feature_names)

    print(f"\n{BOLD}Training…{RESET}\n")
    final_mse = neuron.train_epochs(norm_dataset, epochs)

    print(f"\n{BOLD}Weights AFTER training:{RESET}")
    show_weights(neuron, feature_names)

    accuracy_col = GREEN if final_mse < 0.05 else (YELLOW if final_mse < 0.15 else RED)
    print(f"\n  Final MSE: {accuracy_col}{final_mse:.5f}{RESET}")
    if final_mse < 0.05:
        print(f"  {GREEN}✅ Neuron has learned well!{RESET}")
    elif final_mse < 0.15:
        print(f"  {YELLOW}⚠  Decent learning — try more epochs or a different learning rate.{RESET}")
    else:
        print(f"  {RED}❌ Poor fit — try more data, more epochs, or a lower learning rate.{RESET}")

    # ── Test loop ──
    print(f"\n{BOLD}{'='*50}")
    print(f"  Try the trained neuron with your own inputs!")
    print(f"{'='*50}{RESET}\n")

    while True:
        test_inputs = []
        print("Enter values to predict (or Ctrl+C to quit):")
        try:
            for name, mn, mx in zip(feature_names, mins, maxs):
                val = get_float(f"  {name} ({mn:.1f}–{mx:.1f}): ")
                test_inputs.append(val)
        except KeyboardInterrupt:
            print(f"\n\n{CYAN}Thanks for training! The neuron has left the building. 🧠{RESET}\n")
            break

        norm_test = normalise_single(test_inputs, mins, ranges)
        prediction = neuron.predict(norm_test)
        label = 1 if prediction >= 0.5 else 0

        print(f"\n  Raw output    : {prediction:.4f}")
        print(f"  Prediction    : {GREEN if label == 1 else RED}{label}{RESET}  "
              f"({'YES / Positive' if label == 1 else 'NO / Negative'})")
        print(f"  Confidence    : {max(prediction, 1-prediction)*100:.1f}%\n")

# ── Entry point ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{CYAN}Exiting. Bye! 👋{RESET}\n")


