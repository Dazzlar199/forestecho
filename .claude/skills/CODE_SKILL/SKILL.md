---
name: elite-code-reviewer
description: Advanced code review system with deep security analysis architecture evaluation and performance profiling for pull requests security audits refactoring and code quality assessments
---

# Elite Code Review Assistant

## When to Use

### Primary Triggers
- Pull request reviews before merge
- Pre-production security audits
- Performance bottleneck investigations
- Architecture quality assessments
- Technical debt evaluation
- Code refactoring planning
- Security vulnerability scanning

### Activation Keywords
Review this code, find vulnerabilities, optimize performance, security audit, code quality check, refactor suggestions, tech debt analysis, architecture review

---

## Core Workflow

### Phase 1: Context Detection

#### Language Recognition
Automatically detect and apply standards for Python, JavaScript, TypeScript, Java, C#, Go, Ruby, PHP, Rust, Swift, Kotlin, Scala, and more.

#### Project Context Analysis
Identify framework, architecture pattern, database technology, and environment to provide context-aware recommendations.

#### Review Scope Calculation
Assess files changed, lines modified, estimated review time, and risk level classification.

---

### Phase 2: Security Deep Scan

#### OWASP Top 10 Checks

**Broken Access Control**
```python
# BAD
@app.route('/admin/users/<user_id>')
def get_user(user_id):
    return User.query.get(user_id)

# GOOD
@app.route('/admin/users/<user_id>')
@require_admin
def get_user(user_id):
    if not current_user.can_access(user_id):
        abort(403)
    return User.query.get(user_id)
```

**Cryptographic Failures**
```python
# BAD
hashed = hashlib.md5(password.encode()).hexdigest()

# GOOD
from werkzeug.security import generate_password_hash
hashed = generate_password_hash(password, method='pbkdf2:sha256')
```

**Injection Attacks**
```python
# BAD SQL Injection
query = f"SELECT * FROM users WHERE email = '{user_input}'"

# GOOD Parameterized Query
query = "SELECT * FROM users WHERE email = %s"
cursor.execute(query, (user_input,))

# BAD Command Injection
os.system(f"ping {user_input}")

# GOOD Safe Subprocess
import subprocess
subprocess.run(['ping', '-c', '4', user_input], check=True)
```

**Security Misconfiguration**
```python
# BAD
app.config['DEBUG'] = True
response.headers.add('Access-Control-Allow-Origin', '*')

# GOOD
app.config['DEBUG'] = os.getenv('FLASK_ENV') == 'development'
CORS(app, origins=['https://trusted-site.com'])
```

#### Security Checklist

**Authentication**
- JWT tokens expire within 15 minutes
- Refresh token rotation
- Session invalidation on logout
- MFA for admin routes
- Rate limiting on login

**Data Protection**
- Encrypt sensitive data at rest with AES-256
- Use TLS 1.3 minimum
- Anonymize PII in logs
- Store credentials in environment variables
- Rotate API keys every 90 days

**Input Validation**
- Validate all inputs with whitelist
- Check file uploads: type, size, virus scan
- Validate JSON against schema
- Sanitize phone numbers and emails

---

### Phase 3: Performance Profiling

#### Algorithm Complexity
```python
# BAD O(n²) Quadratic
def find_duplicates(arr):
    duplicates = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                duplicates.append(arr[i])
    return duplicates

# GOOD O(n) Linear
def find_duplicates(arr):
    seen = set()
    duplicates = set()
    for item in arr:
        if item in seen:
            duplicates.add(item)
        seen.add(item)
    return list(duplicates)
# Improvement: 1000x faster for large arrays
```

#### Database Optimization

**N+1 Query Problem**
```python
# BAD 101 queries
posts = Post.query.all()
for post in posts:
    print(post.author.name)

# GOOD 2 queries
posts = Post.query.options(joinedload(Post.author)).all()
for post in posts:
    print(post.author.name)
# Improvement: 50x faster
```

**Missing Index**
```sql
-- BAD Full table scan
SELECT * FROM users WHERE email = 'user@example.com';

-- GOOD Indexed lookup
CREATE INDEX idx_users_email ON users(email);
SELECT * FROM users WHERE email = 'user@example.com';
-- Improvement: 766x faster
```

#### Memory Leaks
```python
# BAD Unbounded cache
cache = {}
def get_data(key):
    if key not in cache:
        cache[key] = expensive_operation(key)
    return cache[key]

# GOOD LRU cache
from functools import lru_cache

@lru_cache(maxsize=128)
def get_data(key):
    return expensive_operation(key)
```

#### Async Opportunities
```python
# BAD Synchronous
def send_notifications(users):
    for user in users:
        send_email(user)
        send_sms(user)
# 100 users = 80 seconds

# GOOD Asynchronous
import asyncio

async def send_notifications(users):
    tasks = []
    for user in users:
        tasks.append(send_email_async(user))
        tasks.append(send_sms_async(user))
    await asyncio.gather(*tasks)
# 100 users = 0.8 seconds
```

---

### Phase 4: Architecture Quality

#### SOLID Principles

**Single Responsibility**
```python
# BAD God class
class User:
    def save_to_db(self): pass
    def send_email(self): pass
    def validate_password(self): pass
    def generate_report(self): pass

# GOOD Separated concerns
class User:
    def __init__(self, email, password):
        self.email = email
        self.password = password

class UserRepository:
    def save(self, user): pass

class EmailService:
    def send_welcome(self, user): pass
```

**Open/Closed**
```python
# BAD Must modify for new types
def process_payment(payment_type, amount):
    if payment_type == "credit_card":
        pass
    elif payment_type == "paypal":
        pass

# GOOD Strategy pattern
from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
    def process(self, amount): pass

class CreditCardProcessor(PaymentProcessor):
    def process(self, amount): pass

class PayPalProcessor(PaymentProcessor):
    def process(self, amount): pass
```

**Dependency Inversion**
```python
# BAD Tight coupling
class UserService:
    def __init__(self):
        self.db = MySQLDatabase()

# GOOD Depend on abstraction
class Database(ABC):
    @abstractmethod
    def save(self, data): pass

class UserService:
    def __init__(self, db: Database):
        self.db = db
```

#### Complexity Analysis