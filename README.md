# Flovera — Event Management Platform

A full-stack event management web application for **Flovera**: party hall/room booking,
marriage & birthday event packages, flower decoration, food court & catering, DJ, invitation
card design, and event poster design — all managed end-to-end (A–Z) through one system.

## Stack
- **Backend:** Java 17, Spring Boot 3, Spring Security + JWT, Spring Data JPA, MySQL
- **Frontend:** React 18 (Vite), React Router, Axios

## Two-tier access
- **Customer** — self-registers, browses the service catalog (Home & Services pages),
  books a service for a date, and tracks their own bookings & payment status in their Dashboard.
- **Admin** — logs in with a fixed, unique account (`admin123@flovera.com` / `Admin@123`,
  seeded automatically on first backend startup). Only the admin panel can see/manage
  service availability, payment limits, invoices, and all bookings/customers.

Login is a single page with a Customer/Admin toggle. The backend re-checks the account's
real role against the option chosen, so a customer account can never log in as admin and
vice versa.

## Project structure
```
flovera/
├── backend/    Spring Boot REST API (MySQL, JWT auth)
│   └── README.md   ← setup & run instructions, full endpoint list
└── frontend/   React app (Home / Services / Login / Register / Dashboard)
```

## Quick start

1. **Backend**
   ```bash
   cd backend
   # edit src/main/resources/application.properties if your MySQL credentials differ
   mvn spring-boot:run
   ```
   Runs on `http://localhost:8080`. See `backend/README.md` for the endpoint reference.

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Runs on `http://localhost:5173` and talks to the backend at `http://localhost:8080/api`.

3. Open `http://localhost:5173`:
   - Register as a **Customer** to browse Services and make a booking.
   - Log in with **Admin** + `admin123@flovera.com` / `Admin@123` to manage services,
     confirm/cancel bookings, and record payments/invoices.

## What's implemented
- **Home** — service summary, imagery, "how it works" documentation.
- **Services** — full catalog with category filter, pricing, address/capacity, availability
  badge, and a date-picker booking modal (double-booking on the same date is blocked).
- **Login / Register** — unified login with Customer/Admin role toggle; customer self-registration.
- **Dashboard**
  - *Customer view:* their bookings, live booking status, and per-booking payment/due status; cancel a booking.
  - *Admin view:* business overview stats, full service CRUD (incl. availability toggle & payment
    limit), all-bookings management with status updates, invoices & payment recording (admin-only),
    and a customer list.

## Notes for going to production
- Change `flovera.jwt.secret` and the default admin password in `application.properties`.
- Swap the sample Unsplash image URLs in `Home.jsx` / seed data for your own venue/service photos.
- Add HTTPS, environment-based config, and a proper email verification flow for customer sign-up.
