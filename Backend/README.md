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

### Example Response Headers
```
HTTP/1.1 201 Created
Content-Type: application/json
Content-Length: 324
Connection: keep-alive
```

---

## Success Response Examples

### Example 1: Valid Registration
**Request:**
```json
{
  "email": "alice.smith@example.com",
  "fullname": {
    "firstname": "Alice",
    "lastname": "Smith"
  },
  "password": "SecurePass2024"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdjZTNmNDEyMzQ1NjY3ODhhYmNkZWYiLCJpYXQiOjE2ODU4OTc5MjZ9.kL9mNoPqRsT0uVwXyZ1aB2cDeFgHiJkLmNoPqRsT0u",
  "user": {
    "_id": "647ce3f412345667888abcdef",
    "fullname": {
      "firstname": "Alice",
      "lastname": "Smith"
    },
    "email": "alice.smith@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

### Example 2: Another Valid Registration
**Request:**
```json
{
  "email": "michael.johnson@example.com",
  "fullname": {
    "firstname": "Michael",
    "lastname": "Johnson"
  },
  "password": "MyPassword123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdjZTNmNDEyMzQ1NjY3ODhhYmNkZWYiLCJpYXQiOjE2ODU4OTc5MjZ9.aBcDeFgHiJkLmNoPqRsT0uVwXyZ1aB2cDeF",
  "user": {
    "_id": "647ce3f412345667888abcxyz",
    "fullname": {
      "firstname": "Michael",
      "lastname": "Johnson"
    },
    "email": "michael.johnson@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

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

**Example - Multiple Validation Errors:**
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
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

**Example - Missing Required Fields:**
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

**Example - Duplicate Email:**
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

**Example - Database Connection Error:**
```json
{
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

**Example - Password Hashing Error:**
```json
{
  "error": "Internal server error",
  "message": "Error during password encryption"
}
```

**Example - Token Generation Error:**
```json
{
  "error": "Internal server error",
  "message": "Failed to generate authentication token"
}
```

---

## Complete Request/Response Flow Examples

### Successful Registration Flow

**Step 1: Send Registration Request**
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.wilson@example.com",
    "fullname": {
      "firstname": "Sarah",
      "lastname": "Wilson"
    },
    "password": "SecurePassword2024"
  }'
```

**Step 2: Receive Success Response**
```
Status: 201 Created
```
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdjZTNmNDEyMzQ1NjY3ODhhYmNkZWYiLCJpYXQiOjE2ODU4OTc5MjZ9.kL9mNoPqRsT0uVwXyZ1aB2cDeFgHiJkLmNoPqRsT0u",
  "user": {
    "_id": "647ce3f412345667888abcdef",
    "fullname": {
      "firstname": "Sarah",
      "lastname": "Wilson"
    },
    "email": "sarah.wilson@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

**Step 3: Store Token for Future Requests**
```javascript
// Save token for subsequent API calls
localStorage.setItem('authToken', response.token);

// Use token in header for authenticated requests
fetch('/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
});
```

### Failed Registration Flow

**Step 1: Send Invalid Request**
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "fullname": {
      "firstname": "Jo",
      "lastname": "D"
    },
    "password": "123"
  }'
```

**Step 2: Receive Validation Error**
```
Status: 400 Bad Request
```
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
    },
    {
      "msg": "Last name must be at least 3 characters long",
      "param": "fullname.lastname",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

**Step 3: Handle Errors and Retry**
```javascript
// Correct the input and retry
const correctedData = {
  email: "valid@example.com",
  fullname: {
    firstname: "John",
    lastname: "Doe"
  },
  password: "SecurePassword123"
};

// Send corrected request
fetch('/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(correctedData)
});
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

---

# User Login Endpoint

## POST /users/login

### Description
Authenticates a user by validating their email and password credentials. Returns a JWT authentication token and user details upon successful authentication.

### URL
```
POST /users/login
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
  "password": "string"
}
```

### Required Fields

| Field | Type | Description | Validation Rules |
|-------|------|-------------|------------------|
| `email` | String | User's registered email address | Must be a valid email format |
| `password` | String | User's password | Minimum 6 characters |

### Field Validation Details

- **Email**: Must match standard email format (e.g., user@domain.com). Must be registered in the database.
- **Password**: Must be at least 6 characters long. Will be compared against the hashed password in the database using bcrypt.

---

## Request Example

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

---

## Response Status Codes

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| `200 OK` | User successfully authenticated | Email and password match |
| `400 Bad Request` | Validation failed or authentication failed | Invalid email format, short password, or invalid credentials |
| `401 Unauthorized` | User not found or password incorrect | Email doesn't exist or password mismatch |
| `500 Internal Server Error` | Server error | Unexpected error during authentication |

---

## Success Response (200)

**Status Code:** `200 OK`

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

### Example Response Headers
```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 324
Connection: keep-alive
```

---

## Success Response Examples

### Example 1: Valid Login
**Request:**
```json
{
  "email": "alice.smith@example.com",
  "password": "SecurePass2024"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdjZTNmNDEyMzQ1NjY3ODhhYmNkZWYiLCJpYXQiOjE2ODU4OTc5MjZ9.kL9mNoPqRsT0uVwXyZ1aB2cDeFgHiJkLmNoPqRsT0u",
  "user": {
    "_id": "647ce3f412345667888abcdef",
    "fullname": {
      "firstname": "Alice",
      "lastname": "Smith"
    },
    "email": "alice.smith@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

### Example 2: Another Valid Login
**Request:**
```json
{
  "email": "michael.johnson@example.com",
  "password": "MyPassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdjZTNmNDEyMzQ1NjY3ODhhYmNkZWYiLCJpYXQiOjE2ODU4OTc5MjZ9.aBcDeFgHiJkLmNoPqRsT0uVwXyZ1aB2cDeF",
  "user": {
    "_id": "647ce3f412345667888abcxyz",
    "fullname": {
      "firstname": "Michael",
      "lastname": "Johnson"
    },
    "email": "michael.johnson@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

---

## Error Response (400)

**Status Code:** `400 Bad Request`

**Example - Invalid Email Format:**
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

**Example - Missing Required Fields:**
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

---

## Error Response (401)

**Status Code:** `401 Unauthorized`

**Example - Invalid Credentials:**
```json
{
  "error": "Invalid email or password",
  "message": "Authentication failed"
}
```

**Example - User Not Found:**
```json
{
  "error": "User not found",
  "message": "No user registered with this email"
}
```

**Example - Wrong Password:**
```json
{
  "error": "Invalid password",
  "message": "Password does not match"
}
```

---

## Error Response (500)

**Status Code:** `500 Internal Server Error`

**Example - Database Query Error:**
```json
{
  "error": "Internal server error",
  "message": "Error querying database"
}
```

**Example - Password Comparison Error:**
```json
{
  "error": "Internal server error",
  "message": "Error during password verification"
}
```

**Example - Token Generation Error:**
```json
{
  "error": "Internal server error",
  "message": "Failed to generate authentication token"
}
```

---

## Complete Request/Response Flow Examples

### Successful Login Flow

**Step 1: Send Login Request**
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.wilson@example.com",
    "password": "SecurePassword2024"
  }'
```

**Step 2: Receive Success Response**
```
Status: 200 OK
```
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdjZTNmNDEyMzQ1NjY3ODhhYmNkZWYiLCJpYXQiOjE2ODU4OTc5MjZ9.kL9mNoPqRsT0uVwXyZ1aB2cDeFgHiJkLmNoPqRsT0u",
  "user": {
    "_id": "647ce3f412345667888abcdef",
    "fullname": {
      "firstname": "Sarah",
      "lastname": "Wilson"
    },
    "email": "sarah.wilson@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

**Step 3: Use Token for Authenticated Requests**
```javascript
// Save token for subsequent API calls
localStorage.setItem('authToken', response.token);

// Use token in header for authenticated requests
fetch('/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
});
```

### Failed Login Flow

**Step 1: Send Invalid Login Request**
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "WrongPassword123"
  }'
```

**Step 2: Receive Authentication Error**
```
Status: 401 Unauthorized
```
```json
{
  "error": "Invalid email or password",
  "message": "Authentication failed"
}
```

### Validation Error Flow

**Step 1: Send Request with Invalid Data**
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123"
  }'
