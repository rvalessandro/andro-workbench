# NoOn MVP - Technical Specification

## TL;DR

**3 Core Flows:**
1. **Onboarding** - Google OAuth → Import contacts → Auto-connect with NoOn users
2. **Ring Exchange** - NFC tap → Web page → Connect (+ metrics tracking)
3. **Contact Sharing** - Send contact to another NoOn user

**Key Technical Insight:** The intermediary web page (`noon.app/t/xyz`) is the metrics layer. Every tap, view, download, and conversion is tracked here.

---

## Flow 1: Onboarding

### Goal
Get user from app download to having a populated contact list in under 2 minutes.

### User Journey

```
1. Download app
2. Tap "Sign in with Google"
3. Approve Google OAuth
4. App shows: "Import your contacts?"
5. Tap "Import from Google"
6. Approve Google Contacts permission
7. App imports contacts in background
8. Show progress: "Importing 245 contacts..."
9. Complete: "✓ 245 contacts imported. 12 are NoOn users!"
10. Show: "Connect with them?" → List of NoOn users
11. Tap "Connect All" or select individually
12. Done! Contact list populated
```

**Time to value:** <2 minutes

### Technical Flow

```typescript
// Step 1: Google OAuth
POST /api/auth/google
Request:
{
  "id_token": "eyJhbGciOiJSUzI1NiIs...", // From Google Sign-In SDK
  "device_info": {
    "platform": "ios",
    "device_id": "uuid",
    "fcm_token": "fcm_device_token" // For push notifications
  }
}

Response:
{
  "user": {
    "id": "usr_abc123",
    "email": "user@gmail.com",
    "full_name": "John Doe",
    "profile_picture": "https://...",
    "nfc_url": "https://noon.app/t/a1b2c3d4", // User's unique ring URL
    "is_new_user": true
  },
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token"
}

// Backend creates user if new:
// 1. Verify Google ID token
// 2. Extract user info (email, name, picture)
// 3. Check if user exists (by email or Google ID)
// 4. If new: Create user, generate unique NFC code
// 5. Generate JWT tokens
// 6. Store FCM token for push notifications


// Step 2: Import contacts
POST /api/contacts/import
Headers: Authorization: Bearer {jwt}
Request:
{
  "google_access_token": "ya29.a0AfH6SMBx...", // For Google People API
  "source": "google"
}

Response:
{
  "job_id": "import_xyz789", // Background job ID
  "status": "processing",
  "estimated_time": 30 // seconds
}

// Poll for progress (or use websocket)
GET /api/contacts/import/{job_id}
Response:
{
  "status": "completed",
  "imported_count": 245,
  "noon_users_found": 12,
  "noon_users": [
    {
      "id": "usr_def456",
      "name": "Sarah Chen",
      "profile_picture": "https://...",
      "phone": "+6598765432",
      "is_connected": false // Not yet connected
    },
    // ... 11 more
  ]
}

// Backend import logic:
async function importContacts(userId, googleToken) {
  // 1. Fetch all contacts from Google People API
  const contacts = await fetchGoogleContacts(googleToken);

  // 2. For each contact:
  for (const contact of contacts) {
    // Extract phone, email, name
    const phone = normalizePhone(contact.phoneNumbers[0]);
    const email = contact.emailAddresses[0];
    const name = contact.names[0].displayName;

    // 3. Check if this contact is a NoOn user
    const noonUser = await db.users.findByPhoneOrEmail(phone, email);

    // 4. Insert into contacts table
    await db.contacts.create({
      user_id: userId,
      contact_name: name,
      contact_phone: phone,
      contact_email: email,
      is_noon_user: !!noonUser,
      linked_user_id: noonUser?.id,
      source: 'google_import',
      google_contact_id: contact.resourceName // For future sync
    });
  }

  // 5. Return summary
  const noonUsers = await db.contacts.findWhere({
    user_id: userId,
    is_noon_user: true
  });

  return {
    imported_count: contacts.length,
    noon_users_found: noonUsers.length,
    noon_users: noonUsers
  };
}


// Step 3: Connect with NoOn users
POST /api/connections/batch
Headers: Authorization: Bearer {jwt}
Request:
{
  "user_ids": ["usr_def456", "usr_ghi789", ...] // List of NoOn users to connect with
}

Response:
{
  "connected": 12,
  "failed": 0,
  "connections": [
    {
      "user_id": "usr_def456",
      "name": "Sarah Chen",
      "connected_at": "2025-01-15T10:30:00Z"
    },
    // ... 11 more
  ]
}

// Backend:
// 1. For each user_id:
//    - Create connection in connections table
//    - Send push notification to other user: "[Your Name] connected with you"
// 2. Return summary
```

