# Smart Mess Rental Management System

A centralized web platform where students can find available mess seats and rental houses, and landlords/mess owners can publish their available spaces. Built with the MERN stack.

## Problem Statement

Students often struggle to find available mess seats, rental houses, or suitable accommodation. At the same time, landlords and mess owners have difficulty reaching students who are looking for accommodation. This system solves that by providing one centralized platform for both sides.

## User Roles

- **Student** — search/browse mess & rental listings, view details, contact owners, manage profile
- **Landlord / House Owner** — publish and manage house rental listings
- **Mess Owner** — publish and manage mess seat listings, update seat availability
- **Admin** — manage users, approve/reject listings, moderate content

## MVP Features

- [ ] User registration & login (role-based auth)
- [ ] Student profile
- [ ] Mess seat listing (create/view)
- [ ] House/rental listing (create/view)
- [ ] Search & filter (location, price, type)
- [ ] Student → owner contact
- [ ] Landlord publish house listing
- [ ] Mess owner publish seat listing
- [ ] Admin dashboard
- [ ] Post approval / moderation

## Phase 2 (Planned, not in MVP)

- [ ] Used-product buy/sell marketplace for students
- [ ] Student requirement posts
- [ ] Reviews / ratings
- [ ] Notifications

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Version Control | Git & GitHub |

## Project Structure (planned)

```
smart-mess-rental/
├── client/          # React frontend
├── server/          # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── middleware/
├── docs/            # SRS and other documentation
└── README.md
```

## Getting Started

```bash
# Clone the repo
git clone <repo-url>

# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm start
```

## Authentication setup

1. Copy `.env.example` to `.env` and add the Firebase Web App configuration.
2. In Firebase Console, enable **Authentication > Sign-in method > Email/Password**.
3. Copy `server/.env.example` to `server/.env` and add the MongoDB Atlas URI and Firebase Admin service-account values.
4. In MongoDB Atlas, create a database user and allow your development IP under **Network Access**.
5. Put approved admin email addresses in `ADMIN_EMAILS`. Student, guardian, and homeowner are public signup roles; admin is allowlisted.
6. Run the apps in separate terminals:

```powershell
npm run dev
npm run server:dev
```

The API health endpoint is `http://localhost:5000/api/health`.

## Contribution Guidelines

- Create a feature branch from `main` for every task: `feature/<short-description>`
- Commit messages should be clear and descriptive (e.g., `feat: add mess listing creation API`)
- Open a Pull Request into `main` and get it reviewed before merging
- Keep MVP features scoped — Phase 2 features go into separate branches/issues once MVP is stable
- Document any new API route in `docs/`

## Initial Task List

1. Finalize SRS and get supervisor sign-off
2. Set up GitHub repository, branch structure, and `.gitignore`
3. Initialize backend (Express server, MongoDB connection, folder structure)
4. Design and implement User schema + auth (register/login, role-based)
5. Design and implement Mess Listing schema + CRUD APIs
6. Design and implement House/Rental Listing schema + CRUD APIs
7. Implement search & filter API
8. Initialize frontend (React app, routing, basic layout)
9. Build auth pages (register/login) on frontend
10. Build listing creation forms (landlord/mess owner views)
11. Build listing browse/search page (student view)
12. Build admin dashboard (approve/reject listings, manage users)
13. Integrate frontend with backend APIs end-to-end
14. Testing and bug fixing
15. Prepare demo/documentation for submission

## License

Academic project — Khulna University of Engineering & Technology.
