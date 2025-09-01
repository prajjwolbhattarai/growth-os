import { Campaign, Platform, FunnelStage, Comment, AttributionModel, Audience, OverlapData, User, Integration, IntegrationCategory, ChurnableUser, Experiment, CohortData, DynamicSegment, Webhook, ForecastDataPoint, Anomaly, MarketTrend, CompetitorInfo } from './types';
import React from 'react';

// --- Placeholder Logos for Integrations ---
const GoogleLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox: "0 0 24 24", fill: "currentColor", ...props},
    React.createElement('path', {d:"M21.54,11.23h0c0-.75-.06-1.48-.18-2.2H12v4.16h5.36c-.22,1.35-.89,2.5-1.9,3.25v2.7h3.46c2.02-1.86,3.18-4.59,3.18-7.91Z", style:{fill: '#4285f4'}}),
    React.createElement('path', {d:"M12,22c2.7,0,4.96-.89,6.62-2.41l-3.46-2.7c-.9,.6-2.05,.96-3.16,.96-2.43,0-4.48-1.64-5.21-3.84H3.27v2.79c1.53,3.03,4.64,5.1,8.73,5.1Z", style:{fill: '#34a853'}}),
    React.createElement('path', {d:"M6.79,14.01c-.18-.54-.27-1.11-.27-1.71s.09-1.17,.27-1.71V7.81H3.27c-.64,1.28-1,2.68-1,4.19s.36,2.91,1,4.19l3.52-2.79Z", style:{fill: '#fbbc05'}}),
    React.createElement('path', {d:"M12,5.78c1.46,0,2.78,.5,3.82,1.5l3.07-3.07C16.96,2.29,14.7,1,12,1,7.91,1,4.8,3.06,3.27,6.09l3.52,2.79c.73-2.2,2.78-3.84,5.21-3.84Z", style:{fill: '#ea4335'}})
);
const MetaLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", fill:"#1877F2", ...props},
    React.createElement('path', {d:"M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2c-.55,0-1,.45-1,1v2h3v3h-3v6.95c5.05-.5,9-4.76,9-9.8Z"})
);
const LinkedInLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", fill:"#0A66C2", ...props}, React.createElement('path', {d:"M19,3a2,2,0,0,1,2,2v14a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2V5A2,2,0,0,1,5,3H19m-8.5,15v-7h-2v7h2m-1-8.22c.66,0,1.2-.54,1.2-1.2s-.54-1.2-1.2-1.2-1.2,.54-1.2,1.2,.54,1.2,1.2,1.2m7.5,8.22v-4.5c0-2.21-1.28-3.07-2.75-3.07-1.22,0-1.89,.68-2.25,1.25V11h-2v7h2v-4.16c0-.83,.41-1.64,1.25-1.64s1.25,.81,1.25,1.64V18h2Z"}));
const TwitterLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", fill:"currentColor", ...props}, React.createElement('path', {d:"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"}));
const TikTokLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 28 28", ...props}, React.createElement('path', {fill:"#FF0050", d:"M22.99 11.23c-.02-1.7-.89-3.29-2.2-4.25a.86.86 0 00-.9.13L18 8.4a7.08 7.08 0 01-1.4-3.82c0-.47-.39-.85-.86-.85h-3.6c-.47 0-.86.38-.86.85v11.5a4.49 4.49 0 01-4.48 4.48A4.49 4.49 0 012 16.1a4.49 4.49 0 014.48-4.48c.38 0 .76.05 1.12.14V8.45c0-.47-.38-.85-.85-.85H3.1c-.47 0-.85.38-.85.85C2.25 15.33 7.84 22 15.14 22a7.1 7.1 0 007.1-7.1v-3.2a.86.86 0 00-.25-.67z"}), React.createElement('path', {fill:"#00F2EA", d:"M22.99 11.23c-.02-1.7-.89-3.29-2.2-4.25a.86.86 0 00-.9.13L18 8.4a7.08 7.08 0 01-1.4-3.82c0-.47-.39-.85-.86-.85h-3.6c-.47 0-.86.38-.86.85v11.5a4.49 4.49 0 01-4.48 4.48A4.49 4.49 0 012 16.1a4.49 4.49 0 014.48-4.48c.38 0 .76.05 1.12.14V8.45c0-.47-.38-.85-.85-.85H3.1c-.47 0-.85.38-.85.85C2.25 15.33 7.84 22 15.14 22a7.1 7.1 0 007.1-7.1v-3.2a.86.86 0 00-.25-.67zM19.1 14.53a4.34 4.34 0 11-8.68 0V5.1h2.75v8.78a.86.86 0 00.86.86c.47 0 .85-.38.85-.86v-8.78h2.75v9.43z"}));
const RedditLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", fill:"#FF4500", ...props}, React.createElement('path', {d:"M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2Zm0,18c-4.41,0-8-3.59-8-8s3.59-8,8-8,8,3.59,8,8-3.59,8-8,8Zm-1-12h2v2h-2v-2Zm-2,4h6v6h-6v-6Zm2,2v2h2v-2h-2Zm-4.5-2.5c.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5-1.5,.67-1.5,1.5,.67,1.5,1.5,1.5Zm9,0c.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5-1.5,.67-1.5,1.5,.67,1.5,1.5,1.5Z"}));
const SpotifyLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", fill:"#1DB954", ...props}, React.createElement('path', {d:"M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2Zm4.89,12.11c-.23,.36-.69,.49-1.05,.25-2.62-1.61-5.92-1.98-9.9-.99-.42,.1-.84-.13-.94-.55-.1-.42,.13-.84,.55-.94,4.35-1.08,8.02-.67,10.91,1.1,.37,.23,.49,.69,.27,1.05v-.02Zm-1.2-2.37c-.28,.44-.82,.58-1.26,.3-2.9-1.78-7.2-2.28-10.68-1.25-.5,.14-1.02-.16-1.15-.65s.16-1.02,.65-1.15c3.9-.94,8.71-.53,11.96,1.49,.44,.28,.58,.82,.3,1.26v-.01Zm-1.31-2.48c-3.35-2.07-8.83-2.28-12.42-1.25-.58,.16-1.19-.2-1.35-.78-.16-.58,.2-1.19,.78-1.35,4.12-1.16,10.16-.91,14.06,1.47,.52,.32,.71,.96,.39,1.48-.32,.52-.96,.71-1.48,.39h.02Z"}));
const AppleLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", fill:"currentColor", ...props}, React.createElement('path', {d:"M17.5,22c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5,2.5,1.12,2.5,2.5-1.12,2.5-2.5,2.5Zm-11-2.5c0,1.38-1.12,2.5-2.5,2.5S1.5,20.88,1.5,19.5,2.62,17,4,17s2.5,1.12,2.5,2.5Zm11.8-4.5H6.7c-.55,0-1,.45-1,1s.45,1,1,1h11.1c.55,0,1-.45,1-1s-.45-1-1-1Zm-1-4H7.2c-.55,0-1,.45-1,1s.45,1,1,1h10.6c.55,0,1-.45,1-1s-.45-1-1-1ZM19,2H5C3.34,2,2,3.34,2,5v4.1c0,.55,.45,1,1,1s1-.45,1-1V5c0-.55,.45-1,1-1H19c.55,0,1,.45,1,1v14c0,.55-.45,1-1,1h-1.1c-.55,0-1,.45-1,1s.45,1,1,1H19c1.66,0,3-1.34,3-3V5c0-1.66-1.34-3-3-3Z"}));
const PlaceholderLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", fill:"currentColor", className:"text-slate-400", ...props}, React.createElement('path', {d:"M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2Zm0,18c-4.41,0-8-3.59-8-8s3.59-8,8-8,8,3.59,8,8-3.59,8-8,8Z"}));
const ShopifyLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", fill:"#95BF47", ...props}, React.createElement('path', {d:"M19.33,11.23c-1.33-1.67-3.11-2.61-5.33-2.61s-4,0.94-5.33,2.61c-0.19,0.24-0.18,0.59,0.06,0.82c0.24,0.23,0.59,0.22,0.82-0.06 c1.12-1.4,2.56-2.18,4.45-2.18s3.33,0.78,4.45,2.18c0.14,0.17,0.35,0.24,0.55,0.24c0.1,0,0.2-0.02,0.3-0.07 C19.51,11.82,19.52,11.47,19.33,11.23z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20 c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"}));
const WebhookLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", fill:"currentColor", className:"text-slate-500", ...props}, React.createElement('path', {d: "M13.2,18.8c-0.6,0.5-1.3,0.8-2.1,0.8c-1.3,0-2.5-0.7-3.1-1.8c-0.6-1.1-0.6-2.5,0-3.6c0.6-1.1,1.7-1.8,3.1-1.8 c0.8,0,1.5,0.3,2.1,0.8l1.4-1.4c-0.9-0.8-2.1-1.3-3.5-1.3c-2,0-3.8,1-4.8,2.7c-1,1.7-1,3.8,0,5.5c1,1.7,2.8,2.7,4.8,2.7 c1.4,0,2.6-0.5,3.5-1.3L13.2,18.8z M17,5.2c-1.3,0-2.5,0.7-3.1,1.8c-0.6,1.1-0.6,2.5,0,3.6c0.6,1.1,1.7,1.8,3.1,1.8 c1.3,0,2.5-0.7,3.1-1.8c0.6-1.1,0.6-2.5,0-3.6C19.5,5.9,18.3,5.2,17,5.2z"}));
const CustomerIoLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", fill:"currentColor", className:"text-green-500", ...props}, React.createElement('path', {d:"M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M9.94,15.22L6.82,12.1l1.06-1.06l2.06,2.06l4.24-4.24l1.06,1.06L9.94,15.22z"}));
const GoogleSheetsLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", ...props}, React.createElement('path', {fill:"#1A73E8", d:"M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2h12a2,2,0,0,0,2-2V8L14,2Z"}), React.createElement('path', {fill:"#FFFFFF", d:"M13,3.5V9h5.5L13,3.5Z"}), React.createElement('path', {fill:"#188038", d:"M12,20h-1v-2h1v2Zm-3,0h-1v-2h1v2Zm6,0h-1v-2h1v2Zm-6-4h-1v-2h1v2Zm3,0h-1v-2h1v2Zm3,0h-1v-2h1v2Z"}));
const GoogleSlidesLogo = (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {viewBox:"0 0 24 24", ...props}, React.createElement('path', {fill:"#F9AB00", d:"M5,2H19a2,2,0,0,1,2,2V20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2V4A2,2,0,0,1,5,2Z"}), React.createElement('rect', {x:"7", y:"7", width:"10", height:"10", fill:"#FFFFFF"}));


