import { promises as fs } from "node:fs";
import path from "node:path";

export interface PressLogo {
  text: string;
  fontStyle: string;
  icon?: string;
}

export interface HeroSettings {
  videoUrl: string;
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  viewDemoText: string;
  viewDemoHref: string;
  pressLogos: PressLogo[];
}

export interface LiveSolution {
  title: string;
  description: string;
  icon: string;
  href: string;
  features: string[];
}

export interface SoonSolution {
  title: string;
  icon: string;
  description: string;
}

export interface SolutionsSettings {
  headerBadgeText: string;
  headerTitleLine1: string;
  headerTitleLine2: string;
  headerSubtitle: string;
  live: LiveSolution[];
  soon: SoonSolution[];
}

export interface ServicesSettings {
  dashboardVideoUrl: string;
  operationalBadgeText: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  exploreDashboardText: string;
  exploreDashboardHref: string;
  routeOptimizedTitle: string;
  routeOptimizedSubtitle: string;
  activeFleetTitle: string;
  activeFleetSubtitle: string;
  activeFleetIcon: string;
  routeOptimizedIcon: string;
  appLabel: string;
}

export interface StatsItem {
  label: string;
  value: number;
  suffix: string;
  description: string;
}

export interface StatsSettings {
  badgeText: string;
  title: string;
  subtitle: string;
  items: StatsItem[];
}

export interface CoreFeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  colSpan: string;
}

export interface CoreFeaturesSettings {
  badgeText: string;
  title: string;
  subtitle: string;
  items: CoreFeatureItem[];
}

export interface BenefitItem {
  category: string;
  title: string;
  description: string;
  metric: string;
  detail: string;
}

