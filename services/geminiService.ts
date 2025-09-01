
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { AIAnalysisResult, Campaign, SentimentAnalysisResult, BudgetSimulationResult, GrowthOpportunity, ChurnableUser, ChurnPredictionResult, AdCreativeBrief, GeneratedAdCreative, ForecastDataPoint, Anomaly, CompetitorInfo, MarketTrend } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    headlineFeedback: {
      type: Type.STRING,
      description: 'Constructive feedback on the ad headline. Max 2 sentences.',
    },
    bodyCopyFeedback: {
      type: Type.STRING,
      description: 'Constructive feedback on the ad body copy. Max 3 sentences.',
    },
    visualFeedback: {
      type: Type.STRING,
      description: 'Feedback on the provided image and how it complements the text. Max 3 sentences.',
    },
    engagementPrediction: {
      type: Type.STRING,
      enum: ['Low', 'Medium', 'High'],
      description: 'A prediction of the likely user engagement level.',
    },
    complianceScore: {
      type: Type.NUMBER,
      description: 'A score from 0 to 100 indicating the likelihood of compliance with typical ad platform policies (e.g., Meta, Google). 100 is fully compliant.',
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: 'A list of 3 concrete, actionable suggestions for improving the ad creative.',
    },
  },
  required: ['headlineFeedback', 'bodyCopyFeedback', 'visualFeedback', 'engagementPrediction', 'complianceScore', 'suggestions'],
};

const sentimentSchema = {
  type: Type.OBJECT,
  properties: {
    positive: { type: Type.NUMBER, description: 'Number of comments with positive sentiment.' },
    neutral: { type: Type.NUMBER, description: 'Number of comments with neutral sentiment.' },
    negative: { type: Type.NUMBER, description: 'Number of comments with negative sentiment.' },
    summary: { type: Type.STRING, description: 'A 2-sentence summary of the overall sentiment and key topics.' },
  },
  required: ['positive', 'neutral', 'negative', 'summary'],
};

const budgetSimulationSchema = {
  type: Type.OBJECT,
  properties: {
    predictedImpressions: { type: Type.NUMBER, description: 'The predicted number of impressions for the new budget.' },
    predictedClicks: { type: Type.NUMBER, description: 'The predicted number of clicks for the new budget.' },
    predictedRoas: { type: Type.NUMBER, description: 'The predicted ROAS (Return On Ad Spend) for the new budget.' },
  },
  required: ['predictedImpressions', 'predictedClicks', 'predictedRoas'],
};

const insightsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            insight: { type: Type.STRING, description: 'A single, actionable insight about campaign performance, budget, or strategy.'},
            priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: 'The priority level of the insight.'}
        },
        required: ['insight', 'priority'],
    }
};

const growthOpportunitySchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'A catchy, descriptive title for the growth opportunity.' },
            description: { type: Type.STRING, description: 'A detailed explanation of the opportunity, including the "why". Max 3 sentences.' },
            potentialImpact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: 'The estimated potential impact on KPIs like ROAS, Clicks, or Revenue.' },
            suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of concrete, actionable next steps to seize this opportunity.' },
            relevantCampaigns: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of campaign IDs that are relevant to this opportunity.' },
        },
        required: ['title', 'description', 'potentialImpact', 'suggestedActions', 'relevantCampaigns'],
    }
};

const churnPredictionSchema = {
    type: Type.OBJECT,
    properties: {
        churnProbability: { type: Type.NUMBER, description: "A float value from 0 (will not churn) to 1 (will definitely churn)." },
        riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Very High'], description: "A categorical assessment of the churn risk." },
        keyFactors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 key factors influencing the prediction (e.g., 'low session count', 'high days since last seen')." },
        suggestedAction: { type: Type.STRING, description: "A single, concrete action to take to mitigate the churn risk (e.g., 'Send a re-engagement email with a special offer.')." }
    },
    required: ['churnProbability', 'riskLevel', 'keyFactors', 'suggestedAction']
};

const adCreativeSchema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING, description: 'A catchy, high-impact headline (max 40 characters).' },
    body: { type: Type.STRING, description: 'Compelling body copy (max 125 characters).' },
    cta: { type: Type.STRING, description: 'A strong call-to-action (e.g., "Shop Now", "Learn More").' },
    imagePrompt: { type: Type.STRING, description: 'A detailed, descriptive prompt for an AI image generator to create a relevant visual. Describe the scene, subjects, style, and colors.' },
  },
  required: ['headline', 'body', 'cta', 'imagePrompt'],
};

const forecastSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            date: { type: Type.STRING, description: 'The date in YYYY-MM-DD format.' },
            value: { type: Type.NUMBER, description: 'The forecasted value for that date.' },
        },
        required: ['date', 'value'],
    }
};

const anomalySchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: 'A unique identifier for the anomaly, e.g., anom_1.' },
            campaignName: { type: Type.STRING, description: 'The name of the campaign with the anomaly.' },
            date: { type: Type.STRING, description: 'The date the anomaly was detected in YYYY-MM-DD format.' },
            metric: { type: Type.STRING, enum: ['CPA', 'CTR', 'Spend'], description: 'The metric that showed anomalous behavior.' },
            description: { type: Type.STRING, description: 'A 1-2 sentence explanation of the anomaly and its potential cause.' },
            severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: 'The severity of the anomaly.' },
        },
        required: ['id', 'campaignName', 'date', 'metric', 'description', 'severity'],
    }
};


export const critiqueCreative = async (
  adText: string,
  imageBase64: string
): Promise<AIAnalysisResult> => {
    
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: imageBase64,
    },
  };

  const textPart = {
    text: `Analyze the following ad creative. Ad copy is provided below:
    ---
    ${adText}
    ---
    The ad visual is the provided image. Provide a detailed critique based on the required JSON schema.
    `,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AIAnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI. Please check the console for details.");
  }
};

export const analyzeSentiment = async (comments: string[]): Promise<SentimentAnalysisResult> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");
    
    const prompt = `Analyze the sentiment of the following social media comments. Classify each as positive, neutral, or negative and provide a total count for each category. Also, provide a brief summary of the overall sentiment and topics.
    Comments:
    ---
    ${comments.map(c => `- ${c}`).join('\n')}
    ---
    Respond with JSON based on the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: sentimentSchema,
                temperature: 0.1,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SentimentAnalysisResult;
    } catch (error) {
        console.error("Error calling Gemini API for sentiment analysis:", error);
        throw new Error("Failed to get sentiment analysis from AI.");
    }
};

export const simulateBudget = async (campaign: Campaign, newBudget: number): Promise<BudgetSimulationResult> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");

    const prompt = `Given the following campaign data, predict the performance if the budget is changed.
    Current Campaign Data:
    - Platform: ${campaign.platform}
    - Name: ${campaign.name}
    - Current Spend: ${campaign.spend}
    - Current Impressions: ${campaign.impressions}
    - Current Clicks: ${campaign.clicks}
    - Current ROAS: ${campaign.roas}

    New Proposed Budget: ${newBudget}

    Based on typical ad platform performance curves (diminishing returns at higher spend), predict the new number of impressions, clicks, and the new ROAS. The platform is ${campaign.platform}, which should influence your prediction (e.g., LinkedIn CPC is higher than Meta). Be realistic. Respond with JSON based on the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: budgetSimulationSchema,
                temperature: 0.5,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as BudgetSimulationResult;
    } catch (error) {
        console.error("Error calling Gemini API for budget simulation:", error);
        throw new Error("Failed to get budget simulation from AI.");
    }
};

export const getDashboardInsights = async (campaigns: Campaign[]): Promise<{insight: string, priority: 'High' | 'Medium' | 'Low'}[]> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");
    
    const campaignDataString = campaigns.map(c => 
        `- ${c.name} (${c.platform}): Spend €${c.spend}, Clicks ${c.clicks}, ROAS ${c.roas}x, Status ${c.status}`
    ).join('\n');

    const prompt = `As a marketing analyst AI, review the following campaign data. Identify the top 3-4 most critical insights. Focus on performance outliers (good and bad), budget allocation opportunities, and potential risks. For each insight, provide a priority level.
    
    Campaign Data:
    ---
    ${campaignDataString}
    ---
    Provide a JSON array of insight objects based on the provided schema. Be concise and actionable.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: insightsSchema,
                temperature: 0.4,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API for dashboard insights:", error);
        throw new Error("Failed to get dashboard insights from AI.");
    }
};

export const findGrowthOpportunities = async (campaigns: Campaign[]): Promise<GrowthOpportunity[]> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");

    const campaignDataString = campaigns.map(c => 
        `- ID ${c.id}: ${c.name} (${c.platform}), Spend €${c.spend}/${c.budget}, Clicks ${c.clicks}, ROAS ${c.roas}x`
    ).join('\n');

    const prompt = `As a growth marketing expert AI, analyze the following portfolio of digital ad campaigns. Your goal is to identify 3-4 significant growth opportunities.
    
    Consider these areas:
    1.  **High-Performers:** Identify campaigns with excellent ROAS or engagement that could be scaled up.
    2.  **Underutilized Channels:** Is there a platform with good results but low budget allocation?
    3.  **Cross-Sell/Upsell:** Based on campaign themes, are there opportunities to market other products to successful audiences?
    4.  **Creative Insights:** Are there patterns in high-performing creatives that can be replicated?

    Here is the campaign data:
    ---
    ${campaignDataString}
    ---

    Provide a JSON array of growth opportunity objects based on the provided schema. Be specific and actionable.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: growthOpportunitySchema,
                temperature: 0.5,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as GrowthOpportunity[];
    } catch (error) {
        console.error("Error calling Gemini API for growth opportunities:", error);
        throw new Error("Failed to get growth opportunities from AI.");
    }
};