### Database Changes

```sql
-- Track import jobs for progress polling
CREATE TABLE import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  source VARCHAR(50) NOT NULL, -- 'google' | 'apple'
  status VARCHAR(50) NOT NULL, -- 'processing' | 'completed' | 'failed'
  total_contacts INT,
  imported_contacts INT,
  noon_users_found INT,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  error_message TEXT
);

-- Store device info for push notifications
ALTER TABLE users ADD COLUMN fcm_token VARCHAR(255);
ALTER TABLE users ADD COLUMN device_platform VARCHAR(20); -- 'ios' | 'android'
```

### Metrics to Track

```sql
-- Onboarding funnel
INSERT INTO events (user_id, event_type, properties)
VALUES
  (user_id, 'onboarding_started', '{}'),
  (user_id, 'google_auth_completed', '{}'),
  (user_id, 'import_initiated', '{"source": "google"}'),
  (user_id, 'import_completed', '{"imported": 245, "noon_users": 12}'),
  (user_id, 'connections_created', '{"count": 12}'),
  (user_id, 'onboarding_completed', '{"duration_seconds": 90}');
```

**Key metrics:**
- Time from download to first connection
- % who complete Google auth
- % who import contacts
- Avg contacts imported per user
- Avg NoOn users found per import
- % who connect with discovered users

---

## Flow 2: Ring Exchange (The Core Innovation)

### Naming Options for "Tapping Flow"
- **Ring Exchange** ✅ (recommended - clear, professional)
- Tap to Connect
- Contact Tap
- Ring Tap
- NFC Exchange
- Quick Connect

Going with **"Ring Exchange"** for the spec.

### Goal
User A taps ring to User B's phone → Instant connection with zero friction + full metrics tracking.

### The Intermediary Page (Key Innovation)

**URL format:** `https://noon.app/t/{encrypted_user_id}`

This page is the **metrics hub**. It:
1. Logs every tap
2. Detects if NoOn app is installed
3. If app installed: Deep links to app for instant connection
4. If no app: Auto-redirects to WhatsApp (1.5 second timeout)
5. Tracks all conversions (tap → WhatsApp → download → signup → connection)

### User Journey - Scenario A: Both Have NoOn

```
1. User A taps ring to User B's phone
2. Phone reads NFC → Opens noon.app/t/a1b2c3d4
3. Web page loads:
   - Logs tap event (User A's ID, timestamp, User B's IP/location)
   - Detects NoOn app installed (via User Agent or deep link attempt)
4. Immediately redirects to: noon://connect/a1b2c3d4
5. NoOn app opens on User B's phone
6. Shows connection request:
   ┌─────────────────────────────┐
   │   [John's Photo]            │
   │   John Doe                  │
   │   Product Manager @ Google  │
   │                             │
   │   Wants to connect          │
   │                             │
   │   [Connect]  [Not Now]      │
   └─────────────────────────────┘
7. User B taps "Connect"
8. App sends: POST /api/connections/accept
9. Backend:
   - Creates mutual connection
   - Sends push to User A: "Sarah Chen connected with you"
   - Logs connection event
10. Both users see each other in contacts

Total time: 5 seconds
Total taps by User B: 1 (just "Connect")
```

### User Journey - Scenario B: User B Doesn't Have NoOn (WhatsApp Default)

