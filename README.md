# Ecommerce Store UI

A modern, responsive Angular application providing a complete frontend for an ecommerce store. Users can browse products, manage shopping carts, process checkouts, and view order history. Includes an admin dashboard for store management.

## Features

- Product catalog with browsing and search
- Shopping cart management
- Secure checkout process
- Order history tracking
- Admin dashboard for statistics, coupons, and inventory
- Responsive design for desktop and mobile
- Built with Angular Material for a polished UI

## Prerequisites

- Node.js (version 18 or higher)
- npm (included with Node.js)
- Angular CLI (version 20 or higher)

Install Angular CLI globally:
```bash
npm install -g @angular/cli
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ecommerce-store-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Start the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The app reloads automatically on file changes.

## Build

Build for production:
```bash
npm run build
```

Artifacts are stored in the `dist/` directory.

## Testing

Run unit tests:
```bash
npm test
```

## Project Structure

```
src/
├── app/
│   ├── features/          # Feature modules (admin, cart, checkout, orders, store)
│   ├── models/            # Data models and interfaces
│   ├── services/          # API and business logic services
│   └── shared/            # Shared components
├── assets/                # Static assets
├── environments/          # Environment configurations
└── styles/                # Global styles
```

## Technologies

- Angular 20
- Angular Material
- RxJS
- TypeScript
- SCSS

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
