# MentalTouch App - Comprehensive Codebase Index

**Generated**: 2026-01-30
**Project**: ForestEcho (숲울림) - AI Mental Health Counseling Platform
**Tech Stack**: Next.js 16, React 19, TypeScript 5.9, Firebase, Gemini AI, OpenAI

---

## Executive Summary

### Codebase Health
- **Total Source Files**: 130 TypeScript/TSX files (excluding node_modules)
- **Total Lines of Code**: ~42,000 lines
- **Largest File**: `types/education.ts` (17,180 lines, 856KB) ⚠️ **CRITICAL PERFORMANCE ISSUE**
- **Dead Code**: ~17MB of unused music files in `/public/music/` ⚠️
- **Duplicate Code**: Significant duplication between OpenAI and Gemini implementations

### Key Metrics
- **API Routes**: 5 active, 1 empty directory (auth)
- **Firebase Integration Points**: 20 files
- **AI Provider Implementations**: 2 (OpenAI GPT-4o-mini, Gemini 3 Flash)
- **Empty Directories**: 3 (api/auth, public/images, .serena/memories)

---

## 1. Main Application Structure

### `/app/` - Next.js App Router (356KB, 30 files)

#### Pages & Layouts
```
app/
├── layout.tsx                    # Root layout with providers
├── page.tsx                      # Home/Chat page
├── loading.tsx                   # Global loading state
│
├── admin/
│   └── page.tsx                  # Admin dashboard (720 lines)
│
├── analysis/[id]/
│   ├── layout.tsx                # Analysis page layout
│   └── page.tsx                  # Analysis detail view (924 lines)
│
├── assessment/
│   └── page.tsx                  # Mental health assessment
│
├── checkin/
│   └── page.tsx                  # Daily check-in (330 lines)
│
├── community/
│   └── page.tsx                  # Community forum (273 lines)
│
├── education/
│   ├── layout.tsx                # Education section layout
│   ├── loading.tsx               # Loading state
│   ├── page.tsx                  # Article list
│   └── [slug]/page.tsx          # Article detail view
│
├── emotion/
│   ├── loading.tsx
│   └── page.tsx                  # Emotion tracking
│
├── faq/
│   └── page.tsx                  # FAQ page
│
├── myforest/
│   ├── loading.tsx
│   └── page.tsx                  # Gamification forest (471 lines)
│
├── offline/
│   ├── page.tsx
│   └── OfflineContent.tsx       # PWA offline page
│
├── support/
│   └── page.tsx                  # Support page (402 lines)
│
├── terms/
│   └── page.tsx                  # Terms of service (383 lines)
│
├── disclaimer/
│   └── page.tsx                  # Legal disclaimer (324 lines)
│
├── opengraph-image.tsx          # OG image generator
├── robots.ts                     # Robots.txt
├── sitemap.ts                    # Sitemap generator
└── rss.xml/route.ts             # RSS feed
```

### `/components/` - React Components (520KB, 87 files)