```
1. User A taps ring to User B's phone
2. Opens noon.app/t/a1b2c3d4
3. Web page detects no NoOn app → auto-redirects to WhatsApp
4. WhatsApp opens with pre-filled message:
   "Hi! I received your NoOn contact. Let's connect! Code: a1b2c3d4"
   → To: +65 XXXX XXXX (NoOn WhatsApp Business number)
5. User B taps send (or modifies and sends)
6. WhatsApp Business API webhook fires:
   POST /api/webhooks/whatsapp
7. Backend:
   - Extracts code: a1b2c3d4 → User A's ID
   - Extracts sender: +6598765432 → User B's phone
   - Creates unregistered contact for User A
   - Logs tap conversion event
8. User A gets notification:
   "Someone tapped your ring: +65 9876 5432"
   "Tap to save or message them"
9. User B gets WhatsApp reply:
   "Thanks! John Doe will receive your contact. Download NoOn to connect: https://noon.app/d?ref=a1b2c3d4"

Total time: 10 seconds
Total taps by User B: 1 (just "Send" in WhatsApp)

If User B later downloads NoOn using the link:
- Referral code auto-connects them with User A
- Both get notified: "You're now connected!"
```

### Technical Implementation

#### The Intermediary Web Page

```typescript
// Hosted at: noon.app/t/:code

// HTML Template (Server-Side Rendered)
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connect with {{user.name}} | NoOn</title>

  <!-- Open Graph for sharing -->
  <meta property="og:title" content="Connect with {{user.name}}">
  <meta property="og:image" content="{{user.profile_picture}}">
  <meta property="og:description" content="{{user.headline}}">

  <!-- Deep link for app detection -->
  <meta name="apple-itunes-app" content="app-id=NOON_APP_ID, app-argument=noon://connect/{{code}}">
  <meta name="google-play-app" content="app-id=com.noon.app, app-argument=noon://connect/{{code}}">

  <style>
    /* Minimal, fast-loading CSS */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-align: center;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .profile-pic {
      width: 120px;
      height: 120px;
      border-radius: 60px;
      border: 4px solid white;
      margin: 0 auto 20px;
    }
    .name { font-size: 28px; font-weight: bold; margin: 10px 0; }
    .headline { font-size: 16px; opacity: 0.9; margin-bottom: 30px; }
    .btn {
      display: block;
      margin: 15px auto;
      padding: 16px 32px;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      max-width: 280px;
    }
    .btn-secondary {
      background: transparent;
      border: 2px solid white;
      color: white;
    }
    .loading { opacity: 0.7; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <img src="{{user.profile_picture}}" class="profile-pic" alt="{{user.name}}">
  <div class="name">{{user.name}}</div>
  <div class="headline">{{user.headline}}</div>
  <div class="message">wants to connect!</div>

  <div class="loading" id="status">Connecting...</div>

  <script>
    // Track page view immediately
    fetch('/api/metrics/tap-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: '{{code}}',
        user_agent: navigator.userAgent,
        timestamp: Date.now()
      })
    });

    // Try deep link first
    const deepLink = 'noon://connect/{{code}}';
    const whatsappUrl = '{{whatsapp_url}}';

    // Attempt to open app
    window.location.href = deepLink;

    // If app didn't open in 1.5 seconds, redirect to WhatsApp
    const timer = setTimeout(() => {
      // App not installed, go to WhatsApp
      document.getElementById('status').textContent = 'Opening WhatsApp...';

      // Track WhatsApp redirect
      fetch('/api/metrics/tap-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: '{{code}}' })
      });

      window.location.href = whatsappUrl;
    }, 1500);

    // If page becomes hidden (app opened), cancel WhatsApp redirect
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(timer);
        // Track app open
        fetch('/api/metrics/tap-app-open', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: '{{code}}' })
        });
      }
    });
  </script>
</body>
</html>
```

#### Backend Endpoints for Ring Exchange

