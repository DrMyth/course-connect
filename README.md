# Course Connect

Course Connect is a backend application for a course-selling platform. It provides APIs for users to register, log in, purchase courses, and view available courses. Admins can log in, create and manage course content. This project is built using Node.js, Express, MongoDB, and JWT (JSON Web Tokens) for authentication.

## Tech Stack

- **Node.js**: Backend runtime environment
- **Express**: Framework for handling HTTP requests and routing
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB ORM for defining schemas and handling database operations
- **jsonwebtoken**: Library for generating and verifying JWTs

## Features
### User
- **Sign Up**: Allows users to create an account.
- **Login**: Allows users to log in and receive an authentication token.
- **Purchase a Course**: Enables users to purchase courses.
- **View Courses**: Users can see all available courses.

### Admin
- **Admin Sign Up**: Allows admins to create an account.
- **Admin Login**: Allows admins to log in and receive an authentication token.
- **Create Course**: Enables admins to create a new course.
- **Edit Course**: Enables admins to edit their courses.

---

## **Admin Router (`/admin`)**

1. **POST `/admin/signup`** - Registers a new admin account.
2. **POST `/admin/signin`** - Authenticates an admin and returns a JWT token.
3. **POST `/admin/course`** - Creates a new course (admin authentication required).
4. **PUT `/admin/course`** - Updates an existing course by ID (admin authentication required).
5. **GET `/admin/course/bulk`** - Retrieves all courses created by the admin (admin authentication required).


## **Course Router (`/course`)**

1. **POST `/course/purchase`** - Allows a user to purchase a course (user authentication required).
2. **GET `/course/preview`** - Retrieves a preview of all available courses.

## **User Router (`/user`)**

1. **POST `/user/signup`** - Registers a new user account.
2. **POST `/user/signin`** - Authenticates a user and returns a JWT token.
3. **GET `/user/purchases`** - Retrieves all courses purchased by the user (user authentication required).

---

# Course Connect - Project Setup

## 1. Prerequisites

- Ensure **Node.js** and **MongoDB** are installed on your system.
- Install **Postman** or any API testing tool to test the APIs.

## 2. Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/varunmaramreddy/course-connect.git
    cd course-connect
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

   - Create a `.env` file in the root directory.
   - Add the following variables:

    ```plaintext
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

## 3. Run the Application

- **Start the server**:

    ```bash
    npm run start
    ```

- The server should start on [http://localhost:5000](http://localhost:5000)

- Use Postman or any API client to test the routes.

## Conclusion

Thank you for exploring the **Course Connect** project! This application serves as a comprehensive solution for managing courses, allowing users to seamlessly sign up, sign in, and purchase courses while ensuring secure authentication and authorization.

We hope this project meets your needs and provides a valuable resource for anyone looking to engage with course management in a user-friendly environment.

If you have any feedback or suggestions, feel free to reach out!

