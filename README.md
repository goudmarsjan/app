# De Goudmarsjan – Koersen & Gold Rush

A mobile-friendly single-page app showing indicative live gold/silver spot prices and a 30-second tap-the-gold mini-game.

## Setup
1. Create the table and public read/submit policies by running `supabase-setup.sql` in the Supabase SQL Editor.
2. In `index.html`, replace `SUPABASE_URL` and `SUPABASE_ANON_KEY` with your Supabase project URL and publishable/anon key. Never use a service-role key in browser code.
3. Deploy the repository with GitHub Pages or connect it to Vercel.

The game currently accepts client-submitted scores; this is suitable for a simple promotional leaderboard but is not cheat-proof. For a public competition with prizes, move score validation to a server-side function and add rate limiting.

Gold/silver quotes are fetched from Gold-API and shown in USD per troy ounce. They are indicative spot prices, not guaranteed purchase prices.