```typescript
// Render intermediary page
GET /t/:code
async function handleTapPage(req, res) {
  const { code } = req.params;

  // 1. Decrypt code to get user ID
  const userId = decryptCode(code);

  // 2. Fetch user profile
  const user = await db.users.findById(userId);
  if (!user) return res.status(404).send('User not found');

  // 3. Log tap event (important!)
  await db.tap_events.create({
    user_id: userId,
    code: code,
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
    referrer: req.headers.referer,
    timestamp: new Date()
  });

  // 4. Generate URLs
  const whatsappUrl = generateWhatsAppUrl(user, code);
  const appStoreUrl = generateAppStoreUrl(code);

  // 5. Render template
  res.render('tap-page', {
    user: {
      name: user.full_name,
      profile_picture: user.profile_picture_url,
      headline: user.headline || 'NoOn User'
    },
    code: code,
    whatsapp_url: whatsappUrl,
    app_store_url: appStoreUrl
  });
}


// Handle connection request (from app)
POST /api/connections/accept
Headers: Authorization: Bearer {jwt}
Request:
{
  "code": "a1b2c3d4", // From deep link
  "source": "ring_exchange"
}

Response:
{
  "success": true,
  "connection": {
    "user_id": "usr_abc123",
    "name": "John Doe",
    "profile_picture": "https://...",
    "connected_at": "2025-01-15T10:30:00Z"
  }
}

// Backend logic:
async function acceptConnection(currentUserId, code) {
  // 1. Decrypt code to get other user's ID
  const otherUserId = decryptCode(code);

  // 2. Create mutual connection
  await db.connections.create({
    user_a_id: Math.min(currentUserId, otherUserId), // Canonical order
    user_b_id: Math.max(currentUserId, otherUserId),
    connected_via: 'ring_exchange',
    tap_code: code // Reference to original tap event
  });

  // 3. Add to each other's contacts (if not already)
  await addToContacts(currentUserId, otherUserId);
  await addToContacts(otherUserId, currentUserId);

  // 4. Send push notification to other user
  await sendPush(otherUserId, {
    title: 'New Connection',
    body: `${currentUser.name} connected with you!`,
    data: { user_id: currentUserId, type: 'connection_accepted' }
  });

  // 5. Log connection event for metrics
  await db.events.create({
    user_id: currentUserId,
    event_type: 'connection_accepted',
    properties: {
      other_user_id: otherUserId,
      code: code,
      source: 'ring_exchange'
    }
  });

  // 6. Update tap event with conversion
  await db.tap_events.update({
    where: { code: code },
    data: { converted: true, converted_at: new Date() }
  });

  return await db.users.findById(otherUserId);
}


// WhatsApp webhook (for fallback flow)
POST /api/webhooks/whatsapp
Request:
{
  "from": "+6598765432",
  "body": "Hi! This is Sarah. I received your NoOn contact. Let's connect! Code: a1b2c3d4",
  "timestamp": "2025-01-15T10:30:00Z"
}

// Backend logic:
async function handleWhatsAppMessage(from, body, timestamp) {
  // 1. Extract code from message using regex
  const codeMatch = body.match(/Code:\s*([a-zA-Z0-9]+)/i);
  if (!codeMatch) {
    // Invalid message, reply with error
    await sendWhatsApp(from, "Oops! We couldn't find a valid code. Please tap the ring again.");
    return;
  }

  const code = codeMatch[1];
  const userId = decryptCode(code);

  // 2. Log WhatsApp conversion
  await db.tap_events.update({
    where: { code: code },
    data: {
      whatsapp_fallback: true,
      whatsapp_number: from,
      converted_at: new Date()
    }
  });

  // 3. Check if sender is a NoOn user
  const senderUser = await db.users.findByPhone(from);

  if (senderUser) {
    // Scenario: Sender is registered but didn't have app open
    // Auto-connect them
    await db.connections.create({
      user_a_id: Math.min(userId, senderUser.id),
      user_b_id: Math.max(userId, senderUser.id),
      connected_via: 'ring_exchange_whatsapp'
    });

    // Notify both
    await sendPush(userId, {
      title: 'New Connection',
      body: `${senderUser.full_name} connected with you via WhatsApp!`
    });
    await sendWhatsApp(from,
      `You're connected with ${user.full_name}! Open NoOn to see their profile.`
    );

  } else {
    // Scenario: Sender is not registered
    // Add as unregistered contact for the user
    await db.contacts.create({
      user_id: userId,
      contact_name: 'Unknown Contact', // Will be updated later
      contact_phone: from,
      is_noon_user: false,
      source: 'ring_exchange_whatsapp'
    });

    // Notify user A
    await sendPush(userId, {
      title: 'Someone tapped your ring!',
      body: `${from} wants to connect. Tap to save or message them.`,
      data: { phone: from, type: 'ring_tap_unregistered' }
    });

    // Reply to sender with download link
    const user = await db.users.findById(userId);
    await sendWhatsApp(from,
      `Thanks! ${user.full_name} will receive your contact.\n\nDownload NoOn to connect instantly: https://noon.app/d?ref=${code}`
    );
  }
}