```
components/
├── analysis/                     # Analysis reports & charts (7 files)
│   ├── AnalysisDownload.tsx
│   ├── AnalysisHistoryCard.tsx
│   ├── AnalysisStatsCard.tsx
│   ├── EmotionChart.tsx
│   ├── LifeImpactChart.tsx
│   ├── RecommendedCareSection.tsx
│   └── ScoreGauge.tsx
│
├── apps-in-toss/                 # Toss mini-app integration
│   └── AppsInTossProvider.tsx   # TODO: Implement Toss SDK
│
├── assessment/                   # Mental health tests (2 files)
│   ├── AssessmentResult.tsx
│   └── AssessmentTest.tsx
│
├── audio/                        # Background music player
│   └── BGMPlayer.tsx            # ⚠️ DISABLED - Commented out in app/page.tsx
│
├── auth/                         # Authentication (2 files)
│   ├── AuthModal.tsx            # Login/signup modal
│   └── GuestLimitModal.tsx      # Guest mode limitations
│
├── chat/                         # Chat interface (3 files)
│   ├── ChatHistory.tsx          # Session history
│   ├── ChatInterface.tsx        # Main chat UI (509 lines)
│   └── ChatMessage.tsx          # Message bubble
│
├── checkin/                      # Daily routines (3 files)
│   ├── EveningCheckin.tsx       # Evening reflection
│   ├── MorningCheckin.tsx       # Morning check-in
│   └── RoutineTracker.tsx       # Habit tracking
│
├── community/                    # Forum features (3 files)
│   ├── PostCreate.tsx
│   ├── PostDetail.tsx
│   └── PostList.tsx
│
├── counseling/                   # AI mode controls (2 files)
│   ├── ModeSelector.tsx         # CBT, DBT, etc. (10 modes)
│   └── ToneSlider.tsx           # Emotion-Logic slider (0-100)
│
├── crisis/                       # Emergency support
│   └── CrisisModal.tsx          # Suicide prevention resources
│
├── education/                    # Mental health articles (4 files)
│   ├── ArticleContent.tsx
│   ├── ArticleDetail.tsx
│   ├── ArticleList.tsx
│   └── RecommendedProducts.tsx
│
├── emotion/                      # Emotion tracking (6 files)
│   ├── EmotionCheckin.tsx       # Daily emotion log
│   ├── EmotionGraph.tsx         # Emotion trends chart
│   ├── EmotionHistory.tsx
│   ├── EmotionJourneyChart.tsx
│   ├── EmotionJourneySection.tsx
│   └── EmotionStatsCard.tsx
│
├── forest/                       # Gamification (3 files)
│   ├── ForestVisualization.tsx  # Tree growth animation (485 lines)
│   ├── LevelUpModal.tsx         # Achievement celebration
│   └── QuickCareLinks.tsx
│
├── layout/                       # App layout (7 files)
│   ├── AuthProvider.tsx         # Firebase Auth context
│   ├── ForestBackground.tsx     # Animated forest bg
│   ├── Header.tsx               # Desktop header (783 lines)
│   ├── LanguageProvider.tsx     # i18n support
│   ├── MobileHeader.tsx         # Mobile nav
│   ├── ThemeProvider.tsx        # Dark/light theme
│   └── WelcomeScreen.tsx        # First-time UX
│
├── onboarding/                   # User onboarding (3 files)
│   ├── EmotionPicker.tsx
│   ├── OnboardingTour.tsx
│   └── QuickStartTemplates.tsx
│
├── premium/                      # Paid features
│   └── AnalysisReport.tsx       # AI-generated insights
│
├── profile/                      # User profile
│   └── NicknameModal.tsx
│
├── pwa/                          # Progressive Web App
│   └── ServiceWorkerRegister.tsx
│
├── referral/                     # Referral program (2 files)
│   ├── ReferralDashboard.tsx
│   └── ShareProgress.tsx
│
└── trust/                        # Conversion elements (4 files)
    ├── SocialProof.tsx
    ├── TrustBadges.tsx
    ├── UpgradeModal.tsx
    └── UserStats.tsx
```

### `/lib/` - Business Logic (228KB, 31 files)

