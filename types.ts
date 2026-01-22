export interface SipInputs {
  monthlyInvestment: number;
  expectedReturn: number;
  timePeriod: number;
}

export interface SipResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
}

export interface YearlyBreakdown {
  year: number;
  invested: number;
  value: number;
}

export interface InsightRequest {
  inputs: SipInputs;
  results: SipResult;
}