// A 16x16 blue square PNG, base64 encoded.
const BLUE_SQUARE_B64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAFUlEQVR42mNkYPhfz4ABhgF5GBgAAFeAD/2KzPMAAAAASUVORK5CYII=';

// A 16x16 green square PNG, base64 encoded.
const GREEN_SQUARE_B64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAADUlEQVR42mNkYPhfz4ABhgFhLgAECgC29s2gAAAAAElFTkSuQmCC';

// A 16x16 orange square PNG, base64 encoded.
const ORANGE_SQUARE_B64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEklEQVR42mNkYPhfz4AGMIbEwAAAAV8AAnVBHngAAAAASUVORK5CYII=';

// A 16x16 purple square PNG, base64 encoded.
const PURPLE_SQUARE_B64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEElEQVR42mNkWMr4z4AGMIbEwAAAAYAA/sF/2QAAAABJRU5ErkJggg==';

// A 16x16 black square PNG, base64 encoded.
const BLACK_SQUARE_B64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEElEQVR42mNkaGD4z4AGMIbEwAAAAYAA/iUD+wAAAABJRU5ErkJggg==';

export const mockCampaigns: Campaign[] = [
  {
    id: 'meta-summer-sale',
    name: 'Summer Sale 2024',
    platform: Platform.Meta,
    status: 'Active',
    spend: 12500,
    budget: 15000,
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    impressions: 450000,
    clicks: 9000,
    roas: 4.2,
    creative: {
      text: '🌞 Summer is here! Get up to 50% off on all our new arrivals. Shop now and shine bright. Limited time offer, dont miss out! #SummerSale #Fashion',
      imageUrl: 'https://picsum.photos/seed/summer/400/200',
      base64Image: BLUE_SQUARE_B64,
    },
    comments: [
      { user: 'user123', text: 'Love this! Just bought one!' },
      { user: 'fashionista', text: 'Are other colors available?' },
      { user: 'deal_hunter', text: 'Is the 50% off on everything? The ad is a bit vague.' },
      { user: 'skeptic', text: 'Shipping is probably super expensive though.' },
    ],
  },
  {
    id: 'google-q3-leads',
    name: 'Q3 B2B Lead Gen',
    platform: Platform.Google,
    status: 'Active',
    spend: 25000,
    budget: 30000,
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    impressions: 120000,
    clicks: 6000,
    roas: 3.5,
    creative: {
      text: 'Drive your business growth. Download our free e-book on scaling SaaS solutions. Learn from industry experts. Get your copy today.',
      imageUrl: 'https://picsum.photos/seed/leadgen/400/200',
      base64Image: GREEN_SQUARE_B64,
    },
  },
  {
    id: 'linkedin-hiring',
    name: 'Senior Developer Hiring',
    platform: Platform.LinkedIn,
    status: 'Paused',
    spend: 7500,
    budget: 10000,
    startDate: '2024-05-15',
    endDate: '2024-06-15',
    impressions: 80000,
    clicks: 1200,
    roas: 1.8,
    creative: {
      text: 'Join our innovative team! We are hiring Senior Frontend Engineers to build the future of marketing tech. Apply now and make an impact. #Hiring #TechJobs #Frontend',
      imageUrl: 'https://picsum.photos/seed/hiring/400/200',
      base64Image: ORANGE_SQUARE_B64,
    },
  },
  {
    id: 'reddit-brand-awareness',
    name: 'Brand Awareness Campaign',
    platform: Platform.Reddit,
    status: 'Ended',
    spend: 5000,
    budget: 5000,
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    impressions: 1500000,
    clicks: 7500,
    roas: 2.1,
    creative: {
      text: 'We see you, Reddit. Check out our new tools for marketers. No fluff, just results. #Marketing #Tools',
      imageUrl: 'https://picsum.photos/seed/reddit/400/200',
      base64Image: BLUE_SQUARE_B64,
    },
    comments: [
      { user: 'dev_guy', text: 'Finally, a tool that gets it. Signed up.' },
      { user: 'marketing_pro', text: 'Looks interesting, but how is it different from Hubspot?' },
      { user: 'cynic_redditor', text: 'Another martech tool promising the world. Will wait for reviews.' },
    ],
  },
  {
    id: 'twitter-product-launch',
    name: 'Product Launch Event',
    platform: Platform.Twitter,
    status: 'Active',
    spend: 9800,
    budget: 12000,
    startDate: '2024-06-10',
    endDate: '2024-07-10',
    impressions: 650000,
    clicks: 13000,
    roas: 3.8,
    creative: {
      text: 'It\'s finally here! The new UCIH Pro is launching next week. Sign up for early access and exclusive discounts. #UCIHPro #MarTech',
      imageUrl: 'https://picsum.photos/seed/launch/400/200',
      base64Image: GREEN_SQUARE_B64,
    },
    comments: [
      { user: 'techie', text: 'YES! Been waiting for this. Take my money! 🚀' },
      { user: 'startup_sam', text: 'What\'s the pricing like for the Pro version?' },
      { user: 'competitor_watch', text: '@competitor check this out' },
    ],
  },
  {
    id: 'tiktok-viral-challenge',
    name: 'Viral Dance Challenge',
    platform: Platform.TikTok,
    status: 'Active',
    spend: 18000,
    budget: 25000,
    startDate: '2024-07-01',
    endDate: '2024-07-31',
    impressions: 12000000,
    clicks: 250000,
    roas: 3.1,
    creative: {
      text: 'Join the #UCIHShuffle challenge! Show us your moves and win big. 🕺💃 #DanceChallenge #Viral',
      imageUrl: 'https://picsum.photos/seed/tiktok/400/200',
      base64Image: PURPLE_SQUARE_B64,
    },
  },
  {
    id: 'apple-app-install',
    name: 'App Install Campaign',
    platform: Platform.Apple,
    status: 'Active',
    spend: 22000,
    budget: 40000,
    startDate: '2024-06-15',
    endDate: '2024-08-15',
    impressions: 800000,
    clicks: 16000,
    roas: 2.5,
    creative: {
      text: 'The #1 marketing hub, now on your iPhone. Download the UCIH app and take control of your campaigns on the go.',
      imageUrl: 'https://picsum.photos/seed/apple/400/200',
      base64Image: BLACK_SQUARE_B64,
    },
  }
];

