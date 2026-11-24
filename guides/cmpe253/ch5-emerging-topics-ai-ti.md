## Ch 5: Emerging Topics in AI TI

Covers Mock Final Q25 to Q30.

### Core Formulas

- **Green-List Watermark & Biased Softmax:**
  $$P(\text{green}) = \frac{\gamma e^\delta}{\gamma e^\delta + 1 - \gamma}, \qquad p_i = \frac{e^{\ell_i + \delta g_i}}{\sum_j e^{\ell_j + \delta g_j}}$$
  Green-token odds multiply by $$e^\delta$$; red tokens lose probability share because the softmax denominator grows.
- **Watermark Z-Test, Required Tokens, and Paraphrase Dilution:**
  $$z = \frac{s - \gamma T}{\sqrt{T\gamma(1 - \gamma)}} \;\; (\text{flag } z > 4), \qquad T^* = \left[\frac{z\sqrt{\gamma(1 - \gamma)}}{g - \gamma}\right]^2$$
  $$g' = (1 - 2r)g + 2r\gamma \quad (\text{each swap spoils 2 positions at context width 1})$$
- **Provenance Survival, Layered Union, & Bayes Alert Precision:**
  $$\text{survival} = (1 - s)^k, \qquad P(\text{any}) = 1 - \prod_i (1 - p_i), \qquad \text{Precision} = \frac{TPR \cdot b}{TPR \cdot b + FPR(1 - b)}$$
- **Agent Risk, Token Budgets, & Daily Attack Cost:**
  $$\text{Residual} = L(1 - e) \times I \quad (\ge 15\text{ high},\; 9\text{ to }14\text{ med},\; \le 8\text{ low})$$
  $$\text{Threshold} = \mu + k\sigma, \qquad \text{\$/day} = \rho \cdot k_{\text{tok}} \cdot 1440 \cdot \pi$$
- **Supply Chain, Merkle Proofs, & Birthday Bounds:**
  $$P(\ge 1\text{ tamper in }n) = 1 - (1 - p)^n, \qquad \text{Proof} = \lceil \log_2 n \rceil \times 32\text{ B}$$
  $$P(\text{collision}) \approx \frac{n^2}{2^{b+1}}, \qquad \text{Nonce repeats} \approx \frac{N^2}{2^{n+1}} \;\; (\text{use } \ge 128\text{-bit nonces})$$
- **TEE ROI & EU AI Act Training Compute:**
  $$\text{Net TEE} = \Delta p \cdot L - \text{cost}, \qquad \Delta p_{\text{break-even}} = \frac{\text{cost}}{L}$$
  $$C \approx 6ND, \qquad \text{GPU-days} = \frac{C}{\text{peak} \cdot \text{util} \cdot 86400} \quad (\ge 10^{25}\text{ FLOPs} \Rightarrow \text{systemic risk})$$

### Key Exam Traps

- **Watermark `z` uses `T` scored tokens** and denominator $$\sqrt{T\gamma(1-\gamma)}$$.
- **Paraphrase dilution multiplies `r` by 2** because every replaced token breaks both its own position and the next token's seed.
- **Always round $$\lceil \log_2 n \rceil$$ UP** for Merkle proof height.
- **MD5 and SHA-1 are rejected for deliberate cryptanalytic collisions**, not accidental birthday collisions.
- **Layered defense product assumes independence and full traversal** (prompt injection skips signing and TEE attestation).
