# Engineering Fundamentals

What to learn as a software engineer. Concepts that matter, not frameworks.

---

## TL;DR

**Foundation:**
- **Choose boring technology** - Proven tech over shiny things
- **Structure code well** - Patterns, separation of concerns, clear contracts

**Performance & Scale:**
- **Performance** - Fast for single user (indexing, avoid N+1)
- **Scalability** - Handle more users (caching, load balancing, sharding)
- **Understand the difference** - Performance ≠ Scalability

**Reliability:**
- **CAP theorem** - Pick 2: Consistency, Availability, Partition tolerance
- **Consistency patterns** - Weak, eventual, strong
- **Reliability patterns** - Transactions, outbox, idempotency

**Shipping:**
- **Deploy ≠ Release** - Feature flags, canaries, rollbacks
- **Safe migrations** - Dual write, expand-contract, zero-downtime

**Good UX:**
- **Optimistic updates** - Show success before server confirms
- **Real-time data** - SSE, WebSockets, polling (when to use each)

---

## Why This Matters

Most engineers learn frameworks and languages. React, Vue, Angular. Python, Go, Rust. AWS, GCP, Azure.

These are tools. They change every few years.

The concepts below don't change. They're how systems work. Learn these once, apply them everywhere.

**The goal:** Know what to learn, not what's trendy.

---

## 1. Choose Boring Technology

**What it is:** Use proven, stable tech. Avoid shiny new things.

**The insight:** Every team has limited "innovation tokens." Spend them wisely.

If you use:
- Boring database (Postgres)
- Boring backend (Rails/Django)
- Boring infrastructure (AWS/Heroku)

You can innovate on your product.

