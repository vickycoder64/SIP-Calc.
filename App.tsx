import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, TrendingUp, Sparkles, Smartphone, Github, Loader2 } from 'lucide-react';
import { InputSlider } from './components/InputSlider';
import { ResultsCard } from './components/ResultsCard';
import { Charts } from './components/Charts';
import { GitHubWorkflowModal } from './components/GitHubWorkflowModal';
import { generateFinancialInsights } from './services/geminiService';
import { SipInputs, SipResult, YearlyBreakdown } from './types';

const App: React.FC = () => {
  // State
  const [inputs, setInputs] = useState<SipInputs>({
    monthlyInvestment: 5000,
    expectedReturn: 12,
    timePeriod: 10,
  });

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);

  // Calculations
  const calculateSip = useMemo(() => {
    const P = inputs.monthlyInvestment;
    const i = inputs.expectedReturn / 12 / 100; // Monthly interest rate
    const n = inputs.timePeriod * 12; // Total months

    // SIP Formula: M = P * ({[1 + i]^n - 1} / i) * (1 + i)
    const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const investedAmount = P * n;
    const estimatedReturns = totalValue - investedAmount;

    return {
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue),
    } as SipResult;
  }, [inputs]);

  const yearlyBreakdown = useMemo(() => {
    const data: YearlyBreakdown[] = [];
    const P = inputs.monthlyInvestment;
    const i = inputs.expectedReturn / 12 / 100;

    for (let year = 1; year <= inputs.timePeriod; year++) {
      const n = year * 12;
      const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const invested = P * n;
      data.push({
        year,
        invested: Math.round(invested),
        value: Math.round(totalValue),
      });
    }
    return data;
  }, [inputs]);

  // Handlers
  const handleInputChange = (key: keyof SipInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    // Reset AI insight when inputs change significantly to encourage refreshing, 
    // but maybe keep it for minor tweaks. For now, clear it to keep context fresh.
    if (Math.abs(value - inputs[key]) > (key === 'expectedReturn' ? 1 : 100)) {
        setAiInsight(null);
    }
  };

  const fetchInsights = async () => {
    setLoadingAi(true);
    const insight = await generateFinancialInsights({
      inputs,
      results: calculateSip
    });
    setAiInsight(insight);
    setLoadingAi(false);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Smart SIP</h1>
          </div>
          <button 
            onClick={() => setShowWorkflowModal(true)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">Export Config</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-800">Plan Investment</h2>
              </div>
              
              <InputSlider
                label="Monthly Investment"
                value={inputs.monthlyInvestment}
                min={500}
                max={100000}
                step={500}
                unit="₹"
                onChange={(val) => handleInputChange('monthlyInvestment', val)}
              />
              
              <InputSlider
                label="Expected Return Rate (p.a)"
                value={inputs.expectedReturn}
                min={1}
                max={30}
                step={0.5}
                unit="%"
                onChange={(val) => handleInputChange('expectedReturn', val)}
              />
              
              <InputSlider
                label="Time Period"
                value={inputs.timePeriod}
                min={1}
                max={40}
                step={1}
                unit="Yr"
                onChange={(val) => handleInputChange('timePeriod', val)}
              />
            </div>

            {/* AI Insights Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <h3 className="font-bold text-lg">AI Financial Advisor</h3>
                </div>
                
                {!aiInsight ? (
                  <div className="text-indigo-100 text-sm">
                    <p className="mb-4">Get personalized insights about your investment plan powered by Gemini models.</p>
                    <button 
                      onClick={fetchInsights}
                      disabled={loadingAi}
                      className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze Plan'}
                    </button>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-500">
                    <div className="prose prose-invert prose-sm text-indigo-50 leading-relaxed mb-4">
                      {aiInsight.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>
                    <button 
                      onClick={fetchInsights}
                      className="text-xs text-indigo-200 hover:text-white underline decoration-dashed underline-offset-4"
                    >
                      Refresh Analysis
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Results & Charts */}
          <div className="lg:col-span-8">
            <ResultsCard results={calculateSip} />
            <Charts results={calculateSip} yearlyData={yearlyBreakdown} />
            
            {/* Disclaimer */}
            <p className="text-xs text-gray-400 mt-8 text-center max-w-2xl mx-auto">
              Disclaimer: The calculated results are approximate and for illustration purposes only. 
              Returns are not guaranteed and are subject to market risks. Please consult a financial advisor before investing.
            </p>
          </div>
        </div>
      </main>

      {/* Workflow Modal */}
      <GitHubWorkflowModal 
        isOpen={showWorkflowModal} 
        onClose={() => setShowWorkflowModal(false)} 
      />
    </div>
  );
};

export default App;