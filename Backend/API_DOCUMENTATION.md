# API Documentation

## User Registration Endpoint

### Overview
This document describes the `/users/register` endpoint, which handles user registration for the Women-to-Women Online Ride Booking Website.

---

## POST /users/register

### Description
Creates a new user account with the provided credentials. Validates input data, hashes the password, and returns a JWT authentication token along with the user details.

### URL
```
POST /users/register
```

### Request Headers
```
Content-Type: application/json
```

---

## Request Body

The request body must be sent as JSON with the following structure:

```json
{
  "email": "user@example.com",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "password": "securePassword123"
}
```

### Required Fields

| Field | Type | Description | Validation Rules |
|-------|------|-------------|------------------|
| `email` | String | User's email address | Must be a valid email format (e.g., user@domain.com) |
| `fullname.firstname` | String | User's first name | Must be at least 3 characters long |
| `fullname.lastname` | String | User's last name | Must be at least 3 characters long |
| `password` | String | User's password | Must be at least 6 characters long |

### Example Request

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "fullname": {
      "firstname": "Alice",
      "lastname": "Smith"
    },
    "password": "MySecurePass123"
  }'
```

---

## Response

### Success Response (201 Created)

**Status Code:** `201`

**Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "Alice",
      "lastname": "Smith"
    },
    "email": "alice@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

**Description:** User successfully created and JWT token generated.

---

## Error Responses

### Validation Error (400 Bad Request)

**Status Code:** `400`

**Scenario:** One or more validation rules are violated.

**Example Response:**
```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

### Common Validation Errors

| Validation Rule | Error Message | Example |
|-----------------|---------------|---------|
| Invalid Email | "Invalid email address" | `email: "invalid-email"` |
| First Name Too Short | "First name must be at least 3 characters long" | `firstname: "Jo"` |
| Last Name Too Short | "Last name must be at least 3 characters long" | `lastname: "Do"` |
| Password Too Short | "Password must be at least 6 characters long" | `password: "12345"` |

### Missing Required Fields (400 Bad Request)

**Status Code:** `400`

**Response Body:**
```json
{
  "errors": [
    {
      "msg": "All fields are required",
      "type": "Error"
    }
  ]
}
```

### Duplicate Email (400 Bad Request)

**Status Code:** `400`

**Scenario:** Email already exists in the database.

**Response Body:**
```json
{
  "errors": [
    {
      "msg": "Email already registered",
      "type": "Error"
    }
  ]
}
```

### Server Error (500 Internal Server Error)

**Status Code:** `500`

**Scenario:** An unexpected server error occurred.

**Response Body:**
```json
{
  "error": "Internal server error",
  "message": "Error message describing what went wrong"
}
```

---

## HTTP Status Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| `201 Created` | Success | User account successfully created |
| `400 Bad Request` | Client Error | Validation failed or missing required fields |
| `500 Internal Server Error` | Server Error | Unexpected server error during registration |

---

## Data Processing Flow

1. **Request Validation**: Express-validator middleware validates all input fields.
2. **Password Hashing**: Password is hashed using bcrypt with 10 salt rounds.
3. **User Creation**: User document is created in MongoDB with hashed password.
4. **Token Generation**: JWT token is generated using the user's MongoDB `_id`.
5. **Response**: Returns JWT token and user details (password is not included).

---

## Important Notes

- **Password Security**: Passwords are hashed using bcrypt and never stored in plain text. Never included in response data.
- **Email Uniqueness**: Email must be unique across the system. Duplicate emails will cause an error.
- **JWT Token**: The returned token should be used for authentication in subsequent API requests. Store it securely on the client.
- **Token Expiration**: Token expiration is determined by the `JWT_SECRET` environment variable and JWT configuration.
- **HTTPS**: Always use HTTPS in production to protect sensitive data in transit.

---

## Example Usage in JavaScript

```javascript
async function registerUser(userData) {
  try {
    const response = await fetch('http://localhost:3000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Registration failed:', errorData);
      return;
    }

    const data = await response.json();
    console.log('Registration successful!');
    console.log('Token:', data.token);
    console.log('User:', data.user);
    
    // Store token in localStorage or sessionStorage
    localStorage.setItem('authToken', data.token);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
registerUser({
  email: 'john@example.com',
  fullname: {
    firstname: 'John',
    lastname: 'Doe'
  },
  password: 'MyPassword123'
});
```

---

## Testing the Endpoint

### Using Postman
1. Create a new POST request to `http://localhost:3000/users/register`
2. Set `Content-Type` header to `application/json`
3. Paste the following in the body (raw JSON):
```json
{
  "email": "testuser@example.com",
  "fullname": {
    "firstname": "Test",
    "lastname": "User"
  },
  "password": "TestPass123"
}
```
4. Click Send and verify the response.

### Using cURL
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "fullname": {
      "firstname": "Test",
      "lastname": "User"
    },
    "password": "TestPass123"
  }'
```

---

## Environment Variables

The following environment variable is required:

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for signing JWT tokens | `your-secret-key-here` |

---

## Related Documentation

- [User Model Documentation](./models/USER_MODEL.md)
- [Authentication Guide](./AUTH_GUIDE.md)
- [Error Handling](./ERROR_HANDLING.md)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-05-23 | Initial documentation for `/users/register` endpoint |

---

## Support

For issues or questions regarding this endpoint, please contact the development team.