// Metrics endpoints (called from web page JavaScript)
POST /api/metrics/tap-view
Request:
{
  "code": "a1b2c3d4",
  "user_agent": "Mozilla/5.0...",
  "timestamp": 1642248000000
}
// Logs: Someone viewed the tap page

POST /api/metrics/tap-app-open
Request:
{
  "code": "a1b2c3d4"
}
// Logs: User had app installed, opened it

POST /api/metrics/tap-download
Request:
{
  "code": "a1b2c3d4"
}
// Logs: User didn't have app, redirected to store
```

### Database Schema for Ring Exchange

```sql
-- Track every tap event (the metrics goldmine)
CREATE TABLE tap_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Whose ring was tapped
  code VARCHAR(255) NOT NULL, -- Encrypted code from URL

  -- Tap metadata
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,

  -- Outcome tracking
  app_opened BOOLEAN DEFAULT FALSE, -- User had NoOn app installed
  app_opened_at TIMESTAMP,
  whatsapp_redirect BOOLEAN DEFAULT FALSE, -- Redirected to WhatsApp (no app)
  whatsapp_redirect_at TIMESTAMP,
  whatsapp_number VARCHAR(20), -- Phone number from WhatsApp message

  -- Conversion tracking
  converted BOOLEAN DEFAULT FALSE, -- Did they connect?
  converted_at TIMESTAMP,
  connected_user_id UUID REFERENCES users(id), -- Who connected (if registered)

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_converted (converted)
);

-- Track app installs from referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Whose ring
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Who signed up
  referral_code VARCHAR(255) NOT NULL, -- Same as tap event code

  -- Attribution
  tap_event_id UUID REFERENCES tap_events(id),

  -- Install tracking
  app_installed BOOLEAN DEFAULT FALSE,
  installed_at TIMESTAMP,
  signed_up BOOLEAN DEFAULT FALSE,
  signed_up_at TIMESTAMP,

  -- Connection tracking
  connected BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);
```

### Key Metrics to Track

```sql
-- Ring Exchange Funnel
-- Metric 1: Total taps
SELECT COUNT(*) FROM tap_events
WHERE created_at > NOW() - INTERVAL '7 days';

-- Metric 2: App open rate (had app already)
SELECT
  COUNT(*) FILTER (WHERE app_opened = TRUE) * 100.0 / COUNT(*) AS app_open_rate
FROM tap_events
WHERE created_at > NOW() - INTERVAL '7 days';

-- Metric 3: WhatsApp redirect rate (no app installed)
SELECT
  COUNT(*) FILTER (WHERE whatsapp_redirect = TRUE) * 100.0 / COUNT(*) AS whatsapp_rate
FROM tap_events
WHERE created_at > NOW() - INTERVAL '7 days';

-- Metric 4: Conversion rate (tap → connection)
SELECT
  COUNT(*) FILTER (WHERE converted = TRUE) * 100.0 / COUNT(*) AS conversion_rate
FROM tap_events
WHERE created_at > NOW() - INTERVAL '7 days';

-- Metric 5: Time to conversion (tap → connection)
SELECT AVG(EXTRACT(EPOCH FROM (converted_at - created_at))) AS avg_seconds
FROM tap_events
WHERE converted = TRUE;

-- Metric 6: Referral attribution (WhatsApp → install → signup)
SELECT
  COUNT(*) FILTER (WHERE signed_up = TRUE) * 100.0 / COUNT(*) AS signup_rate
FROM referrals
WHERE created_at > NOW() - INTERVAL '30 days';

-- Metric 7: Top users by taps
SELECT
  u.full_name,
  COUNT(te.id) AS total_taps,
  COUNT(*) FILTER (WHERE te.converted = TRUE) AS conversions,
  COUNT(*) FILTER (WHERE te.converted = TRUE) * 100.0 / COUNT(te.id) AS conversion_rate
