export let tik = performance.now();

export function showElapsedTime (stepName) {
  const duration = ((performance.now() - tik) / 1000).toFixed(4);
  const suffix = stepName ? ` -> ${stepName} completed` : "";
  console.log(`${duration}s ${suffix}`);
  tik = performance.now();
}

export const COLORS = {
  aubergine: "red",
  paperBG: "var(--color-amber-50)"
  // paperBG: "#e7e2cd"
}