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
IoT Device → Authentication → Trust Engine → Threat Detection → Auto Isolation
**Ring Topology:**
N1 (Smart Camera) → N2 (Door Lock) → N3 (Temp Sensor) → N4 (Network Router) → N5 (Security Alarm) → N1
Each node verifies only its direct neighbor — enforcing Zero Trust principles by limiting verification scope.

---

## 🔐 How HMAC Handshake Works
Node A generates a random nonce
Node A sends nonce to Node B
Node B computes HMAC-SHA256(nonce + secretKey) → sends result back
Node A independently computes HMAC-SHA256(nonce + secretKey)
Match → Node B is TRUSTED ✅
No match → Node B is QUARANTINED 🚫
---

## 📁 Project Structure
ZeTACipher/
├── backend/
│   └── src/main/java/com/zetacipher/backend/
│       ├── crypto/          → HMACUtil.java
│       ├── node/            → Node, NodeServer, NodeClient
│       ├── network/         → MeshNetwork.java
│       ├── model/           → HandshakeLog, NodeStatusDTO, User
│       ├── repository/      → JPA Repositories
│       ├── service/         → NetworkService.java
│       └── controller/      → StatusController, AuthController
└── frontend/
└── src/
├── components/      → Dashboard components
├── pages/           → Landing, Login, Dashboard
├── services/        → API calls
└── utils/           → Device names, Threat analyzer
---

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

## 🎯 Key Interview Concepts

- **DTO Pattern** — NodeStatusDTO prevents secretKey exposure in API responses
- **@PostConstruct** — NetworkService initializes mesh on Spring Boot startup
- **Daemon Threads** — Each node runs as a non-blocking background thread
- **Zero Trust** — No node trusts any other by default, trust earned every handshake
- **Ring Topology** — Chosen to enforce neighbor-only verification, aligning with Zero Trust

---

## 👤 Author

**Neha Rajput** — Final Year B.Tech Student  
[LinkedIn](https://www.linkedin.com/in/neha-rajput-9615b5295)

---

*ZeTACipher is a final year capstone project demonstrating distributed systems, cryptographic authentication, and autonomous threat response.*