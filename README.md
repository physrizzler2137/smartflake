# SMaRT-Lab Website
**Smart Materials and Soft Robotics Laboratory**

A high-tech, precision-driven website for SMaRT-Lab, featuring a custom-animated logotype, administrative CMS, and multi-platform support (Web, Tauri, Capacitor).

## 🚀 Quick Start

### 1. Development
```sh
npm install
npm run dev
```

### 2. Building for Web
```sh
npm run build
```

### 3. Building for Desktop (Tauri)
```sh
npm run tauri build
```

### 4. Running with Docker
```sh
docker-compose up --build
```

## 📂 Project Architecture

- **Branches**:
  - `snowflake`: Uses **Supabase** as the backend.
  - `pocketflake`: Uses **PocketBase** for embedded/local data management.
- **Image Assets**: Optimized web assets (WebP) are located in `static/img/`. These are tracked in Git to ensure consistent bundling across native builds.
- **Logotype Animation**: Custom "piston-like" animation logic defined in `tailwind.config.ts`.

## 📦 Current Versions
- **Snowflake**: v0.3.3 (Supabase Infrastructure)
- **Pocketflake**: v0.4.2 (PocketBase Infrastructure)

## 🛠 Tooling

- **Image Optimizer**: `python3 pictoolkit/optimize-images.py`
- **Mega Downloader**: `node pictoolkit/download-mega.mjs`

---
*Maintained by SMaRT-Lab Team.*
