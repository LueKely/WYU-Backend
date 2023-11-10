# Project Name

Backend for What's your ulam?

## Endpoints

### User Login

Endpoint: `/api/user/login`

**Request:**

```json
{
	"login_identifier": "",
	"password": ""
}
```

Description:
- `login_identifier`: The identifier for login, such as username or email.
- `password`: The user's password.

```json
{
	"login_identifier": "exampleuser",
	"password": "secretpassword"
}
```
### User Register
Endpoint: `/api/user/login`

```json
{
	"username": "",
	"email": "",
	"password": "",
	"first_name": "",
	"last_name": ""
}
```

Description:
- `username`: The desired username for registration.
- `email`: The user's email address.
- `password`: The user's password.
- `first_name`: The user's first name.
- `last_name`: The user's last name.