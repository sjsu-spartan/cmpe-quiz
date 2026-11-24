## Ch 4: Human-Centered AI Design

Covers Mock Final Q19 to Q24.

### Core Formulas

- **95% Confidence Band & Target Sample Size:**
  $$CI_{95\%} = s \pm 1.96 \cdot SE, \qquad W = 3.92\sqrt{\frac{p(1 - p)}{n}}, \qquad n = \left\lceil \frac{3.92^2 p(1 - p)}{W^2} \right\rceil$$
- **Uncertainty Routing (deck rule; ALWAYS check width first):**
  - `width > 0.20` -> **ABSTAIN**
  - else `s < 0.35` -> **AUTO**
  - else `s > 0.65` -> **FLAG**
  - else -> **REVIEW**
- **Trust Calibration Score (TCS) vs. Team Accuracy:**
  $$\text{override} = r b + (1 - r)a, \qquad \text{trust} = 1 - \text{override}, \qquad TCS = 1 - |\text{trust} - r|$$
  $$\text{Acc}_{\text{team}} = r(1 - b) + (1 - r)a$$
  where $$a = P(\text{override} \mid \text{AI wrong})$$, $$b = P(\text{override} \mid \text{AI right})$$.
- **Team Beats AI Alone Condition:**
  $$(1 - r)a > r b \iff \frac{a}{b} > \frac{r}{1 - r}$$
- **Control Pattern & Cost-Based Review Threshold:**
  $$\text{Control} = \text{Impact} \times \text{Uncertainty} \quad (\ge 15\text{ in-loop},\; 6\text{ to }14\text{ on-loop},\; < 6\text{ out-of-loop})$$
  $$\text{Review if } s > \frac{c_{\text{review}}}{c_{\text{harm}}}$$
- **MAD-Scaled Recourse & Retraining Safety Margin:**
  $$\Delta x_j = -\frac{s(x)}{w_j}, \qquad \text{Cost}_j = \frac{|\Delta x_j|}{MAD_j}, \qquad P(\text{valid}) = \Phi\!\left(\frac{m}{\sigma_s}\right), \qquad m_{95} = 1.645\,\sigma_s$$
- **Monitoring False-Alarm Rate & Cadence Harm:**
  $$P_{\text{FA}} = \Phi\!\left(\frac{SLO - r}{\sqrt{r(1 - r)/n}}\right), \qquad \text{Excess errors} = \Delta\text{error} \times \text{volume} \times \left(\frac{\text{interval}}{2} + \text{response}\right)$$
- **Stakeholder Impact & Show/Hide/Guard Utility:**
  $$\text{Impact} = \text{Severity} \times \text{Likelihood}, \qquad \text{Net} = \text{benefit} - \text{anchoring} \times \text{harm} - \text{cost}$$

### Key Exam Traps

- **Trust equals compliance rate (`1 - override`), not accuracy.**
- **High TCS can hide a bad team:** a blind team (`a = b = 1 - r`) scores `TCS = 1.000` while performing worse than AI alone. Always report discrimination `a - b`.
- **Boundary scores (`= 15`) count as the higher tier** (in-the-loop / High).
- **Expected detection delay is half the check interval** plus response time.
- **Zero-margin recourse is a 50% coin flip** after model retraining; add `1.645 * sigma_s` for 95% validity.