```

**Step 2: Receive Validation Error**
```
Status: 400 Bad Request
```
```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

---

## Data Processing Flow

1. **Validation**: Express-validator middleware validates email format and password length
2. **User Lookup**: Database query finds user by email address
3. **Password Comparison**: Provided password is compared against hashed password using bcrypt
4. **Token Generation**: JWT token is generated if credentials match
5. **Response**: Returns JWT token and user details (password excluded from response)

---

## Security Considerations

- **Password Comparison**: Passwords are compared using bcrypt.compare() for secure verification
- **JWT Token**: Returned token should be stored securely on the client side
- **HTTPS**: Always use HTTPS in production to encrypt credentials in transit
- **Password Storage**: Passwords are never returned in response for security
- **Environment Variables**: JWT_SECRET must be configured in environment variables
- **Rate Limiting**: Consider implementing rate limiting to prevent brute force attacks
- **Session Management**: Token expiration should be configured appropriately

---

## Testing

### Using Postman
1. Method: `POST`
2. URL: `http://localhost:3000/users/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123"
}
```

### Using JavaScript Fetch API
```javascript
const loginUser = async (credentials) => {
  try {
    const response = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        console.error('Authentication failed:', errorData.error);
      } else {
        console.error('Login error:', errorData.errors);
      }
      return;
    }

    const data = await response.json();
    console.log('Login successful!');
    localStorage.setItem('authToken', data.token);
    console.log('User:', data.user);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
loginUser({
  email: 'user@example.com',
  password: 'MyPassword123'
});
```

---

## Version
**v1.0** - Initial release (May 23, 2026)
