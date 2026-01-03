# API Documentation

This directory is structured to follow the Marvel project model and would contain API documentation in a full-stack implementation.

## Overview

In a complete backend implementation, this folder would include:

### Swagger/OpenAPI Documentation
- `swagger.yaml` or `openapi.json` - API specification
- Interactive API documentation
- Endpoint definitions and schemas

### API Endpoints (Planned)

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

#### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (restaurateur only)
- `PUT /api/restaurants/:id` - Update restaurant (restaurateur only)
- `DELETE /api/restaurants/:id` - Delete restaurant (restaurateur only)

#### Menu Items
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/restaurants/:id/menu` - Add menu item (restaurateur only)
- `PUT /api/menu/:id` - Update menu item (restaurateur only)
- `DELETE /api/menu/:id` - Delete menu item (restaurateur only)

#### Orders
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (restaurateur only)
- `DELETE /api/orders/:id` - Cancel order

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

## Current Implementation

**Note:** The current Fast Food App implementation uses **local storage** for all data persistence and does not require a backend API. This structure is maintained for:
- Future scalability to a full-stack architecture
- Conformity with the Marvel project structure
- Documentation and reference purposes

## Authentication

When implemented, the API would use:
- JWT (JSON Web Tokens) for authentication
- Bearer token in Authorization header
- Token stored in localStorage on client side

## Data Models

Refer to the main project documentation in `/docs/assets/Relazione.md` for detailed data models.

## Error Handling

Standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Or for errors:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```