export const mockAttributionData: Record<AttributionModel, FunnelStage[]> = {
  [AttributionModel.LastTouch]: [
    { name: 'Impressions', value: 2770000, fill: '#0ea5e9' },
    { name: 'Clicks', value: 36700, fill: '#0284c7' },
    { name: 'Site Visits', value: 35000, fill: '#0369a1' },
    { name: 'Sign Ups', value: 4200, fill: '#075985' },
    { name: 'SQLs', value: 2000, fill: '#085078' },
    { name: 'Onboarding', value: 1850, fill: '#0c4a6e' },
    { name: 'Conversions', value: 1550, fill: '#0c3a5e' },
  ],
  [AttributionModel.FirstTouch]: [
    { name: 'Impressions', value: 2770000, fill: '#8b5cf6' },
    { name: 'Clicks', value: 38900, fill: '#7c3aed' },
    { name: 'Site Visits', value: 37100, fill: '#6d28d9' },
    { name: 'Sign Ups', value: 4800, fill: '#5b21b6' },
    { name: 'SQLs', value: 2500, fill: '#521e9c' },
    { name: 'Onboarding', value: 2100, fill: '#4c1d95' },
    { name: 'Conversions', value: 1850, fill: '#411882' },
  ],
  [AttributionModel.Linear]: [
    { name: 'Impressions', value: 2770000, fill: '#16a34a' },
    { name: 'Clicks', value: 37500, fill: '#15803d' },
    { name: 'Site Visits', value: 36000, fill: '#166534' },
    { name: 'Sign Ups', value: 4450, fill: '#14532d' },
    { name: 'SQLs', value: 2200, fill: '#0f4929' },
    { name: 'Onboarding', value: 1950, fill: '#052e16' },
    { name: 'Conversions', value: 1680, fill: '#042612' },
  ],
  [AttributionModel.TimeDecay]: [
    { name: 'Impressions', value: 2770000, fill: '#f97316' },
    { name: 'Clicks', value: 37100, fill: '#ea580c' },
    { name: 'Site Visits', value: 35600, fill: '#c2410c' },
    { name: 'Sign Ups', value: 4300, fill: '#9a3412' },
    { name: 'SQLs', value: 2100, fill: '#852c0f' },
    { name: 'Onboarding', value: 1880, fill: '#7c2d12' },
    { name: 'Conversions', value: 1610, fill: '#6e2711' },
  ],
};

