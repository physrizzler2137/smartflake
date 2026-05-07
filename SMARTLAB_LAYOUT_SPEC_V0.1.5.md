# SMaRT-Lab Website Layout Specification
## Version: v0.2.0-stable (Branches: snowflake / pocketflake)

This document serves as a comprehensive prompt and architectural guide for maintaining the SMaRT-Lab website's visual and structural layout.

---

### 1. Global Design System
- **Core Aesthetic**: Architectural, minimalist, and precision-driven. Focus on vertical baseline alignment and strict geometric proportions.
- **Color Palette**: Sophisticated dark-mode primary theme (Deep Navy/Slate) with a vibrant primary accent color (usually a soft amber or neon depending on the active theme).
- **Typography**: 
  - **Headings/Logotype**: **Roboto Slab**.
  - **Navigation/Status**: **Monospace** (14px) for technical uniformity.
  - **Body**: Modern Sans-Serif (Inter).
- **Container**: Global constraint of **`max-w-6xl`** for all primary sections (Menubar, Main Content, Footer).

### 2. Navigation (Menubar)
- **Structure**: A fixed-top horizontal strip with a strict **4:2 margin ratio** (Top: 30px, Bottom: 15px relative to font size).
- **Alignment**: `items-baseline` across the entire container.
- **Components**:
  - **Left**: "SMaRT-Lab" logotype in Roboto Slab.
    - **Animation**: "Piston-like" rhythmic motion (4s loop).
      1. **Phase 1**: Heartbeat-style squeeze of letters "SM" and "RT", with "a" popping up (0.4 horizontal scale).
      2. **Phase 2**: Linear push-left of the "SMaRT" block (1.0s stroke) bridged by an elastic dash anchored to the "L".
  - **Center**: Navigation links (News, History, Facilities, etc.) distributed with balanced spacing.
  - **Right**: Accessibility block (Theme switcher, Font size controls, and a subtle "Ghost/Squid" icon for admin access).

### 3. Administrative Portal (@ CMS DASHBOARD)
- **Identity**: A uniform status-line heading: `[ADMIN Badge] @ CMS Dashboard`.
- **Typographic Protocol**: Absolute 14px monospace (`font-mono`) for every element in the heading row.
- **Metadata Integration**: Right-aligned build information reflecting the active backend: `Build: v0.2.0-stable | Branch: [snowflake/pocketflake]`.
- **Layout**: 
  - **Sticky Footer**: The page uses a `flex-col min-h-screen` layout where the main content expands (`flex-grow`) to anchor the footer to the bottom of the viewport.
  - **Grid**: Tile-based management system with categorized sections (Content Management, System Management).

### 4. Footer System
- **Design**: A minimalist horizontal strip constrained to `max-w-6xl`.
- **Alignment**: Perfect baseline synchronization for copyright text, lab identity ("Smart Materials and Soft Robotics Laboratory"), and utility icons.
- **Functionality**: Unified site-wide; remains persistent and aligned with the main navigation grid.

- **Uniformity**: Every character in a status or navigation line must share the same font size and baseline.
- **Asset Strategy**: Web-optimized images (WebP/JPEG) are tracked in `static/img/` to ensure reliability across all platform builds (Tauri, Mobile, Web).
- **Reactivity**: All components must support dynamic theme switching and text-size scaling without breaking baseline alignment.

### 6. Branch Architecture
- **snowflake**: Main production branch using **Supabase** for backend services.
- **pocketflake**: Experimental branch using **PocketBase** for localized/embedded database management.
- **Synchronization**: Frontend UI components and animation logic are kept in sync across both branches.

---

*Updated by Antigravity AI on 2026-05-07 for SMaRT-Lab.*