export const predictChurn = async (user: ChurnableUser): Promise<ChurnPredictionResult> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");

    const prompt = `Analyze the following user's data to predict their churn risk.
    User Data:
    - Plan: ${user.plan}
    - Lifetime Value (LTV): €${user.ltv}
    - Total Sessions: ${user.sessions}
    - Last Seen: ${user.lastSeen}
    
    Based on this data, evaluate the likelihood of the user churning. A user with low LTV, few sessions, and a long time since last seen is at high risk. A user with high LTV and recent activity is low risk. Provide a churn probability, a risk level, key influencing factors, and a concrete suggested action to retain the user. Respond with JSON based on the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: churnPredictionSchema,
                temperature: 0.4,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ChurnPredictionResult;
    } catch (error) {
        console.error("Error calling Gemini API for churn prediction:", error);
        throw new Error("Failed to get churn prediction from AI.");
    }
}

export const generateAdCopy = async (brief: AdCreativeBrief): Promise<GeneratedAdCreative> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");

    const prompt = `You are an expert ad copywriter. Based on the following brief, generate compelling ad copy optimized for the specified platform.

    **Product/Service:** ${brief.product}
    **Target Audience:** ${brief.targetAudience}
    **Key Features/Benefits:** ${brief.keyFeatures}
    **Tone of Voice:** ${brief.toneOfVoice}
    **Platform:** ${brief.platform}

    Generate a headline, body copy, a call-to-action, and a detailed image prompt according to the JSON schema.
    The copy must be concise and impactful, suitable for the specified platform's constraints and audience expectations.
    The image prompt must be descriptive enough for an AI image model to generate a high-quality, relevant visual.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: adCreativeSchema,
                temperature: 0.7,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as GeneratedAdCreative;
    } catch (error) {
        console.error("Error calling Gemini API for ad copy generation:", error);
        throw new Error("Failed to generate ad copy from AI.");
    }
};

export const generateAdImage = async (prompt: string): Promise<string> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("Image generation returned no images.");
        }
    } catch (error) {
        console.error("Error calling Gemini API for image generation:", error);
        throw new Error("Failed to generate image from AI.");
    }
};

export const forecastKpis = async (historicalData: {date: string; value: number}[], kpiName: string, forecastDays: number): Promise<{date: string, value: number}[]> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");
    
    const dataString = historicalData.map(d => `${d.date}: ${d.value}`).join('\n');

    const prompt = `You are a time-series forecasting specialist. Given the following historical data for the "${kpiName}" KPI, forecast the values for the next ${forecastDays} days.
    
    Historical Data (last ${historicalData.length} days):
    ---
    ${dataString}
    ---
    
    Analyze the trend and seasonality from the data and provide a realistic forecast. Return the data as a JSON array according to the schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: forecastSchema,
                temperature: 0.3,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API for forecasting:", error);
        throw new Error("Failed to get forecast from AI.");
    }
};

export const detectAnomalies = async (campaigns: Campaign[]): Promise<Anomaly[]> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");

    // This is a simplified example; a real-world scenario would use more detailed daily data.
    const promptData = campaigns.map(c => 
        `Campaign "${c.name}" has ROAS ${c.roas} and spend ${c.spend}. A normal ROAS is between 2.5 and 5.0.`
    ).join('\n');

    const prompt = `You are a data anomaly detection expert. Analyze the following campaign snapshots. Identify any campaigns whose metrics seem anomalous (e.g., extremely high/low ROAS, sudden drops). For each anomaly, describe the issue and assign a severity.
    
    Data:
    ---
    ${promptData}
    ---
    
    Return a JSON array of anomalies based on the schema. If there are no anomalies, return an empty array.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: anomalySchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API for anomaly detection:", error);
        throw new Error("Failed to detect anomalies.");
    }
};

