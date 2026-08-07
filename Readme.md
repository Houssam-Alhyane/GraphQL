# GraphQL Profile

A personal school profile page built with vanilla JavaScript, consuming the Zone01 GraphQL API. Displays user identification, XP, audit ratio, level, and three SVG statistics graphs (XP progression, Pass/Fail results, and Audit outcomes).

Live demo: https://graphql-houssam.netlify.app/

## Features

* **Login page** — authenticate with either `username:password` or `email:password` via Basic Auth against the platform's sign-in endpoint. Displays a clear error message on invalid credentials.
* **JWT session handling** — the token returned by the sign-in endpoint is stored client-side and sent as a Bearer token on every GraphQL request.
* **Profile page** with:
  * User identification (avatar, login, ID)
  * Total XP
  * Audit ratio
  * Level
* **Statistics section** — three graphs rendered with raw SVG (no charting library):
  * **XP progression** — animated gradient line chart of cumulative XP over time, with grid lines, axis labels, and a hover tooltip
  * **Pass / Fail ratio** — animated gradient donut chart with the pass rate in the center and a legend
  * **Audit outcomes** — succeeded / failed / expired, shown as three animated radial progress rings
* **Logout** — clears the stored token and returns to the login page.
* **Route guarding** — logged-out users are redirected away from the profile page, and logged-in users are redirected away from the login page.

## GraphQL usage

The project queries the platform's GraphQL endpoint (`/api/graphql-engine/v1/graphql`) using all three required query styles:

* **Normal query** — `user { id login avatarUrl auditRatio }`
* **Nested query** — `user { events { level } }`, `user { audits { closureType } }`
* **Query with arguments** — `transaction_aggregate(where: { type: { _eq: "xp" }, ... })`, `result(where: { eventId: { _eq: 41 } })`, `transaction(where: { type: { _eq: "xp" }, ... }, order_by: { createdAt: asc })` for the XP history used by the trend chart

See `js/services/query.js` for the full query.

## Project structure

```
.
├── assest/
│   └── icon.png
├── css/
│   ├── variables.css      # Shared design tokens (color, type, radii, shadows, motion)
│   ├── login.css
│   └── profile.css
├── index.html              # Login page
├── profile.html             # Profile page
├── js/
│   ├── config/
│   │   └── config.js        # Login & GraphQL endpoint URLs
│   ├── graphs/
│   │   ├── xpGraph.js        # SVG line chart (XP progression)
│   │   ├── ResultGraph.js    # SVG donut chart (pass/fail)
│   │   └── auditGraph.js     # SVG radial progress rings (audits)
│   ├── main.js               # Entry point / route guarding
│   ├── pages/
│   │   ├── login.js
│   │   └── profile.js
│   ├── services/
│   │   ├── auth.js           # Login request + token handling
│   │   ├── graphql.js        # GraphQL fetch + data shaping
│   │   └── query.js          # GraphQL query string
│   └── utils/
│       ├── storage.js        # Token get/save/remove (localStorage)
│       └── helpers.js        # XP formatting helper
└── README.md
```

## Getting started

1. Clone the repository:

```
git clone <your-repo-url>
cd <repo-folder>
```

2. Update the endpoint URLs in `js/config/config.js` if you're pointing at a different Zone01/01-edu domain.
3. Serve the folder with any static file server (it uses ES modules, so it can't be opened directly via `file://`):

```
npx serve .
# or
python3 -m http.server 8080
```

4. Open the served URL in your browser and log in with your platform credentials.

## Tech stack

* Vanilla JavaScript (ES modules)
* Native `fetch` for REST (auth) and GraphQL requests
* Hand-written SVG for data visualization — no charting library
* Plain CSS with custom properties (no framework)

## Hosting

This project is a static site and can be deployed on any static host, e.g. GitHub Pages, Netlify, or Vercel.

## Author

halhyane
