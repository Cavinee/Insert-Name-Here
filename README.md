# Cointract

Welcome to Cointract, a decentralized freelance marketplace built on the Internet Computer. This platform connects clients with skilled freelancers from around the globe, offering a seamless and secure environment for digital services. Inspired by platforms like Fiverr, Cointract leverages Web3 technologies to provide a transparent, efficient, and low-cost solution for the gig economy.

## ✨ Features

  - **Decentralized Identity**: Secure authentication using Internet Identity
  - **Service Listings**: Freelancers can create, update, and manage their service offerings
  - **Package Tiers**: Services can be offered in multiple tiers (e.g., Basic, Standard, Premium) with different prices, delivery times, and features
  - **Client and Freelancer Profiles**: Dedicated profiles for clients and freelancers to showcase their information, skills, and history
  - **Order Management**: A comprehensive system for creating, accepting, and managing orders between clients and freelancers
  - **Secure Payments**: Integration with a ledger canister for handling transactions, with plans for an escrow system to secure funds until work is completed
  - **Review and Reputation System**: Clients and freelancers can review each other after a completed order, contributing to a transparent reputation system
  - **Chat System**: Real-time messaging between clients and freelancers for seamless communication
  - **Search and Filtering**: Users can easily search for services and filter them by category, price, and rating

## 🛠️ Technology Stack]

### Frontend

| Technology | Badge |
| :--- | :--- |
| **Vite** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) |
| **React** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) |
| **TypeScript** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
| **Tailwind CSS** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |

---

### Backend

| Technology | Badge |
| :--- | :--- |
| **Internet Computer** | ![Internet Computer](https://img.shields.io/badge/Internet_Computer-3B00B9?style=for-the-badge&logo=internetcomputer&logoColor=white) |
| **Motoko** | ![Motoko](https://img.shields.io/badge/Motoko-7A0489?style=for-the-badge&logo=motoko&logoColor=white) |

---

### Tooling

| Technology | Badge |
| :--- | :--- |
| **DFX** | ![DFX](https://img.shields.io/badge/DFX-3B00B9?style=for-the-badge&logo=internetcomputer&logoColor=white) |
| **Vitest**| ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white) |
| **Mops** | ![Mops](https://img.shields.io/badge/Mops-7A0489?style=for-the-badge&logo=motoko&logoColor=white) |



## 🏗️ Architecture

The application is structured as a collection of interconnected canisters, each responsible for a specific domain of the marketplace. This modular architecture enhances scalability and maintainability.

  - **`frontend`**: Serves the React-based user interface
  - **`backend`**: A general-purpose canister, currently used for identity and profile checks
  - **`Client_backend`**: Manages client profiles and data
  - **`Freelancer_backend`**: Manages freelancer profiles, including skills and availability
  - **`Service_backend`**: Handles the creation, updating, and retrieval of service listings
  - **`Order_backend`**: Manages the lifecycle of orders, from creation to completion
  - **`Review_backend`**: Stores and manages reviews for completed orders
  - **`Chat_backend`**: Facilitates real-time communication between users
  - **`Payment`**: Contains the logic for handling payments and escrow services
  - **`icp_ledger_canister`**: An instance of the ICRC-1 ledger canister for token transactions

The project also includes several `seeder` canisters for populating the marketplace with initial data for development and testing purposes

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your system:

  - [Node.js](https://nodejs.org/) (version 20.x or higher)
  - [DFX](https://internetcomputer.org/docs/current/developer-docs/build/install-upgrade-remove) (version 0.14 or higher)

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/cavinee/cointract.git
    cd cointract
    ```

2.  **Install frontend dependencies:**

    ```sh
    npm install
    ```

3.  **Install Motoko packages:**

    ```sh
    mops install
    ```

4.  **Start the local replica:**

    ```sh
    dfx start --clean --background
    ```

5.  **Deploy the canisters:**

    ```sh
    npm run setup
    ```

    This script installs npm packages, creates all canisters, generates type bindings, and deploys the application to your local replica

### Running the Application

Once the setup is complete, you can run the application with the following command:

```sh
npm start
```

This will start the Vite development server for the frontend and the `mo-dev` server for live reloading of your Motoko canisters

  - Frontend will be available at `http://localhost:3000`
  - The local replica will be running at `http://127.0.0.1:8000`

## 📂 Project Structure

```
.
├── backend/                  # Motoko source code
│   ├── Client_backend/       # Canister for managing clients
│   ├── Freelancer_backend/   # Canister for managing freelancers
│   ├── Order_backend/        # Canister for managing orders
│   ├── Payment/              # Canister for payments and escrow
│   ├── Review_backend/       # Canister for reviews
│   ├── Service_backend/      # Canister for services
│   ├── Chat_backend/         # Canister for chat functionality
│   ├── Seeders/              # Data seeders for development
│   ├── tests/                # Backend tests
│   ├── Backend.mo            # Main backend canister
│   └── Types.mo              # Shared data types
├── src/                      # Frontend source code (Vite + React)
│   ├── assets/               # Static assets
│   ├── components/           # Reusable UI components
│   ├── declarations/         # Canister type declarations
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Library functions and utilities
│   ├── pages/                # Application pages
│   ├── routes/               # Routing configuration
│   ├── types/                # Frontend type definitions
│   ├── utility/              # Utility functions and context
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── .github/                  # GitHub Actions workflows
├── dfx.json                  # DFX project configuration
├── package.json              # NPM package configuration
└── vite.config.ts            # Vite configuration
```

## 📜 Available Scripts

In the project directory, you can run:

  - `npm run setup`: Installs dependencies, creates canisters, generates type bindings, and deploys the application.
  - `npm start`: Starts the frontend and backend development servers concurrently.
  - `npm run frontend`: Starts only the Vite development server for the frontend.
  - `npm run backend`: Starts only the `mo-dev` server for the backend.
  - `npm test`: Runs both frontend and backend tests.
  - `npm run build`: Compiles TypeScript and builds the frontend for production.
  - `npm run format`: Formats both frontend and backend code using Prettier.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
