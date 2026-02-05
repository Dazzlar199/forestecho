# ForestEcho - Quick Reference Guide

**Last Updated**: 2026-02-01
**Project Health**: 6.5/10

---

## 🚨 Critical Issues (Fix Now)

### 1. Performance: 856KB Type File
```bash
# File: types/education.ts (17,180 lines)
# Issue: Embedded article data in type definitions
# Impact: +850KB bundle, slow TypeScript compilation

# Quick Fix:
mkdir -p public/data/articles
# Move article data to JSON files
# Update imports to fetch dynamically

# Time: 2 hours
# Impact: -850KB bundle, +50% faster builds
```

### 2. Security: Broken Rate Limiting
```bash
# File: lib/rate-limit.ts
# Issue: In-memory storage won't work in serverless
# Impact: Users can bypass 10 req/min limit

# Quick Fix:
npm install @upstash/ratelimit @upstash/redis
# Get free Redis from https://upstash.com
# Replace lib/rate-limit.ts implementation

# Time: 1 hour
# Impact: Proper abuse prevention
```

### 3. Security: Client-Side Admin Check
```typescript
// Current: NEXT_PUBLIC_ADMIN_EMAIL (insecure)
// Issue: Client can spoof admin status

// Quick Fix: Use Firebase Custom Claims
const user = await adminAuth.getUserByEmail('admin@example.com')
await adminAuth.setCustomUserClaims(user.uid, { admin: true })

// Update firestore.rules:
function isAdmin() {
  return request.auth.token.admin == true;
}

// Time: 2 hours
```

### 4. Cleanup: 17MB Unused Files
```bash
# Files: public/music/*.mp3, components/audio/BGMPlayer.tsx
# Issue: BGMPlayer commented out but files remain

# Quick Fix:
rm -rf public/music/
rm components/audio/BGMPlayer.tsx

# Time: 5 minutes
# Impact: -17MB deployment size
```

---

## 📁 Project Structure

```
mentaltouch_App/
├── app/                    # Next.js App Router
│   ├── api/               # 4 active API routes + 1 empty (auth/)
│   ├── page.tsx           # Main chat interface
│   ├── analysis/[id]/     # Psychological analysis reports
│   ├── education/[slug]/  # Mental health articles
│   └── admin/             # Admin dashboard
│
├── components/            # 87 React components
│   ├── chat/             # Main chat UI (509 lines ⚠️)
│   ├── layout/           # Header (783 lines ⚠️), providers
│   ├── emotion/          # Emotion tracking charts
│   ├── forest/           # Gamification (tree growth)
│   └── premium/          # Premium analysis reports
│
├── lib/                   # Business logic
│   ├── gemini/           # Google Gemini AI integration
│   ├── openai/           # OpenAI GPT integration (duplicate code ⚠️)
│   ├── firebase/         # Firebase client + admin
│   ├── rag/              # Pinecone vector search
│   └── rate-limit.ts     # BROKEN: in-memory ⚠️
│
├── types/                 # TypeScript definitions
│   └── education.ts      # ⚠️ 856KB, 17,180 lines (FIX ASAP)
│
├── public/
│   └── music/            # ⚠️ 17MB unused audio files (DELETE)
│
└── functions/            # ⚠️ 144MB unused Cloud Functions (DELETE)
```

---

## 🔌 API Routes

### POST /api/chat (470 lines)
**Purpose**: Real-time AI chat with streaming
**Models**:
- Guest/Free: GPT-4o-mini ($0.15/$0.60 per 1M tokens)
- Premium: Gemini 3 Flash ($0.50/$3 per 1M tokens)

**Features**:
- Streaming SSE responses
- Crisis keyword detection
- 3-layer content filtering
- Auto language detection (ko/en/ja/zh)
- Tone adjustment (0-100 slider)
- Daily limits (guest: 3, free: 10, premium: ∞)

**Issues**:
- Rate limiting broken (in-memory)
- Emotion tracking blocks response
- No caching for frequent queries

---

### POST /api/analysis (208 lines)
**Purpose**: Generate psychological analysis report
**Model**: GPT-4o-mini
**Premium Only**: Checks tier in Firestore

**Response**:
```json
{
  "overallScore": 75,
  "emotionBreakdown": [...],
  "lifeImpact": [...],
  "keyInsights": [...],
  "recommendedActions": [...]
}
```

---

### POST /api/referral (76 lines)
**Purpose**: Track referral codes
**Issues**:
- Rewards not implemented (TODO)
- No fraud detection

---

### POST /api/seed-faq (238 lines)
**Purpose**: Seed FAQ data
**Issues**:
- ⚠️ No admin permission check
- Any logged-in user can POST

---

## 🔒 Security Layers

### Content Filtering (3 Layers)

**Layer 1: Pre-Request** (`lib/gemini/response-filter.ts`)
```typescript
detectDangerousIntent(message)
// Blocks: drugs, weapons, self-harm, illegal content
```

**Layer 2: Crisis Detection** (`lib/gemini/context-manager.ts`)
```typescript
detectCrisisKeywords(message)
// Keywords: 자살, 죽고싶어, 자해
// Action: Show emergency contacts
```

**Layer 3: Post-Response** (`app/api/chat/route.ts`)
```typescript
filterProhibitedContent(aiResponse)
// Replaces unsafe content with safe message
```

**Issues**:
- Keyword-based (can be bypassed with creative spelling)
- No AI moderation (OpenAI Moderation API)
- Korean-focused (may miss other languages)

---

## ⚙️ Configuration Files

### `next.config.js`
```javascript
reactStrictMode: true ✅
Security headers ✅
Image optimization ✅

Missing:
- Bundle analyzer
- Compression settings
- Redirects for legacy URLs
```

