# FindAMech

A full-stack web application that connects customers with mechanics for automotive services. Built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure signup and login for both customers and mechanics
- **Service Booking**: Customers can browse mechanics and book services
- **Real-time Bookings**: Mechanics can accept/reject bookings and manage their schedule
- **Payment Integration**: Secure payments through Paystack
- **Location Services**: GPS-based location capture for service requests
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Hook Form (form handling)
- React Paystack (payment processing)
- React Icons (icon library)

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- CORS enabled

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Paystack account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ragnol666/FindaMech.git
   cd findamech
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your Paystack keys and API base URL
   npm run dev
   ```

### Environment Variables

#### Backend (.env)
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secure_jwt_secret
NODE_ENV=development
PORT=5000
```

#### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: npm run build
   - **Output Directory**: dist
3. Add environment variables in Vercel dashboard

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set build settings:
   - **Build Command**: npm install
   - **Start Command**: node server.js
3. Add environment variables in Render dashboard

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service (mechanics only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status

### Mechanics
- `GET /api/mechanics` - Get all mechanics
- `GET /api/mechanics/:id` - Get mechanic details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email gilbert@example.com or create an issue in this repository.