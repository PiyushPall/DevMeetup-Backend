# DevMeetup Backend - Updated

## Setup
1. Open this folder in VS Code.
2. Run `npm install`.
3. Create a `.env` file from `.env.example`.
4. Put your MongoDB connection string and JWT secret in `.env`.
5. Run `npm run dev`.
6. Server: http://localhost:3000

## Important
The ZIP intentionally does not contain your original `.env` credentials. Copy the values from your existing backend `.env` into the new `.env` file.

## API endpoints

### Public
- GET `/` - server test
- POST `/user/signup` - create account
- POST `/user/login` - login and receive JWT
- GET `/user/user/:id` - get one user by ID

### Protected (send `Authorization: Bearer <token>`)
- GET `/user/profile` - logged-in user's profile
- GET `/user/users` - all users
- PATCH `/user/updateProfile` - update logged-in user's profile
- PATCH `/user/user/:id` - update own profile by ID
- DELETE `/user/user/:id` - delete own account
- POST `/user/sendRequest/:toUserId` - send connection request
- PATCH `/user/acceptRequest/:id/:status` - accept/reject request
- GET `/user/view/allRequest` - incoming pending requests
- GET `/user/view/request/:id` - view pending request from a user

## Postman testing

### 1. Signup
POST http://localhost:3000/user/signup
Body -> raw -> JSON:
```json
{
  "firstName": "Piyush",
  "lastName": "Pal",
  "emailId": "piyush@example.com",
  "password": "Piyush@123",
  "age": 21,
  "phone": "9876543210",
  "skills": ["React", "Node.js", "MongoDB"]
}
```

### 2. Login
POST http://localhost:3000/user/login
Body -> raw -> JSON:
```json
{
  "emailId": "piyush@example.com",
  "password": "Piyush@123"
}
```
Copy the `token` from the response.

### 3. Profile
GET http://localhost:3000/user/profile
Headers:
`Authorization: Bearer YOUR_TOKEN`

Do NOT add `?userId=...` because the user ID is taken from the JWT.

### 4. Update profile
PATCH http://localhost:3000/user/updateProfile
Headers:
`Authorization: Bearer YOUR_TOKEN`
`Content-Type: application/json`
Body:
```json
{
  "firstName": "Piyush",
  "age": 22,
  "skills": ["React", "Node.js", "MongoDB", "Express"]
}
```

### 5. Users
GET http://localhost:3000/user/users
Headers:
`Authorization: Bearer YOUR_TOKEN`

### 6. Send request
POST http://localhost:3000/user/sendRequest/OTHER_USER_ID
Headers:
`Authorization: Bearer YOUR_TOKEN`

### 7. Incoming requests
GET http://localhost:3000/user/view/allRequest
Headers:
`Authorization: Bearer YOUR_TOKEN`

### 8. Accept/reject request
PATCH http://localhost:3000/user/acceptRequest/FROM_USER_ID/accepted
or
PATCH http://localhost:3000/user/acceptRequest/FROM_USER_ID/rejected
Headers:
`Authorization: Bearer YOUR_TOKEN`