### `firestore.rules`
```javascript
Collections: 10
Security:
- ✅ Default deny all
- ✅ User-scoped data
- ⚠️ FAQ write not restricted (anyone can edit)
- ⚠️ No custom claims for admin

Action: Add isAdmin() function using custom claims
```

### `.env.local`
```env
Required:
- GEMINI_API_KEY
- OPENAI_API_KEY
- NEXT_PUBLIC_FIREBASE_* (6 variables)
- FIREBASE_PRIVATE_KEY ⚠️ (missing from example)
- FIREBASE_PROJECT_ID ⚠️ (missing from example)
- FIREBASE_CLIENT_EMAIL ⚠️ (missing from example)

Optional:
- TAVILY_API_KEY
- PINECONE_API_KEY
```

---

## 📦 Dependencies

### Heavy Libraries (>1MB)
```
firebase-admin: 8.1MB
firebase: 5.2MB
framer-motion: 2.1MB
@pinecone-database/pinecone: 1.8MB
recharts: 1.5MB
```

### Unused
```
@apps-in-toss/web-framework (TODO: implement or remove)
```

### Optimization Opportunities
```
✅ Lazy load html2canvas (150KB)
✅ Consider lighter chart library
✅ Evaluate Pinecone cost ($70/month)
   → Alternatives: Supabase pgvector (free), Qdrant (self-hosted)
```

---

## 🧪 Testing

**Current State**:
```
Test Coverage: 0%
Test Files: 0
Test Framework: Not installed
```

**Critical Tests Needed**:
```typescript
// Crisis detection
it('should detect suicide keywords', () => {
  expect(detectCrisisKeywords('죽고싶어')).toBe(true)
})

// Content filtering
it('should block drug-related content', () => {
  expect(detectDangerousIntent('마약 구매')).toBe(true)
})

// API routes
it('should return 429 on rate limit exceeded', async () => {
  // Test rate limiting
})
```

**Quick Setup**:
```bash
npm install -D @testing-library/react jest
# Configure jest.config.js
# Write first tests
npm test
```

---

## 🚀 Quick Wins (This Week)

### 1. Delete Unused Files (-17MB, 5 min)
```bash
rm -rf public/music/
rm components/audio/BGMPlayer.tsx
rm -rf functions/  # Verify unused first
rm -rf app/api/auth/  # Empty directory
```

### 2. Fix Environment Example (10 min)
```bash
# Add to .env.local.example:
FIREBASE_PRIVATE_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
```

### 3. Add .gitignore Rules (2 min)
```bash
echo "android/app/google-services.json" >> .gitignore
echo ".serena/memories/" >> .gitignore
```

### 4. Check Git History for Secrets (5 min)
```bash
git log --all --full-history -- .env.local
git log --all --full-history -- google-services.json
# If tracked: git rm --cached <file>
```

---

## 🎯 4-Week Action Plan

### Week 1: Critical Fixes (16h)
- [ ] Move education data to JSON (-850KB)
- [ ] Delete music files (-17MB)
- [ ] Implement Upstash rate limiting
- [ ] Fix Firebase Admin proxy
- [ ] Add missing env vars
- [ ] Secure admin operations

### Week 2: Security & Monitoring (12h)
- [ ] Firebase custom claims for admin
- [ ] Add Sentry error tracking
- [ ] Add Vercel Analytics
- [ ] Add structured logging (Pino)
- [ ] Audit git for secrets

### Week 3: Code Quality (20h)
- [ ] Refactor duplicate AI code
- [ ] Split large components
- [ ] Delete functions/ directory
- [ ] Add ESLint rules
- [ ] Create Firestore indexes

### Week 4: Testing & Docs (16h)
- [ ] Set up Jest
- [ ] Write critical tests
- [ ] Add API docs (OpenAPI)
- [ ] Update README
- [ ] Architecture diagrams

**Total Time**: 64 hours (1.5 months for 1 developer)

---

## 📊 Performance Targets

### Current Bundle Sizes
```
/                    ~500 KB
/chat                ~530 KB
/analysis/[id]       ~570 KB
/education/[slug]    ~1.35 MB ⚠️
```

### After Optimization
```
/                    ~500 KB
/chat                ~530 KB
/analysis/[id]       ~570 KB
/education/[slug]    ~500 KB ✅ (-850KB)
```

### Lighthouse Goals
```
Current:
- Performance: 65/100 ⚠️
- Accessibility: 90/100 ✅
- Best Practices: 85/100
- SEO: 95/100 ✅

Target:
- Performance: 85/100 ✅
- Accessibility: 90/100
- Best Practices: 90/100
- SEO: 95/100
```

---

## 🔧 Common Commands

### Development
```bash
npm run dev           # Start dev server (localhost:3000)
npm run build         # Production build
npm run lint          # ESLint
```

### Firebase
```bash
firebase deploy --only firestore:rules    # Deploy security rules
firebase deploy --only firestore:indexes  # Deploy indexes
```

### Analysis
```bash
ANALYZE=true npm run build  # Bundle analysis (after adding analyzer)
```

### Testing
```bash
npm test              # Run tests (after setup)
npm run test:watch    # Watch mode
```

---

## 📞 Support

**Repository**: /Users/dazzlar/Desktop/coding/mentaltouch_App
**Framework**: Next.js 16.0.0
**Node Version**: 18+ (recommended)
**Package Manager**: npm

**Documentation**:
- Full Index: `PROJECT_INDEX_ENHANCED.md`
- JSON Data: `PROJECT_INDEX_ENHANCED.json`
- Original Index: `PROJECT_INDEX.md`

**Next Review**: 2026-03-01

---

**Made with ❤️ for mental health support**
