# GraphQL Profile

A personal school profile page built with vanilla JavaScript, that authenticates against the platform's GraphQL API and visualizes XP and audit data using hand-built SVG graphs.

**Live demo:** https://graphql-houssam.netlify.app/

## Features

- **Login** — sign in with either `username:password` or `email:password`, authenticated via the platform's `/api/auth/signin` endpoint (Basic auth, JWT returned)
- **Session handling** — JWT stored client-side, attached as a Bearer token on every GraphQL request, cleared on logout
- **Error handling** — invalid credentials show a visible error message on the login form
- **Profile data** — login, user ID, total XP, audit ratio, and current level, pulled directly from GraphQL
- **Statistics graphs** (SVG, no charting library):
  - XP progress over time — line graph built from cumulative transaction totals
  - Audit results — bar chart of succeeded / failed / expired audits
- **GraphQL query techniques** — normal queries, nested queries (e.g. `user { audits { closureType } }`), and argument-filtered queries (`where`, aggregates)

## Tech Stack

- Vanilla JavaScript (ES modules)
- Hand-written SVG for all graphs — no charting library
- Hosted on Netlify

## Project Structure

```
├── index.html          # Login page
├── profile.html         # Profile / dashboard page
├── css/
│   ├── login.css
│   └── profile.css
├── js/
│   ├── config/
│   │   └── config.js    # API endpoint constants
│   ├── services/
│   │   ├── auth.js       # Login request + JWT handling
│   │   ├── graphql.js     # getUser() — fetches profile data
│   │   └── query.js       # GraphQL query string
│   ├── graphs/
│   │   └── auditGraph.js  # SVG XP line graph + audit bar graph
│   ├── main.js           # Login page controller
│   └── profile.js        # Profile page controller
└── assest/
    └── icon.png
```

## How It Works

1. **Login** — credentials are Base64-encoded and sent as a `Basic` Authorization header to the signin endpoint. On success, the returned JWT is saved; on failure, an error message is displayed on the form.
2. **Fetching data** — the JWT is sent as a `Bearer` token to the GraphQL endpoint. A single query fetches the user's profile info, audit history, level, and XP transactions.
3. **Rendering** — profile fields are written directly into the DOM; XP and audit data are passed to two SVG-generating functions that build `<polyline>` and `<rect>` elements dynamically based on the returned data.
4. **Logout** — clears the stored token and redirects back to the login page.

## Running Locally

Since this project uses ES modules, it needs to be served over HTTP (not opened as a local file):

```bash
# from the project root
python3 -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080` in your browser.

## GraphQL Endpoint

- **Signin:** `https://learn.zone01oujda.ma/api/auth/signin`
- **GraphQL:** `https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql`

## Author

halhyane
