# Wawi Stock Management Server

## Postman API Documentation:

- **[Postman API Documentation](https://documenter.getpostman.com/view/20678245/2sB3HnJK4B)**

## Technologies Used

- TypeScript
- Express
- Prisma
- PostgreSQL
- Zod

---

## Getting Started

To get a local copy of the project up and running, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone <repository-link>
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd <project_name>
   ```

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`
   - Update the values:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `PORT`: Server port (default: 5000)

4. **Install Dependencies:**

   ```bash
   pnpm install
   # or
   yarn install
   # or
   npm install
   ```

5. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

6. **Run Migrations:**

   ```bash
   npx prisma migrate dev
   ```

7. **Start the Server:**

   ```bash
   pnpm dev
   # or
   yarn dev
   # or
   npm run dev
   ```

Server will be running at **`http://localhost:5000`**.

---

## API Endpoints

### 🔹 Stock APIs

- `POST /stock/in` → Add stock to a warehouse
- `POST /stock/out` → Remove stock (prevents negatives)
- `POST /stock/transfer` → Transfer stock between warehouses
- `GET /stock/summary` → Stock totals per warehouse and overall

### 🔹 Product APIs

- `POST /products` → Create a product
- `GET /products` → List all products
- `GET /products/id` → Get Product by id
- `PATCH /products/id` → Update product by id
- `DELETE /products/id` → Delete product by id

### 🔹 Warehouse APIs

- `POST /warehouses` → Create a warehouse
- `GET /warehouses` → List all warehouses
- `GET /warehouses/id` → Get warehouse by id
- `PATCH /warehouses/id` → Update warehouse by id
- `DELETE /warehouses/id` → Delete warehouse by id

---

## Approach

This WaWi stock management server follows a **RESTful API architecture** with the following design principles:

- **Transaction-safe stock operations**: Prevents negative stock using transactions and locks
- **Idempotency**: Ensured with a unique `operationKey` for each stock operation
- **Immutable ledger**: Stock changes are always recorded in a ledger (never updated in place)
- **Summary view**: Provides stock totals per warehouse and overall
- **TypeScript + Prisma**: For strong typing and database abstraction
- **Zod validation**: Runtime validation for request/response data
- **Modular structure**: Clear separation of controllers, services, and routes
- **Error handling**: Centralized error responses with proper HTTP status codes

---

## Setup Requirements

- Node.js (v18 or higher)
- PostgreSQL
- Git

---

## Contributing

Contributions are welcome!
If you find any bugs or want to suggest improvements, please open an issue or create a pull request.

---

## License

Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## More Projects and Information

👉 Explore more projects and my portfolio: [Md Mobassher Hossain](https://mobassher.vercel.app)
