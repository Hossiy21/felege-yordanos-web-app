\# ⛪ Church Management System API



A professional, role-based backend system built with \*\*Go (Golang)\*\*, \*\*Gin Gonic\*\*, and \*\*PostgreSQL\*\*.



\## 🚀 Features

\* \*\*Authentication\*\*: Secure JWT-based login and registration.

\* \*\*RBAC (Role-Based Access Control)\*\*: Different permissions for `admin` and `user`.

\* \*\*Letter Management\*\*: Create, Read, Update, and Soft-delete letters.

\* \*\*Data Ownership\*\*: Users can only see/edit their own letters; Admins see everything.

\* \*\*System Stats\*\*: Admin dashboard with real-time statistics.

\* \*\*Security\*\*: Rate limiting, CORS enabled, and environment variable configuration.



\## 🛠️ Tech Stack

\- \*\*Language\*\*: Go 1.23+

\- \*\*Framework\*\*: Gin Gonic

\- \*\*Database\*\*: PostgreSQL (using `pgxpool` for performance)

\- \*\*Environment\*\*: Docker \& `.env` support



\## 🚦 Getting Started



\### 1. Environment Setup

Create a `.env` file in the root directory:

```env

DB\_USER=postgres

DB\_PASSWORD=mypassword123

DB\_HOST=localhost

DB\_PORT=5432

DB\_NAME=church\_management\_db

PORT=8080

JWT\_SECRET=your\_super\_secret\_key

