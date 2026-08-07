# Bille Backend Project State

## Overview
This project is a backend service for the Bille application. It is currently in an early scaffold stage and provides a minimal Express server with Prisma integration for PostgreSQL.

## Technology Stack
- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- dotenv, cors

## Current Structure
- src/app.ts: creates the Express app and sets up middleware
- src/server.ts: starts the HTTP server
- prisma/schema.prisma: defines the database schema
- src/controllers, src/routes, src/services, src/models: directories exist but currently contain no implementation

## Existing API
The app currently exposes a simple health-style endpoint:
- GET / -> returns a JSON object with app name, version, and a running message

## Database Model
The Prisma schema currently includes:
- Customer model
- Transaction model
- TransactionType enum with CHARGE, PAYMENT, and ADJUSTMENT

## Project Status
- Basic server setup is complete
- Prisma schema is defined
- No business routes or controllers are implemented yet
- No service layer or data access layer is implemented yet
- Database connection wiring is not yet completed in application code

## Next Suggested Steps
1. Implement routes for customers and transactions
2. Add controllers and services
3. Configure Prisma client usage in the app
4. Add validation and error handling
5. Connect the app to a real PostgreSQL database
