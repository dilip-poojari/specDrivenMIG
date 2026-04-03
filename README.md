# IBM Cloud Migration Hub

A self-service UI that guides customers through migrating from IBM Classic Infrastructure to IBM Cloud VPC.

## Features

- **7-Stage Migration Flow**: Connect Account → Resource Inventory → Recommendation → Provision VPC → Data Migration → Validation → Cutover & Finish
- **AI-Powered Guidance**: Bob (IBM's AI agent) provides personalized guidance at every stage
- **Multi-User Collaboration**: Role-based views for IT Managers, DBAs, Developers, and Compliance officers
- **Safety-First**: Built-in gates between stages, read-only operations until approval, mandatory validation checklists
- **Cost Transparency**: Side-by-side Classic vs VPC comparisons with estimated savings

## Tech Stack

- React 18 with functional components and hooks
- IBM Carbon Design System
- React Router for navigation
- Vite for build tooling
- Mock data for prototype demonstration

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── BobPanel.jsx    # AI assistant panel
│   └── Navigation.jsx  # 7-stage navigation
├── screens/            # Main application screens
│   ├── MigrationDashboard.jsx
│   ├── ConnectAccount.jsx
│   ├── ResourceInventory.jsx
│   └── Recommendation.jsx
├── mock/               # Mock data for prototype
│   └── mockData.js
└── App.jsx            # Main application component
```

## User Personas

- **Olive** (Primary): IBM Cloud customer managing her own migration
- **Maya**: IT Manager who approves costs
- **Raj**: DBA who validates database integrity
- **Tara**: Developer who tests applications
- **Sam**: Compliance officer who signs off on decommissioning

## Phase 1 (Babathon Scope) - Completed ✅

- ✅ Project scaffold with Carbon Design System
- ✅ Screen 1: Migration Dashboard with mock data
- ✅ Screen 2: Connect Account with API key flow
- ✅ Screen 3: Resource Inventory (BOM output)
- ✅ Screen 4: Recommendation (sizing + approval)
- ✅ Bob panel component (persistent, collapsible)
- ✅ Navigation component (7 stages, gate states)

## Phase 2 (Post-Babathon)

- Screen 5: Provision VPC (Terraform plan)
- Screen 6: Data Migration (BRS + checklist)
- Screen 7: Cutover and Finish

## Phase 3

- Teammate invite and role-based views
- Migration completion report generator
- Service dependency map visualization

## License

IBM Internal Use Only