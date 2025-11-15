# Test Refresh Token Endpoint

## Using curl (in terminal):

```bash
# Replace with your actual refresh token from cookies
curl -X POST http://localhost:3000/auth/refresh-token \
  -H "Cookie: refreshToken=YOUR_REFRESH_TOKEN_HERE" \
  -v
```

## Using Postman:

1. Create a new POST request to `http://localhost:3000/auth/refresh-token`
2. Go to **Headers** tab
3. Add: `Cookie: refreshToken=YOUR_TOKEN_HERE`
4. Send request
5. Check the response

## Expected Response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## If 500 Error:

Check your backend console for the actual error message. Common issues:

- `req.cookies is undefined` → Missing cookie-parser middleware
- `JWT_REFRESH_SECRET is not defined` → Missing env variable
- `User not found` → User lookup failing in database
- `jwt.verify error` → Wrong secret or malformed token