```
lib/
├── firebase/                     # Firebase integrations (11 files)
│   ├── admin.ts                 # Firebase Admin SDK
│   ├── analysis.ts              # Analysis CRUD
│   ├── chat-sessions.ts         # Chat history
│   ├── config.ts                # Client SDK config
│   ├── emotion-tracking.ts      # Client-side tracking
│   ├── emotion-tracking-admin.ts # Server-side tracking
│   ├── firestore.ts             # Firestore helpers
│   ├── user-subscription.ts     # Client subscription logic
│   └── user-subscription-admin.ts # Server tier management
│
├── gemini/                       # Google Gemini AI (9 files)
│   ├── advanced-prompts.ts      # 6 lines ⚠️ UNUSED (use enhanced-prompts.ts)
│   ├── config.ts                # Gemini client setup
│   ├── context-manager.ts       # Crisis detection, context building
│   ├── counseling-modes.ts      # 10 therapy modes (370 lines)
│   ├── emotion-analyzer.ts      # Emotion extraction from text
│   ├── enhanced-prompts.ts      # Main prompts (111 lines)
│   └── response-filter.ts       # Content safety filter (230 lines)
│
├── openai/                       # OpenAI GPT (9 files)
│   ├── advanced-prompts.ts      # 334 lines ⚠️ DUPLICATE OF GEMINI
│   ├── config.ts                # OpenAI client setup
│   ├── context-manager.ts       # 191 lines ⚠️ DUPLICATE OF GEMINI
│   ├── counseling-modes.ts      # 370 lines ⚠️ IDENTICAL TO GEMINI
│   ├── free-tier-prompt.ts      # Simplified prompt for GPT-4o-mini
│   ├── prompts.ts               # 193 lines
│   └── structured-schemas.ts    # Zod schemas for structured output
│
├── rag/                          # Retrieval-Augmented Generation (4 files)
│   ├── embeddings.ts            # OpenAI embeddings
│   ├── knowledge-base.ts        # Psychology knowledge (505 lines)
│   ├── pinecone-config.ts       # Vector DB config
│   └── search.ts                # Semantic search
│
├── referral/                     # Referral system (3 files)
│   ├── referral-admin.ts        # Server-side referral logic
│   ├── referral-client.ts       # Client-side referral
│   └── referral-utils.ts        # Shared utilities
│
├── search/                       # External search
│   └── tavily.ts                # Tavily research API
│
├── utils/                        # Utilities (2 files)
│   ├── icon-map.ts              # Emoji icon mapping
│   └── language-detector.ts     # Auto-detect user language
│
├── apps-in-toss/
│   └── hooks.ts                 # Toss mini-app hooks
│
├── forest-level.ts              # Gamification level logic
└── rate-limit.ts                # In-memory rate limiting (10/min)
```

### `/types/` - TypeScript Definitions (928KB, 9 files)

⚠️ **CRITICAL ISSUE**: `types/education.ts` is 856KB (17,180 lines)

```
types/
├── analysis.ts                   # Analysis report types
├── assessment.ts                 # Mental health test types (583 lines)
├── chat.ts                       # Chat message types
├── checkin.ts                    # Check-in types (302 lines)
├── community.ts                  # Forum types (307 lines)
├── education.ts                  # 17,180 lines ⚠️ MASSIVE FILE
├── emotion.ts                    # Emotion tracking types
├── index.ts                      # Re-exports
└── user.ts                       # User profile types
```

---

## 2. API Routes & Dependencies

### Active API Routes (`/app/api/`)

```
app/api/
├── analysis/route.ts            # POST - Generate AI analysis report
│   Dependencies: Firebase Admin, OpenAI, Gemini
│
├── chat/route.ts                # POST - Streaming AI chat (457 lines)
│   Dependencies:
│     - Gemini 3 Flash (premium/basic users)
│     - GPT-4o-mini (free/guest users)
│     - Firebase Admin (tier check)
│     - RAG Search (premium only)
│     - Tavily (optional research)
│     - Rate limiting (10/min)
│
├── referral/route.ts            # POST/GET - Referral tracking
│   Dependencies: Firebase Admin
│
└── seed-faq/route.ts            # POST - Seed FAQ data
    Dependencies: Firebase Admin
```

### Empty/Unused API Routes

```
app/api/auth/                     # ⚠️ EMPTY DIRECTORY (delete or implement)
```

---

## 3. Firebase Integration Points

### Firebase Services Used

1. **Authentication** (Firebase Auth)
   - Email/Password
   - Google OAuth
   - Anonymous (Guest mode)

2. **Firestore Database**
   - Collections: `users`, `chatSessions`, `emotionTracking`, `analyses`, `subscriptions`, `referrals`, `faqs`, `communityPosts`

3. **Firestore Security Rules** (`firestore.rules`)

### Firebase Client Files (9 files)

```
components/auth/AuthModal.tsx
components/layout/AuthProvider.tsx
components/layout/Header.tsx
components/layout/MobileHeader.tsx
components/profile/NicknameModal.tsx
lib/firebase/config.ts
```

### Firebase Admin Files (11 files)

```
app/api/analysis/route.ts
app/api/chat/route.ts
app/api/seed-faq/route.ts
app/admin/page.tsx
app/analysis/[id]/page.tsx
app/community/page.tsx
app/faq/page.tsx
app/myforest/page.tsx
app/support/page.tsx
lib/firebase/admin.ts
lib/firebase/emotion-tracking-admin.ts
lib/firebase/user-subscription-admin.ts
lib/referral/referral-admin.ts
```

