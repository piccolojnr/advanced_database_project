# Rain Forest Exotics Inventory Management System

A web-based inventory management system for tracking exotic plants and animals.

## Features

- User authentication with role-based access control (Admin/Staff)
- Complete CRUD operations for species management
- Real-time inventory tracking
- Low stock alerts
- Search and filter functionality

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a PostgreSQL database named 'rainforest_exotics'

3. Update the .env file with your database credentials

4. Start the server:
```bash
npm start
```

## Default Admin Credentials

- Email: admin@rainforestexotics.com
- Password: admin123

**Important:** Change these credentials in production!

## API Endpoints

### Authentication
- POST /api/auth/login - Login
- POST /api/auth/register - Register new user (Admin only)
- GET /api/auth/profile - Get current user profile

### Species Management
- GET /api/species - Get all species
- GET /api/species/:id - Get single species
- POST /api/species - Create new species (Admin only)
- PUT /api/species/:id - Update species (Admin only)
- PATCH /api/species/:id/quantity - Update species quantity
- DELETE /api/species/:id - Delete species (Admin only)

## Query Parameters for Species

- type: Filter by type (PLANT/ANIMAL)
- status: Filter by status (AVAILABLE/RESERVED/OUT_OF_STOCK)
- search: Search by name or scientific name
