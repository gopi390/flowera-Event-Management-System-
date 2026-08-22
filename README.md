Flovera — Event Management Platform

A full-stack web application for an event management company that handles the complete A–Z of marriage, birthday, and celebration events — party hall/room booking, flower decoration, catering & food court, DJ services, invitation card design, and event posters, all from one platform.

Two-tier access system:

Customer — registers, browses the service catalog (pricing, availability, address, calendar), books events, and tracks bookings & payment status in a personal dashboard.
Admin — logs in through a unique admin account, manages the full service catalog, controls availability and payment limits, updates booking statuses, and handles invoices/payments — completely isolated from customer access.

Tech stack:

Backend: Java, Spring Boot, Spring Security (JWT), Spring Data JPA, MySQL
Frontend: React, Vite, React Router, Axios
Deployment: Render (backend) + Vercel (frontend) + Aiven (MySQL) — all free tier

Key features:

Role-verified login (customer/admin separation enforced on both frontend and backend)
Service catalog with category filters, live pricing, and calendar-based booking (prevents double-booking)
Admin dashboard: service CRUD, availability toggle, payment limit control, invoice/payment tracking, booking status management
Customer dashboard: booking history, live status, per-booking payment/due tracking
Environment-based configuration ready for cloud deployment
