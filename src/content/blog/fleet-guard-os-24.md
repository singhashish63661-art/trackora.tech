---
title: "Trackora OS 2.4: Advanced ADAS Sync Rules"
excerpt: "Release notes for version 2.4, introducing sub-millisecond video telemetry, intelligent ADAS trigger policies, and driver coaching AI."
category: "Changelog"
date: "AUG 30, 2025"
readTime: "4 MIN"
img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1600"
featured: false
---

## What's New in v2.4

This release focuses on deepening our ADAS integration layer and reducing video telemetry pipeline latency by 60%.

### ADAS Trigger Policy Engine

Trackora OS 2.4 introduces a fully configurable **ADAS Trigger Policy Engine**. Operators can now define:

- Custom sensitivity thresholds per vehicle class (e.g. more lenient for city buses vs. highway trucks)
- Geographic zone overrides (school zones trigger stricter lane departure rules)
- Shift-based policies (night drivers get fatigue detection at 3-hour intervals vs. 4-hour)

### Sub-Millisecond Video Telemetry

By moving H.264 encoding to the on-device chip, we've reduced the time from **camera event to dashboard alert** from 3.2 seconds to **850 milliseconds**. For collision pre-warning, this is critical.

### Driver Coaching AI (Beta)

Available to Pro and Enterprise accounts, the new Driver Coaching AI analyses trip footage weekly and generates personalized coaching reports:

- **Harsh braking frequency** vs. fleet average
- **Tailgating score** with route context
- Improvement trend over 30/60/90 day windows

### Bug Fixes

- Fixed false positive lane departure alerts on curved mountain roads
- Resolved dashboard freeze when streaming > 6 live camera feeds simultaneously
- Corrected fuel rod calibration drift after firmware update

## Upgrade Instructions

Trackora OS 2.4 will roll out automatically to all devices over the next 14 days. Enterprise customers with custom firmware can request a manual upgrade window via the admin portal.
