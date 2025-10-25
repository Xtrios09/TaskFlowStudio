
# TaskFlowStudio

> A modern, full-stack workflow/task-automation studio built with TypeScript.


> https://github.com/user-attachments/assets/35966cf3-891a-42e3-a7c3-3185a49d859c

<img width="1920" height="953" alt="Screenshot From 2025-10-25 17-05-46" src="https://github.com/user-attachments/assets/eba237ff-1b8d-4724-890b-d81af720f102" />
<img width="1920" height="953" alt="Screenshot From 2025-10-25 17-05-54" src="https://github.com/user-attachments/assets/07333177-d8c3-406a-af5c-03b8655e21b2" />
<img width="1920" height="953" alt="Screenshot From 2025-10-25 17-06-07" src="https://github.com/user-attachments/assets/afda2f11-b057-4277-a4f6-1157aa7af111" />
<img width="1920" height="953" alt="Screenshot From 2025-10-25 17-06-17" src="https://github.com/user-attachments/assets/457baf6f-5b65-4a35-9d6f-d64e83595b69" />
<img width="1920" height="953" alt="Screenshot From 2025-10-25 17-06-26" src="https://github.com/user-attachments/assets/a55f0daf-8814-4683-99c4-b3974a46ceb2" />


## 🚀 What is TaskFlowStudio?

TaskFlowStudio is a flexible, extensible environment for building, managing and executing task-flows.  
It features:

- A **client** UI built with modern tooling (TS, Vite, Tailwind CSS)  
- A **server** backend for orchestration of workflows  
- Shared code/components inside a `shared/` folder for DRY architecture  
- Infrastructure ready for database configuration with Drizzle ORM (`drizzle.config.ts`)  
- Tailored to teams or individuals who want to visually define and automate sequences of tasks.

## 🧱 Architecture overview

```

/client        → front-end application (UI for defining & monitoring flows)
/server        → backend application (API, workflow engine, persistence)
/shared        → shared types, utilities and UI/components between client & server
drizzle.config.ts → DB/ORM config
package.json, tsconfig.json, vite.config.ts → build tooling & project setup

````

## 🔧 Key Technologies

- TypeScript — end-to-end typed experience  
- Vite — fast build & dev environment for the client side  
- Tailwind CSS — utility-first styling  
- Drizzle ORM — type-safe database access (see `drizzle.config.ts`)  
- Node.js / Express (or similar) — backend framework  
- Monorepo structure (client + server + shared) for full-stack coherence  

## ✅ Features

- Define tasks, link them into flows (sequential or conditional)  
- Interactive UI to view, edit, and monitor flows  
- Backend handles flow execution, error handling, persistence  
- Shared types/components to keep client and server in sync  
- Easily extensible: add new task types, integrate external services, custom UI widgets  

## 📝 Getting Started

1. **Clone the repository**  
   ```
   bash
   git clone https://github.com/Xtrios09/TaskFlowStudio.git
   cd TaskFlowStudio


2. **Install dependencies**

   ```bash
   # from root or inside each of client & server as required
   npm install
   ```

3. **Configure environment**

   * Copy `.env.example` (if present) to `.env`
   * Edit database connection, ports, any API keys
   * Ensure `drizzle.config.ts` is configured properly for your database

4. **Run the applications**

   ```bash
   # Start server (in /server)
   npm run dev

   # Start client (in /client)
   npm run dev
   ```

5. **Access the UI**
   Open your browser and go to `http://localhost:<client-port>` (default typically 3000 or 5173)
   Use the UI to create task flows, view existing flows, trigger execution, inspect logs.

## 🛠 Usage & Development

* To create a new **task type**, extend the shared types, implement the backend handler, and expose UI controls in the client.
* To add a new **flow rule or condition**, modify the flow-engine logic in /server and update the UI accordingly.
* Use `npm run build` in each package when preparing production.
* Logging, error-handling, and retry mechanisms are important — make sure you handle failures gracefully.
* Add tests (unit/integration) in client & server to ensure reliability.

## 🧪 Testing

*(If testing setup is present — adapt accordingly.)*

```bash
# Run tests in client
cd client
npm test

# Run tests in server
cd server
npm test
```

## 📦 Deployment

* Build the client (`npm run build`), serve the static files (e.g., via Nginx or Express).
* Run the server as a Node.js service (e.g., with PM2, Docker).
* Configure environment variables for production (DB credentials, secrets, ports).
* Backup and manage the database models via migrations (if using Drizzle’s migration tool).
* Consider monitoring tools (logs, metrics) for production workflows.

## 🤝 Contributing

Contributions are welcome! If you’d like to suggest a feature or fix a bug:

* Fork this repo
* Create a branch (`git checkout -b feature/my-feature`)
* Commit and push your changes
* Open a Pull Request describing your changes
* Please follow the project’s coding style, include tests & documentation as applicable

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---