FROM users u
LEFT JOIN tap_events te ON te.user_id = u.id
WHERE te.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.id, u.full_name
ORDER BY total_taps DESC
LIMIT 10;
```

### Analytics Dashboard (For Users)

In the app, users can see:

```
Your Ring Stats (Last 30 Days)

📊 Total Taps: 47
   ↑ 12% from last month

📱 Connections Made: 23 (48.9%)
   ↑ 5% from last month

💬 WhatsApp Connects: 24 (51.1%)
   → 8 downloaded app later (33.3%)

⏱️ Avg Time to Connect: 12 seconds

🔥 Best Day: Jan 18 (12 taps at TechCon)

───────────────────────────

Recent Taps:
• Sarah Chen - Connected (2 mins ago)
• +65 9876 5432 - WhatsApp sent (1 hour ago)
• Michael Tan - Downloaded app (3 hours ago)
```

---

## Flow 3: Contact Sharing

### Goal
Allow NoOn users to introduce their contacts to each other seamlessly.

### User Journey

```
1. User A opens contact "David Chen" in app
2. Taps "Share Contact" button
3. Search/select recipient: "Sarah Lee" (must be a NoOn user)
4. Add optional note: "Sarah, meet David! He's great at product design."
5. Tap "Send"
6. Sarah receives push notification: "[Your name] shared a contact with you"
7. Sarah opens app → sees David's profile + A's note
8. Sarah taps "Send Connection Request"
9. David receives: "Sarah Lee wants to connect (introduced by [Your name])"
10. David accepts → they're connected

Total time: 30 seconds
```

### Technical Flow

```typescript
// Step 1: Share contact
POST /api/contacts/share
Headers: Authorization: Bearer {jwt}
Request:
{
  "contact_id": "usr_david123", // The contact being shared (must be NoOn user)
  "recipient_user_id": "usr_sarah456", // Who to share with (must be NoOn user)
  "note": "Sarah, meet David! He's great at product design."
}

Response:
{
  "success": true,
  "share_id": "share_xyz789",
  "shared_with": {
    "id": "usr_sarah456",
    "name": "Sarah Lee"
  }
}

// Backend logic:
async function shareContact(senderId, contactId, recipientId, note) {
  // 1. Verify sender is connected with both parties
  const senderConnectedToContact = await db.connections.exists(senderId, contactId);
  const senderConnectedToRecipient = await db.connections.exists(senderId, recipientId);

  if (!senderConnectedToContact || !senderConnectedToRecipient) {
    throw new Error('You can only share contacts you\'re connected with');
  }

  // 2. Create share record
  const share = await db.contact_shares.create({
    sender_user_id: senderId,
    contact_user_id: contactId,
    recipient_user_id: recipientId,
    note: note,
    status: 'pending' // pending | accepted | declined
  });

  // 3. Send push notification to recipient
  const sender = await db.users.findById(senderId);
  const contact = await db.users.findById(contactId);

  await sendPush(recipientId, {
    title: 'Contact Shared',
    body: `${sender.full_name} shared ${contact.full_name} with you`,
    data: {
      type: 'contact_share',
      share_id: share.id,
      contact_id: contactId
    }
  });

  // 4. Log event
  await db.events.create({
    user_id: senderId,
    event_type: 'contact_shared',
    properties: {
      contact_id: contactId,
      recipient_id: recipientId,
      share_id: share.id
    }
  });

  return share;
}


// Step 2: View shared contact
GET /api/contacts/shares/{share_id}
Headers: Authorization: Bearer {jwt}

Response:
{
  "share_id": "share_xyz789",
  "shared_by": {
    "id": "usr_sender",
    "name": "John Doe",
    "profile_picture": "https://..."
  },
  "contact": {
    "id": "usr_david123",
    "name": "David Chen",
    "headline": "Product Designer @ Figma",
    "profile_picture": "https://...",
    "is_connected_with_me": false // Sarah not connected with David yet
  },
  "note": "Sarah, meet David! He's great at product design.",
  "shared_at": "2025-01-15T10:30:00Z"
}


