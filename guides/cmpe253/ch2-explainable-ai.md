## Ch 2: Explainable AI (xAI)

Covers Mock Final Q7 to Q12 and HW3 Part B (Q5 to Q8).

### Core Formulas

- **LIME Kernel (default width $$\omega = 0.75\sqrt{p}$$):**
  $$\pi(d) = \exp\!\left(-\frac{d^2}{\omega^2}\right)$$
- **One-Feature Weighted Least Squares (WLS) Surrogate:**
  $$\beta_1 = \frac{(\sum w)(\sum wxy) - (\sum wx)(\sum wy)}{(\sum w)(\sum wx^2) - (\sum wx)^2}, \qquad \beta_0 = \frac{\sum wy - \beta_1 \sum wx}{\sum w}$$
- **Exact Shapley Value (for $$n = 3$$, weights are $$\frac{1}{3}, \frac{1}{6}, \frac{1}{6}, \frac{1}{3}$$):**
  $$\phi_i = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!\,(n - |S| - 1)!}{n!}\,\big[v(S \cup \{i\}) - v(S)\big]$$
- **Linear SHAP & Efficiency Check (always state the baseline):**
  $$\phi_i = \beta_i (x_i - \mathbb{E}[x_i]), \qquad v(\emptyset) + \sum_i \phi_i = f(x)$$
- **Stability (mean pairwise Jaccard, `>= 80` stable, `50 to 79` moderate, `< 50` unstable):**
  $$\text{Stability} = \text{mean}\!\left(\frac{|A \cap B|}{|A \cup B|}\right) \times 100$$
- **Deletion Faithfulness (trapezoid AUC, `>= 20` faithful, `10 to 19` weak, `< 10` not faithful):**
  $$\text{AUC} = \sum_k \frac{c_k + c_{k+1}}{2}, \qquad \text{Faithfulness} = \frac{AUC_{\text{rand}} - AUC_{\text{attr}}}{AUC_{\text{rand}}} \times 100$$
- **Explanation Assurance Score (`>= 80` audit-grade, `60 to 79` supportive, `< 60` low-assurance):**
  $$EAS = 0.35 \cdot \text{Stab} + 0.40 \cdot \text{Faith} + 0.25 \cdot \text{Fid}, \qquad \text{Fid} = 100 - \frac{|\hat{f}(x) - f(x)|}{f(x)} \times 100$$
- **Attribution Drift Index (`< 10` stable, `10 to 25` monitor, `> 25` investigate) & Spearman Rank:**
  $$ADI = 0.5 \sum_i |p_i - q_i|, \qquad \rho = 1 - \frac{6 \sum d_i^2}{n(n^2 - 1)}$$
- **Minimal-L2 & Single-Feature Counterfactuals:**
  $$\Delta^* = \frac{\text{logit}(\tau) - w^T x - b}{\|w\|^2}\, w, \qquad \Delta x_j = -\frac{s(x)}{w_j}$$

### Key Exam Traps

- **n = 3 Shapley weights are 1/3, 1/6, 1/6, 1/3**, not equal `1/4` weights.
- **Fidelity divides by black-box `f(x)`**, never by surrogate `f_hat(x)`.
- **ADI includes the 0.5 factor** (half the total absolute percentage-share shift).
- **High Spearman `rho` can still swap rank #1**, changing the top adverse-action reason.
- **Drop immutable features** (such as past delinquencies) before computing counterfactual recourse; use ALE instead of PDP when features are strongly correlated.
