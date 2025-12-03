# Contributing to Enigma Protocol 🤝

Panduan untuk berkontribusi pada Enigma Protocol

## 🎯 Welcome Contributors!

Kami sangat appreciate kontribusi dari komunitas untuk mengembangkan Enigma Protocol sebagai platform Privacy DeFi terdepan. Whether you're fixing bugs, adding features, improving documentation, or proposing new ideas - semua contribution sangat berharga!

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

### Our Standards
- **Respect**: Treat all community members with respect
- **Inclusive**: Welcome people of all backgrounds and experience levels
- **Constructive**: Provide helpful feedback and suggestions
- **Collaborative**: Work together to improve the project
- **Professional**: Maintain professional communication

### Unacceptable Behavior
- Harassment, discrimination, or offensive language
- Personal attacks or trolling
- Publishing private information without permission
- Any conduct that could reasonably be considered inappropriate

## 🚀 How to Contribute

### Types of Contributions
1. **🐛 Bug Fixes** - Fix bugs in existing features
2. **✨ New Features** - Add new functionality
3. **📚 Documentation** - Improve docs, examples, tutorials
4. **🎨 UI/UX** - Enhance user interface and experience
5. **⚡ Performance** - Optimize code and database queries
6. **🔒 Security** - Improve security measures
7. **🧪 Testing** - Add or improve test coverage
8. **🌐 Translation** - Help with internationalization

### Contribution Areas
- **Frontend Development** - React components, UI/UX improvements
- **Backend Development** - Edge functions, database optimization
- **AI Agents** - ERC-8004 agent implementations
- **Privacy Features** - ZKP implementations, stealth addresses
- **Blockchain Integration** - Smart contract interactions
- **DevOps** - CI/CD, deployment automation

## 🛠️ Development Setup

### Prerequisites
```bash
node --version  # v18+
pnpm --version  # v8+
git --version
```

### Quick Start
```bash
# 1. Fork the repository
git clone https://github.com/your-username/enigma-protocol.git
cd enigma-protocol

# 2. Add upstream remote
git remote add upstream https://github.com/enigma-protocol/core.git

# 3. Install dependencies
pnpm install

# 4. Setup environment
cp .env.example .env.local
# Edit .env.local dengan your credentials

# 5. Start development
pnpm dev
```

### Environment Configuration
```env
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ETHEREUM_RPC_URL=your_rpc_url
VITE_CHAIN_ID=1
```

### Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login dan setup
supabase login
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push

# Deploy edge functions
supabase functions deploy
```

## 📝 Coding Standards

### TypeScript Guidelines
```typescript
// ✅ Good: Use proper types
interface AI Agent {
  id: string
  name: string
  capabilities: string[]
  isActive: boolean
}

// ✅ Good: Use async/await
const getPoolStats = async (): Promise<PoolStats> => {
  try {
    const response = await fetch('/api/stats')
    return response.json()
  } catch (error) {
    throw new Error('Failed to fetch pool stats')
  }
}

// ❌ Bad: Missing types
const getData = async () => {
  const data = await fetch('/api/data')
  return data.json()
}
```

### React Components
```typescript
// ✅ Good: Functional component dengan hooks
import { useState, useEffect } from 'react'
import { AIAgent } from '@/types'

