## 📖 CMPE 253 Final Exam Study Guide (Overview)

Formulas, worked examples, and decision thresholds from all 12 course decks, organized into the 6 chapters of the final exam (36 worked numerical mock problems, 6 per chapter, 10 points each).

### Six-Chapter Blueprint

| Chapter | Core Topics | Mock Final |
| :--- | :--- | :--- |
| **1. Algorithmic Fairness** | Group rates, EOpp, EOdds, DP, DI, ECE, Chouldechova identity, reweighing, randomized thresholds | Q1 to Q6 |
| **2. Explainable AI (xAI)** | LIME kernel & WLS surrogate, exact & linear SHAP, stability, faithfulness, EAS, ADI, counterfactuals | Q7 to Q12 |
| **3. AI Auditing & Accountability** | Risk `L x I`, PSI/KL, DI z-test, sample size, robust z, CUSUM/EWMA, CAS, RAS, DDI, EPS | Q13 to Q18 |
| **4. Human-Centered AI Design** | Confidence bands, uncertainty routing, TCS vs. team accuracy, control score, recourse margins, monitoring, utility | Q19 to Q24 |
| **5. Emerging Topics in AI TI** | Watermark `P(green)` & z-test, paraphrasing, provenance, Bayes precision, agent risk, SLSA/Merkle/TEE, `6ND` compute | Q25 to Q30 |
| **6. Operationalizing AI TI** | Signal funnel & priority, SLA buffer, triage grid, containment cost, KPIs, TEVV, FSS, PMRI, AWTCS headroom | Q31 to Q36 |

### Decision Thresholds at a Glance (Deck Rules)

| Metric | Pass / Middle Bands | Action Band |
| :--- | :--- | :--- |
| **Disparate-impact ratio (DI)** | `>= 0.80` pass | `< 0.80` flag adverse impact |
| **PSI** | `< 0.10` none · `0.10 to 0.25` moderate | `> 0.25` major shift |
| **Audit risk (`L x I`)** | `1 to 7` Low · `8 to 14` Medium | `15 to 25` HIGH (block) |
| **Triage severity (`I x L`)** | `1 to 6` monitor · `7 to 14` review | `15 to 25` escalate + sign-off |
| **HCAI control / impact** | `< 6` out/Low · `6 to 14` on/Med | `>= 15` in-the-loop / High |
| **Agent risk (`L x I`)** | `<= 8` low · `9 to 14` medium | `>= 15` high |
| **Anomaly z-score** | `|z| <= 3` normal | `|z| > 3` alert |
| **Watermark z-score** | `z <= 4` unflagged | `z > 4` flag watermarked |
| **Residual risk (FSS)** | `<= 7.0` proceed | `> 7.0` block release |
| **Stability (Jaccard %)** | `>= 80` stable · `50 to 79` moderate | `< 50` unstable |
| **Faithfulness (%)** | `>= 20` faithful · `10 to 19` weak | `< 10` not faithful |
| **EAS** | `>= 80` audit-grade · `60 to 79` supportive | `< 60` low-assurance |
| **ADI** | `< 10` stable · `10 to 25` monitor | `> 25` investigate |
| **CAS (floor 50)** | `>= 85` ready · `65 to 84` conditional | `< 65` or any pillar `< 50` not ready |
| **RAS** | `>= 85` strong · `60 to 84` adequate | `< 60` weak |
| **DDI** | `< 10%` low · `10 to 30%` moderate | `> 30%` high (block) |
| **EPS** | `< 40` P3 · `40 to 69` P2 (24 h) | `>= 70` P1 |
| **TEVV / PMRI** | `>= 80` go · `60 to 79` conditional | `< 60` no-go (gov PMRI gate `>= 90`) |

### 12-Minute Routine for Every Problem

1. **Read and list (2 min):** Name the formula for each part and copy the givens with units.
2. **Compute (7 min):** Substitute step by step; retain 3 to 4 significant figures.
3. **Decide (2 min):** Map each number to its decision band and write the verdict in words.
4. **Check (1 min):** Run the sanity self-checks below before moving on.

### Self-Checks That Catch Most Lost Marks

- Shapley and SHAP attributions sum to $$f(x) - \text{baseline}$$.
- Softmax probabilities and histogram bin shares sum to 1.
- Every PSI bin term is $$\ge 0$$ (terms never cancel).
- Audit sample sizes `n` and evidence-bundle counts round **up** (`ceil`).
- `EOdds` is a **max** (never a sum); `ADI` is **half** the sum of absolute shifts.
- KPI sample standard deviation `s` divides by `n - 1`; auditing z-scores in Ch 3 use population $$\sigma$$.
