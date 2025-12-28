# Ecommerce Store UI

A modern, responsive Angular application for an ecommerce store frontend. This application provides a complete user interface for browsing products, managing shopping carts, processing checkouts, and handling order history. It also includes an admin dashboard for store management.

## Features

- **Product Catalog**: Browse and search through available products
- **Shopping Cart**: Add, remove, and update items in your cart
- **Checkout Process**: Secure checkout with payment processing
- **Order History**: View past orders and their status
- **Admin Dashboard**: Manage store statistics, coupons, and inventory
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Angular Material**: Modern UI components for a polished experience

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Angular CLI](https://angular.dev/tools/cli) (version 20 or higher)

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

## Development

### Development Server

To start a local development server, run:

```bash
ng serve
```

Or using npm script:
```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project for production, run:

```bash
ng build
```

Or using npm script:
```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use:

```bash
ng test
```

Or using npm script:
```bash
npm test
```

### Running End-to-End Tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Project Structure

```
src/
├── app/
│   ├── features/
│   │   ├── admin/
│   │   │   └── admin-dashboard/     # Admin management interface
│   │   ├── cart/
│   │   │   └── cart/                # Shopping cart functionality
│   │   ├── checkout/
│   │   │   └── checkout/            # Checkout process
│   │   ├── orders/
│   │   │   └── order-history/       # Order history and tracking
│   │   └── store/
│   │       └── product-catalog/     # Product browsing and catalog
│   ├── models/                      # Data models and interfaces
│   ├── services/                    # API services and business logic
│   └── shared/                      # Shared components and utilities
├── assets/                          # Static assets
├── environments/                    # Environment configurations
└── styles/                          # Global styles
```

## Technologies Used

- **Angular 20**: Modern web framework
- **Angular Material**: UI component library
- **RxJS**: Reactive programming
- **TypeScript**: Type-safe JavaScript
- **SCSS**: Enhanced CSS preprocessing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