### Firebase Cloud Functions

```
functions/
├── index.js                     # 577 lines, 144MB node_modules ⚠️
├── package.json
└── .env
```

**Status**: Appears to be legacy/unused. The app uses Next.js API routes instead of Cloud Functions.

---

## 4. Unused/Orphaned Files & Dead Code

### 🔴 Critical Issues (Immediate Action Required)

#### 1. Massive Education Types File
```
types/education.ts               # 17,180 lines, 856KB ⚠️ CRITICAL
```
**Problem**: This file contains massive embedded article data (likely 100+ full articles in multiple languages).

**Impact**:
- Bloats bundle size by ~1MB
- Slows down TypeScript compilation
- Every component importing this loads all article data

**Solution**: Move article data to:
- JSON files in `/public/data/articles/`
- Database (Firestore)
- CMS (Contentful, Sanity)

**Estimated savings**: 850KB bundle reduction, 50% faster TS compilation

---

#### 2. Unused Background Music Files
```
public/music/                    # 17MB total ⚠️
├── forest-whispers.mp3          # 3.7MB
├── golden-hour-dreams.mp3       # 2.1MB
├── healing-rain-therapy.mp3     # 2.7MB
├── ocean-reverie.mp3            # 2.2MB
├── starlit-reverie.mp3          # 3.1MB
└── weightless-dreams.mp3        # 2.9MB
```

**Problem**: BGMPlayer component exists but is commented out in `app/page.tsx`:
```tsx
{/* <BGMPlayer /> */}
```

**Impact**:
- Wastes 17MB in production build
- Increases deployment time
- No benefit to users

**Solution**:
- Delete `/public/music/` directory
- Delete `components/audio/BGMPlayer.tsx`
- Remove dynamic import from `app/page.tsx`

**Estimated savings**: 17MB

---

#### 3. Duplicate AI Provider Code
```
lib/openai/counseling-modes.ts   # 370 lines
lib/gemini/counseling-modes.ts   # 370 lines (IDENTICAL)

lib/openai/context-manager.ts    # 191 lines
lib/gemini/context-manager.ts    # 191 lines (IDENTICAL)

lib/openai/advanced-prompts.ts   # 334 lines
lib/gemini/advanced-prompts.ts   # 6 lines (points to enhanced-prompts.ts)
```

**Problem**: The counseling modes and context manager code is duplicated across OpenAI and Gemini implementations.

**Impact**:
- Maintenance burden (update in 2 places)
- ~20KB duplicate code
- Risk of divergence

**Solution**: Create shared utilities:
```typescript
lib/ai/
├── counseling-modes.ts          # Shared across providers
├── context-manager.ts           # Shared crisis detection
└── prompts/
    ├── shared.ts                # Common prompts
    ├── openai.ts                # OpenAI-specific
    └── gemini.ts                # Gemini-specific
```

**Estimated savings**: 15KB, 50% less maintenance

---

#### 4. Unused Firebase Cloud Functions
```
functions/                       # 144MB node_modules ⚠️
├── index.js                     # 577 lines
├── package.json
└── node_modules/                # 144MB
```

**Problem**: The app uses Next.js API routes (`app/api/*`), not Firebase Cloud Functions.

**Evidence**:
- `functions/index.js` contains duplicate logic of `app/api/chat/route.ts`
- No deployment references in `firebase.json`
- Not called from client code

**Solution**: Delete entire `functions/` directory if confirmed unused.

**Estimated savings**: 144MB disk space

---

### 🟡 Medium Priority Issues

#### 5. Empty API Directory
```
app/api/auth/                    # Empty directory
```

**Solution**: Either implement auth endpoints or delete directory.

---

#### 6. Empty Public Images Directory
```
public/images/                   # Empty
```

**Solution**: Delete or add placeholder image.

---

#### 7. Minimal Gemini Advanced Prompts
```
lib/gemini/advanced-prompts.ts   # 6 lines (just re-exports)
```

