
export enum Platform {
  Google = 'Google Ads',
  Meta = 'Meta Ads',
  LinkedIn = 'LinkedIn Ads',
  Twitter = 'Twitter/X Ads',
  Reddit = 'Reddit Ads',
  Spotify = 'Spotify Ads',
  TikTok = 'TikTok Ads',
  Apple = 'Apple Search Ads',
}

export interface Comment {
  user: string;
  text: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  status: 'Active' | 'Paused' | 'Ended';
  spend: number;
  budget: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  impressions: number;
  clicks: number;
  roas: number;
  creative: {
    text: string;
    imageUrl: string;
    base64Image: string;
  };
  comments?: Comment[];
}

export interface AIAnalysisResult {
    headlineFeedback: string;
    bodyCopyFeedback: string;
    visualFeedback: string;
    engagementPrediction: 'Low' | 'Medium' | 'High';
    complianceScore: number;
    suggestions: string[];
}

export interface FunnelStage {
  name: string;
  value: number;
  fill: string;
}

export enum AttributionModel {
  LastTouch = 'Last Touch',
  FirstTouch = 'First Touch',
  Linear = 'Linear',
  TimeDecay = 'Time Decay',
}

export interface Audience {
  platform: Platform;
  name: string;
  size: number;
}

export interface OverlapData {
  platforms: [Platform, Platform];
  overlapCount: number;
  overlapPercentage: [number, number];
}

export interface SentimentAnalysisResult {
  positive: number;
  neutral: number;
  negative: number;
  summary: string;
}

export interface BudgetSimulationResult {
  predictedImpressions: number;
  predictedClicks: number;
  predictedRoas: number;
}

export interface GrowthOpportunity {
  title: string;
  description: string;
  potentialImpact: 'High' | 'Medium' | 'Low';
  suggestedActions: string[];
  relevantCampaigns: string[];
}

// Types for Settings and Integrations
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'Admin' | 'Manager' | 'Analyst' | 'Viewer';
  lastActive: string;
}

export type IntegrationCategory = 'Advertising' | 'Analytics' | 'CRM' | 'Email/SMS' | 'Social Tools' | 'E-commerce' | 'Automation';

export interface Integration {
    name: string;
    category: IntegrationCategory;
    logo: React.FC<React.SVGProps<SVGSVGElement>>;
    isConnected: boolean;
}

// --- New Types for Added Features ---

// For Churn Prediction
export interface ChurnableUser {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    lastSeen: string; // e.g., "3 days ago"
    ltv: number; // lifetime value
    sessions: number;
    plan: 'Free' | 'Pro' | 'Enterprise';
}

export interface ChurnPredictionResult {
    churnProbability: number; // 0 to 1
    riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
    keyFactors: string[];
    suggestedAction: string;
}


// For Dynamic Segmentation
export type SegmentMetric = 'ltv' | 'sessions' | 'lastSeenDays' | 'plan';
export type SegmentOperator = '>' | '<' | '=' | '!=';
export interface SegmentRule {
    metric: SegmentMetric;
    operator: SegmentOperator;
    value: number | string;
}
export interface DynamicSegment {
    id: string;
    name:string;
    rules: SegmentRule[];
    userCount: number;
    syncedTo: ('HubSpot' | 'Customer.io')[];
}

// For Experiment Tracker
export interface Experiment {
    id: string;
    name: string;
    hypothesis: string;
    status: 'Running' | 'Completed' | 'Draft';
    primaryKpi: 'ROAS' | 'CTR' | 'Conversion Rate';
    startDate: string;
    endDate?: string;
    resultSummary?: string;
    statisticalSignificance?: number; // e.g., 95 for 95%
    winner?: 'Control' | 'Variant A';
}

// For Cohort Analysis
export interface CohortData {
    cohort: string; // e.g., '2024-W25'
    users: number;
    retention: number[]; // e.g., [100, 50, 40, 35, 30] for Week 0, 1, 2, 3, 4
}

// For Webhooks
export interface Webhook {
  id: string;
  url: string;
  event: 'campaign_ended' | 'budget_overspend' | 'new_lead' | 'churn_risk_high';
  isActive: boolean;
}

// For Generative Ad Creative Studio
export interface AdCreativeBrief {
  product: string;
  targetAudience: string;
  keyFeatures: string;
  toneOfVoice: 'Professional' | 'Casual' | 'Witty' | 'Bold';
  platform: Platform;
}

export interface GeneratedAdCreative {
  headline: string;
  body: string;
  cta: string;
  imagePrompt: string;
  base64Image?: string;
}

// For Predictive Forecasting & Anomaly Detection
export interface ForecastDataPoint {
  date: string; // YYYY-MM-DD
  value: number;
  type: 'historical' | 'forecasted';
}

export interface Anomaly {
  id: string;
  campaignName: string;
  date: string;
  metric: 'CPA' | 'CTR' | 'Spend';
  description: string;
  severity: 'High' | 'Medium' | 'Low';
}

// For Competitor & Market Intelligence
export interface CompetitorInfo {
  domain: string;
  summary: string;
  adPlatforms: string[];
  messagingStrategies: string[];
  recentOffers: string[];
  sources: { title: string, uri: string }[];
}

export interface MarketTrend {
  title: string;
  summary: string;
  searchVolumeChange: number; // percentage
  sources: { title: string, uri: string }[];
}
