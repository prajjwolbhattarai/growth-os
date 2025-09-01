
import React from 'react';
import { Audience, OverlapData, Platform } from '../types';
import Card from './ui/Card';

interface AudienceOverlapViewProps {
  audiences: Audience[];
  overlaps: OverlapData[];
}

const platformColors: Record<Platform, string> = {
  [Platform.Google]: 'bg-red-500',
  [Platform.Meta]: 'bg-blue-600',
  [Platform.LinkedIn]: 'bg-sky-700',
  [Platform.Twitter]: 'bg-slate-800',
  [Platform.Reddit]: 'bg-orange-500',
  [Platform.Spotify]: 'bg-green-500',
  [Platform.TikTok]: 'bg-purple-500',
  [Platform.Apple]: 'bg-black',
};

const AudienceOverlapView: React.FC<AudienceOverlapViewProps> = ({ audiences, overlaps }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Audience Overlap</h1>
      <p className="text-slate-600 mb-8">Identify wasted ad spend by finding audience overlap across platforms.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Your Audiences</h2>
            {audiences.map(audience => (
                <div key={audience.name} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200/75 flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${platformColors[audience.platform]}`}></div>
                    <div>
                        <p className="font-semibold text-slate-800">{audience.name}</p>
                        <p className="text-sm text-slate-500">{audience.platform}: {audience.size.toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Overlap Analysis</h2>
            <div className="space-y-6">
                {overlaps.map((overlap, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">{overlap.platforms[0]} vs. {overlap.platforms[1]}</h3>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Visualization */}
                            <div className="relative w-48 h-32 flex-shrink-0">
                                <div className={`absolute top-0 left-0 w-32 h-32 ${platformColors[overlap.platforms[0]]} rounded-full opacity-60`}></div>
                                <div className={`absolute top-0 right-0 w-32 h-32 ${platformColors[overlap.platforms[1]]} rounded-full opacity-60`}></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-white font-bold text-xl">{overlap.overlapCount.toLocaleString()}</p>
                                        <p className="text-white text-xs font-medium">Overlap</p>
                                    </div>
                                </div>
                            </div>
                            {/* Stats */}
                            <div className="flex-1 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-slate-800">{overlap.overlapPercentage[0]}%</p>
                                    <p className="text-sm text-slate-500">of {overlap.platforms[0].replace(' Ads', '')}</p>
                                </div>
                                 <div>
                                    <p className="text-2xl font-bold text-slate-800">{overlap.overlapPercentage[1]}%</p>
                                    <p className="text-sm text-slate-500">of {overlap.platforms[1].replace('/X Ads', '')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceOverlapView;