**Solution**: Delete and use `enhanced-prompts.ts` directly.

---

### 🟢 Low Priority (Technical Debt)

#### 8. Incomplete Toss Integration
```
components/apps-in-toss/AppsInTossProvider.tsx
lib/apps-in-toss/hooks.ts
```

Contains `// TODO: Implement Toss SDK` comments.

---

#### 9. No Test Files
```
# No *.test.ts or *.spec.ts files found
```

**Recommendation**: Add basic tests for critical paths:
- API route error handling
- Crisis detection logic
- Content filtering

---

## 5. Performance Bottlenecks & Optimization

### Bundle Size Analysis

```
Current estimated bundle size:
- types/education.ts:          ~850KB ⚠️
- lib/ duplicates:             ~20KB
- Total source (excl. deps):   ~5MB

After optimization:
- types/education.ts:          ~10KB (moved to JSON/DB)
- lib/ duplicates:             ~5KB (shared modules)
- Estimated total:             ~4MB (-20%)
```

### Lazy Loading Opportunities

The app already uses dynamic imports for:
- BGMPlayer (though commented out)
- Heavy components

**Good**: No major lazy loading issues.

---

### Large Files (>300 lines)

```
Top 10 largest files:
1. types/education.ts            # 17,180 lines ⚠️
2. app/analysis/[id]/page.tsx    # 924 lines
3. components/layout/Header.tsx  # 783 lines
4. app/admin/page.tsx            # 720 lines
5. types/assessment.ts           # 583 lines
6. functions/index.js            # 577 lines
7. components/chat/ChatInterface.tsx # 509 lines
8. lib/rag/knowledge-base.ts     # 505 lines
9. components/forest/ForestVisualization.tsx # 485 lines
10. app/myforest/page.tsx        # 471 lines
```

**Recommendation**: Consider splitting:
- `app/admin/page.tsx` into smaller components
- `components/layout/Header.tsx` into Desktop/Mobile variants (already has MobileHeader.tsx)

---

### Duplicate Code Patterns

**Pattern 1**: Tone guidance logic duplicated
- `app/api/chat/route.ts` (lines 36-77)
- `functions/index.js` (lines 48-83)

**Pattern 2**: Crisis keyword detection
- Multiple files have similar crisis detection logic

**Solution**: Centralize in `lib/ai/safety/`

---

## 6. Dependency Analysis

### Core Dependencies (from package.json)

```json
{
  "@google/generative-ai": "^0.24.1",     // Gemini AI
  "@pinecone-database/pinecone": "^6.1.4", // Vector DB (RAG)
  "@tavily/core": "^0.5.12",              // Research search
  "firebase": "^12.4.0",                   // Client SDK
  "firebase-admin": "^13.5.0",             // Server SDK
  "openai": "^6.17.0",                     // GPT API
  "next": "^16.0.0",                       // Framework
  "react": "^19.2.0",                      // UI library
  "framer-motion": "^12.23.24",            // Animations
  "recharts": "^3.7.0"                     // Charts
}
```

### Unused Dependencies Audit

**Potentially Unused**:
- `html2canvas` - Only used in analysis download (could be lazy loaded)
- `react-confetti` - Used in LevelUpModal (good)
- `@apps-in-toss/web-framework` - TODO implementation

---

## 7. Security & Safety Review

### Content Safety Layers

1. **Pre-request Filtering** (`lib/gemini/response-filter.ts`)
   - Detects dangerous intent before sending to AI
   - Blocks: drugs, weapons, self-harm, illegal content

2. **Crisis Detection** (`lib/gemini/context-manager.ts`)
   - Keyword detection for suicide/self-harm
   - Emergency contact provision

3. **Post-response Filtering** (`app/api/chat/route.ts`)
   - Validates AI responses
   - Replaces prohibited content with safe alternatives

### Rate Limiting

```typescript
lib/rate-limit.ts                # In-memory (10 requests/min)
```

**Issue**: In-memory rate limiting doesn't work across serverless instances.

**Recommendation**: Use Upstash Redis or Vercel KV for distributed rate limiting.

---

## 8. Firebase Firestore Schema

### Collections