export const analyzeCompetitor = async (domain: string): Promise<CompetitorInfo> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");

    const prompt = `Provide a competitive analysis of the website "${domain}". I need to understand their advertising strategy.
    
    Specifically, tell me:
    1. A brief summary of the company.
    2. What ad platforms they likely use.
    3. What their core messaging strategies and value propositions are in their ads.
    4. Any recent special offers or promotions they are running.
    
    Use Google Search to find this information. Base your answer only on verifiable sources.
    `;

    try {
        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: prompt,
           config: {
             tools: [{googleSearch: {}}],
           },
        });

        // The model output for this is not guaranteed to be JSON, so we will parse the text.
        const text = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
            title: chunk.web?.title || 'Untitled',
            uri: chunk.web?.uri || '#',
        })) || [];
        
        // Basic text parsing to structure the output.
        const summary = text.match(/summary:(.*?)(ad platforms:|messaging strategies:)/is)?.[1].trim() ?? 'No summary available.';
        const adPlatforms = text.match(/ad platforms:(.*?)(messaging strategies:|recent offers:)/is)?.[1].trim().split('\n').map(s => s.replace(/^- /, '')) ?? [];
        const messagingStrategies = text.match(/messaging strategies:(.*?)(recent offers:)/is)?.[1].trim().split('\n').map(s => s.replace(/^- /, '')) ?? [];
        const recentOffers = text.match(/recent offers:(.*)/is)?.[1].trim().split('\n').map(s => s.replace(/^- /, '')) ?? [];
        
        return { domain, summary, adPlatforms, messagingStrategies, recentOffers, sources };
    } catch (error) {
        console.error("Error calling Gemini API for competitor analysis:", error);
        throw new Error("Failed to analyze competitor.");
    }
};

export const getMarketTrends = async (industry: string): Promise<MarketTrend[]> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");

    const prompt = `Identify 2-3 current, major marketing trends for the "${industry}" industry. For each trend, provide a title, a short summary of why it's important, and an estimated change in search volume or interest if available.
    
    Use Google Search to find recent articles, reports, and data. Base your answer only on verifiable sources.
    `;

    try {
        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: prompt,
           config: {
             tools: [{googleSearch: {}}],
           },
        });
        
        const text = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
            title: chunk.web?.title || 'Untitled',
            uri: chunk.web?.uri || '#',
        })) || [];
        
        // Basic parsing of a text list into structured objects.
        const trends: MarketTrend[] = text.split(/\d\.\s+/).slice(1).map(trendBlock => {
            const titleMatch = trendBlock.match(/^(.*?):/);
            const title = titleMatch ? titleMatch[1].trim() : 'Untitled Trend';
            const summary = trendBlock.replace(titleMatch?.[0] || '', '').trim();
            return {
                title,
                summary,
                searchVolumeChange: parseInt(summary.match(/(\d+)%/)?.[1] || '0', 10),
                sources: [], // Sources are global for this response
            };
        });

        // Add all sources to each trend for simplicity in this example
        trends.forEach(trend => trend.sources = sources);

        return trends;

    } catch (error) {
        console.error("Error calling Gemini API for market trends:", error);
        throw new Error("Failed to get market trends.");
    }
};


export const createChatWithContext = (campaigns: Campaign[]): Chat => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");

    const simplifiedCampaigns = campaigns.map(c => ({
        id: c.id,
        name: c.name,
        platform: c.platform,
        status: c.status,
        spend: c.spend,
        impressions: c.impressions,
        clicks: c.clicks,
        roas: c.roas,
        comments: c.comments?.length
    }));

    const campaignDataString = JSON.stringify(simplifiedCampaigns, null, 2);

    const systemInstruction = `You are UCIH AI Assistant, an expert marketing data analyst.
You will answer user questions based on the marketing campaign data provided below in JSON format.
Your tone should be friendly, insightful, and professional.
Keep your answers concise and to the point.
When mentioning currency, use Euros (€) and format numbers appropriately (e.g., €1,250.50).
When mentioning large numbers, use commas as thousands separators (e.g., 1,500,000).

Here is the campaign data:
---
${campaignDataString}
---

Do not mention that you are an AI or that you were given data in JSON format unless the user asks specifically about it. Just answer their questions naturally as if you are their human analyst colleague.`;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.4,
        }
    });

    return chat;
}
