# ZeTACipher 🔐

A **Zero-Trust IoT Mesh Security Platform** that continuously verifies device identity using HMAC-SHA256 cryptographic handshakes — isolating threats before damage spreads.

## 🧠 What is ZeTACipher?

ZeTACipher simulates a 5-node IoT mesh network where every device must cryptographically prove its identity to its neighbor on every handshake. No device is trusted by default. If any node fails verification, it is automatically quarantined — no human intervention required.

> **Positioned as the enforcement layer** companion to SentinelMesh (the monitoring layer).

---

## 🚀 Features

- 🔐 **HMAC-SHA256 Cryptographic Verification** — Every node challenges its neighbor with a fresh nonce and verifies the response
- 🔄 **5-Node Ring Topology** — N1→N2→N3→N4→N5→N1 continuous peer verification
- ⚡ **Autonomous Quarantine** — Compromised nodes isolated instantly without central server
- 🛡️ **Nonce-based Replay Attack Prevention** — Every handshake uses a unique random value
- 📡 **Live Mesh Monitoring** — Auto-handshake every 5 seconds with real-time status updates
- 🎯 **Attack Simulator** — Simulate Packet Tampering, Replay Attack, Man-in-the-Middle, Random attacks with full incident lifecycle
- 🧠 **AI Security Advisor** — Rule-based threat pattern detection with actionable recommendations
- 📊 **Network Health Score** — Live percentage based on trusted vs quarantined nodes
- 🚨 **Threat Alert Banner** — Auto-appears when any node is quarantined
- 👤 **Real Authentication** — MySQL-backed user registration and login

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.5 |
| Cryptography | HMAC-SHA256 (javax.crypto) |
| Network Simulation | Java Sockets, Daemon Threads |
| Database | MySQL (JPA/Hibernate) |
| Frontend | React 18, Vite |
| Styling | CSS3 (custom, no UI library) |
| Deployment | Railway (backend), Vercel (frontend) |

---

## 🏗️ Architecture

**Flow:**
IoT Device → Authentication → Trust Engine → Threat Detection → Auto Isolation
**Ring Topology:**
N1 (Smart Camera) → N2 (Door Lock) → N3 (Temp Sensor) → N4 (Network Router) → N5 (Security Alarm) → N1
Each node verifies only its direct neighbor — enforcing Zero Trust principles by limiting verification scope.

---

## 🔐 How HMAC Handshake Works

```
1. Node A generates a random nonce
2. Node A sends nonce to Node B
3. Node B computes HMAC-SHA256(nonce + secretKey) → sends result back
4. Node A independently computes HMAC-SHA256(nonce + secretKey)
5. Match   → Node B is TRUSTED ✅
6. No match → Node B is QUARANTINED 🚫
```

## 📁 Project Structure

```
ZeTACipher/
├── backend/
│   └── src/main/java/com/zetacipher/backend/
│       ├── crypto/
│       │   └── HMACUtil.java
│       ├── node/
│       │   ├── Node.java
│       │   ├── NodeServer.java
│       │   └── NodeClient.java
│       ├── network/
│       │   └── MeshNetwork.java
│       ├── model/
│       │   ├── HandshakeLog.java
│       │   ├── NodeStatusDTO.java
│       │   └── User.java
│       ├── repository/
│       │   ├── HandshakeLogRepository.java
│       │   └── UserRepository.java
│       ├── service/
│       │   └── NetworkService.java
│       └── controller/
│           ├── StatusController.java
│           └── AuthController.java
└── frontend/
    └── src/
        ├── components/
        │   ├── TopologyMap.jsx
        │   ├── NodeDashboard.jsx
        │   ├── HandshakeLogs.jsx
        │   ├── AttackSimulator.jsx
        │   ├── AIRecommendation.jsx
        │   ├── HealthScore.jsx
        │   └── ThreatBanner.jsx
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── LoginPage.jsx
        │   └── DashboardPage.jsx
        ├── services/
        │   └── api.js
        └── utils/
            ├── deviceNames.js
            └── threatAnalyzer.js
```

## ⚙️ Setup & Running Locally

### Backend
```bash
cd backend
# Configure MySQL in application.properties
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Authentication
ZeTACipher uses a real database-backed authentication system. Create your own account through the Sign Up page to access the dashboard.

---

## 👤 Author

**Neha Rajput** — Final Year B.Tech Student  
[LinkedIn](https://www.linkedin.com/in/neha-rajput-9615b5295)

---

*ZeTACipher is a final year capstone project demonstrating distributed systems, cryptographic authentication, and autonomous threat response.*