---
version: gamma
name: Clay Refined
description: A ultra-minimal, high-fidelity interface. Anchors on cream canvas with sharp but soft 8px radii. Focused on single-task clarity and "whispering" borders.

colors:
  primary: "#0a0a0a"
  ink: "#0a0a0a"
  muted: "#6a6a6a"
  hairline: "#e5e5e5"
  hairline-soft: "#f0f0f0"
  canvas: "#fffaf0"
  surface-soft: "#faf5e8"
  brand-pink: "#ff4d8b"
  brand-teal: "#1a3a3a"

typography:
  display:
    fontSize: 40px
    fontWeight: 500
    letterSpacing: -0.03em
  title:
    fontSize: 18px
    fontWeight: 600
  body:
    fontSize: 15px
    lineHeight: 1.6

rounded:
  sm: 4px
  md: 8px
  lg: 12px

principles:
  - Fixed-position layouts: Keep primary actions anchored.
  - Border consistency: Use 1px hairline for all containers.
  - Single Modality focus: Don't overwhelm with tabs; prioritize the active bridge.
---

## Components

### SmoothButton

Standardized on `8px` (md) radius. Solid ink or whispering outline.

### Communicate Layout

A tall, centered message column with a floating or fixed input bar at the bottom. Negative space is used to drive focus to the conversation.
