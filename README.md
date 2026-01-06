# MarketSim

An advanced full-stack market simulation platform with AI-assisted features for analyzing trading strategies, market dynamics, and financial scenarios. Built with TypeScript, React, and modern web technologies.

## Overview

MarketSim is a comprehensive trading simulation environment designed to help traders, analysts, and students understand market mechanics, test strategies, and learn financial concepts in a risk-free environment. The platform features sophisticated market modeling, real-time data visualization, and AI-powered insights.

## Features

- **Realistic Market Simulation** - Accurate simulation of market dynamics, order matching, and price discovery
- - **Portfolio Management** - Track and manage simulated portfolios with detailed performance metrics
  - - **Advanced Charting** - Real-time visualization of market data and technical indicators
    - - **Strategy Backtesting** - Test trading strategies against historical and simulated data
      - - **Order System** - Market, limit, and stop orders with realistic execution models
        - - **Performance Analytics** - Comprehensive metrics including returns, Sharpe ratio, drawdown analysis
          - - **Multi-Asset Support** - Trade stocks, commodities, currencies, and crypto assets
            - - **Educational Tools** - Built-in tutorials and learning resources for financial literacy
              - - **AI-Assisted Analysis** - AI-powered suggestions and market insights
                - - **User Accounts** - Secure authentication with Supabase for data persistence
                  - - **Responsive UI** - Beautiful, intuitive interface optimized for desktop and tablet
                   
                    - ## Tech Stack
                   
                    - **Frontend**
                    - - React with Vite for fast development and building
                      - - TypeScript for type-safe code
                        - - Tailwind CSS for responsive styling
                          - - React Router for navigation
                            - - TanStack Query for data fetching
                              - - Recharts for data visualization and charting
                                - - Lucide React for icons
                                 
                                  - **Backend & Services**
                                  - - Node.js/Express server
                                    - - TypeScript for backend code
                                      - - Supabase for authentication, database, and real-time features
                                        - - PostgreSQL database for persistent storage
                                          - - Stripe integration for premium features
                                           
                                            - **Development & Testing**
                                            - - Vite for fast module reloading
                                              - - Vitest for unit testing
                                                - - ESLint for code quality
                                                  - - TypeScript strict mode
                                                   
                                                    - ## Getting Started
                                                   
                                                    - ### Prerequisites
                                                   
                                                    - - Node.js 18 or higher
                                                      - - npm or yarn package manager
                                                        - - Supabase account for backend services
                                                          - - Modern web browser (Chrome, Firefox, Safari, Edge)
                                                           
                                                            - ### Installation
                                                           
                                                            - 1. **Clone the repository**
                                                              2. ```bash
                                                                 git clone https://github.com/katycat1313/marketsim.git
                                                                 cd marketsim
                                                                 ```

                                                                 2. **Install dependencies**
                                                                 3. ```bash
                                                                    npm install
                                                                    ```

                                                                    3. **Configure environment variables**
                                                                   
                                                                    4. Create a `.env.local` file in the project root:
                                                                    5. ```
                                                                       VITE_SUPABASE_URL=your_supabase_project_url
                                                                       VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
                                                                       VITE_API_BASE_URL=http://localhost:3000
                                                                       ```

                                                                       4. **Start the development server**
                                                                       5. ```bash
                                                                          npm run dev
                                                                          ```

                                                                          5. **Open in browser**
                                                                          6. Navigate to `http://localhost:5173`
                                                                         
                                                                          7. ### Building for Production
                                                                         
                                                                          8. ```bash
                                                                             npm run build
                                                                             npm run preview
                                                                             ```

                                                                             ## Project Structure

                                                                             ```
                                                                             .
                                                                             ├── client/                  # Frontend React application
                                                                             │   ├── src/
                                                                             │   │   ├── components/     # Reusable React components
                                                                             │   │   ├── pages/          # Route pages
                                                                             │   │   ├── services/       # API and external services
                                                                             │   │   ├── hooks/          # Custom React hooks
                                                                             │   │   ├── utils/          # Utility functions
                                                                             │   │   └── types/          # TypeScript type definitions
                                                                             │   └── vite.config.ts
                                                                             ├── server/                  # Backend Express server
                                                                             │   ├── src/
                                                                             │   │   ├── routes/         # API route handlers
                                                                             │   │   ├── services/       # Business logic
                                                                             │   │   ├── models/         # Database models
                                                                             │   │   └── middleware/     # Express middleware
                                                                             │   └── tsconfig.json
                                                                             ├── shared/                  # Shared types and utilities
                                                                             └── package.json
                                                                             ```

                                                                             ## Core Concepts

                                                                             ### Market Simulation Engine
                                                                             - Order matching engine for realistic trading execution
                                                                             - - Dynamic price discovery based on supply and demand
                                                                               - - Support for different order types (market, limit, stop)
                                                                                 - - Realistic slippage and commission modeling
                                                                                  
                                                                                   - ### Portfolio Management
                                                                                   - - Real-time portfolio valuation
                                                                                     - - Performance metrics (P&L, returns, Sharpe ratio)
                                                                                       - - Risk metrics (volatility, VaR, max drawdown)
                                                                                         - - Asset allocation and rebalancing tools
                                                                                          
                                                                                           - ### Analytics Dashboard
                                                                                           - - Interactive charts and technical indicators
                                                                                             - - Real-time data updates
                                                                                               - - Export capabilities for further analysis
                                                                                                 - - Custom alert settings
                                                                                                  
                                                                                                   - ## Usage Examples
                                                                                                  
                                                                                                   - ### Creating an Account
                                                                                                   - Users can sign up with email/password authentication powered by Supabase.
                                                                                                  
                                                                                                   - ### Starting a Simulation
                                                                                                   - 1. Select a market scenario (bullish, bearish, volatile, etc.)
                                                                                                     2. 2. Set initial capital and trading parameters
                                                                                                        3. 3. Begin placing trades in real-time
                                                                                                          
                                                                                                           4. ### Analyzing Performance
                                                                                                           5. Use the analytics dashboard to review:
                                                                                                           6. - Cumulative returns
                                                                                                              - - Monthly/daily P&L
                                                                                                                - - Win rate and trade statistics
                                                                                                                  - - Risk-adjusted performance metrics
                                                                                                                   
                                                                                                                    - ## API Documentation
                                                                                                                   
                                                                                                                    - The backend provides RESTful APIs for:
                                                                                                                    - - User authentication and management
                                                                                                                      - - Portfolio operations
                                                                                                                        - - Order management
                                                                                                                          - - Market data retrieval
                                                                                                                            - - Performance metrics calculation
                                                                                                                             
                                                                                                                              - Detailed API documentation available at `/api/docs` when server is running.
                                                                                                                             
                                                                                                                              - ## Performance Considerations
                                                                                                                             
                                                                                                                              - - Real-time market updates using WebSocket connections
                                                                                                                                - - Efficient data pagination for large datasets
                                                                                                                                  - - Cached market data for improved responsiveness
                                                                                                                                    - - Optimized database queries with proper indexing
                                                                                                                                      - - Client-side calculation of technical indicators
                                                                                                                                       
                                                                                                                                        - ## Contributing
                                                                                                                                       
                                                                                                                                        - Contributions are welcome! Please follow these steps:
                                                                                                                                       
                                                                                                                                        - 1. Fork the repository
                                                                                                                                          2. 2. Create a feature branch (`git checkout -b feature/amazing-feature`)
                                                                                                                                             3. 3. Commit your changes (`git commit -m 'Add amazing feature'`)
                                                                                                                                                4. 4. Push to the branch (`git push origin feature/amazing-feature`)
                                                                                                                                                   5. 5. Open a Pull Request
                                                                                                                                                     
                                                                                                                                                      6. ## Future Enhancements
                                                                                                                                                     
                                                                                                                                                      7. - Machine learning models for market predictions
                                                                                                                                                         - - Advanced options trading support
                                                                                                                                                           - - Multi-player competitions
                                                                                                                                                             - - Mobile app (React Native)
                                                                                                                                                               - - Paper trading with real market data
                                                                                                                                                                 - - AI-powered trading advisor
                                                                                                                                                                  
                                                                                                                                                                   - ## License
                                                                                                                                                                  
                                                                                                                                                                   - This project is licensed under the MIT License - see the LICENSE file for details.
                                                                                                                                                                  
                                                                                                                                                                   - ## Author
                                                                                                                                                                  
                                                                                                                                                                   - Kathleen Casto - Full-stack developer specializing in financial applications and AI integration.
                                                                                                                                                                  
                                                                                                                                                                   - ---
                                                                                                                                                                   
                                                                                                                                                                   **Disclaimer**: MarketSim is an educational tool for learning financial concepts. Simulated results do not guarantee future performance. Always conduct thorough research before making real trading decisions.
