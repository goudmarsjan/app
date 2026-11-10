# De Goudmarsjan — Edelmetalen & Gold Rush

A responsive, installable mobile-first app for De Goudmarsjan.

## Features
- Live indicative gold and silver spot prices, automatically refreshed once per minute.
- Gold Rush: a playable descending mine game with coins, safe platforms, hazards, score, depth and three lives.
- Public Top 10 leaderboard backed by Supabase.
- Local player-name and sound preferences.
- Offline app shell for the interface and bundled artwork.

## Supabase
The app uses the existing `goldrush_scores` table in the Goudmarsjan project. Run `supabase-setup.sql` for a fresh setup. The browser uses only the project's publishable key; never place a service-role key in the client.

The public leaderboard accepts anonymous score submissions. As with the previous version, client-submitted scores are not cheat-proof. For a prize competition, score validation and rate limiting should be moved server-side.

## Market data
Gold and silver spot prices are retrieved in USD per troy ounce and converted to EUR per kilogram and gram. They are indicative international spot prices, not guaranteed purchase prices.
