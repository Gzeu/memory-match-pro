# 🧠 Memory Match Pro

[![Vercel Status](https://img.shields.io/badge/Vercel-Deployed-success?style=flat&logo=vercel)](https://memory-match-pro.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Gzeu/memory-match-pro.svg)](https://github.com/Gzeu/memory-match-pro/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> 🎮 **Professional Memory Match game** built with HTML5 Canvas, modern JavaScript ES6+, and advanced game architecture. Features particle effects, sound system, multiple difficulty levels, and responsive design.

![Memory Match Pro Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=Memory+Match+Pro)

## 🚀 Live Demo

**Play Now:** [https://memory-match-pro.vercel.app](https://memory-match-pro.vercel.app)

## ✨ Features

### 🎯 Gameplay
- 🃏 **Multiple Difficulty Levels**: Easy (3×2), Medium (4×3), Hard (4×4), Expert (6×4)
- 🎨 **Beautiful Card Animations**: Smooth flip animations with CSS3 transitions
- 🏆 **Scoring System**: Time-based scoring with bonus points
- 📊 **Statistics Tracking**: Moves, time, level progression
- 🔄 **Progressive Difficulty**: Automatic level advancement
- ⏸️ **Game Controls**: Pause, restart, settings

### 🎨 Visual Effects
- ✨ **Particle System**: Dynamic particle effects for matches and celebrations
- 🌈 **Multiple Themes**: Default, Dark Mode, Neon Glow
- 📱 **Responsive Design**: Perfect on desktop, tablet, and mobile
- 🎬 **Smooth Animations**: Hardware-accelerated CSS animations
- 🎯 **Visual Feedback**: Hover effects, click animations

### 🔊 Audio System
- 🎵 **Sound Effects**: Card flip, match found, game complete
- 🔊 **Volume Control**: Adjustable audio settings
- 🔇 **Mute Option**: Toggle sound on/off
- 🎼 **Audio Preloading**: Smooth playback without delays

### 🛠️ Technical Features
- ⚡ **ES6+ JavaScript**: Modern JavaScript with modules
- 🎯 **Performance Optimized**: Efficient rendering and memory management
- 📦 **Webpack Bundle**: Optimized build process
- 🧪 **Jest Testing**: Comprehensive test suite
- 📱 **PWA Ready**: Progressive Web App capabilities
- 🔧 **Developer Tools**: Debug panel and performance monitoring

## 🏗️ Technical Stack

| Technology | Purpose |
|------------|----------|
| **HTML5 Canvas** | High-performance graphics rendering |
| **ES6+ JavaScript** | Modern JavaScript features and modules |
| **CSS3** | Animations, responsive design, themes |
| **Webpack** | Module bundling and optimization |
| **Jest** | Unit testing framework |
| **ESLint + Prettier** | Code quality and formatting |
| **Vercel** | Deployment and hosting |

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/Gzeu/memory-match-pro.git
cd memory-match-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open automatically in your browser at `http://localhost:8080`

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run serve        # Serve built files locally

# Building
npm run build        # Production build
npm run build:dev    # Development build

# Testing
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint        # Lint JavaScript files
npm run lint:fix    # Fix linting issues
npm run format      # Format code with Prettier

# Deployment
npm run deploy      # Deploy to GitHub Pages

# Utilities
npm run clean       # Clean build directory
npm run analyze     # Analyze bundle size
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Fork this repository**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - Vercel will automatically detect the configuration

3. **Environment Setup:**
   - No environment variables needed
   - Vercel uses the included `vercel.json` configuration

4. **Automatic Deployment:**
   - Every push to `main` branch triggers automatic deployment
   - Pull requests get preview deployments

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
npx netlify-cli deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# Deploy to gh-pages branch
npm run deploy
```

## 🎮 How to Play

1. **Select Difficulty**: Choose from Easy to Expert levels
2. **Click Cards**: Click any card to flip it over
3. **Find Matches**: Click a second card to find matching pairs
4. **Score Points**: Faster matches = higher scores
5. **Complete Levels**: Match all pairs to advance
6. **Beat Your Record**: Try to improve your time and moves

## 🏗️ Architecture

```
src/
├── index.html          # Main HTML file
├── main.js            # Application entry point
├── js/
│   ├── game.js        # Core game logic
│   ├── ui.js          # User interface management
│   ├── audio.js       # Audio system
│   └── utils.js       # Utility functions
└── styles/
    ├── main.css       # Base styles
    ├── responsive.css # Responsive design
    ├── cards.css      # Card-specific styles
    ├── animations.css # Animation definitions
    ├── components.css # UI components
    └── performance.css # Performance optimizations
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## 🎨 Customization

### Adding New Themes

1. Create theme variables in `styles/themes.css`
2. Add theme option in `settings-screen`
3. Implement theme switching in `js/ui.js`

### Adding New Difficulty Levels

1. Modify `DIFFICULTY_LEVELS` in `js/game.js`
2. Add button in difficulty selector
3. Update grid generation logic

### Custom Card Designs

1. Add card images to `assets/images/cards/`
2. Update `CARD_SYMBOLS` array in `js/game.js`
3. Modify card rendering in CSS

## 🔧 Configuration

### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "name": "memory-match-pro",
  "routes": [
    {
      "src": "/(.*\\.(css|js|png|jpg|jpeg|gif|svg|ico|json))",
      "dest": "/src/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/src/index.html"
    }
  ]
}
```

### Webpack Configuration

The project uses Webpack 5 with:
- **Hot Module Replacement** for development
- **Code Splitting** for optimized loading
- **Asset Optimization** for production builds
- **Source Maps** for debugging

## 📊 Performance

- **Lighthouse Score**: 95+ Performance
- **First Contentful Paint**: < 1.5s
- **Bundle Size**: < 200KB gzipped
- **Mobile Optimized**: Touch-friendly controls
- **Cross-browser Compatible**: Modern browsers supported

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Use semantic commit messages

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Gzeu** - [GitHub Profile](https://github.com/Gzeu)

## 🙏 Acknowledgments

- Inspired by classic memory card games
- Built with modern web technologies
- Optimized for performance and accessibility

## 📈 Roadmap

- [ ] **Multiplayer Mode**: Online multiplayer support
- [ ] **Leaderboards**: Global scoring system
- [ ] **Daily Challenges**: Special challenge modes
- [ ] **Custom Card Sets**: User-uploadable card images
- [ ] **Achievement System**: Unlock rewards
- [ ] **Social Sharing**: Share scores on social media

---

### 🎯 Quick Links

- **[Play Game](https://memory-match-pro.vercel.app)** 🎮
- **[Report Bug](https://github.com/Gzeu/memory-match-pro/issues)** 🐛
- **[Request Feature](https://github.com/Gzeu/memory-match-pro/issues)** ✨
- **[Contribute](https://github.com/Gzeu/memory-match-pro/pulls)** 🤝

**Made with ❤️ by Gzeu | Star ⭐ if you enjoyed!**