interface AgentCardProps {
  agent: AIAgent
  onActivate: (agentId: string) => void
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onActivate }) => {
  const [loading, setLoading] = useState(false)
  
  const handleActivate = async () => {
    setLoading(true)
    try {
      await onActivate(agent.id)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="agent-card">
      <h3>{agent.name}</h3>
      <p>{agent.description}</p>
      <button onClick={handleActivate} disabled={loading}>
        {loading ? 'Activating...' : 'Activate'}
      </button>
    </div>
  )
}

// ❌ Bad: Class component tanpa proper typing
class AgentCard extends React.Component {
  render() {
    return <div>{this.props.agent.name}</div>
  }
}
```

### Naming Conventions
```typescript
// Files: kebab-case
// agent-card.component.tsx
// pool-statistics.hook.ts

// Components: PascalCase
export const PrivacyPool: React.FC = () => {}

// Functions & Variables: camelCase
const getPoolStats = async () => {}
const isUserAuthenticated = true

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3
const API_BASE_URL = 'https://api.enigma-protocol.xyz'

// Interfaces: PascalCase dengan descriptive names
interface PoolStatisticsResponse {
  totalPoolSize: number
  activeMixers: number
  privacyScore: number
}
```

### Code Organization
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components
│   ├── forms/           # Form components
│   └── layouts/         # Layout components
├── pages/               # Route pages
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── api.ts           # API functions
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Helper functions
├── types/               # TypeScript definitions
│   ├── agent.types.ts   # AI agent types
│   ├── pool.types.ts    # Pool types
│   └── user.types.ts    # User types
└── styles/              # Global styles
```

## 🧪 Testing Guidelines

### Unit Tests
```typescript
// hooks/usePoolStats.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { usePoolStats } from '@/hooks/usePoolStats'

describe('usePoolStats', () => {
  it('should fetch pool statistics', async () => {
    const { result } = renderHook(() => usePoolStats())
    
    await waitFor(() => {
      expect(result.current.stats).toBeDefined()
    })
    
    expect(result.current.stats?.totalPoolSize).toBeGreaterThan(0)
    expect(result.current.loading).toBe(false)
  })
  
  it('should handle errors gracefully', async () => {
    // Mock error scenario
    const { result } = renderHook(() => usePoolStats())
    
    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
  })
})
```

### Component Tests
```typescript
// components/AgentCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { AgentCard } from '@/components/AgentCard'

const mockAgent = {
  id: '1',
  name: 'Test Agent',
  description: 'Test Description',
  reputation_score: 95
}

describe('AgentCard', () => {
  it('should render agent information', () => {
    render(<AgentCard agent={mockAgent} onActivate={jest.fn()} />)
    
    expect(screen.getByText('Test Agent')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
  
  it('should call onActivate when button clicked', () => {
    const onActivate = jest.fn()
    render(<AgentCard agent={mockAgent} onActivate={onActivate} />)
    
    fireEvent.click(screen.getByText('Activate'))
    expect(onActivate).toHaveBeenCalledWith('1')
  })
})
```

### Edge Function Tests
```typescript
// supabase/functions/get-pool-stats/index.test.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

describe('get-pool-stats function', () => {
  it('should return pool statistics', async () => {
    const req = new Request('http://localhost:8000/functions/v1/get-pool-stats', {
      method: 'POST'
    })
    
    const res = await serve(req)
    const data = await res.json()
    
    expect(data.success).toBe(true)
    expect(data.data.totalPoolSize).toBeDefined()
    expect(data.data.privacyScore).toBeGreaterThan(0)
  })
})
```

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests dengan coverage
pnpm test:coverage

# Run tests dalam watch mode
pnpm test:watch

# Run specific test file
pnpm test usePoolStats
```

## 📚 Documentation

### Code Documentation
```typescript
/**
 * Calculate privacy score berdasarkan pool metrics
 * 
 * @param totalPoolSize - Total value locked dalam pool
 * @param activeMixers - Jumlah mixer aktif
 * @param anonymitySet - Ukuran anonymity set
 * @returns Privacy score dari 0-100
 * 
 * @example
 * const score = calculatePrivacyScore(50000000, 2000, 8000)
 * console.log(score) // 85
 */
export const calculatePrivacyScore = (
  totalPoolSize: number,
  activeMixers: number,
  anonymitySet: number
): number => {
  const poolSizeScore = Math.min((totalPoolSize / 100000000) * 40, 40)
  const mixerScore = Math.min((activeMixers / 5000) * 30, 30)
  const anonymityScore = Math.min((anonymitySet / 20000) * 30, 30)
  
  return Math.round(poolSizeScore + mixerScore + anonymityScore)
}
```

### API Documentation
```typescript
/**
 * Get pool statistics
 * 
 * @route POST /functions/v1/get-pool-stats
 * @access Public
 * @returns {Promise<PoolStats>} Pool statistics data
 * 
 * @throws {Error} When database connection fails
 * 
 * @example
 * const stats = await getPoolStats()
 * console.log(stats.totalPoolSize) // 52000000
 */
export const getPoolStats = async (): Promise<PoolStats> => {
  // Implementation
}
```

### README Updates
When adding new features, update relevant documentation:
- **Features**: Add to main README
- **API Changes**: Update API reference
- **Database Schema**: Update database documentation
- **Setup Instructions**: Update installation guide

## 🔄 Pull Request Process

### Before Submitting
1. **Update your fork**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes** and test thoroughly:
   ```bash
   pnpm test
   pnpm lint
   pnpm build
   ```

4. **Update documentation** jika diperlukan

### PR Template
```markdown
## 📝 Description
Brief description of changes

## 🔍 Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📚 Documentation update
- [ ] 🎨 UI/UX improvement
- [ ] ⚡ Performance optimization

## 🧪 Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Edge function testing

## 📋 Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Related issues linked

## 🔗 Related Issues
Closes #issue_number
```

### Review Process
1. **Automated checks** - CI/CD pipeline runs
2. **Code review** - Maintainers review code
3. **Testing** - Manual testing if needed
4. **Approval** - At least 2 approvals required
5. **Merge** - Squash and merge to main

## 🐛 Issue Reporting

### Bug Reports
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]

**Additional Context**
Any other context about the problem
```

### Feature Requests
```markdown
**Feature Description**
Clear description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other context, mockups, or examples
```

## 🎨 UI/UX Contributions

### Design Guidelines
- Follow existing design system
- Use consistent spacing (8px grid)
- Maintain accessibility standards (WCAG 2.1)
- Support dark/light themes
- Mobile-first responsive design

### Component Guidelines
```typescript
// ✅ Good: Accessible component
<button
  onClick={handleClick}
  disabled={loading}
  aria-label={`Activate ${agent.name} agent`}
  className="agent-activate-btn"
>
  {loading ? <Spinner /> : 'Activate Agent'}
</button>

// ❌ Bad: Non-accessible
<button onClick={handleClick} className="btn">
  Activate
</button>
```

## 🔒 Security Contributions

### Security Best Practices
- Never commit private keys atau secrets
- Use environment variables
- Validate all user inputs
- Sanitize data before database operations
- Follow OWASP guidelines

### Security Review
- Review dependencies untuk vulnerabilities
- Audit authentication flows
- Check for XSS/CSRF vulnerabilities
- Validate API endpoints
- Review privacy implementations

## 📈 Performance Contributions

### Optimization Guidelines
- Use React.memo untuk expensive components
- Implement proper loading states
- Optimize database queries
- Use proper indexing
- Minimize bundle size

### Performance Testing
```typescript
// Performance test example
describe('Performance Tests', () => {
  it('should render agents list under 100ms', async () => {
    const start = performance.now()
    render(<AgentList agents={mockAgents} />)
    const end = performance.now()
    
    expect(end - start).toBeLessThan(100)
  })
})
```

## 🌍 Internationalization

### Adding New Languages
1. Create translation files di `locales/`
2. Add language ke i18n configuration
3. Update language selector
4. Test all text displays correctly

### Translation Structure
```json
// locales/en.json
{
  "common": {
    "loading": "Loading",
    "error": "Error",
    "success": "Success"
  },
  "agents": {
    "activate": "Activate Agent",
    "deactivating": "Deactivating..."
  }
}
```

## 🏆 Recognition

### Contributors
All contributors akan di-credit di:
- GitHub contributors page
- Project README
- Release notes
- Community highlights

### Maintainership
Outstanding contributors mungkin di-invite untuk menjadi maintainer berdasarkan:
- Consistent high-quality contributions
- Community engagement
- Technical expertise
- Commitment to project values

## 📞 Getting Help

### Development Questions
- **Discord**: [Join our Discord](https://discord.gg/enigma-protocol)
- **GitHub Discussions**: Technical discussions
- **Stack Overflow**: Tag dengan `enigma-protocol`

### Getting Started Help
- **First-time contributors**: Look for `good first issue` labels
- **Documentation**: Start dengan docs improvements
- **Small fixes**: Begin dengan bug fixes

### Code Reviews
- **For reviewers**: Be constructive dan patient
- **For contributors**: Be open to feedback
- **Learning opportunities**: Ask questions during reviews

---

**Thank you untuk contributing to Enigma Protocol! 🎉**

Together we're building the future of Privacy DeFi dengan cutting-edge technology dan community-driven development.