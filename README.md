# 🛠️ Maintenance Task Tracker (Enterprise Edition)

A high-performance Full-Stack application built using the latest **.NET 10** ecosystem and **React TS**. 

## 🏗️ Architecture Overview
The project follows a **Layered Architecture** to ensure separation of concerns and maintainability:

- **Core:** Contains domain entities, enums, and the `Result` pattern logic.
- **Repository Layer:** Handles direct data access and encapsulation of EF Core 10 logic.
- **Service Layer:** Contains the business logic, orchestrating between repositories and DTOs.
- **WebAPI:** The entry point, handling HTTP requests, middleware, and CORS configuration.
- **ClientApp:** A modern React frontend powered by Vite, TypeScript, and Tailwind CSS.



## 🚀 Technical Highlights (.NET 10 + React)
- **Unified Result Pattern:** Consistent API responses across the entire system.
- **Generic Repository:** Clean data access layer.
- **Frontend Dashboard:** Real-time data visualization with Recharts.
- **Vite Build Pipeline:** Automated build process that transfers assets to `wwwroot`.

## 🛠️ Installation & Setup

1. **Prerequisites:** .NET 10 SDK & Node.js (Latest LTS).
2. **Database:** - Update `ConnectionStrings` in `appsettings.json`.
   - Run `dotnet ef database update`.
3. **Running the App:**
   ```bash
   # Run Backend
   dotnet run --project WebAPI
   
   # Run Frontend
   cd ClientApp
   npm install
   npm run dev