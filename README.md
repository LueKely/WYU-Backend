# What's your Ulam? Backend

The What's your Ulam? Backend serves as the backbone for managing recipes, user authentication, and user interactions such as likes and comments. It comprises various components, including models, controllers, routes, middleware, and database connection.

## Models

### Recipe
The Recipe model represents the structure of recipe data in the database. It includes essential fields such as user ID, recipe name, image URL, difficulty level, cooking time, tags, description, ingredients, and instructions. Each recipe entry is associated with a user.

### User
The User model defines the structure of user data, encompassing fields like username, email, password, first name, and last name. User entries are utilized for authentication and ownership attribution to associated recipes.

### Like & Comment
The Like and Comment models are used to capture user interactions. The Like model links a user to a specific recipe they liked, while the Comment model associates a user's comment with a recipe.

## Models

### Recipe
The Recipe controller provides functions for retrieving recipes and creating new ones. It handles requests to fetch all recipes or a specific recipe by ID. Additionally, it facilitates the creation of a new recipe, ensuring that required fields are provided and the user is authenticated.

### User
The User controller manages user-related operations such as registration, login, and logout. It includes functions to register a new user, authenticate login attempts, and handle user logout requests.

### Interaction
The Interaction controller handles user interactions, specifically likes and comments. It validates incoming requests, ensuring required fields are present, and saves the interactions in the database.

## Routes

### Recipe
The Recipe routes define endpoints for retrieving and creating recipes. The `/` route retrieves all recipes, while the `/create` route is responsible for creating a new recipe. Both routes are protected by token validation middleware.

```terminal
	/api/recipe/ - get
	/api/recipe/create - post
```

**Request:**

```json
{
  "recipe_name": "",
  "image_url": "",
  "difficulty": "",
  "cooking_time": "",
  "tags": "",
  "description": "",
  "ingredients": "",
  "instructions": ""
}
```


### User
User routes handle user-related operations. The /register route allows users to register, /login facilitates user login, and /logout handles user logout. These routes are accessible without token validation.

```terminal
	/api/user/login - post
	/api/recipe/register - post
	/api/user/logout - post
```

**Request:**

```json
{
	"login_identifier": "",
	"password": ""
}
```

### Interaction
The Interaction route provides an endpoint for handling user interactions. The / route handles both likes and comments, with the type specified in the request body. It is protected by token validation.

```terminal
	/api/itr/
```

**Request:**

```json
{
	"user_id": "",
	"recipe_id": "",
	"itrType": "",
	"comment"?: ""
}
```

## Middleware

### TokenValidation
The TokenValidation middleware ensures that routes are protected by validating user tokens. It checks for the presence of a valid token in the request header, allowing access to protected routes only if the token is verified successfully.


### Database Connection
The ConnectDB module establishes a connection to the MongoDB database. It utilizes Mongoose to connect to the specified database using the connection string provided in the environment variables.
