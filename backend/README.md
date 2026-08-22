# Flovera Backend (Spring Boot + MySQL + JWT)

Event management REST API for Flovera — party halls, marriage/birthday events,
flower decoration, food court, catering, DJ, invitation cards, event posters,
booking, and admin-controlled payments/invoices.

## 1. Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+ running locally

## 2. Configure database
Edit `src/main/resources/application.properties` if your MySQL username/password differ from `root` / `root`.
The database `flovera_db` is auto-created on first run (`createDatabaseIfNotExist=true`).

## 3. Run
```bash
mvn spring-boot:run
```
The API starts on **http://localhost:8080**.

On first startup, a default admin account and sample services are seeded automatically:

- **Admin login:** `admin123@flovera.com` / `Admin@123`  (change `flovera.admin.*` in `application.properties` before going to production)
- Sample services across all categories (Party Hall, Catering, DJ, Flower Decoration, etc.)

## 4. Key API endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Customer sign-up |
| POST | `/api/auth/login` | Public | Login (body includes `loginAs`: `CUSTOMER` or `ADMIN`) |
| GET | `/api/services` | Public | Home/Services page catalog |
| POST/PUT/DELETE | `/api/services/**` | Admin | Manage services |
| PATCH | `/api/services/{id}/availability` | Admin | Toggle service availability |
| PATCH | `/api/services/{id}/payment-limit` | Admin | Set advance/payment limit |
| POST | `/api/bookings` | Customer | Book a service/hall for a date |
| GET | `/api/bookings/my` | Customer | View own bookings |
| GET | `/api/bookings` | Admin | View all bookings |
| PATCH | `/api/bookings/{id}/status` | Admin | Confirm/cancel/complete booking |
| GET | `/api/dashboard/me` | Customer | Customer dashboard data |
| GET | `/api/admin/invoices` | Admin | All invoices (admin-only, as required) |
| PATCH | `/api/admin/invoices/{id}/pay` | Admin | Record a payment |
| GET | `/api/admin/summary` | Admin | Dashboard stats |
| GET | `/api/admin/customers` | Admin | List all customers |

All authenticated requests need header: `Authorization: Bearer <token>` (returned by login/register).

## Notes on access control
- Login is unified but role-checked: a customer cannot log in through the "Admin" option and vice-versa, even with correct credentials for the wrong role.
- Payment amounts, limits, and invoices are **only** exposed under `/api/admin/**`, restricted to `ROLE_ADMIN` — customers never see other customers' payment data.