// Step 3: Send connection request
POST /api/connections/request
Headers: Authorization: Bearer {jwt}
Request:
{
  "user_id": "usr_david123",
  "via_share_id": "share_xyz789" // Optional: for attribution
}

Response:
{
  "success": true,
  "request_id": "req_abc123",
  "status": "pending"
}

// Backend:
async function sendConnectionRequest(senderId, targetUserId, viaShareId) {
  // 1. Create connection request
  const request = await db.connection_requests.create({
    sender_user_id: senderId,
    target_user_id: targetUserId,
    via_share_id: viaShareId,
    status: 'pending'
  });

  // 2. Get introducer name (if via share)
  let introducerName = null;
  if (viaShareId) {
    const share = await db.contact_shares.findById(viaShareId);
    const introducer = await db.users.findById(share.sender_user_id);
    introducerName = introducer.full_name;
  }

  // 3. Send push to target
  const sender = await db.users.findById(senderId);
  await sendPush(targetUserId, {
    title: 'New Connection Request',
    body: introducerName
      ? `${sender.full_name} wants to connect (introduced by ${introducerName})`
      : `${sender.full_name} wants to connect`,
    data: {
      type: 'connection_request',
      request_id: request.id,
      sender_id: senderId
    }
  });

  return request;
}


// Step 4: Accept connection request
POST /api/connections/requests/{request_id}/accept
Headers: Authorization: Bearer {jwt}

Response:
{
  "success": true,
  "connection": {
    "user_id": "usr_sarah456",
    "name": "Sarah Lee",
    "connected_at": "2025-01-15T11:00:00Z"
  }
}

// Backend:
async function acceptConnectionRequest(requestId, currentUserId) {
  // 1. Get request
  const request = await db.connection_requests.findById(requestId);
  if (request.target_user_id !== currentUserId) {
    throw new Error('Not authorized');
  }

  // 2. Create connection
  await db.connections.create({
    user_a_id: Math.min(request.sender_user_id, request.target_user_id),
    user_b_id: Math.max(request.sender_user_id, request.target_user_id),
    connected_via: 'connection_request',
    via_share_id: request.via_share_id
  });

  // 3. Update request status
  await db.connection_requests.update(requestId, {
    status: 'accepted',
    responded_at: new Date()
  });

  // 4. If via share, update share status and notify introducer
  if (request.via_share_id) {
    await db.contact_shares.update(request.via_share_id, {
      status: 'accepted'
    });

    const share = await db.contact_shares.findById(request.via_share_id);
    const sender = await db.users.findById(request.sender_user_id);
    const target = await db.users.findById(request.target_user_id);

    await sendPush(share.sender_user_id, {
      title: 'Introduction Successful!',
      body: `${sender.full_name} and ${target.full_name} are now connected`,
      data: { type: 'share_accepted', share_id: request.via_share_id }
    });
  }

  // 5. Notify sender
  await sendPush(request.sender_user_id, {
    title: 'Connection Accepted',
    body: `${target.full_name} accepted your connection request`,
    data: { type: 'connection_accepted', user_id: currentUserId }
  });

  return { /* connection data */ };
}
```

### Database Schema for Contact Sharing

```sql
-- Contact shares
CREATE TABLE contact_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Who shared
  contact_user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Who was shared
  recipient_user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Who received
  note TEXT, -- Optional intro message
  status VARCHAR(50) DEFAULT 'pending', -- pending | accepted | declined | expired
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,

  INDEX idx_recipient (recipient_user_id, created_at),
  INDEX idx_sender (sender_user_id, created_at)
);

-- Connection requests (for share follow-up)
CREATE TABLE connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  via_share_id UUID REFERENCES contact_shares(id) ON DELETE SET NULL,
  message TEXT, -- Optional personal message
  status VARCHAR(50) DEFAULT 'pending', -- pending | accepted | declined | expired
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,

  INDEX idx_target (target_user_id, status),
  UNIQUE(sender_user_id, target_user_id, status) -- Prevent duplicate pending requests
);
```

### Metrics to Track

```sql
-- Contact Sharing Metrics

