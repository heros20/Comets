// test-fetch.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

(async () => {
  const res = await fetch("https://ffbs.wbsc.org/fr/events/2025-championnat-r1-baseball-ligue-normandie/standings", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "text/html",
    }
  });
  const text = await res.text();
  console.log(text);
})();
