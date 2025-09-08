# Wawi Stock Management Server

## Deployment

- **Live Link**: [Live server link]()

## Postman API Documentation:

- **[Postman API Documentation]()**

## Technologies Used

- TypeScript
- Express
- Prisma
- PostgreSQL
- Zod

## Getting Started

To get a local copy of the project up and running, follow these steps:

1. **Clone the Repository:**

```shell
git clone <repository-link>
```

2. **Navigate to the Project Directory:**

```shell
cd <project_name>
```

3. Please update the filename from `.env.example` to `.env` and Fill your own data

4. **Install Dependencies:**

```shell
pnpm i
```

or

```shell
yarn
```

or

```shell
npm i
```

5. **Generate Prisma:**

```shell
npx prisma generate
```

6. **Generate migration:**

```shell
npx prisma migrate

```

7. **Start the Server:**

```shell
pnpm dev
```

or

```shell
yarn dev
```

or

```shell
npm run dev
```

The server will be running at **`http://localhost:5000`** .

## Setup Steps

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Git

### Environment Configuration

1. Copy `.env.example` to `.env`
2. Configure the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT token generation
   - `PORT`: Server port (default: 5000)

### Database Setup

1. Ensure PostgreSQL is running
2. Run `npx prisma generate` to generate Prisma client
3. Run `npx prisma migrate` to sync database schema

## Approach

This wawi stock management server follows a **RESTful API architecture** with the following key design decisions:

- **TypeScript**: For type safety and better development experience
- **Prisma ORM**: For database operations with auto-generated types
- **JWT Authentication**: Secure user authentication and authorization
- **Zod Validation**: Runtime type validation for request/response data
- **Modular Structure**: Separated routes, controllers, and services for maintainability
- **Error Handling**: Centralized error handling with appropriate HTTP status codes
- **Input Validation**: Comprehensive validation using Zod schemas

## Contributing

Contributions are welcome! If you find any bugs or want to suggest improvements, please open an issue or create a pull request.

## License

Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## More Projects and Information

👉 Explore additional projects and find out more about my work on my portfolio website: [Md Mobassher Hossain](https://mobassher.vercel.app)
