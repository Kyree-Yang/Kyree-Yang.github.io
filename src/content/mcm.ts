import type { Entry } from './types';

/**
 * MCM 2024, Problem C — "Momentum in tennis". The beyond page tells the story
 * of the award; this module is the technical record of the method chain, and
 * the two deliberately do not share sentences.
 */

export type McmFigure = {
  src: string;
  webp: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

/**
 * Paper figures, keyed by the section each one belongs under. The page renders
 * them after the section's prose as chamfered plates with mono captions.
 */
export const mcmFigures: Record<string, McmFigure[]> = {
  problem: [
    {
      src: '/media/mcm-flow.jpg',
      webp: '/media/mcm-flow.webp',
      alt: 'Method-selection flowchart from the MCM 2024 paper, candidates marked with checks and crosses.',
      caption:
        'The method-selection chart from the paper: candidates checked or crossed. EWMA (objective) and PCA (flexible) pass into the model; AHP (subjective) and RF (limited) are crossed out. On the prediction side, LSTM (accurate) is chosen and XGBoost (interpretable) kept for factor attribution; ARIMA (imprecise) is crossed out.',
      width: 1175,
      height: 406,
    },
  ],
  momentum: [
    {
      src: '/media/mcm-momentum.jpg',
      webp: '/media/mcm-momentum.webp',
      alt: 'Five-set momentum area chart for the 2023 Wimbledon final.',
      caption:
        'Momentum across all 334 points of the 2023 Wimbledon final, Alcaraz vs Djokovic, five sets end to end.',
      width: 1600,
      height: 946,
    },
  ],
  swings: [
    {
      src: '/media/mcm-mmf.jpg',
      webp: '/media/mcm-mmf.webp',
      alt: 'Moving-median-filtered momentum curve with green circles marking poorly filtered stretches.',
      caption:
        "The rejected filter: a moving median over the final's momentum curve, one of four smoothers the paper compared. Green circles mark where the filtering performed unsatisfactorily — swings flattened into step-like plateaus. The paper disqualifies it and picks the wavelet filter.",
      width: 1600,
      height: 1008,
    },
  ],
  drivers: [
    {
      src: '/media/mcm-shap.jpg',
      webp: '/media/mcm-shap.webp',
      alt: 'SHAP values across the 40 match features, with the feature table.',
      caption: 'SHAP values over the 40 match features, with the feature table alongside.',
      width: 1600,
      height: 850,
    },
  ],
};

export const mcm: Entry = {
  slug: 'mcm-2024',
  order: 6,
  title: 'Command the Flow — momentum in tennis',
  tagline:
    'MCM 2024, Problem C: given every point of the Wimbledon 2023 featured matches, decide whether momentum in tennis is real. Our team of three finished as an Outstanding Winner, top <1% of teams; my piece was the EWMA momentum definition and the swing detection built on it.',
  eyebrow: 'ENTRY 06 · FEBRUARY 2024 · MCM/ICM PROBLEM C, SJTU',
  dates: 'Feb 2024',
  role: '3-person team · SJTU',
  category: 'modeling',
  categoryLabel: 'modeling',
  stack: ['EWMA', 'wavelet filter', 'LSTM', 'XGBoost', 'SHAP', 'Python'],
  headline: [
    { label: 'of teams', value: 'top <1%' },
    { label: 'points, one final', value: '334' },
    { label: 'match features', value: '40' },
  ],
  caveatTeaser:
    'Momentum here is defined after the fact, from points already won. The pipeline shows the signal is coherent; it does not settle whether momentum decides the next point.',
  teaser: 'Momentum was defined from the scoreboard, after the points were played.',
  metrics: [
    { label: 'of MCM teams', value: 'top <1%', note: 'Outstanding Winner, Problem C', tone: 'primary' },
    { label: 'points in the showcased final', value: 334, note: 'Alcaraz vs Djokovic, five sets' },
    { label: 'match features attributed', value: 40, note: 'SHAP over XGBoost' },
    { label: 'people on the team', value: 3, note: 'SJTU, with a faculty advisor' },
  ],
  credits: 'with Hantian Shi and Yutong Wu · advised by Prof. Xiaofeng Gao',
  sections: [
    {
      id: 'problem',
      heading: 'The problem',
      body: 'Problem C, 2024: momentum in tennis. COMAP supplied a point-by-point CSV of the Wimbledon 2023 featured matches — server, winner, and score for every point, plus per-point match statistics — and quoted a coach who calls swings in play random. The task was to measure the flow of a match, decide whether swings are more than noise, and say what a coach could do with the answer. We were three students at SJTU with a faculty advisor. The sections below follow the chain in the order we built it.',
      bullets: [
        "Data: COMAP's point-by-point CSV covering the Wimbledon 2023 featured matches.",
        'Showcased match: the 2023 final, Alcaraz vs Djokovic, 334 points across five sets.',
        'My contribution: the EWMA momentum definition and the swing detection built on it.',
      ],
    },
    {
      id: 'momentum',
      heading: 'Defining momentum',
      body: "The word had to become a number before anything else could happen. The definition takes the exponentially weighted moving average as its reference, then fixes the weights instead of decaying them: momentum at a point is a game-level score G(x) plus a point-level score P(x) at weight 0.05. G(x) is a five-tap window over the surrounding games — 0.4 on the current game, 0.25 on each adjacent game, 0.05 on each game two away — and the window looks forward as well as back. A game enters as its scoring rate pushed through a sigmoid, which widens the gap between narrowly winning and narrowly losing a game. Games in the window alternate server, so the taps split into two serve categories holding 0.5 of the weight each, and the value reads the same in service games and return games. P(x) reuses the five weights over the surrounding points, +1 for a point won, −1 for a point lost. The two players' curves are standardized to sum to one; for the final, that is one pair of curves across all 334 points.",
      bullets: [
        'A fixed symmetric window, weights 0.05/0.25/0.4/0.25/0.05: two games back, the current game, two games ahead, with the same taps repeated over the surrounding five points.',
        'Sigmoid game scores: each game contributes its scoring rate through a sigmoid, so a close win and a close loss land far apart.',
        "Serving and receiving games handled as two categories, 0.5 of the weight each; the players' momentum values sum to one at every point.",
      ],
    },
    {
      id: 'swings',
      heading: 'Detecting swings',
      body: "A raw EWMA still jitters point to point, and a detector that fires on jitter is useless. The paper compares four smoothers on the final's curve: a moving median filter, an FIR filter, a wavelet filter, and a convolutional moving average. The moving median flattens swings into step-like plateaus and the FIR filter lags, which disqualifies both; the convolutional moving average drifts from the original near the start and end. The wavelet filter, coif5 at decomposition level 3, keeps the trend and the turns, and detection runs on its output: a swing is a point where the first-order difference of momentum is zero and the second-order difference exceeds 0.03 in absolute value. On the randomness claim the paper makes a two-part argument. A runs test on the swing sequence returns P = 0.000, which the paper reads as the swings being random 'in the aspect of statistics'; the rebuttal is context — point 68 of 334 is Djokovic breaking Alcaraz's serve, point 296 is Alcaraz breaking back early in the decisive set — and the paper concludes the swings are 'certain to happen to some extent' once that context is in.",
      bullets: [
        'Four filters compared on the final: moving median (step-like plateaus) and FIR (lagging) disqualified, convolutional moving average drifting at the edges, wavelet filter chosen.',
        'Swings sit where the filtered curve has zero first-order difference and second-order difference above 0.03 in absolute value.',
        "The paper's runs test on the swing sequence gives P = 0.000, read there as randomness in the bare numbers; its rebuttal is that the flagged points sit on real breaks of serve, making the swings 'certain to happen to some extent'.",
      ],
    },
    {
      id: 'drivers',
      heading: 'What moves the curve',
      body: "Detection says when a match turned; the follow-up question is what the turns co-occur with. We built 40 features per point from the raw CSV — score state, serve, rally, and movement variables — fit an XGBoost model against the swing labels, and read SHAP values off the fit to rank each feature's contribution. The ranking is attribution over a fitted model. It says which of the 40 features the model leans on; whether pulling one of those levers would change a match is a different experiment, and the paper does not claim otherwise.",
      bullets: [
        '40 features per point, built from the COMAP CSV: score state, serve, rally, and movement variables.',
        "XGBoost fit to the detected swings; SHAP values rank each feature's contribution to the fit.",
        'The full feature table sits next to the SHAP plot, so every bar stays traceable to its variable.',
      ],
    },
    {
      id: 'prediction',
      heading: 'Prediction and sensitivity',
      body: "The paper's last chapters ask whether the curve is forecastable and how fragile the forecaster is. Three recurrent networks — plain RNN, GRU, and LSTM — were trained on the same match data with matched structures, one match held out as the shared test set. Trained straight, RNN and GRU fit decently; LSTM, the expected winner, was the worst of the three, starved by the small training set. Clustered transfer learning closed the gap: PCA compresses matches to three dimensions, K-means groups them into three clusters, and each network pre-trains on the held-out match's cluster-mates. All three improved, and LSTM came out most accurate — train and test loss both 0.02 in the paper's table — so LSTM is the forecaster. XGBoost sits in the same chapter for a different job, factor attribution; that work is the previous section, and ARIMA appears only in the paper's opening chart, crossed out as imprecise. Sensitivity follows: of step sizes 1 through 30, around 10 suffices once transfer learning is in; of cluster counts 1 through 15, test error bottoms out at 3. The pipeline was built on men's matches from one tournament; run on women's matches from the 2023 US Open, prediction error grew, and the paper reports the gap.",
      bullets: [
        'Model selection: RNN, GRU, and LSTM on the same data; plain LSTM underperformed both until clustered transfer learning, then finished most accurate and became the model.',
        "Clustered transfer learning: PCA to three dimensions, K-means into three clusters, pre-training on the test match's cluster; LSTM reached 0.02 train and 0.02 test loss.",
        'Sensitivity: step sizes 1-30 and cluster counts 1-15 varied; around step 10 and 3 clusters, the choices hold.',
        "Transfer: on 2023 US Open women's matches, prediction error grew; the paper states the limit.",
      ],
    },
  ],
  caveats: [
    'Momentum is defined from points already won, and swings are then detected in that same signal. The pipeline demonstrates the signal is coherent and non-random; it does not settle the causal question Problem C poses, whether momentum decides the next point rather than describing the last few.',
    "The showcased detection is one match, the 2023 final. The method ran across the Wimbledon featured matches, and the one transfer we tried — women's matches from the 2023 US Open — made prediction error grow. Nothing here is a validated predictor across tournaments.",
    'SHAP rankings are attribution over one fitted XGBoost model. They say what the model leans on across the 40 features; they are not evidence that changing a feature would change a match.',
    'This is a contest paper, written and judged inside the MCM format. The award places it in the top <1% of teams for that cycle; peer review is a different bar the paper has not faced.',
    'The analysis code was written for the contest window and never published; the paper is the complete record of the method.',
  ],
  docs: ['mcmPaper'],
};
