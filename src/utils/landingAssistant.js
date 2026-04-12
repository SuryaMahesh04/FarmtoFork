// ============================================================
//  Farm2Fork — Landing Page AI Assistant Knowledge Engine
//  Designed to be informative for evaluators & visitors
// ============================================================

const KNOWLEDGE = {
    project: {
        name: "Farm2Fork",
        fullName: "Farm2Fork — Agricultural Supply Chain Traceability Platform",
        tagline: "Revolutionizing Agriculture with Transparency, Trust & Technology",
        version: "v2.0 (April 2026)",
        type: "Full-Stack Web Application (Major Project)",
        domain: "AgriTech / Supply Chain Management / Blockchain Traceability",
        institution: "Academic Major Project — B.Tech Computer Science",
        github: "https://github.com/SuryaMahesh04/FarmtoFork",
        branch: "development",
    },

    team: [
        {
            name: "Surya Mahesh",
            role: "Lead Developer & Project Architect",
            github: "SuryaMahesh04",
            responsibilities: [
                "Full-stack architecture design (MERN Stack)",
                "Backend API development (Node.js + Express + MongoDB)",
                "Cryptographic integrity engine (AES-256 encryption, HMAC verification)",
                "Frontend dashboard UI for all 6 user roles",
                "QR Code traceability system",
                "Real-time notification system",
                "Supply chain journey tracking and blockchain hash generation",
                "Admin, Farmer, Transporter, Distributor, Retailer & Consumer dashboards",
            ],
        },
        {
            name: "Sharmitha",
            role: "UI/UX Designer & Frontend Developer",
            responsibilities: [
                "Mobile-responsive UI design",
                "Consumer-facing traceability interface",
                "Component library development",
            ],
        },
        {
            name: "Adithya",
            role: "Database Designer & Backend Support",
            responsibilities: [
                "MongoDB schema design",
                "Backend API integration",
                "Data modeling for supply chain entities",
            ],
        },
        {
            name: "Praneep",
            role: "Testing & Documentation",
            responsibilities: [
                "System testing & QA",
                "Project report documentation",
                "Presentation and demo preparation",
            ],
        },
        {
            name: "Laharika",
            role: "Testing & Documentation",
            responsibilities: [
                "System testing & QA",
                "Project report documentation",
                "Presentation and demo preparation",
            ],
        },
    ],

    techStack: {
        frontend: ["React 18 (Vite)", "Tailwind CSS", "Framer Motion", "Recharts", "Lucide Icons", "React Router DOM", "React Hot Toast"],
        backend: ["Node.js", "Express.js", "MongoDB (Atlas)", "Mongoose ODM", "JWT Authentication", "Multer (File uploads)"],
        security: ["AES-256 Encryption (cryptoEngine)", "HMAC-SHA256 Integrity Hashing", "JWT Access Tokens", "bcrypt Password Hashing", "Role-Based Access Control (RBAC)"],
        devOps: ["Git & GitHub (version control)", "MongoDB Atlas (cloud DB)", "Vite Dev Server", "npm workspaces"],
        integrations: ["QR Code Generation & Scanning (html5-qrcode)", "Leaflet Maps (real-time GPS)", "Socket.io (live notifications)", "Multer (image uploads)"],
    },

    features: {
        core: [
            "End-to-end supply chain tracking from farm to consumer",
            "Cryptographic data integrity — AES-256 encryption + HMAC tamper-detection",
            "QR code generation for every batch, scannable by any consumer",
            "Role-based multi-dashboard system (6 unique roles)",
            "Real-time notifications using Socket.io",
            "GPS-based live shipment tracking with LeafletMap",
            "Batch creation with quality score assignment",
            "Consumer scan history and verification analytics",
        ],
        farmer: [
            "Create and manage crop batches with full metadata",
            "Assign quality scores and organic certifications",
            "Generate QR codes for each batch",
            "Create shipments selecting transporters and distributors",
            "View revenue analytics and harvest volume trends",
            "Data tamper-detection alerts on dashboard",
        ],
        transporter: [
            "Accept/reject shipment requests from farmers",
            "Manage driver assignments and vehicle fleet",
            "Real-time GPS location tracking on map",
            "Update shipment status (In Transit → Delivered)",
            "Fleet performance analytics",
        ],
        distributor: [
            "Receive and verify incoming shipments",
            "Smart inventory management with stock levels",
            "Mark batches as 'Live' to publish to retailer marketplace",
            "Accept or reject Purchase Orders from retailers",
            "Quality control dashboard with pass/fail metrics",
            "Warehouse zone utilization tracking",
        ],
        retailer: [
            "Browse live distributor marketplace for fresh produce",
            "Raise Purchase Orders directly from the marketplace",
            "Track incoming inventory and manage retail stock",
            "Sales analytics and performance charts",
            "Consumer-facing product traceability view",
        ],
        admin: [
            "Platform-wide governance and user management",
            "Approve or reject new farmer/retailer/distributor accounts",
            "Monitor all shipments in real-time (ShipmentMonitor)",
            "View live supply chain map (SupplyMap)",
            "View blockchain-level integrity analytics",
            "Fleet hub and driver management oversight",
            "Platform statistics with KPI metrics",
        ],
        consumer: [
            "Scan QR codes or enter Batch IDs to verify product authenticity",
            "View complete farm-to-fork journey timeline",
            "Cryptographic tamper-detection — see if data was altered",
            "Personal verification history and impact dashboard",
            "Farms explored, counterfeits spotted, favorite farms",
            "Alert system for tampered products",
        ],
    },

    architecture: {
        pattern: "MVC (Model-View-Controller) + RESTful API",
        database: "MongoDB Atlas (NoSQL Cloud Database)",
        auth: "JWT-based authentication with refresh-token logic",
        encryption: "AES-256-CBC encryption for sensitive batch data. All field-level data like quantity, price, GPS coordinates are encrypted at rest and decrypted only by authorized users.",
        integrity: "HMAC-SHA256 hash on critical batch fields. Any unauthorized direct DB modification is detected on the next read — the system flags it as 'TAMPERED' with a red alert.",
        realtime: "Socket.io WebSocket server integrated into Express for live notifications across all dashboards.",
        roles: ["farmer", "transporter", "distributor", "retailer", "admin", "consumer"],
    },

    impact: {
        problem: "Indian farmers lose 30-40% of produce value due to opaque supply chains, middlemen exploitation, and lack of traceability. Consumers cannot verify the origin or quality of food they purchase.",
        solution: "Farm2Fork creates a closed-loop digital ecosystem where every stakeholder — from farmer to consumer — has a verified, transparent view of the product journey.",
        benefits: [
            "🌾 Farmers get fair, direct-to-market pricing without exploitation",
            "🚛 Transporters have digital accountability for cargo integrity",
            "🏭 Distributors maintain quality-verified inventory with easy marketplace publishing",
            "🛒 Retailers source directly from verified distributors with full provenance",
            "👤 Consumers verify food authenticity by scanning a QR code in seconds",
            "🔒 Data tamper-detection prevents supply chain fraud at every node",
            "📊 Real-time analytics empower all stakeholders with actionable insights",
        ],
        marketContext: "The global food traceability market is valued at $18+ billion (2024) and growing at 9% CAGR. India's agriculture sector, contributing 17% of GDP with 600M+ people dependent on it, urgently needs digitization.",
    },

    evaluation: {
        novelty: [
            "Dual-layer security: AES-256 Encryption + HMAC Tamper Detection — unlike typical blockchain projects, data is both encrypted AND integrity-verified",
            "6-role full-stack platform covering the entire supply chain lifecycle in one system",
            "Consumer-facing traceability with anonymous device-based scan tracking (no login required)",
            "Real-time socket notifications across all dashboards",
            "Mobile-first responsive design for farmer accessibility in rural areas",
        ],
        complexity: [
            "Complex role-based access control with 6 different user types",
            "End-to-end encrypted data pipeline with field-level AES encryption",
            "Real-time GPS tracking with Leaflet Maps integration",
            "Marketplace with Purchase Order workflow (Retailer → Distributor)",
            "Dual-hash integrity system (blockchainHash + dataHash) per batch",
            "Automated Admin approval workflow for new accounts",
        ],
        codeStats: {
            totalFiles: "100+ source files",
            linesOfCode: "13,000+ lines (frontend + backend combined)",
            apiEndpoints: "50+ REST API endpoints",
            databaseModels: "15+ Mongoose models",
            reactComponents: "40+ reusable React components",
        },
    },
};