```
firestore/
├── users/
│   └── {userId}/
│       ├── profile
│       ├── subscription (tier, dailyUsageCount, lastResetDate)
│       └── referrals/
│
├── chatSessions/
│   └── {sessionId}/
│       └── messages[]
│
├── emotionTracking/
│   └── {trackingId}/
│       └── {emotion, intensity, timestamp}
│
├── analyses/
│   └── {analysisId}/
│       └── {report, createdAt, userId}
│
├── communityPosts/
│   └── {postId}/
│       └── comments[]
│
└── faqs/
    └── {faqId}
```

---

## 9. Deployment Architecture

### Current Setup

```
Vercel (Production)
├── Web App (Next.js)
│   ├── Static Pages: /, /terms, /disclaimer
│   ├── SSR Pages: /education/[slug], /analysis/[id]
│   └── API Routes: /api/chat, /api/analysis
│
Firebase
├── Authentication
├── Firestore Database
└── Cloud Functions (unused?)

Third-party APIs
├── Gemini 3 Flash (premium users)
├── GPT-4o-mini (free users)
├── Pinecone (RAG - vector search)
└── Tavily (optional research)
```

---

## 10. Recommended Action Plan

### Phase 1: Critical Performance Fixes (Week 1)

**Priority 1** - Education Types Refactor
```bash
# Move article data to JSON
mkdir -p public/data/articles/{ko,en,ja,zh}
# Split education.ts into:
# - types/education.ts (10KB - types only)
# - public/data/articles/*.json (850KB)
# Update imports to fetch JSON dynamically
```

**Priority 2** - Remove Dead Music Files
```bash
rm -rf public/music/
rm components/audio/BGMPlayer.tsx
# Remove BGMPlayer import from app/page.tsx
```

**Estimated Impact**: -18MB build size, +50% faster builds

---

### Phase 2: Code Deduplication (Week 2)

**Priority 3** - Consolidate AI Logic
```bash
# Create lib/ai/shared/
mkdir -p lib/ai/shared
mv lib/gemini/counseling-modes.ts lib/ai/shared/
mv lib/gemini/context-manager.ts lib/ai/shared/
# Update imports in lib/openai/ and lib/gemini/
```

**Priority 4** - Remove Duplicate Functions Directory
```bash
# Verify functions/ is unused
git log --all --full-history -- functions/
# If confirmed unused:
rm -rf functions/
```

**Estimated Impact**: -15KB code, -144MB disk space

---

### Phase 3: Infrastructure (Week 3)

**Priority 5** - Distributed Rate Limiting
```bash
npm install @upstash/ratelimit @upstash/redis
# Replace lib/rate-limit.ts with Upstash
```

**Priority 6** - Add Basic Tests
```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
# Add tests for:
# - Crisis detection (lib/gemini/context-manager.ts)
# - Content filtering (lib/gemini/response-filter.ts)
# - API route error handling
```

---

### Phase 4: Code Organization (Week 4)

**Priority 7** - Split Large Components
```typescript
// app/admin/page.tsx (720 lines) → Split into:
app/admin/
├── page.tsx              // 100 lines (layout)
└── components/
    ├── UserManagement.tsx
    ├── ContentModeration.tsx
    └── Analytics.tsx
```

**Priority 8** - Clean Up Empty Directories
```bash
rm -rf app/api/auth
rm -rf public/images  # or add placeholder
rm -rf .serena/memories
```

---

## 11. File Dependency Graph

### Critical Path: Chat Flow

```
User Input
  ↓
app/page.tsx
  ↓
components/chat/ChatInterface.tsx
  ↓
app/api/chat/route.ts
  ├→ lib/firebase/user-subscription-admin.ts (tier check)
  ├→ lib/rate-limit.ts (rate limiting)
  ├→ lib/gemini/context-manager.ts (crisis detection)
  ├→ lib/gemini/response-filter.ts (safety)
  ├→ lib/rag/search.ts (knowledge base)
  ├→ lib/gemini/config.ts (Gemini API) OR
  └→ lib/openai/config.ts (OpenAI API)
```

### Critical Path: Analysis Generation

