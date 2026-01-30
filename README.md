# 📊 GitHub Log 

> A Next.js-based UI that visualizes GitHub activity logs stored in MongoDB.

- Displays GitHub actions such as pushes, pull requests, and merges.
- Presents logs in a clean, minimal, developer-friendly interface.
- Designed to resemble real-world GitHub activity monitoring tools.

## Table of Contents

1. [Tech Stack and Prerequisites](#1-tech-stack-and-prerequisites)
2. [Architecture Overview](#2-architecture-overview)
3. [How to Use the Project](#3-how-to-use-the-project)

## 1. Tech Stack and Prerequisites

**Frontend:** Next.js, Tailwind CSS\
**Backend:** Next.js, Vercel\
**Prerequisites:** Git, MongoDB Community Edition, Node.js

## 2. Architecture Overview
```
action-repo
│
│  GitHub Webhook
│
▼
webhook-repo (Flask)
│
│  - Write-only webhook endpoint
│
▼
MongoDB Atlas Cluster
│
│  - Persistent event storage
│
▲
│  Poll every 15 seconds
│
github-log (Next.js)
│
│  - Client-side polling
│  - Minimal data processing
│  - UI-focused responsibilities
```

## 3. How to Use the Project

```
git clone https://github.com/aursalan/github-log.git
cd github-log
npm install
npm run dev
```
The application will be available at:
```
http://localhost:3000
```