export const mockAudienceData: Audience[] = [
    { platform: Platform.Meta, name: 'Tech Enthusiasts (US)', size: 850000 },
    { platform: Platform.Google, name: 'B2B Decision Makers', size: 450000 },
    { platform: Platform.LinkedIn, name: 'Senior Software Engineers', size: 220000 },
    { platform: Platform.Twitter, name: 'MarTech Followers', size: 310000 },
];

export const mockOverlapData: OverlapData[] = [
    { platforms: [Platform.Meta, Platform.Twitter], overlapCount: 120000, overlapPercentage: [14.1, 38.7] },
    { platforms: [Platform.Meta, Platform.LinkedIn], overlapCount: 45000, overlapPercentage: [5.3, 20.5] },
    { platforms: [Platform.Google, Platform.LinkedIn], overlapCount: 95000, overlapPercentage: [21.1, 43.2] },
];

export const mockUsers: User[] = [
    { id: 'usr_1', name: 'Alice Johnson', email: 'alice.j@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=alice', role: 'Admin', lastActive: '2 hours ago'},
    { id: 'usr_2', name: 'Bob Williams', email: 'bob.w@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=bob', role: 'Manager', lastActive: '1 day ago'},
    { id: 'usr_3', name: 'Charlie Brown', email: 'charlie.b@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=charlie', role: 'Analyst', lastActive: '5 minutes ago'},
    { id: 'usr_4', name: 'Diana Miller', email: 'diana.m@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=diana', role: 'Viewer', lastActive: '3 weeks ago'},
];