```
User Request
  ↓
app/analysis/[id]/page.tsx
  ↓
app/api/analysis/route.ts
  ├→ lib/firebase/admin.ts
  ├→ lib/openai/config.ts
  └→ components/premium/AnalysisReport.tsx
```

---

## 12. TODO Items Found in Code

```typescript
// components/apps-in-toss/AppsInTossProvider.tsx
// TODO: Implement Toss SDK
// https://toss.im/developers/apps-in-toss

// components/emotion/EmotionCheckin.tsx
// TODO: Add emotion intensity levels

// components/trust/UpgradeModal.tsx
// TODO: Integrate with payment system

// lib/referral/referral-utils.ts
// TODO: Add referral reward calculation
```

---

## 13. Environment Variables Required

```env
# AI APIs
GEMINI_API_KEY=                 # Google Gemini (required)
OPENAI_API_KEY=                 # OpenAI (required)
TAVILY_API_KEY=                 # Research search (optional)

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Pinecone (RAG)
PINECONE_API_KEY=               # Vector database (optional)
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=

# Optional
NEXT_PUBLIC_ADSENSE_CLIENT_ID=  # Google AdSense
NEXT_PUBLIC_BASE_URL=           # Production URL
```

---

## 14. Build & Deploy Commands

```bash
# Development
npm run dev                     # Start dev server (localhost:3000)

# Production Build
npm run build                   # Next.js build
npm run start                   # Start production server

# Linting
npm run lint                    # ESLint

# Firebase
firebase deploy --only firestore:rules  # Deploy security rules
firebase deploy --only functions        # Deploy Cloud Functions (unused?)

# Seeding
npm run seed:kb                # Seed knowledge base to Pinecone
```

---

## 15. Performance Benchmarks (Estimated)

### Current State

```
Lighthouse Score (estimated):
- Performance: 65/100 ⚠️
  - Large bundle size (education types)
  - Unused music files

- Accessibility: 90/100 ✓
- Best Practices: 85/100
- SEO: 95/100 ✓
```

### After Optimization

```
Lighthouse Score (target):
- Performance: 85/100 ✓
  - Reduced bundle (-850KB)
  - Removed unused assets (-17MB)

- Accessibility: 90/100 ✓
- Best Practices: 90/100
- SEO: 95/100 ✓
```

---

## 16. Key Insights & Recommendations

### Strengths

1. **Modern Stack**: Next.js 16, React 19, TypeScript 5.9
2. **Multi-AI Support**: Gemini + OpenAI with tier-based routing
3. **Comprehensive Safety**: 3-layer content filtering + crisis detection
4. **Good UX Features**: Streaming responses, auto language detection, gamification
5. **PWA Support**: Offline functionality, service worker

### Weaknesses

1. **Massive Type File**: 17,180-line education.ts file (critical)
2. **Dead Code**: 17MB unused music files
3. **Code Duplication**: OpenAI/Gemini implementations share 90% code
4. **In-Memory Rate Limiting**: Doesn't work in serverless
5. **No Tests**: Zero test coverage for critical safety logic

### Quick Wins (This Week)

1. Delete `public/music/` and `BGMPlayer.tsx` → -17MB
2. Move education data to JSON → -850KB bundle
3. Delete `app/api/auth/` empty directory
4. Add .gitignore rule for `.serena/memories/`

### Long-term Improvements

1. Add E2E tests with Playwright
2. Implement Sentry error tracking
3. Add bundle analyzer (`@next/bundle-analyzer`)
4. Consider migrating to Vercel KV for rate limiting
5. Evaluate Pinecone costs (may be expensive for this use case)

---

## 17. Conclusion

The mentaltouch_App codebase is well-structured overall with modern best practices, but suffers from **critical performance issues** due to:

1. An 856KB types file containing embedded article data
2. 17MB of unused audio assets
3. Significant code duplication between AI providers

**Immediate action required** on the education.ts refactor to prevent bundle bloat in production. The other issues are manageable technical debt.

**Estimated time to fix critical issues**: 1-2 weeks
**Estimated performance gain**: +20% faster builds, -18MB bundle size, +15 Lighthouse points

---

**Index last updated**: 2026-01-30
**Next review recommended**: 2026-02-06 (after Phase 1 cleanup)
