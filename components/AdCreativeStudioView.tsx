
import React, { useState } from 'react';
import { AdCreativeBrief, GeneratedAdCreative, Platform } from '../types';
import { generateAdCopy, generateAdImage } from '../services/geminiService';

const AdCreativeStudioView: React.FC = () => {
    const [brief, setBrief] = useState<AdCreativeBrief>({
        product: '',
        targetAudience: '',
        keyFeatures: '',
        toneOfVoice: 'Casual',
        platform: Platform.Meta
    });
    const [creative, setCreative] = useState<GeneratedAdCreative | null>(null);
    const [isCopyLoading, setIsCopyLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBriefChange = (field: keyof AdCreativeBrief, value: string) => {
        setBrief(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerateCopy = async () => {
        setIsCopyLoading(true);
        setIsImageLoading(false);
        setError(null);
        setCreative(null);
        try {
            const result = await generateAdCopy(brief);
            setCreative(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while generating copy.");
        } finally {
            setIsCopyLoading(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!creative?.imagePrompt) return;
        setIsImageLoading(true);
        setError(null);
        try {
            const imageB64 = await generateAdImage(creative.imagePrompt);
            setCreative(prev => prev ? { ...prev, base64Image: imageB64 } : null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while generating the image.");
        } finally {
            setIsImageLoading(false);
        }
    };

    const isFormValid = brief.product && brief.targetAudience && brief.keyFeatures;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Generative Ad Creative Studio</h1>
            <p className="text-slate-600 mb-8">Move from analysis to creation. Generate complete ad creatives with AI.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Brief Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">1. Create Your Brief</h2>
                    <div className="space-y-4">
                        <FormRow label="Product / Service Name">
                            <input type="text" value={brief.product} onChange={e => handleBriefChange('product', e.target.value)} placeholder="e.g., QuantumLeap CRM" className="w-full p-2 border border-slate-300 rounded-lg"/>
                        </FormRow>
                        <FormRow label="Target Audience">
                            <input type="text" value={brief.targetAudience} onChange={e => handleBriefChange('targetAudience', e.target.value)} placeholder="e.g., Marketing managers at B2B tech startups" className="w-full p-2 border border-slate-300 rounded-lg"/>
                        </FormRow>
                        <FormRow label="Key Features / Benefits">
                            <textarea value={brief.keyFeatures} onChange={e => handleBriefChange('keyFeatures', e.target.value)} rows={3} placeholder="e.g., AI-powered insights, automated reporting, seamless integrations" className="w-full p-2 border border-slate-300 rounded-lg"/>
                        </FormRow>
                        <FormRow label="Tone of Voice">
                           <select value={brief.toneOfVoice} onChange={e => handleBriefChange('toneOfVoice', e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg">
                               <option>Casual</option><option>Professional</option><option>Witty</option><option>Bold</option>
                           </select>
                        </FormRow>
                        <FormRow label="Platform">
                           <select value={brief.platform} onChange={e => handleBriefChange('platform', e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg">
                               {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                           </select>
                        </FormRow>
                        <button onClick={handleGenerateCopy} disabled={!isFormValid || isCopyLoading} className="w-full bg-brand-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center">
                            {isCopyLoading ? <><SpinnerIcon /> Generating Copy...</> : '📝 Generate Ad Copy'}
                        </button>
                    </div>
                </div>

                {/* Creative Output */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">2. AI-Generated Creative</h2>
                    {error && <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg mb-4">{error}</div>}
                    
                    {!creative && !isCopyLoading && (
                        <div className="flex items-center justify-center h-full text-center text-slate-400">
                            <p>Your generated creative will appear here.</p>
                        </div>
                    )}

                    {isCopyLoading && (
                         <div className="flex items-center justify-center h-full text-center text-slate-400">
                             <SpinnerIcon isBlue/>
                         </div>
                    )}

                    {creative && (
                        <div className="space-y-6 animate-fade-in">
                           <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                                <h3 className="font-bold text-lg text-slate-800">{creative.headline}</h3>
                                <p className="text-slate-600 mt-2">{creative.body}</p>
                                <p className="mt-4 font-semibold text-brand-blue-600">{creative.cta}</p>
                           </div>

                            <div className="relative aspect-video bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                               {isImageLoading && <SpinnerIcon isBlue/>}
                               {creative.base64Image && !isImageLoading && <img src={`data:image/jpeg;base64,${creative.base64Image}`} alt="Generated ad creative" className="w-full h-full object-cover rounded-lg"/>}
                               {!isImageLoading && !creative.base64Image && <p className="text-slate-500 p-4 text-center">Ready to generate visual</p>}
                           </div>

                           <button onClick={handleGenerateImage} disabled={isImageLoading || !creative.imagePrompt} className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center">
                                {isImageLoading ? <><SpinnerIcon /> Generating Image...</> : '🎨 Generate Image'}
                           </button>

                           <div className="text-xs text-slate-400 italic">
                               <p className="font-semibold text-slate-500">Image Prompt:</p>
                               <p>"{creative.imagePrompt}"</p>
                           </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {children}
    </div>
);

const SpinnerIcon: React.FC<{isBlue?: boolean}> = ({ isBlue = false }) => <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 ${isBlue ? 'text-brand-blue-600' : 'text-white'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default AdCreativeStudioView;