export const mockIntegrations: Integration[] = [
    // Advertising
    { name: 'Google Ads', category: 'Advertising', logo: GoogleLogo, isConnected: true },
    { name: 'Meta Ads', category: 'Advertising', logo: MetaLogo, isConnected: true },
    { name: 'LinkedIn Ads', category: 'Advertising', logo: LinkedInLogo, isConnected: true },
    { name: 'TikTok Ads', category: 'Advertising', logo: TikTokLogo, isConnected: true },
    { name: 'Reddit Ads', category: 'Advertising', logo: RedditLogo, isConnected: true },
    { name: 'Spotify Ads', category: 'Advertising', logo: SpotifyLogo, isConnected: false },
    { name: 'Apple Search Ads', category: 'Advertising', logo: AppleLogo, isConnected: true },
    { name: 'Twitter/X Ads', category: 'Advertising', logo: TwitterLogo, isConnected: true },
    // Analytics
    { name: 'Google Analytics 4', category: 'Analytics', logo: GoogleLogo, isConnected: true },
    { name: 'Looker', category: 'Analytics', logo: PlaceholderLogo, isConnected: true },
    { name: 'Tableau', category: 'Analytics', logo: PlaceholderLogo, isConnected: false },
    // CRM
    { name: 'HubSpot', category: 'CRM', logo: PlaceholderLogo, isConnected: true },
    { name: 'Salesforce', category: 'CRM', logo: PlaceholderLogo, isConnected: false },
    // Email/SMS
    { name: 'Customer.io', category: 'Email/SMS', logo: CustomerIoLogo, isConnected: false },
    // E-commerce
    { name: 'Shopify', category: 'E-commerce', logo: ShopifyLogo, isConnected: true },
    { name: 'WooCommerce', category: 'E-commerce', logo: PlaceholderLogo, isConnected: false },
    // Automation
    { name: 'Zapier', category: 'Automation', logo: PlaceholderLogo, isConnected: true },
    { name: 'Webhook', category: 'Automation', logo: WebhookLogo, isConnected: false },
    { name: 'Google Sheets', category: 'Automation', logo: GoogleSheetsLogo, isConnected: true },
    { name: 'Google Slides', category: 'Automation', logo: GoogleSlidesLogo, isConnected: false },
];

