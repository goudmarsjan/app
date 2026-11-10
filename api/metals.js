export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const timeout = AbortSignal.timeout(10000);

  try {
    const yahooUrl = "https://query1.finance.yahoo.com/v8/finance/chart/EURUSD%3DX?range=1d&interval=1m";

    const [metalsResponse, fxResponse] = await Promise.all([
      fetch("https://xaus.com/api/v1/spot?compact=1", {
        cache: "no-store",
        signal: timeout,
        headers: { Accept: "application/json" }
      }),
      fetch(yahooUrl, {
        cache: "no-store",
        signal: timeout,
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; Goudmarsjan/1.0)"
        }
      })
    ]);

    if (!metalsResponse.ok || !fxResponse.ok) {
      throw new Error("Een van de live koersbronnen is niet bereikbaar.");
    }

    const [metals, fx] = await Promise.all([
      metalsResponse.json(),
      fxResponse.json()
    ]);

    const market = fx.chart?.result?.[0]?.meta;
    const eurUsd = Number(market?.regularMarketPrice);
    const fxTime = Number(market?.regularMarketTime) * 1000;

    const goldUsdKg = Number(
      metals.per_kg_usd ??
      (Number(metals.spot_usd_oz) * 32.1507466)
    );
    const silverUsdOz = Number(metals.silver_usd_oz);
    const metalTime = Date.parse(metals.price_as_of || metals.updated_at || "");
    const now = Date.now();

    if (
      metals.data_state?.status !== "fresh" ||
      !Number.isFinite(metals.data_state?.age_seconds) ||
      metals.data_state.age_seconds > 180
    ) {
      throw new Error("De goud- en zilverkoers is niet actueel.");
    }

    if (
      !Number.isFinite(metalTime) ||
      now - metalTime > 180000 ||
      metalTime > now + 60000
    ) {
      throw new Error("Tijdstip van de edelmetaalkoers is ongeldig.");
    }

    if (
      !Number.isFinite(fxTime) ||
      now - fxTime > 15 * 60 * 1000 ||
      fxTime > now + 60000
    ) {
      throw new Error("De EUR/USD-wisselkoers is ouder dan 15 minuten.");
    }

    if (![eurUsd, goldUsdKg, silverUsdOz].every(v => Number.isFinite(v) && v > 0)) {
      throw new Error("De koersbron gaf ongeldige marktgegevens.");
    }

    const ounceToKg = 32.1507466;
    const goldEurKg = goldUsdKg / eurUsd;
    const silverEurKg = (silverUsdOz * ounceToKg) / eurUsd;

    return res.status(200).json({
      goldEurKg,
      silverEurKg,
      currency: "EUR",
      unit: "kg",
      source: "XAUS spot + Yahoo Finance EUR/USD",
      asOf: new Date(Math.min(metalTime, fxTime)).toISOString(),
      goldSourceAsOf: new Date(metalTime).toISOString(),
      fxSourceAsOf: new Date(fxTime).toISOString()
    });
  } catch (error) {
    console.error("Metal price API error:", error);
    return res.status(503).json({
      error: "Geen bevestigde actuele koers beschikbaar."
    });
  }
}
