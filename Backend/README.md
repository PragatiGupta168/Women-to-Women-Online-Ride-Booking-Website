# Backend API Documentation

## User Registration Endpoint

### Endpoint Overview
The `/users/register` endpoint allows users to create a new account with email and password credentials.

---

## POST /users/register

### Description
Creates a new user account by validating input data, hashing the password using bcrypt, and returning a JWT authentication token along with user details.

### URL
```
POST /users/register
```

### Content-Type
```
application/json
```

---

## Request Data Structure

The endpoint requires a JSON payload with the following structure:

```json
{
  "email": "string",
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "password": "string"
}
```

### Required Fields

| Field | Type | Description | Validation Rules |
|-------|------|-------------|------------------|
| `email` | String | User's email address | Must be a valid email format |
| `fullname.firstname` | String | User's first name | Minimum 3 characters |
| `fullname.lastname` | String | User's last name | Minimum 3 characters |
| `password` | String | User's password | Minimum 6 characters |

### Field Validation Details

- **Email**: Must match standard email format (e.g., user@domain.com). Must be unique in the database.
- **First Name**: Must be at least 3 characters long. Required field.
- **Last Name**: Must be at least 3 characters long. Required field.
- **Password**: Must be at least 6 characters long. Will be hashed using bcrypt (10 salt rounds) before storage.

---

## Request Example

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "password": "securePassword123"
  }'
```

---

## Response Status Codes

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| `201 Created` | User successfully created | All validations passed, user created, token generated |
| `400 Bad Request` | Validation failed | Invalid email, short name/password, or missing required fields |
| `500 Internal Server Error` | Server error | Unexpected error during user creation |

---

## Success Response (201)

**Status Code:** `201 Created`

**Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDc5YTBkZjMxMjM0NTY3ODlhYmNkZWYiLCJpYXQiOjE2ODU4OTczOTZ9...",
  "user": {
    "_id": "6479a0df312345678abcdef",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

### Response Fields
- `token`: JWT authentication token for subsequent API requests
- `user._id`: Unique MongoDB identifier for the user
- `user.fullname`: User's first and last name
- `user.email`: User's registered email address
- `user.socketId`: Socket connection ID (initially null)

---

## Error Response (400)

**Status Code:** `400 Bad Request`

**Example - Invalid Email:**
```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Example - Short First Name:**
```json
{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

**Example - Short Password:**
```json
{
  "errors": [
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### Common Validation Error Messages

| Error Message | Cause | Solution |
|---------------|-------|----------|
| Invalid email address | Email format is incorrect | Provide a valid email (e.g., user@domain.com) |
| First name must be at least 3 characters long | Firstname is too short | Use at least 3 characters for first name |
| Last name must be at least 3 characters long | Lastname is too short | Use at least 3 characters for last name |
| Password must be at least 6 characters long | Password is too short | Use at least 6 characters for password |
| All fields are required | One or more fields are missing | Ensure all required fields are provided |

---

## Error Response (500)

**Status Code:** `500 Internal Server Error`

**Response Body:**
```json
{
  "error": "Internal server error",
  "message": "Error details"
}
```

---

## Data Processing Flow

1. **Validation**: Express-validator middleware validates all input fields
2. **Password Hashing**: Password is hashed using bcrypt with 10 salt rounds
3. **User Creation**: User document is created in MongoDB database
4. **Token Generation**: JWT token is generated using user's MongoDB `_id`
5. **Response**: Returns JWT token and user details (password excluded from response)

---

## Security Considerations

- **Password Hashing**: All passwords are hashed using bcrypt before storage. Plain text passwords are never stored.
- **Email Uniqueness**: Database enforces unique email constraint to prevent duplicate accounts.
- **JWT Token**: Returned token should be stored securely on the client side.
- **HTTPS**: Always use HTTPS in production to encrypt data in transit.
- **Environment Variables**: JWT_SECRET must be configured in environment variables.

---

## Implementation Files

- **Route Definition**: `routes/user.routes.js`
- **Controller**: `controllers/user.controller.js`
- **Service**: `services/user.service.js`
- **Model**: `models/user.model.js`

---

## Environment Requirements

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for signing JWT tokens | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 3000) | No |

---

## Testing

### Using Postman
1. Method: `POST`
2. URL: `http://localhost:3000/users/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "testuser@example.com",
  "fullname": {
    "firstname": "Test",
    "lastname": "User"
  },
  "password": "TestPassword123"
}
```

### Using JavaScript Fetch API
```javascript
const registerUser = async (userData) => {
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
      console.error('Registration failed:', errorData.errors);
      return;
    }

    const data = await response.json();
    console.log('Registration successful!');
    localStorage.setItem('authToken', data.token);
    console.log('User:', data.user);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
registerUser({
  email: 'newuser@example.com',
  fullname: {
    firstname: 'New',
    lastname: 'User'
  },
  password: 'MySecurePassword123'
});
```

---

## Version
**v1.0** - Initial release (May 23, 2026)
