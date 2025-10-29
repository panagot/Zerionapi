# 🏆 Portfolio Battle Arena

**DeFi meets competition.** Track, battle, and dominate across 55+ blockchains.

![Portfolio Battle Arena](https://img.shields.io/badge/Powered%20by-Zerion%20API-blue?style=for-the-badge&logo=ethereum)
![Live Data](https://img.shields.io/badge/Live%20Data-55%2B%20Chains-green?style=for-the-badge)
![Hackathon](https://img.shields.io/badge/Hackathon-Zerion%20x%20Cypherpunk-purple?style=for-the-badge)

## 🚀 Live Demo
**Coming Soon** - Deploying to Vercel

## 🎥 Demo Video
**Coming Soon** - 3-4 minute showcase video

## ✨ Features

### 🎯 Core Features
- **Real-time PnL & Portfolio Tracking** - Live data from Zerion API across 55+ blockchains
- **Competitive Battle Scoring** - Fair algorithm that rewards both skill and consistency
- **Live Leaderboard** - Real-time rankings with live data indicators
- **Social Trading** - Community features, chat, and strategy sharing
- **Token Discovery** - Search and analyze any wallet address
- **Advanced Analytics** - Risk analysis, Sharpe ratios, performance metrics

### 🔥 Battle System
- **Battle Score Algorithm**: `log10(total_value + 1) × 10 + max(0, pnl_percentage) × 2`
- **Live Rankings** - Real-time position updates
- **Tournament System** - Competitive trading battles
- **Performance Tracking** - Historical data and trends

### 🌐 Multi-Chain Support
- **55+ Blockchains** - Ethereum, Polygon, BSC, Solana, and more
- **Real-time Data** - Live portfolio updates every 30 seconds
- **Asset Breakdown** - Detailed token composition and values
- **Transaction History** - Decoded swaps, transfers, and approvals

## 🛠️ Tech Stack

### Frontend
- **Pure HTML/CSS/JavaScript** - No framework dependencies for maximum compatibility
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Chart.js** - Data visualization and analytics
- **Font Awesome** - Icons and UI elements

### Backend
- **Node.js + Express** - RESTful API server
- **Socket.io** - Real-time communication
- **Axios** - HTTP client for API requests
- **Rate Limiting** - API abuse prevention

### API Integration
- **Zerion API** - Comprehensive onchain data
- **Real-time Updates** - Live portfolio and PnL tracking
- **Multi-chain Support** - 55+ blockchain networks
- **Error Handling** - Graceful Zerion API integration

## 🔗 Zerion API Endpoints Used

```javascript
// Portfolio Data
GET /v1/wallets/{address}/positions
GET /v1/wallets/{address}/portfolio
GET /v1/wallets/{address}/pnl
GET /v1/wallets/{address}/transactions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Zerion API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/panagot/Zerionapi.git
cd Zerionapi
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
echo "ZERION_API_KEY=your_zerion_api_key_here" > .env
```

4. **Start the development server**
```bash
# Start backend
npm run server-hybrid

# In another terminal, start frontend
# Open index.html in your browser or use a local server
python -m http.server 3000
```

5. **Open the application**
```
http://localhost:3000
```

## 📊 Live Data Dashboard

The application displays 8 key metrics in real-time:

1. **Total Portfolio Value** - Sum of all wallet values
2. **Active Traders** - Number of registered wallets  
3. **Total Trades** - Combined transaction count
4. **Avg Win Rate** - Average success rate
5. **Total PnL** - Combined profit/loss
6. **Total Positions** - Number of active positions
7. **Live Wallets** - Wallets with real Zerion data
8. **Avg Portfolio Value** - Average wallet value

## 🎮 How to Play

1. **Join the Arena** - Enter your wallet address to start competing
2. **Track Performance** - Monitor your portfolio in real-time
3. **Climb Rankings** - Improve your battle score through smart trading
4. **Discover Tokens** - Search any address to analyze their strategy
5. **Connect with Community** - Share strategies and learn from others

## 🏆 Hackathon Submission

### Built for Zerion x Cypherpunk Hackathon

This project was specifically built for the Zerion API hackathon, showcasing:

- **Innovation**: Novel social trading platform with gamification
- **User Experience**: Professional, responsive, and intuitive design
- **Impact**: Addresses real need for social trading and competition
- **Zerion API Usage**: Comprehensive integration across all major endpoints
- **Technical Implementation**: Solid architecture with real-time updates
- **Adoption Potential**: Viral social features and competitive elements

### Judging Criteria Met

- ✅ **Consumer Application** - Social trading platform
- ✅ **Zerion API Usage** - All major endpoints integrated
- ✅ **Real-time Data** - Live portfolio tracking
- ✅ **Social Features** - Community and sharing
- ✅ **Token Discovery** - Help users find new assets
- ✅ **Portfolio Management** - Advanced analytics

## 🌟 Unique Value Proposition

**"Portfolio trackers are boring. We made trading a sport."**

This isn't just another portfolio tracker - it's a **social gaming platform** that turns portfolio management into an engaging, competitive experience. Users can:

- **Compete** - Battle with other traders for top rankings
- **Learn** - Discover new strategies and tokens
- **Share** - Connect with the DeFi community  
- **Discover** - Find new opportunities across 55+ chains
- **Track** - Monitor performance with advanced analytics

## 🔧 Development

### Project Structure
```
├── index.html              # Main frontend application
├── server-hybrid.js        # Backend server with Zerion API
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
└── README.md              # This file
```

### Available Scripts
```bash
npm run server-hybrid      # Start hybrid server (Zerion API + Zerion API data)
npm run dev-hybrid         # Start with nodemon for development
```

## 📈 Future Roadmap

- [ ] **Battle Replay** - Animate last 5 trades with performance data
- [ ] **Advanced Tournaments** - Custom rules and prize pools
- [ ] **Mobile App** - Native iOS/Android applications
- [ ] **More Chains** - Additional blockchain support
- [ ] **AI Insights** - Machine learning for trading recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zerion API** - For providing comprehensive onchain data
- **Cypherpunk Hackathon** - For the amazing opportunity
- **Community** - For feedback and support

## 📞 Contact

- **GitHub**: [@panagot](https://github.com/panagot)
- **Project**: [Portfolio Battle Arena](https://github.com/panagot/Zerionapi)

---

**Built with ❤️ for the Zerion x Cypherpunk Hackathon**

*"Empowering financial freedom through social DeFi competition"*