-- Metric 1: Total shares
SELECT COUNT(*) FROM contact_shares
WHERE created_at > NOW() - INTERVAL '7 days';

-- Metric 2: Share acceptance rate
SELECT
  COUNT(*) FILTER (WHERE status = 'accepted') * 100.0 / COUNT(*) AS acceptance_rate
FROM contact_shares
WHERE created_at > NOW() - INTERVAL '30 days';

-- Metric 3: Time to response (share → connection)
SELECT AVG(EXTRACT(EPOCH FROM (responded_at - created_at))) AS avg_seconds
FROM contact_shares
WHERE status IN ('accepted', 'declined');

-- Metric 4: Top introducers (most successful shares)
SELECT
  u.full_name,
  COUNT(cs.id) AS total_shares,
  COUNT(*) FILTER (WHERE cs.status = 'accepted') AS accepted,
  COUNT(*) FILTER (WHERE cs.status = 'accepted') * 100.0 / COUNT(cs.id) AS success_rate
FROM users u
LEFT JOIN contact_shares cs ON cs.sender_user_id = u.id
WHERE cs.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.id, u.full_name
HAVING COUNT(cs.id) > 0
ORDER BY accepted DESC
LIMIT 10;

-- Metric 5: Network effect (shares leading to more shares)
WITH share_chains AS (
  SELECT
    cs1.sender_user_id AS introducer,
    cs1.recipient_user_id AS recipient,
    cs2.id AS subsequent_share_id
  FROM contact_shares cs1
  LEFT JOIN contact_shares cs2
    ON cs2.sender_user_id = cs1.recipient_user_id
    AND cs2.created_at > cs1.created_at
    AND cs2.created_at < cs1.created_at + INTERVAL '7 days'
  WHERE cs1.status = 'accepted'
)
SELECT
  COUNT(DISTINCT recipient) AS recipients_who_shared,
  COUNT(subsequent_share_id) AS subsequent_shares
FROM share_chains;
```

---

## Summary: The 3 Core Flows

| Flow | User Action | Time to Complete | Key Metric |
|------|-------------|------------------|------------|
| **Onboarding** | Sign in → Import contacts → Connect | 2 minutes | % who complete import, avg contacts imported |
| **Ring Exchange** | Tap ring → Connect | 5 seconds (if app) / 60 seconds (download) | Tap-to-connection rate, download attribution |
| **Contact Sharing** | Share → Recipient connects | 30 seconds | Share acceptance rate, introducer success rate |

---

## Next Steps

1. **Build the intermediary web page first** - It's the metrics foundation for everything
2. **Set up WhatsApp Business API** - Critical for fallback flow
3. **Implement deep linking** - iOS Universal Links + Android App Links
4. **Build analytics dashboard** - Show users their ring stats
5. **Test NFC programming** - Ensure rings work reliably across devices

---

## Tech Stack Recommendations

```yaml
Frontend (Mobile):
  - React Native + Expo (fastest MVP path)
  - Deep linking: expo-linking
  - Push notifications: expo-notifications
  - NFC reading: react-native-nfc-manager (for reading other rings)

Backend:
  - Node.js + NestJS (structured, scalable)
  - PostgreSQL (relational data)
  - Redis (caching, rate limiting)
  - Bull (background jobs for imports)

Intermediary Web Page:
  - Next.js (SSR for tap page)
  - Hosted on Vercel (edge functions for speed)

APIs:
  - Google OAuth: passport-google-oauth20
  - Google Contacts: @googleapis/people
  - WhatsApp Business: Official API or Twilio
  - Push notifications: Firebase Cloud Messaging

NFC:
  - NTAG216 chips (888 bytes, perfect for URLs)
  - Programming: use NFC Tools app or custom writer

Hosting:
  - Backend: Railway or DigitalOcean App Platform
  - Database: Railway Postgres or DigitalOcean Managed DB
  - Web page: Vercel (for fast global CDN)

Monitoring:
  - Sentry (error tracking)
  - PostHog (product analytics)
  - Custom metrics dashboard (built in-app)
```

---

This spec covers the 3 core flows with the intermediary page as the metrics hub. Ready to build!
