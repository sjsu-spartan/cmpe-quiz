## Ch 6: Operationalizing AI Threat Intelligence

Covers Mock Final Q31 to Q36.

### Core Formulas

- **Signal Funnel & Priority with Recency Floor:**
  $$\text{Incidents} = \text{Signals} \times \prod \text{pass rates}, \qquad \text{Priority} = \text{Reliab} \times \text{Relev} \times \max(0.5,\; 1 - 0.05 \cdot \text{days})$$
- **SLA Buffer & Triage Severity Grid:**
  $$\text{Buffer} = \text{SLA} - \sum \text{role latencies}, \qquad \text{Severity} = \text{Impact} \times \text{Likelihood}$$
  Grid bands (`5 x 5 = 25` cells): `1 to 6` monitor (12 cells, 48%), `7 to 14` review (7 cells, 28%), `15 to 25` escalate + sign-off (6 cells, 24%).
- **Containment Economics:**
  $$\text{Total Cost} = \text{Downtime Cost} + \text{Residual Risk Cost}$$
  Pick the minimum; solve break-even outage hours `h` or continuation probability `p` as strict inequalities.
- **KPIs & Evidence Coverage (use sample `s` with `n - 1`):**
  $$s = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n - 1}}, \qquad \text{Override rate} = \frac{\text{overrides}}{\text{triaged}}, \qquad \text{Coverage} = \frac{\text{complete bundles}}{\text{confirmed}}$$
- **TEVV Composite, FSS, & Residual Risk:**
  $$TEVV = \frac{T + E + V_{\text{ver}} + V_{\text{val}}}{4} \quad (\ge 80\text{ go},\; 60\text{ to }79\text{ cond},\; < 60\text{ no-go};\; \text{pillar} < 70 \Rightarrow \text{fix})$$
  $$FSS = I \times E \times R, \qquad \text{Residual} = FSS(1 - e) \le 7.0, \qquad e_{\text{needed}} \ge 1 - \frac{7.0}{FSS}$$
- **PMRI Release Gate & AWTCS Coverage Headroom:**
  $$\text{RiskNorm} = \frac{\text{residual}}{50} \times 100, \qquad PMRI = 0.40\cdot TEVV + 0.35(100 - \text{RiskNorm}) + 0.25\cdot KPI$$
  (Commercial gate `>= 80`; Government gate `>= 90`)
  $$AWTCS = \frac{\sum c_i p_i s_i}{\sum p_i s_i}, \qquad \text{Headroom}_i = \frac{(1 - c_i) p_i s_i}{\sum p_i s_i}$$

### Key Exam Traps

- **Recency floors at 0.5** (at day 10), so ageing can at most halve a score and never overturn a 2x raw gap.
- **Sample standard deviation divides by `n - 1`** (unlike Ch 3's population $$\sigma$$).
- **Evidence coverage requires whole bundles:** round `0.95 * confirmed` UP (`ceil`).
- **RiskNorm divides residual risk by max risk 50.**
- **Invest where AWTCS headroom is largest**, and note that `I = 5, L = 2` (`Severity = 10`) falls in Review unless an impact-only escalation override exists.