// ============================================================
//  Intent Processor — Natural Language Query Matching
// ============================================================

export const landingAssistantProcess = (query) => {
    const q = query.toLowerCase().trim();

    // Greeting
    if (/^(hi|hello|hey|hii|namaste|howdy|good morning|good evening|sup|what's up)/.test(q)) {
        return {
            text: "👋 Hello! I'm **Forge**, the Farm2Fork AI guide.\n\nI can tell you about:\n• 🌾 The **platform** and how it works\n• 👥 The **development team**\n• 🔧 The **technology stack**\n• 🔒 **Security & encryption** features\n• 📊 Platform **impact & statistics**\n\nWhat would you like to know?",
        };
    }

    // Project overview
    if (/\b(what is|about|overview|explain|tell me about|project|platform|farm2fork)\b/.test(q)) {
        const p = KNOWLEDGE.project;
        return {
            text: `## 🌾 About Farm2Fork\n\n**${p.fullName}**\n\n${p.tagline}\n\nFarm2Fork is a full-stack agricultural supply chain traceability platform. It connects **farmers, transporters, distributors, retailers, and consumers** in a single verified ecosystem.\n\n**Version:** ${p.version}\n**Type:** ${p.type}\n**Domain:** ${p.domain}\n\nEvery product journey — from harvest to your plate — is tracked, encrypted, and verifiable by anyone with a phone.`,
        };
    }

    // Team
    if (/\b(team|developer|who|members|built|created|made|student|author)\b/.test(q)) {
        const lead = KNOWLEDGE.team[0];
        const memberList = KNOWLEDGE.team.map((m, i) => {
            const emoji = ['🧑‍💻', '🎨', '🗄️', '🧪', '📋'][i] || '👤';
            return `${emoji} **${m.name}** — *${m.role}*\n${m.responsibilities.map(r => `   • ${r}`).join('\n')}`;
        }).join('\n\n');
        return {
            text: `## 👥 Development Team — Farm2Fork\n\nThis project was built by a team of **${KNOWLEDGE.team.length} members**:\n\n${memberList}\n\n**Lead GitHub:** [${lead.github}](https://github.com/${lead.github})\n**Repository:** [FarmtoFork](${KNOWLEDGE.project.github})`,
        };
    }

    // Tech stack
    if (/\b(tech|technology|stack|built with|framework|language|react|node|mongo|database|backend|frontend)\b/.test(q)) {
        const t = KNOWLEDGE.techStack;
        return {
            text: `## 🔧 Technology Stack\n\n**Frontend:**\n${t.frontend.map(x => `• ${x}`).join('\n')}\n\n**Backend:**\n${t.backend.map(x => `• ${x}`).join('\n')}\n\n**Security:**\n${t.security.map(x => `• ${x}`).join('\n')}\n\n**Key Integrations:**\n${t.integrations.map(x => `• ${x}`).join('\n')}`,
        };
    }

    // Security / Encryption
    if (/\b(secure|security|encrypt|blockchain|tamper|hash|data integrity|hack|fraud|protection|aes|hmac)\b/.test(q)) {
        const a = KNOWLEDGE.architecture;
        return {
            text: `## 🔒 Security Architecture\n\n**Encryption:**\n${a.encryption}\n\n**Tamper Detection:**\n${a.integrity}\n\n**Authentication:**\n${a.auth}\n\n**Result:** Any attempt to alter a batch record directly in the database is automatically detected and flagged as ⚠️ **TAMPERED** on the farmer and admin dashboards — providing true blockchain-level accountability without Ethereum gas fees.`,
        };
    }

    // Features
    if (/\b(features|functionality|what can|capabilities|modules|dashboard)\b/.test(q)) {
        const f = KNOWLEDGE.features;
        return {
            text: `## ✨ Platform Features\n\n**Core System:**\n${f.core.slice(0, 5).map(x => `• ${x}`).join('\n')}\n\n**6 Specialized Role Dashboards:**\n🌾 Farmer • 🚛 Transporter • 🏭 Distributor • 🛒 Retailer • 🔑 Admin • 👤 Consumer\n\nEach role has a dedicated dashboard with real-time data, analytics, and workflows. Ask me about any specific role for more details!`,
        };
    }

    // Farmer role
    if (/\b(farmer|farm|harvest|batch|crop)\b/.test(q)) {
        return {
            text: `## 🌾 Farmer Dashboard\n\n${KNOWLEDGE.features.farmer.map(x => `• ${x}`).join('\n')}\n\nFarmers are the origin point of every supply chain journey. Each batch they create generates a **unique batchId**, a **cryptographic hash**, and a **QR code** that consumers can scan to verify authenticity.`,
        };
    }

    // Transporter
    if (/\b(transport|truck|driver|logistics|gps|fleet|shipment)\b/.test(q)) {
        return {
            text: `## 🚛 Transporter / Logistics Dashboard\n\n${KNOWLEDGE.features.transporter.map(x => `• ${x}`).join('\n')}\n\nThe transporter role bridges farmers and distributors. Real-time GPS tracking is displayed on an interactive **Leaflet Map**, and drivers can update their shipment status from their dashboard.`,
        };
    }

    // Distributor
    if (/\b(distribut|warehouse|inventory|marketplace|stock|live toggle|publish)\b/.test(q)) {
        return {
            text: `## 🏭 Distributor Dashboard\n\n${KNOWLEDGE.features.distributor.map(x => `• ${x}`).join('\n')}\n\nDistributors are the quality gatekeepers. They receive verified shipments, manage warehouse inventory, and publish batches to the **Retailer Marketplace** using the "Live" toggle — making products instantly available for purchase.`,
        };
    }

    // Retailer
    if (/\b(retail|shop|store|purchase order|buy|seller)\b/.test(q)) {
        return {
            text: `## 🛒 Retailer Dashboard\n\n${KNOWLEDGE.features.retailer.map(x => `• ${x}`).join('\n')}\n\nRetailers discover and purchase verified produce through the **Distributor Marketplace**. Every purchase order goes through an approval workflow — ensuring retailers always know exactly what they're sourcing and from whom.`,
        };
    }

    // Admin
    if (/\b(admin|governance|manage|monitor|approval|platform stats)\b/.test(q)) {
        return {
            text: `## 🔑 Admin Dashboard\n\n${KNOWLEDGE.features.admin.map(x => `• ${x}`).join('\n')}\n\nThe Admin role has full platform visibility including a **live supply chain map**, **shipment monitor**, **user management**, and **KPI analytics**. Admins approve new accounts, ensuring only verified stakeholders join the ecosystem.`,
        };
    }

    // Consumer
    if (/\b(consumer|scan|qr|verify|authentic|trace|origin)\b/.test(q)) {
        return {
            text: `## 👤 Consumer Traceability\n\n${KNOWLEDGE.features.consumer.map(x => `• ${x}`).join('\n')}\n\nConsumers require **zero login** to verify products. Simply scan the QR code on any Farm2Fork product and instantly see:\n✅ Which farm it came from\n✅ Harvest date & quality score\n✅ Full supply chain journey\n✅ Cryptographic tamper verification`,
        };
    }

    // Impact / problem
    if (/\b(impact|problem|solve|why|importance|benefit|need|agriculture|india|market)\b/.test(q)) {
        const i = KNOWLEDGE.impact;
        return {
            text: `## 📊 Platform Impact\n\n**The Problem:**\n${i.problem}\n\n**Our Solution:**\n${i.solution}\n\n**Key Benefits:**\n${i.benefits.join('\n')}\n\n**Market Context:**\n${i.marketContext}`,
        };
    }

    // Evaluation / novelty for evaluators
    if (/\b(evaluat|judge|novel|unique|innovation|complex|contribution|what makes|different|special|grade|marks)\b/.test(q)) {
        const e = KNOWLEDGE.evaluation;
        const c = e.codeStats;
        return {
            text: `## 🏆 Innovation & Evaluation Highlights\n\n**Novel Contributions:**\n${e.novelty.map(x => `• ${x}`).join('\n')}\n\n**Technical Complexity:**\n${e.complexity.map(x => `• ${x}`).join('\n')}\n\n**Codebase Stats:**\n• ${c.totalFiles}\n• ${c.linesOfCode}\n• ${c.apiEndpoints}\n• ${c.databaseModels}\n• ${c.reactComponents}`,
        };
    }

    // Roles
    if (/\b(role|user|who can use|stakeholder|actor)\b/.test(q)) {
        return {
            text: `## 👥 Platform Roles\n\nFarm2Fork has **6 user roles**, each with a dedicated dashboard:\n\n1. 🌾 **Farmer** — Create batches, manage crops, generate QR codes\n2. 🚛 **Transporter** — Manage fleet, accept shipments, track drivers\n3. 🏭 **Distributor** — Receive shipments, manage inventory, publish to marketplace\n4. 🛒 **Retailer** — Browse marketplace, raise purchase orders, manage store inventory\n5. 🔑 **Admin** — Full platform governance, user approvals, live monitoring\n6. 👤 **Consumer** — Scan QR codes to verify product authenticity (no login needed)`,
        };
    }

    // GitHub / source code
    if (/\b(github|source|code|repo|repository|open source)\b/.test(q)) {
        return {
            text: `## 💻 Source Code\n\n**GitHub Repository:**\n[${KNOWLEDGE.project.github}](${KNOWLEDGE.project.github})\n\n**Active Branch:** \`${KNOWLEDGE.project.branch}\`\n\nThe codebase includes 100+ source files with 13,000+ lines of code across the frontend (React/Vite) and backend (Node.js/Express/MongoDB).`,
        };
    }

    // Suggestions menu
    if (/\b(help|menu|option|suggest|what can you|commands)\b/.test(q)) {
        return {
            text: `## 💡 Ask Me Anything!\n\nHere are some things I can answer:\n\n• *"What is Farm2Fork?"*\n• *"Who built this project?"*\n• *"What is the technology stack?"*\n• *"How does the security work?"*\n• *"Tell me about the farmer dashboard"*\n• *"What makes this project unique?"*\n• *"What is the impact of this platform?"*\n• *"What roles are available?"*\n• *"Show me the GitHub repo"*`,
        };
    }

    // Fallback
    return {
        text: `I'm not sure I understood that. Try asking about:\n\n• The **platform** overview\n• **Team members**\n• **Technology stack**\n• **Security** features\n• A specific **role** (farmer, retailer, etc.)\n• Platform **impact**\n• What makes this **unique**\n\nOr just say *"help"* to see all options! 🌾`,
    };
};

export default KNOWLEDGE;
