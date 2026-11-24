## Ch 3: AI Auditing & Accountability

Covers Mock Final Q13 to Q18 and HW3 Part A (Q1 to Q4).

### Core Formulas

- **Audit Risk Register:** $$\text{Risk} = L \times I$$ (`1 to 7` Low, `8 to 14` Medium, `15 to 25` High / block).
- **Population Stability Index (`< 0.10` none, `0.10 to 0.25` moderate, `> 0.25` major):**
  $$PSI = \sum_i (a_i - e_i)\ln\!\left(\frac{a_i}{e_i}\right) = KL(a\|e) + KL(e\|a) \approx \delta^2$$
- **Disparate Impact Two-Proportion Z-Test (pooled $$\hat{p}$$):**
  $$z = \frac{p_1 - p_2}{\sqrt{\hat{p}(1 - \hat{p})\left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$$
- **Audit Sample Size & Rule of Three (round `n` UP first, then finite correction):**
  $$n = \frac{z^2 p(1 - p)}{m^2}, \qquad n' = \frac{n}{1 + (n - 1)/N}, \qquad \text{Upper bound (0 errors)} \approx \frac{3}{n}$$
- **Classical vs. Robust Z-Score (alert at `|z| > 3`):**
  $$z = \frac{x - \mu}{\sigma}, \qquad z_{\text{rob}} = \frac{x - \text{median}}{1.4826 \cdot MAD}$$
- **CUSUM & EWMA for Slow Creep:**
  $$C_t = \max(0,\; C_{t-1} + x_t - \text{target} - k), \quad \text{alarm if } C_t > h$$
  $$z_t = \lambda x_t + (1 - \lambda) z_{t-1}, \qquad UCL = \mu_0 + L\sigma\sqrt{\frac{\lambda}{2 - \lambda}}$$
- **Continuous Audit Score (CAS, floor 50 on every pillar):**
  $$CAS = 0.30P + 0.25F + 0.25D + 0.20G$$
  (`>= 85` ready, `65 to 84` conditional, `< 65` or any pillar `< 50` not ready)
- **RAS (`>= 85` strong, `60 to 84` adequate, `< 60` weak) & DDI (`< 10%` low, `10 to 30%` mod, `> 30%` block):**
  $$RAS = \left(\sum w_i c_i\right) \times 100 \;\; (c_i \in \{0, 0.5, 1\}), \qquad DDI = \frac{\sum \text{missing weights}}{\sum \text{all weights}} \times 100$$
- **Escalation Priority Score (`>= 70` P1, `40 to 69` P2 24 h, `< 40` P3):**
  $$EPS = 100\left[0.35\min\!\left(\frac{PSI}{0.25}, 1\right) + 0.35\min\!\left(\frac{|z|}{6}, 1\right) + 0.15\frac{100 - RAS}{100} + 0.15\frac{DDI}{100}\right]$$

### Key Exam Traps

- **Floor empty PSI bins at $$\epsilon$$**; every PSI term is $$\ge 0$$ so bins never cancel.
- **Deck auditing z-scores use population $$\sigma$$** (dividing by $$n$$, not $$n - 1$$).
- **Robust $$\sigma = 1.4826 \times MAD$$** resists past attacks in the baseline that inflate classical $$\sigma$$.
- **CAS floor rule overrides a good composite:** one pillar at 45 blocks deployment even if `CAS = 78`.
- **Heavy-tailed MTTD:** report median and p90 (linear interpolation at index `0.9 * (n - 1)`), not just the mean.
