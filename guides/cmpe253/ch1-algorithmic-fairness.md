## Ch 1: Algorithmic Fairness

Covers Mock Final Q1 to Q6 and HW3 Part C (Q9 to Q12).

### Core Formulas

- **Per-group rates (always compute per group first):**
  $$TPR = \frac{TP}{TP + FN}, \quad FPR = \frac{FP}{FP + TN}, \quad PPV = \frac{TP}{TP + FP}, \quad SR = \frac{TP + FP}{N}$$
- **Equal Opportunity (use when false negatives dominate harm):**
  $$EOpp = |TPR_A - TPR_B|$$
- **Equalized Odds (max of the two gaps, never the sum):**
  $$EOdds = \max(|TPR_A - TPR_B|,\; |FPR_A - FPR_B|)$$
- **Demographic Parity & Disparate Impact (four-fifths rule: `DI < 0.80` flags adverse impact):**
  $$DP_{\text{diff}} = |SR_A - SR_B|, \qquad DI = \frac{SR_{\text{low}}}{SR_{\text{high}}}$$
- **Expected Calibration Error (over-confident if `score > observed`):**
  $$ECE = \sum_b \frac{n_b}{N} \left|\text{observed}_b - \overline{\text{score}}_b\right|$$
- **Chouldechova's Identity:**
  $$FPR = \frac{p}{1 - p} \cdot \frac{1 - PPV}{PPV} \cdot TPR$$
- **Kamiran-Calders Reweighing (changes loss weights, never labels):**
  $$w(a, y) = \frac{P(A = a)\, P(Y = y)}{P(A = a, Y = y)}$$
- **Randomized Threshold Mixing (post-processing, $$\tau_1$$ has higher $$TPR_1$$):**
  $$q = \frac{TPR^* - TPR_2}{TPR_1 - TPR_2}, \qquad FPR_{\text{mix}} = q \cdot FPR_1 + (1 - q) \cdot FPR_2$$

### Key Exam Traps

- **EOdds is a max, not a sum.**
- **Difference vs. ratio:** The same 5-point gap fails the 80% rule at 10% vs. 5% (`DI = 0.50`) but passes at 60% vs. 55% (`DI = 0.917`).
- **Calibration within groups does not equal equal error rates.** With unequal base rates $$p$$ and an imperfect model, equal PPV + equal TPR mathematically forces unequal FPR.
- **Reweighing never edits labels:** Total weight stays $$N$$, group sizes stay intact, and weighted base rates all equal global $$P(Y = 1)$$.
- **Fairness through unawareness fails:** Dropping one proxy feature (`x3`) leaves bias in remaining correlated features and historical labels.
