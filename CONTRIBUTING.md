# Contributing to AI Trading Dashboard

Thank you for your interest in contributing to the AI Trading Dashboard! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git
- Basic knowledge of FastAPI and React

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/ai-trading-dashboard.git
   cd ai-trading-dashboard
   ```

2. **Set up the development environment**
   ```bash
   # Backend setup
   pip install -r requirements.txt
   alembic upgrade head
   
   # Frontend setup
   cd frontend
   npm install
   cd ..
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style

#### Python (Backend)
- Follow PEP 8 style guidelines
- Use type hints for all function parameters and return values
- Write docstrings for all classes and functions
- Use meaningful variable and function names

#### TypeScript/React (Frontend)
- Use TypeScript for all new components
- Follow React functional component patterns
- Use meaningful component and variable names
- Implement proper error handling

### Commit Messages
Use conventional commit format:
```
type(scope): description

feat(auth): add JWT token refresh functionality
fix(charts): resolve candlestick rendering issue
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🧪 Testing

### Backend Tests
```bash
pytest app/tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
python verify_complete_deployment.py
```

## 📝 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update the README.md** if necessary
5. **Create a pull request** with:
   - Clear title and description
   - Reference any related issues
   - Screenshots for UI changes

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🐛 Bug Reports

When reporting bugs, please include:
- **Environment details** (OS, Python version, Node.js version)
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Error logs** if available

## 💡 Feature Requests

For feature requests, please provide:
- **Clear description** of the feature
- **Use case** and motivation
- **Proposed implementation** (if you have ideas)
- **Alternative solutions** considered

## 🏗️ Architecture Guidelines

### Backend Structure
```
app/
├── api/          # FastAPI routes
├── core/         # Core functionality
├── models/       # Database models
├── schemas/      # Pydantic schemas
├── services/     # Business logic
└── ml/           # Machine learning models
```

### Frontend Structure
```
frontend/src/
├── components/   # Reusable components
├── contexts/     # React contexts
├── pages/        # Page components
├── styles/       # CSS stylesheets
└── utils/        # Utility functions
```

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

## 🤝 Community

- **Discussions**: Use GitHub Discussions for questions and ideas
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Code Review**: All contributions require code review

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the AI Trading Dashboard! 🚀