export const mockChurnableUsers: ChurnableUser[] = [
    { id: 'usr_101', name: 'Frank Miller', email: 'frank.m@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=frank', lastSeen: '2 days ago', ltv: 1250, sessions: 88, plan: 'Pro' },
    { id: 'usr_102', name: 'Grace Lee', email: 'grace.l@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=grace', lastSeen: '28 days ago', ltv: 250, sessions: 15, plan: 'Pro' },
    { id: 'usr_103', name: 'Henry Wilson', email: 'henry.w@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=henry', lastSeen: '5 hours ago', ltv: 0, sessions: 5, plan: 'Free' },
    { id: 'usr_104', name: 'Ivy Chen', email: 'ivy.c@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=ivy', lastSeen: '45 days ago', ltv: 4500, sessions: 250, plan: 'Enterprise' },
    { id: 'usr_105', name: 'Jack Taylor', email: 'jack.t@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=jack', lastSeen: '1 day ago', ltv: 50, sessions: 4, plan: 'Pro' },
];

export const mockExperiments: Experiment[] = [
    { id: 'exp_1', name: 'Q3 Homepage CTA Test', hypothesis: 'Changing the homepage CTA from "Sign Up" to "Get Started" will increase conversion rate by 15%.', status: 'Completed', primaryKpi: 'Conversion Rate', startDate: '2024-07-01', endDate: '2024-07-15', resultSummary: 'Variant A ("Get Started") showed a 12% uplift in conversions with 98% statistical significance.', statisticalSignificance: 98, winner: 'Variant A' },
    { id: 'exp_2', name: 'Meta vs. TikTok for Top-of-Funnel', hypothesis: 'TikTok will have a lower CPC for our "Summer Sale" campaign than Meta.', status: 'Running', primaryKpi: 'ROAS', startDate: '2024-07-10', endDate: '2024-07-24' },
    { id: 'exp_3', name: 'New Checkout Flow', hypothesis: 'A one-page checkout will reduce cart abandonment.', status: 'Draft', primaryKpi: 'Conversion Rate', startDate: '2024-08-01' }
];