If you use:
- New database (some graph DB you read about)
- New language (Rust because it's fast)
- New infrastructure (Kubernetes because everyone does it)

You spend all your tokens on tech. No tokens left for product innovation. And when things break, you're debugging tech instead of building features.

**Examples:**

| **Boring (Good)** | **Shiny (Risky)** |
|-------------------|-------------------|
| Postgres | MongoDB (when you don't need it), CockroachDB (when Postgres works) |
| Redis | Some new in-memory DB you read about |
| Rails/Django/NestJS | New framework in a new language |
| REST APIs | GraphQL (unless you actually need it) |
| Monolith first | Microservices from day 1 |
| Heroku/DigitalOcean | Kubernetes (when you have 2 engineers) |

**When to use shiny tech:**
- You have a specific problem boring tech can't solve
- You have capacity to learn and debug it
- You've used boring tech everywhere else

**The rule:** Be boring everywhere except where you need to innovate.

**Reference:** [Boring Technology Club](https://boringtechnology.club/)

---

## 2. How to Structure Code

**What it is:** Organize code so it's easy to change, test, and understand.

**Key concepts:**

### Separation of Concerns

Each part of code does one thing.

**Bad:**
```javascript
// Controller handles business logic + database + formatting
function createUser(req, res) {
  const user = { name: req.body.name, email: req.body.email };
  db.insert('users', user);
  const formatted = { userName: user.name, userEmail: user.email };
  res.json(formatted);
}
```

**Good:**
```javascript
// Controller routes, Service handles logic, Repository handles data
function createUser(req, res) {
  const user = userService.create(req.body);
  res.json(formatUser(user));
}
```

### Abstraction Levels

Hide complexity behind clear interfaces.

**Example:**
```javascript
// Bad - leaking implementation details
function getUsers() {
  const rows = await db.query('SELECT * FROM users WHERE deleted_at IS NULL');
  return rows.map(r => ({ id: r.user_id, name: r.user_name }));
}

// Good - clear interface, hidden implementation
function getActiveUsers() {
  return userRepository.findActive();
}
```

### Design Patterns That Matter

You don't need all 23 Gang of Four patterns. Learn these:

**Repository Pattern** - Abstract data access
```javascript
class UserRepository {
  findById(id) { /* database logic here */ }
  findByEmail(email) { /* database logic here */ }
  save(user) { /* database logic here */ }
}
```

**Factory Pattern** - Create objects without exposing creation logic
```javascript
function createPaymentProcessor(type) {
  if (type === 'stripe') return new StripeProcessor();
  if (type === 'paypal') return new PaypalProcessor();
}
```

**Strategy Pattern** - Switch algorithms at runtime
```javascript
class PricingStrategy {
  calculate(amount) { /* implement in subclass */ }
}

class StandardPricing extends PricingStrategy {
  calculate(amount) { return amount; }
}

class DiscountPricing extends PricingStrategy {
  calculate(amount) { return amount * 0.9; }
}
```

### API Contracts

**Version your APIs:**
```
/api/v1/users  // Old clients use this
/api/v2/users  // New clients use this
```

**Don't break contracts:**
```javascript
// Bad - breaks existing clients
{ "user_name": "John" }  // was "name", now "user_name"

// Good - add new fields, keep old ones
{ "name": "John", "user_name": "John" }
```

**Use clear field names:**
```javascript
// Bad
{ "ts": 1234567890, "u": "John", "st": "active" }

// Good
{ "created_at": 1234567890, "name": "John", "status": "active" }
```

---

## 3. How to Make It Fast (Performance)

**What it is:** Make it fast for a single user.

**Performance problem:** System is slow for one user.

**Key metric:** Latency (time to perform an action)

### Indexing

**The problem:** Database scans every row to find your data.

```sql
-- Slow: scans all 1M users
SELECT * FROM users WHERE email = 'john@example.com';

-- Fast: uses index, finds in milliseconds
CREATE INDEX idx_users_email ON users(email);
SELECT * FROM users WHERE email = 'john@example.com';
```

**When to index:**
- Fields you search/filter on (`WHERE email = ?`)
- Fields you sort on (`ORDER BY created_at`)
- Foreign keys (`user_id`, `post_id`)

**When NOT to index:**
- Every field (indexes slow down writes)
- Small tables (<1000 rows)
- Fields that are mostly unique (like timestamps)

### N+1 Queries

**The problem:** Fetching related data in a loop.

```javascript
// Bad: 1 query for posts + N queries for authors (N+1)
const posts = await db.query('SELECT * FROM posts');
for (const post of posts) {
  post.author = await db.query('SELECT * FROM users WHERE id = ?', [post.author_id]);
}

// Good: 2 queries total
const posts = await db.query('SELECT * FROM posts');
const authorIds = posts.map(p => p.author_id);
const authors = await db.query('SELECT * FROM users WHERE id IN (?)', [authorIds]);
const authorMap = authors.reduce((acc, a) => ({ ...acc, [a.id]: a }), {});
posts.forEach(p => p.author = authorMap[p.author_id]);
```

**How to spot:**
- Look for queries inside loops
- Check number of database queries per request (should be <10)
- Use query logging/monitoring

### Algorithmic Complexity

**The basics:**
- O(1) - Constant (hash map lookup)
- O(log n) - Logarithmic (binary search)
- O(n) - Linear (loop through array)
- O(n²) - Quadratic (nested loops)

**Example:**
```javascript
// Bad: O(n²) - nested loops
function findDuplicates(arr1, arr2) {
  const dupes = [];
  for (const a of arr1) {
    for (const b of arr2) {
      if (a === b) dupes.push(a);
    }
  }
  return dupes;
}

// Good: O(n) - use Set
function findDuplicates(arr1, arr2) {
  const set = new Set(arr1);
  return arr2.filter(item => set.has(item));
}
```

**When it matters:**
- Large datasets (>10,000 items)
- Frequent operations (happens 1000x/second)
- User-facing operations (anything the user waits for)

---

## 4. How to Handle More Users (Scalability)

**What it is:** Keep it fast as you add users.

**Scalability problem:** Fast for one user, slow under heavy load.

**Key metric:** Throughput (actions per unit time)

**The distinction:**
- **Performance:** Single user sees slow response (fix with indexing, better algorithms)
- **Scalability:** System handles 10 users fine, crashes with 1000 users (fix with caching, more servers)

### Caching

**What it is:** Store results so you don't recompute them.

**Important:** Caching solves scalability, not performance. It lets you handle more users, not make single requests faster.

**Caching strategies:**

**1. Cache-Aside (Read-Heavy)**
```javascript
function getUser(id) {
  // Check cache first
  let user = cache.get(`user:${id}`);
  if (user) return user;

  // Not in cache, get from DB
  user = db.query('SELECT * FROM users WHERE id = ?', [id]);

  // Store in cache
  cache.set(`user:${id}`, user, { ttl: 3600 });
  return user;
}
```

**When to use:** Read-heavy workloads (10 reads per 1 write)

**2. Write-Through (Consistency)**
```javascript
function updateUser(id, data) {
  // Update DB
  db.query('UPDATE users SET name = ? WHERE id = ?', [data.name, id]);

  // Update cache immediately
  cache.set(`user:${id}`, data, { ttl: 3600 });
}
```

**When to use:** Need cache and DB always in sync

**3. Write-Behind (High Write Load)**
```javascript
function updateUser(id, data) {
  // Update cache immediately
  cache.set(`user:${id}`, data);

  // Queue DB write for later
  queue.add({ type: 'update_user', id, data });
}
```

**When to use:** High write volume, can tolerate brief inconsistency

**What to cache:**
- Database queries that don't change often
- API responses from external services
- Computed results (recommendations, aggregations)

**What NOT to cache:**
- User-specific data that changes frequently
- Data that must be consistent (account balances)
- Large objects (>1MB)

### Load Balancing

**What it is:** Distribute traffic across multiple servers.

**Layer 4 (Transport Layer):**
```
User -> Load Balancer -> [Server 1, Server 2, Server 3]
         (Looks at IP/Port)
```

**Fast, simple.** Doesn't look at request content.

**Layer 7 (Application Layer):**
```
User -> Load Balancer -> Route /api/users to [API Servers]
         (Looks at URL)  -> Route /static to [Static Servers]
```

**Slower, flexible.** Can route based on URL, headers, cookies.

**When to use:**
- Layer 4: Simple distribution, high throughput
- Layer 7: Need routing logic (API vs static files)

### Horizontal vs Vertical Scaling

**Vertical (Scale Up):** Bigger server (more CPU/RAM)
- **Pros:** Simple, no code changes
- **Cons:** Expensive, has limits (can't buy infinite RAM)

**Horizontal (Scale Out):** More servers
- **Pros:** Cheaper, no limits
- **Cons:** Need load balancer, stateless design

**The rule:** Vertical first (easiest), horizontal when you hit limits.

### CDN (Content Delivery Network)

**What it is:** Serve static files from servers close to users.

**Push CDN:**
```
You upload files -> CDN stores them -> Users download
```
**When to use:** Files change rarely (images, videos)

**Pull CDN:**
```
User requests -> CDN checks cache -> If miss, fetches from you
```
**When to use:** Files change frequently

**What to put on CDN:**
- Images, videos, CSS, JavaScript
- API responses that don't change often

---

## 5. How to Make It Reliable (Availability & Consistency)

**What it is:** Keep the system running and data correct.

### CAP Theorem

**The rule:** Pick 2 of 3:
- **Consistency:** All nodes see same data
- **Availability:** System always responds
- **Partition Tolerance:** Works despite network failures

**In practice, you must have P (networks fail).** So you choose:

**CP (Consistency + Partition Tolerance):**
- Sacrifice availability during network issues
- **Example:** Bank transfers (can't show wrong balance)
- **Systems:** Traditional SQL databases

**AP (Availability + Partition Tolerance):**
- Sacrifice consistency during network issues
- **Example:** Social media feed (okay to show old posts briefly)
- **Systems:** Cassandra, DynamoDB

**How to choose:**
- **Need CP:** Financial data, inventory, anything where wrong data is dangerous
- **Need AP:** User-facing apps where downtime is worse than brief inconsistency

### Consistency Patterns

**Strong Consistency:**
```javascript
// User A writes "Hello"
db.write('message', 'Hello');

// User B immediately reads and gets "Hello"
const msg = db.read('message'); // Always "Hello", never stale
```

**When to use:** Financial transactions, inventory

**Eventual Consistency:**
```javascript
// User A writes "Hello"
db.write('message', 'Hello');

// User B reads immediately, might get old value
const msg = db.read('message'); // Might be stale, but eventually becomes "Hello"
```

**When to use:** Social media, analytics, anything where brief staleness is okay

**Weak Consistency:**
```javascript
// User A writes "Hello"
db.write('message', 'Hello');

// User B might never see it
const msg = db.read('message'); // No guarantees
```

**When to use:** Real-time gaming, live video streaming (dropped frames are okay)

### Redundancy and Fail-Over

**Master-Slave Replication:**
```
Master (Writes) -> Replicate -> Slave 1 (Reads)
                             -> Slave 2 (Reads)
```

**Pros:** Read scaling, backup
**Cons:** Master is single point of failure

**Master-Master Replication:**
```
Master 1 (Read/Write) <-> Replicate <-> Master 2 (Read/Write)
```

**Pros:** No single point of failure
**Cons:** Complex (need conflict resolution)

**When to use:**
- Master-Slave: Read-heavy workload, simpler
- Master-Master: Need high availability, worth complexity

### Transactions

**What it is:** Group of operations that succeed or fail together.

**ACID:**
- **Atomicity:** All or nothing
- **Consistency:** Database stays valid
- **Isolation:** Concurrent transactions don't interfere
- **Durability:** Once committed, data is safe

**Use case: Transfer money between accounts**

Without transaction:
```javascript
// Bad: What if second update fails?
await db.query('UPDATE accounts SET balance = balance - 100 WHERE id = 1');
// Power outage here = money disappears!
await db.query('UPDATE accounts SET balance = balance + 100 WHERE id = 2');
```

With transaction:
```sql
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- If either fails, both roll back. No partial transfers.
```

**When to use:** Operations that must succeed together (transfers, order + payment, inventory + order)

### Outbox Pattern

**The problem:** Update DB + send event. DB succeeds, event fails. Now they're out of sync.

**Use case: Complete order + capture payment in background**

Problem without outbox:
```javascript
// Bad: What if Stripe is slow or fails?
await db.query('UPDATE orders SET status = "completed" WHERE id = ?', [orderId]);
await stripe.charges.capture(chargeId); // Slow! Times out! User waiting...
// If this fails, order is completed but payment not captured
```

Solution with outbox:
```sql
BEGIN TRANSACTION;
  -- Mark order completed
  UPDATE orders SET status = 'completed' WHERE id = 123;

  -- Queue payment capture for background processing
  INSERT INTO outbox (event_type, payload)
  VALUES ('capture_payment', '{"order_id": 123, "charge_id": "ch_123"}');
COMMIT;

-- Background worker processes outbox
-- User gets instant response, payment captured in background
```

Background worker:
```javascript
// Runs every second
async function processOutbox() {
  const events = await db.query('SELECT * FROM outbox WHERE processed = false LIMIT 10');

  for (const event of events) {
    if (event.event_type === 'capture_payment') {
      const { order_id, charge_id } = JSON.parse(event.payload);
      await stripe.charges.capture(charge_id);
      await db.query('UPDATE outbox SET processed = true WHERE id = ?', [event.id]);
    }
  }
}
```

**Why it works:**
- DB write + outbox write are atomic (both succeed or both fail)
- User gets instant response (no waiting for Stripe)
- Payment captured reliably in background
- If capture fails, retry from outbox

**When to use:**
- Slow external APIs (Stripe, webhooks, email)
- Update DB + send events/messages
- Need guaranteed delivery

### Idempotency

**What it is:** Operation can be repeated safely with same result.

**The insight:** Network requests can fail, timeout, or be sent multiple times. Idempotency ensures retrying doesn't cause duplicate operations.

**How Stripe does it:**

Clients send an `Idempotency-Key` header:
```javascript
fetch('/api/payments', {
  method: 'POST',
  headers: {
    'Idempotency-Key': 'a7f8d9e1-3b2c-4f6a-9d8e-1c2b3a4f5e6d' // UUID
  },
  body: JSON.stringify({ amount: 1000, currency: 'usd' })
});
```

Server saves result by key:
```javascript
async function processPayment(data, idempotencyKey) {
  // Check if already processed
  const cached = await redis.get(`idempotency:${idempotencyKey}`);
  if (cached) return JSON.parse(cached);

  // Process payment
  const result = await stripe.charges.create(data);

  // Save result for 24 hours
  await redis.setex(
    `idempotency:${idempotencyKey}`,
    86400,
    JSON.stringify(result)
  );

  return result;
}
```

**Key practices:**
- Use V4 UUIDs for idempotency keys (enough entropy to avoid collisions)
- Keys valid for 24 hours (Stripe's approach)
- Only for POST requests (GET/DELETE already idempotent)
- Compare incoming parameters to original (error if different)

**Example:**
```javascript
// Bad: NOT idempotent
function addCredit(userId, amount) {
  const user = await getUser(userId);
  user.credits += amount; // Retry = double credit!
  await saveUser(user);
}

// Good: Idempotent with key
function addCredit(userId, amount, idempotencyKey) {
  // Check if already processed
  const cached = await redis.get(`idempotency:${idempotencyKey}`);
  if (cached) return JSON.parse(cached);

  // Verify parameters match if key exists
  const existing = await getRequestByKey(idempotencyKey);
  if (existing && (existing.userId !== userId || existing.amount !== amount)) {
    throw new Error('Parameters mismatch for idempotency key');
  }

  // Process
  const user = await getUser(userId);
  user.credits += amount;
  await saveUser(user);

  // Save result
  const result = { userId, newBalance: user.credits };
  await redis.setex(`idempotency:${idempotencyKey}`, 86400, JSON.stringify(result));

  return result;
}
```

**Use case: Retry Stripe payment capture from outbox**

```javascript
async function processOutbox() {
  const events = await db.query('SELECT * FROM outbox WHERE processed = false');

  for (const event of events) {
    if (event.event_type === 'capture_payment') {
      const { charge_id } = JSON.parse(event.payload);

      // Use event ID as idempotency key
      // If worker crashes and retries, won't double-capture
      await stripe.charges.capture(charge_id, {
        idempotencyKey: event.id
      });

      await db.query('UPDATE outbox SET processed = true WHERE id = ?', [event.id]);
    }
  }
}
```

**Why it matters here:**
- Worker might crash after capturing but before marking processed
- Worker retries same event
- Idempotency key prevents double-capture
- Stripe returns cached result from first capture

**When to use:**
- Payments (must not double-charge)
- Account operations (credits, debits)
- External API calls
- Any operation that retries

**Reference:** [Stripe Idempotent Requests](https://docs.stripe.com/api/idempotent_requests)

### Dead Letter Queue (DLQ)

**What it is:** Queue for messages that failed processing.

**Use case: Failed payment captures**

```javascript
async function processOutbox() {
  const events = await db.query('SELECT * FROM outbox WHERE processed = false');

  for (const event of events) {
    let retries = event.retry_count || 0;

    try {
      if (event.event_type === 'capture_payment') {
        const { charge_id } = JSON.parse(event.payload);
        await stripe.charges.capture(charge_id, { idempotencyKey: event.id });
        await db.query('UPDATE outbox SET processed = true WHERE id = ?', [event.id]);
      }
    } catch (error) {
      retries++;

      if (retries >= 3) {
        // Move to dead letter queue after 3 retries
        await db.query(`
          INSERT INTO dead_letter_queue (event_type, payload, error, original_event_id)
          VALUES (?, ?, ?, ?)
        `, [event.event_type, event.payload, error.message, event.id]);

        await db.query('UPDATE outbox SET processed = true WHERE id = ?', [event.id]);

        // Alert team
        await slack.send(`Payment capture failed after 3 retries: Order ${event.payload.order_id}`);
      } else {
        // Increment retry count
        await db.query('UPDATE outbox SET retry_count = ? WHERE id = ?', [retries, event.id]);
      }
    }
  }
}
```

**Why it matters:**
- Payment capture might fail (card issues, Stripe downtime)
- Don't retry forever (infinite loop)
- Don't lose failed payments (investigate manually)
- Alert team to fix issues

**When to use:** Background job processing, event handling, webhook delivery

### Retries and Backoff

**Exponential backoff:**
```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
}
```

**Why backoff:** If service is down, hammering it makes it worse. Back off and let it recover.

**When to use:** External API calls, database queries during high load

---

## 6. How to Handle Data at Scale

**What it is:** Store and query data when it gets too big for one database.

### Database Replication

See "Redundancy and Fail-Over" above (Master-Slave, Master-Master).

### Sharding (Partitioning)

**What it is:** Split data across multiple databases.

**Horizontal sharding:**
```
Users 1-1M    -> DB 1
Users 1M-2M   -> DB 2
Users 2M-3M   -> DB 3
```

**How to shard:**
- **By ID range:** Users 1-1M in DB1, 1M-2M in DB2
- **By hash:** `user_id % 3` determines DB (0=DB1, 1=DB2, 2=DB3)
- **By geography:** US users in US DB, EU users in EU DB

**Pros:** Scale writes, handle huge datasets
**Cons:** Complex queries (joining across shards), rebalancing

**When to use:** Data doesn't fit on one DB, need to scale writes

### Federation

**What it is:** Split data by function.

```
Users DB      -> User data
Products DB   -> Product data
Orders DB     -> Order data
```

**Pros:** Each DB can scale independently
**Cons:** Can't join across databases

**When to use:** Different data types have different scaling needs

### SQL vs NoSQL

**Use SQL (Postgres, MySQL) when:**
- Need ACID transactions
- Need complex queries (joins, aggregations)
- Data has clear relationships
- Most use cases

**Use NoSQL when:**
- **Key-Value (Redis):** Caching, sessions
- **Document (MongoDB):** Flexible schema, hierarchical data
- **Wide-Column (Cassandra):** Time-series data, need massive scale
- **Graph (Neo4j):** Social networks, recommendations

**The rule:** Start with SQL (boring). Switch to NoSQL when you have a specific problem SQL can't solve.

---

## 7. How to Ship Without Breaking Things

**What it is:** Deploy code without risking production.

### Separate Deploy from Release

**The insight:** Deploying code ≠ enabling features.

**Deploy:** Push code to production
**Release:** Turn feature on for users

**How:**
```javascript
if (featureFlags.enabled('new_checkout', userId)) {
  return <NewCheckout />;
} else {
  return <OldCheckout />;
}
```

**Why it matters:**
- Deploy Friday, release Monday (when you're watching)
- Release to 1% of users, monitor, then 10%, 50%, 100%
- Bug found? Turn off flag. No deploy needed.

### Feature Flags

**Patterns:**

**1. Percentage rollout:**
```javascript
// Show to 10% of users
if (hash(userId) % 100 < 10) {
  showNewFeature();
}
```

**2. User targeting:**
```javascript
// Show to beta users
if (user.betaTester) {
  showNewFeature();
}
```

**3. Kill switch:**
```javascript
// Turn off immediately if broken
if (!featureFlags.get('new_checkout')) {
  return <OldCheckout />;
}
```

### Canary Releases

**What it is:** Release to small group first, monitor, then expand.

**Flow:**
```
Deploy to 1% -> Monitor (errors, latency) -> If good, deploy to 10%
                                          -> If bad, rollback
```

**What to monitor:**
- Error rate
- Latency (P50, P95, P99)
- Key metrics (sign-ups, purchases)

**When to expand:**
- Error rate normal
- Latency normal
- Key metrics not dropping
- Wait 1-24 hours depending on traffic

### Blue-Green Deployment

**What it is:** Run two identical environments. Switch traffic between them.

```
Blue (old version) <- 100% traffic
Green (new version) <- 0% traffic

Deploy to Green -> Test -> Switch traffic to Green

Blue (old version) <- 0% traffic (keep running for rollback)
Green (new version) <- 100% traffic
```

**Pros:** Instant rollback (switch traffic back to Blue)
**Cons:** Expensive (running 2 environments)

### Rollback Strategies

**1. Feature flag rollback (instant):**
```javascript
featureFlags.disable('new_checkout'); // Done
```

**2. Blue-green rollback (instant):**
```
Switch traffic back to Blue environment
```

**3. Re-deploy old version (slow):**
```bash
git revert HEAD
git push
# Wait for deploy (5-30 minutes)
```

**The rule:** Make rollback instant. Use feature flags or blue-green.

---

## 8. How to Change Systems Safely

**What it is:** Migrate data or change systems without downtime.

### Dual Write Pattern

**The problem:** Moving from System A to System B. Can't switch instantly.

**Use case: Migrate user data from Postgres to MongoDB**

You're outgrowing Postgres for user profiles (need flexible schema). Want to move to MongoDB. But have 1M users and can't take downtime.

**The solution:**
```
Phase 1: Write to Postgres (old)
Phase 2: Write to Postgres + MongoDB (dual write)
Phase 3: Read from Postgres, backfill MongoDB
Phase 4: Read from MongoDB, write to Postgres + MongoDB
Phase 5: Write to MongoDB only (Postgres retired)
```

```javascript
// Phase 2: Dual write (write to both)
async function createUser(data) {
  await postgres.insert('users', data);
  await mongodb.collection('users').insertOne(data); // Also write to MongoDB
}

// Phase 3: Backfill existing data
// Run background script to copy 1M users from Postgres to MongoDB
async function backfillUsers() {
  const users = await postgres.query('SELECT * FROM users');
  for (const user of users) {
    await mongodb.collection('users').insertOne(user);
  }
}

// Phase 4: Read from MongoDB, write to both
async function getUser(id) {
  return await mongodb.collection('users').findOne({ id }); // Read from MongoDB now
}

async function createUser(data) {
  await mongodb.collection('users').insertOne(data); // Primary
  await postgres.insert('users', data);              // Keep Postgres in sync for rollback
}

// Phase 5: Stop writing to Postgres (migration complete)
async function createUser(data) {
  await mongodb.collection('users').insertOne(data);
}
```

**Why it works:**
- Each phase is safe and reversible
- Can rollback at any point (just switch reads back)
- No downtime
- New and old data stay in sync

### Expand-Contract Pattern

**The problem:** Changing database schema or API contracts.

**The solution:**

**Phase 1 (Expand):** Add new field, keep old field
```sql
ALTER TABLE users ADD COLUMN email_address VARCHAR(255);
-- Keep old 'email' column
```

**Phase 2 (Migrate):** Write to both fields
```javascript
function updateUser(id, email) {
  await db.query(
    'UPDATE users SET email = ?, email_address = ? WHERE id = ?',
    [email, email, id]
  );
}
```

**Phase 3 (Backfill):** Copy old data to new field
```sql
UPDATE users SET email_address = email WHERE email_address IS NULL;
```

**Phase 4 (Contract):** Remove old field
```sql
ALTER TABLE users DROP COLUMN email;
```

**Why it works:** Old code keeps working. No breaking changes.

### Zero-Downtime Migrations

**Database migrations:**
```sql
-- Bad: Locks table
ALTER TABLE users ADD COLUMN age INT;

-- Good: Online migration (Postgres)
ALTER TABLE users ADD COLUMN age INT DEFAULT NULL;
-- No lock, instant
```

**Code migrations:**
```javascript
// Deploy 1: Add new code, keep old code working
if (newFieldExists()) {
  return newCodePath();
} else {
  return oldCodePath();
}

// Deploy 2 (after data migration): Remove old code
return newCodePath();
```

### Backward Compatibility

**API versioning:**
```javascript
// v1 response (old)
{ "name": "John" }

// v2 response (new - added field, kept old)
{ "name": "John", "full_name": "John Doe" }
```

**Database schema:**
```sql
-- Don't remove columns immediately
-- Mark as deprecated, remove after all clients upgraded
ALTER TABLE users ADD COLUMN deprecated_email VARCHAR(255);
```

**The rule:** Add new, keep old working. Remove old only after everyone migrated.

---

## 9. How to Build Good UX

**What it is:** Make the app feel fast and responsive.

### Optimistic Updates

**What it is:** Show success before server confirms.

**Example: Like button**
```javascript
// Bad: Wait for server
async function like(postId) {
  setLoading(true);
  await api.post(`/posts/${postId}/like`);
  setLiked(true);
  setLoading(false);
}
// User waits 200ms to see heart turn red

// Good: Update immediately
async function like(postId) {
  setLiked(true); // Update UI immediately

  try {
    await api.post(`/posts/${postId}/like`);
  } catch (error) {
    setLiked(false); // Rollback on error
    showError('Failed to like');
  }
}
// Heart turns red instantly
```

**When to use:**
- High success rate (>99%)
- Reversible actions (like, favorite, toggle)
- NOT for critical actions (payments, deletes)

### Real-Time Data: SSE vs WebSockets vs Polling

**Polling (Simple):**
```javascript
setInterval(async () => {
  const messages = await api.get('/messages');
  updateUI(messages);
}, 5000); // Check every 5 seconds
```

**Pros:** Simple, works everywhere
**Cons:** Wasteful (many empty requests), 5s delay

**Server-Sent Events (SSE):**
```javascript
const eventSource = new EventSource('/api/stream');
eventSource.onmessage = (event) => {
  const message = JSON.parse(event.data);
  updateUI(message);
};
```

**Pros:** Real-time, server pushes, simple
**Cons:** One-way (server -> client)

**WebSockets (Complex):**
```javascript
const ws = new WebSocket('wss://example.com/socket');
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  updateUI(message);
};
ws.send(JSON.stringify({ type: 'subscribe', channel: 'messages' }));
```

**Pros:** Real-time, bi-directional, powerful
**Cons:** Complex, requires infrastructure

**When to use:**
- **Polling:** Simple dashboards, okay with 5-30s delay
- **SSE:** Live feeds, notifications, one-way server push
- **WebSockets:** Chat, gaming, collaborative editing (need bi-directional)

### Loading States

**Don't:**
```javascript
{loading && <Spinner />}
{!loading && <Content />}
// User sees blank screen, then spinner, then content (jarring)
```

**Do:**
```javascript
{loading && <SkeletonScreen />}
{!loading && <Content />}
// User sees skeleton that matches content shape (smooth)
```

**Skeleton screens:**
```jsx
<div className="skeleton">
  <div className="skeleton-avatar" />
  <div className="skeleton-line" />
  <div className="skeleton-line short" />
</div>
```

**Why it matters:** Skeleton feels faster than spinner, even if same load time.

### Error Handling

**Don't:**
```javascript
catch (error) {
  alert('Error: ' + error.message);
  // "Error: Network request failed"
}
```

**Do:**
```javascript
catch (error) {
  showToast('Could not load messages. Trying again...');
  setTimeout(() => retry(), 2000);
}
```

**Good error messages:**
- Say what went wrong in user terms
- Say what happens next ("Trying again...")
- Offer action ("Retry now")

**Example:**
```javascript
// Bad
"Failed to process payment: ERR_NETWORK_TIMEOUT"

// Good
"Payment didn't go through. Check your connection and try again."
```

---

## How to Learn These

**Don't learn by reading. Learn by doing.**

**1. Choose boring technology**
- Next project: Use Postgres, not that new DB you read about
- Track: Did you spend time debugging tech or building features?

**2. Structure code**
- Refactor: Separate your controller/service/repository
- Review: Can you test business logic without HTTP layer?

**3. Performance**
- Add indexes to slow queries
- Find N+1 queries in your app (enable query logging)
- Measure: Is query <100ms after indexing?

**4. Scalability**
- Add caching to expensive queries
- Measure: Can you handle 10x traffic?

**5. Reliability**
- Add transaction to multi-step operation
- Implement outbox pattern for events
- Make API calls idempotent

**6. Shipping**
- Add feature flag to next feature
- Deploy Friday, release Monday
- Practice: Can you rollback in <1 minute?

**7. Migrations**
- Next schema change: Use expand-contract
- Practice dual-write pattern on small migration

**8. UX**
- Add optimistic update to like/favorite
- Replace spinner with skeleton screen
- Improve one error message

**Do one per month. In a year, you'll know all of these.**

---

## What You Don't Need to Learn

**Ignore:**
- Every design pattern (learn Repository, Factory, Strategy first)
- Microservices (monolith first)
- Kubernetes (unless you have scale problem)
- GraphQL (unless you have specific need)
- Event sourcing (unless you have specific need)
- Every new JavaScript framework

**Focus on:**
- Concepts above
- One backend language (Python/Ruby/Go)
- One frontend framework (React/Vue)
- SQL
- Git
- Testing

**The rule:** Depth over breadth. Master concepts, not tools.

---

**References:**
- [Boring Technology Club](https://boringtechnology.club/)
- [System Design Primer](https://github.com/donnemartin/system-design-primer) - Comprehensive guide to scalability concepts
- [Designing Data-Intensive Applications](https://dataintensive.net/) - Book on reliability, scalability, maintainability

**Related:**
- [How to be Successful](/mental-models/how-to-be-successful) - Focus on leverage, develop taste
- [Engineering Mental Models](/mental-models/engineering) - Deploy vs release, dual-write migrations