export interface BenefitsSettings {
  badgeText: string;
  title: string;
  subtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  items: BenefitItem[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface CaseStudyItem {
  title: string;
  metric: string;
  detail: string;
}

export interface TestimonialsSettings {
  badgeText: string;
  title: string;
  subtitle: string;
  items: TestimonialItem[];
  caseStudies: CaseStudyItem[];
}

export interface RoadmapItem {
  phase: string;
  status: string;
  statusLive: boolean;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  offset: string;
}

export interface FutureSettings {
  badgeText: string;
  title: string;
  subtitle: string;
  items: RoadmapItem[];
}

export interface HomeSettings {
  hero: HeroSettings;
  solutions: SolutionsSettings;
  services: ServicesSettings;
  stats: StatsSettings;
  coreFeatures: CoreFeaturesSettings;
  benefits: BenefitsSettings;
  testimonials: TestimonialsSettings;
  future: FutureSettings;
}

const SETTINGS_DIR = path.join(process.cwd(), ".cms");
const SETTINGS_FILE = path.join(SETTINGS_DIR, "home-settings.json");

export function getDefaultHomeSettings(): HomeSettings {
  return {
    hero: {
      videoUrl:
        "https://cdn.dribbble.com/userupload/28751475/file/original-3579e6afca91a0da24722f70c96f3b2e.mp4",
      badgeText: "Real-time Fleet Intelligence",
      titleLine1: "Track Every Vehicle.",
      titleLine2: "Protect Every Route.",
      description:
        "Trackora unifies live GPS, safety events, and fuel visibility in one command center for logistics teams.",
      ctaText: "Book Demo",
      ctaHref: "#",
      viewDemoText: "Watch Platform Tour",
      viewDemoHref: "#command-center",
      pressLogos: [
        {
          text: "Apex Logistics",
          fontStyle: "font-bold text-[13px] lg:text-[15px]",
          icon: "mdi:truck-fast",
        },
        {
          text: "Global Freight",
          fontStyle: "font-semibold tracking-tight text-[13px] lg:text-[15px]",
          icon: "mdi:earth",
        },
        {
          text: "Nexus Transport",
          fontStyle: "font-medium text-[13px] lg:text-[15px]",
          icon: "mdi:road-variant",
        },
      ],
    },
    solutions: {
      headerBadgeText: "Our Solutions",
      headerTitleLine1: "Start with GPS.",
      headerTitleLine2: "Scale to everything.",
      headerSubtitle:
        "Trackora today delivers precision GPS tracking and powerful fleet software. Advanced IoT, ADAS, and TMS modules are arriving soon — subscribe to be first.",
      live: [
        {
          title: "GPS Vehicle Tracking",
          description:
            "Real-time location of every asset with 5-second refresh, geo-fencing alerts, trip replay, and driver behaviour scoring — all in one dashboard.",
          icon: "mdi:map-marker-path",
          href: "/products",
          features: [
            "Live map with 5-sec refresh",
            "Geo-fence violations & alerts",
            "Route replay & trip history",
            "Driver scorecards",
          ],
        },
        {
          title: "Fleet Command Software",
          description:
            "Enterprise-grade web & mobile dashboard. Manage your entire fleet, drivers, and assets from a single pane of glass with real-time data.",
          icon: "mdi:monitor-dashboard",
          href: "/products",
          features: [
            "Unified fleet dashboard",
            "Driver & vehicle management",
            "Custom alerts & reports",
            "Mobile app for field teams",
          ],
        },
      ],
      soon: [
        {
          title: "Fuel Management",
          icon: "mdi:fuel",
          description:
            "IoT fuel rod sensors with litre-level tracking, drain detection, and per-trip cost analysis.",
        },
        {
          title: "ADAS Video Telematics",
          icon: "mdi:car-emergency",
          description:
            "AI dashcam with collision warnings, lane departure detection, and driver fatigue monitoring.",
        },
        {
          title: "Predictive Maintenance",
          icon: "mdi:wrench-clock",
          description:
            "OBD-II diagnostics that predict brake, engine, and tyre failures before they happen.",
        },
        {
          title: "Freight & TMS",
          icon: "mdi:truck-delivery-outline",
          description:
            "End-to-end transport management: dispatch, consignments, e-way bills, and freight audit.",
        },
        {
          title: "AI Analytics",
          icon: "mdi:chart-bell-curve-cumulative",
          description:
            "Fleet-wide intelligence that optimises routes, predicts disruptions and benchmarks drivers.",
        },
      ],
    },
    services: {
      dashboardVideoUrl:
        "https://cdn.dribbble.com/userupload/45849695/file/b31bb91fdfb6436a0cad72b0b0b3bdc2.mp4",
      operationalBadgeText: "Operational Intelligence",
      headingLine1: "Total control.",
      headingLine2: "Zero clutter.",
      description:
        "Experience the industry's most advanced logistics interface. Deep analytics, real-time tracking, and predictive insights—all centralized on one pristine pane of glass.",
      exploreDashboardText: "Explore the dashboard",
      exploreDashboardHref: "#demo",
      routeOptimizedTitle: "Route Optimized",
      routeOptimizedSubtitle: "Saving 42 mins",
      activeFleetTitle: "Active Fleet Intel",
      activeFleetSubtitle: "Scanning 1,402 nodes",
      activeFleetIcon: "mdi:radar",
      routeOptimizedIcon: "mdi:check-all",
      appLabel: "app.trackora.tech",
    },
    stats: {
      badgeText: "Proof at a glance",
      title: "Trusted by scaling fleet operators.",
      subtitle:
        "Measured outcomes from teams running daily dispatch, compliance, and route operations on Trackora.",
      items: [
        {
          label: "Fleet Visibility",
          value: 98,
          suffix: "%",
          description: "Average live tracking coverage across active assets.",
        },
        {
          label: "Response Speed",
          value: 42,
          suffix: "sec",
          description: "Median alert acknowledgment time from command centers.",
        },
        {
          label: "Fuel Efficiency",
          value: 17,
          suffix: "%",
          description: "Typical reduction in avoidable fuel spend after rollout.",
        },
      ],
    },
    coreFeatures: {
      badgeText: "Core Features",
      title: "Everything you need to scale with precision.",
      subtitle:
        "A unified architecture for telemetry, safety, and operations teams.",
      items: [
        {
          id: "automation",
          title: "Intelligent Automation",
          description:
            "Deploy self-optimizing workflows that reduce manual dispatch work.",
          icon: "mdi:robot-outline",
          colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
        },
        {
          id: "performance",
          title: "Real-time Performance",
          description:
            "Sub-second event processing and route monitoring at fleet scale.",
          icon: "mdi:chart-timeline-variant-shimmer",
          colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
        },
        {
          id: "security",
          title: "Advanced Security",
          description:
            "Role-based access control and tamper-evident telemetry streams.",
          icon: "mdi:shield-lock-outline",
          colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
        },
        {
          id: "forecasting",
          title: "Predictive Insights",
          description:
            "Forecast delays, maintenance risk, and route disruptions early.",
          icon: "mdi:chart-bell-curve-cumulative",
          colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
        },
        {
          id: "collaboration",
          title: "Team Collaboration",
          description:
            "Shared command views for dispatch, safety, and operations teams.",
          icon: "mdi:account-group-outline",
          colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
        },
        {
          id: "dashboards",
          title: "Custom Dashboards",
          description:
            "Tailored KPI panels for utilization, SLA, and safety monitoring.",
          icon: "mdi:view-dashboard-outline",
          colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
        },
      ],
    },
    benefits: {
      badgeText: "Value Engineering",
      title: "Built for your bottom line.",
      subtitle:
        "Trackora turns fleet operations into a measurable growth engine.",
      ctaTitle: "Ready to scale faster?",
      ctaSubtitle: "Get a quick expert walkthrough.",
      ctaButtonText: "Schedule Demo",
      items: [
        {
          category: "Fiscal Impact",
          title: "Substantial Cost Savings",
          description:
            "Reduce fuel waste and emergency maintenance with predictive alerts.",
          metric: "22% ROI",
          detail: "Avg. yearly reduction",
        },
        {
          category: "Risk Mitigation",
          title: "Safety Improvements",
          description:
            "Improve driver behavior with ADAS and event-based coaching loops.",
          metric: "40% SAFE",
          detail: "Incident decrease",
        },
        {
          category: "Operational Flow",
          title: "Efficiency Gains",
          description:
            "Optimize dispatch and routing decisions before delays compound.",
          metric: "15% FAST",
          detail: "Route optimization",
        },
      ],
    },
    testimonials: {
      badgeText: "Wall of Intelligence",
      title: "See what our customers say.",
      subtitle:
        "Operations teams trust Trackora for speed, reliability, and measurable outcomes.",
      caseStudies: [
        {
          title: "Fuel savings across regional fleet",
          metric: "18%",
          detail: "Fuel spend reduction in 90 days",
        },
        {
          title: "Safety events reduced",
          metric: "31%",
          detail: "Harsh-event decline after driver coaching",
        },
      ],
      items: [
        {
          name: "Ali Al Marzooqi",
          role: "Logistics Director",
          quote:
            "Trackora transformed our long-haul monitoring with reliable live visibility.",
          rating: 5,
        },
        {
          name: "Sarah Jenkins",
          role: "Fleet Operations Manager",
          quote:
            "The dashboard is powerful without being complicated for our daily team.",
          rating: 5,
        },
        {
          name: "David Chen",
          role: "Chief Technical Officer",
          quote:
            "Integration was smooth and we were operational in under 48 hours.",
          rating: 5,
        },
      ],
    },
    future: {
      badgeText: "Strategic Horizon",
      title: "Built to grow with your operations.",
      subtitle:
        "GPS is live today. Fuel, ADAS, and AI modules expand your capability over time.",
      items: [
        {
          phase: "Phase 01",
          status: "Live Now",
          statusLive: true,
          title: "GPS Tracking & Fleet Software",
          description:
            "Real-time vehicle tracking, geo-fencing, and trip replay available today.",
          icon: "mdi:map-marker-path",
          imageUrl: "/assets/images/gps-tracking-fleet-software.png",
          offset: "lg:translate-y-0",
        },
        {
          phase: "Phase 02",
          status: "In Development",
          statusLive: false,
          title: "Fuel Management",
          description:
            "IoT fuel sensing with drain detection and per-trip fuel analytics.",
          icon: "mdi:fuel",
          imageUrl: "/assets/images/fuel-management-phase2.png",
          offset: "lg:translate-y-12",
        },
        {
          phase: "Phase 03",
          status: "Planned",
          statusLive: false,
          title: "ADAS Video Telematics",
          description:
            "AI dashcam with collision warnings, lane departure, and fatigue detection.",
          icon: "mdi:car-emergency",
          imageUrl: "/assets/images/adas-dms-device.png",
          offset: "lg:translate-y-24",
        },
      ],
    },
  };
}

async function ensureFile() {
  await fs.mkdir(SETTINGS_DIR, { recursive: true });
  try {
    await fs.access(SETTINGS_FILE);
  } catch {
    await fs.writeFile(
      SETTINGS_FILE,
      JSON.stringify(getDefaultHomeSettings(), null, 2),
      "utf-8",
    );
  }
}

export async function getHomeSettings(): Promise<HomeSettings> {
  await ensureFile();
  const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
  const parsed = JSON.parse(raw) as Partial<HomeSettings>;
  const defaults = getDefaultHomeSettings();
  return {
    hero: { ...defaults.hero, ...(parsed.hero ?? {}) },
    solutions: { ...defaults.solutions, ...(parsed.solutions ?? {}) },
    services: { ...defaults.services, ...(parsed.services ?? {}) },
    stats: { ...defaults.stats, ...(parsed.stats ?? {}) },
    coreFeatures: { ...defaults.coreFeatures, ...(parsed.coreFeatures ?? {}) },
    benefits: { ...defaults.benefits, ...(parsed.benefits ?? {}) },
    testimonials: { ...defaults.testimonials, ...(parsed.testimonials ?? {}) },
    future: { ...defaults.future, ...(parsed.future ?? {}) },
  };
}

export async function saveHomeSettings(input: HomeSettings): Promise<void> {
  await ensureFile();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(input, null, 2), "utf-8");
}

