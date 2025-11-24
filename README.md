# Betel_TV Project Setup Guide

Follow these steps to get the website running on your computer.

## Part 1: Setting up the Frontend (React App)

### Step 1: Install Node.js
1. Download **Node.js (LTS version)** from [nodejs.org](https://nodejs.org/).
2. Install it. To check if it worked, open your terminal (Command Prompt or PowerShell) and type:
   ```bash
   node -v
   npm -v
   ```

### Step 2: Create the Project
1. Open your terminal/command prompt.
2. Navigate to where you want the project (e.g., Desktop):
   ```bash
   cd Desktop
   ```
3. Create a new Vite project (it's faster/better than Create-React-App):
   ```bash
   npm create vite@latest betel_tv -- --template react-ts
   ```
4. Enter the folder:
   ```bash
   cd betel_tv
   ```

### Step 3: Install Dependencies
Run the following commands to install the libraries used in the code (React Router, Icons, Charts, etc.):
```bash
npm install
npm install react-router-dom lucide-react recharts
npm install -D tailwindcss postcss autoprefixer
```

### Step 4: Configure Tailwind CSS
1. Initialize Tailwind:
   ```bash
   npx tailwindcss init -p
   ```
2. Open `tailwind.config.js` in your code editor and change the content line to this:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```
3. Open `src/index.css` and replace everything with:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   /* Custom Scrollbar */
   ::-webkit-scrollbar { width: 8px; height: 8px; }
   ::-webkit-scrollbar-track { background: #18181b; }
   ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
   ::-webkit-scrollbar-thumb:hover { background: #52525b; }
   ```

### Step 5: Organize Your Files
Delete the default files inside the `src` folder and create this structure:
```
betel_tv/
├── index.html
├── src/
│   ├── main.tsx        (Rename index.tsx to main.tsx for Vite)
│   ├── App.tsx
│   ├── types.ts
│   ├── constants.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── services/
│   │   └── mockApi.ts
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── VideoCard.tsx
│   │   ├── ... (other components)
│   └── pages/
│       ├── Home.tsx
│       ├── AdminDashboard.tsx
│       └── ... (other pages)
```

**Important:** In `src/main.tsx`, ensure you import the CSS:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Add this line

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 6: Run the App
In your terminal, run:
```bash
npm run dev
```
Open the link shown (usually `http://localhost:5173`) to see your **Betel_TV** site running!

---

## Part 2: Uploading the Database (MySQL)

Even though the current React app uses a "Mock API" (simulated data), you need to set up the real database for the future backend.

### Step 1: Install a Database Server
1. Download **XAMPP** (easiest for Windows) from [apachefriends.org](https://www.apachefriends.org/).
2. Install and open **XAMPP Control Panel**.
3. Click **Start** next to **Apache** and **MySQL**.

### Step 2: Access the Database Manager
1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click **New** in the left sidebar.
3. Database name: `betel_tv_db`
4. Click **Create**.