export const mockCohortData: CohortData[] = [
    { cohort: '2024-W25', users: 350, retention: [100, 65, 55, 48, 42, 38, 35, 31] },
    { cohort: '2024-W26', users: 410, retention: [100, 72, 63, 55, 50, 46, 41] },
    { cohort: '2024-W27', users: 380, retention: [100, 68, 59, 51, 47, 40] },
    { cohort: '2024-W28', users: 450, retention: [100, 75, 68, 61, 55] },
    { cohort: '2024-W29', users: 420, retention: [100, 71, 65, 58] },
    { cohort: '2024-W30', users: 510, retention: [100, 78, 70] },
    { cohort: '2024-W31', users: 490, retention: [100, 76] },
    { cohort: '2024-W32', users: 250, retention: [100] },
];

export const mockSegments: DynamicSegment[] = [
    { id: 'seg_1', name: 'High-Value Inactive Users', rules: [{metric: 'ltv', operator: '>', value: 500}, {metric: 'lastSeenDays', operator: '>', value: 30}], userCount: 82, syncedTo: ['HubSpot'] },
    { id: 'seg_2', name: 'New Pro Users', rules: [{metric: 'plan', operator: '=', value: 'Pro'}, {metric: 'lastSeenDays', operator: '<', value: 7}], userCount: 156, syncedTo: ['Customer.io'] },
];

