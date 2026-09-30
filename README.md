# Subscription Manager Frontend

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38B2AC.svg)](https://tailwindcss.com/)
[![NextUI](https://img.shields.io/badge/NextUI-2.4.2-000000.svg)](https://nextui.org/)

A modern, responsive, and type-safe frontend application for the Subscription Manager. Built with React and TypeScript, it provides a seamless user interface for tracking recurring payments, visualizing expenses, and managing subscription categories. The application integrates securely with the backend via Keycloak authentication and RESTful APIs.

## 🚀 Features

- **Secure Authentication**: Single Sign-On (SSO) powered by Keycloak with automatic token management.
- **Interactive Dashboard**: Visual representation of subscription costs and category breakdowns using CanvasJS charts.
- **Full CRUD Interface**: Intuitive forms and tables for creating, reading, updating, and deleting subscriptions and categories.
- **Modern UI/UX**: Beautiful, accessible, and responsive components built with NextUI and styled via Tailwind CSS.
- **Type Safety**: Comprehensive TypeScript interfaces for API responses, props, and application state.
- **Modular Architecture**: Clean separation of concerns (pages, components, modals, auth, data).

## 🛠️ Tech Stack

- **Core**: React 18, TypeScript
- **Build Tool**: Create React App (react-scripts)
- **Styling**: Tailwind CSS, NextUI, Framer Motion, Emotion
- **State & Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Authentication**: Keycloak-js
- **Data Visualization**: CanvasJS React Charts

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A running instance of the [Subscription Manager Backend](https://github.com/Tokar08/SubscriptionManager) and Keycloak server.

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Tokar08/SubscriptionManagerFrontend.git
cd SubscriptionManagerFrontend
```

### 2. Install Dependencies
Install all required npm packages:
```bash
npm install
```
*(or `yarn install`)*

### 3. Configure Environment (Optional)
The Keycloak configuration is currently located in `src/auth/keycloak.ts`. Ensure the settings match your local Keycloak instance:
```typescript
const initOptions = {
    url: 'http://localhost:8081',
    realm: 'subscription-manager',
    clientId: 'subscription-manager',
    onLoad: 'login-required'
};
```
*Note: If your backend runs on a different port, update the Axios base URL in the respective API service files.*

### 4. Run the Development Server
Start the application in development mode:
```bash
npm start
```
The app will be available at `http://localhost:3000`. The page will automatically reload if you make edits to the source code.

## 📂 Project Structure

```text
src/
├── assets/          # Static assets (icons, images)
├── auth/            # Keycloak initialization and authentication logic
├── components/      # Reusable UI components (tables, forms, cards)
├── data/            # Static data and constants (e.g., currency lists)
├── interfaces/      # TypeScript type definitions and interfaces
├── modals/          # Modal dialog components for CRUD operations
├── pages/           # Main application views and route components
├── App.tsx          # Main application component and routing setup
├── index.tsx        # Application entry point
└── globals.css      # Global Tailwind CSS directives and custom styles
```

## 📡 API Integration

The frontend communicates with the backend REST API (default: `http://localhost:7878/api/v1`). All protected requests automatically attach the Keycloak Bearer token via Axios interceptors.

Key integrated endpoints:
- `GET /api/v1/subscriptions` – Fetch user subscriptions for the dashboard.
- `POST /api/v1/subscriptions` – Create a new subscription.
- `GET /api/v1/categories` – Fetch available categories for dropdowns and filtering.
- `GET /api/v1/subscriptions/total-amounts` – Fetch aggregated data for CanvasJS charts.

## 🏗️ Building for Production

To create an optimized production build:
```bash
npm run build
```
This command bundles React in production mode, minifies the code, and generates hashed filenames for optimal caching. The output will be in the `build/` directory, ready to be served by any static file server (e.g., Nginx, Vercel, Netlify).

## 🧪 Testing

Run the test suite in interactive watch mode:
```bash
npm test
```