export const mockWebhooks: Webhook[] = [
    { id: 'wh_1', url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX', event: 'budget_overspend', isActive: true },
    { id: 'wh_2', url: 'https://api.my-crm.com/v1/leads/new', event: 'new_lead', isActive: true },
    { id: 'wh_3', url: 'https://hooks.zapier.com/hooks/catch/12345/abcde/', event: 'churn_risk_high', isActive: false },
];

// --- Mock Data for New Features ---

// For Forecasting View
const generateHistoricalData = (base: number, volatility: number): ForecastDataPoint[] => {
    const data: ForecastDataPoint[] = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const value = base + (Math.random() - 0.5) * volatility * base;
        data.push({
            date: date.toISOString().split('T')[0],
            value: Math.max(0, Math.round(value)),
            type: 'historical',
        });
    }
    return data;
}
const generateForecastData = (base: number, trend: number, volatility: number): ForecastDataPoint[] => {
    const data: ForecastDataPoint[] = [];
    for (let i = 1; i <= 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const value = (base * (1 + trend * (i/14))) + (Math.random() - 0.5) * volatility * base;
        data.push({
            date: date.toISOString().split('T')[0],
            value: Math.max(0, Math.round(value)),
            type: 'forecasted',
        });
    }
    return data;
}

export const mockForecastData: Record<'spend' | 'roas', ForecastDataPoint[]> = {
    spend: [...generateHistoricalData(500, 0.2), ...generateForecastData(550, 0.1, 0.3)],
    roas: [...generateHistoricalData(3.5, 0.1), ...generateForecastData(3.6, 0.05, 0.15)].map(d => ({...d, value: parseFloat(d.value.toFixed(2))})),
};

export const mockAnomalies: Anomaly[] = [
    { id: 'anom_1', campaignName: 'Summer Sale 2024', date: '2024-07-28', metric: 'CTR', description: 'CTR dropped by 45% overnight, significantly below the 7-day average. Potentially creative fatigue.', severity: 'High' },
    { id: 'anom_2', campaignName: 'Q3 B2B Lead Gen', date: '2024-07-26', metric: 'Spend', description: 'Daily spend is pacing 30% faster than expected, risking budget depletion before the end of the month.', severity: 'Medium' },
    { id: 'anom_3', campaignName: 'Senior Developer Hiring', date: '2024-07-29', metric: 'CPA', description: 'CPA increased by 15% yesterday. This is a minor fluctuation but should be monitored.', severity: 'Low' },
];

export const mockMarketTrends: MarketTrend[] = [
    { title: "Rise of 'AI Marketing Tools'", summary: "Search interest for 'AI marketing tools' has surged by 25% in the last month, driven by new product launches and increased media coverage. This indicates a growing appetite for automation and intelligence in marketing stacks.", searchVolumeChange: 25, sources: [{title: "Google Trends", uri: "https://trends.google.com/"}] },
    { title: "Short-form Video Ads Gain Traction on LinkedIn", summary: "Engagement with short-form video ads on LinkedIn has increased by 15% quarter-over-quarter, suggesting a shift in content consumption habits among B2B audiences. This presents an opportunity for advertisers to repurpose content from platforms like TikTok and Meta.", searchVolumeChange: 15, sources: [{title: "Social Media Today", uri: "https://www.socialmediatoday.com/"}] },
];

export const mockCompetitorInfo: CompetitorInfo = {
    domain: 'competitor.com',
    summary: 'Competitor.com focuses heavily on performance marketing, primarily targeting B2B SaaS companies. Their main value proposition revolves around ease-of-use and integration capabilities.',
    adPlatforms: ['Google Ads', 'LinkedIn Ads', 'Capterra'],
    messagingStrategies: [
        'Highlighting "time-saving" features.',
        'Using customer testimonials in ad copy.',
        'Promoting a "free trial" offer aggressively.'
    ],
    recentOffers: ['Free 14-day trial, no credit card required.', '20% off annual plans for new customers.'],
    sources: [{title: "SEMRush", uri: "https://semrush.com"}, {title: "Meta Ad Library", uri: "https://www.facebook.com/ads/library/"}],
};