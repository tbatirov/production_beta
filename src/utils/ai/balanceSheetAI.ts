import { FinancialData } from '../types';
import { logger } from '../logger';
import { getAISettings, getOpenAIKey } from '../settings/apiSettings';

export async function analyzeTrialBalance(data: FinancialData) {
  const aiSettings = getAISettings();
  const OPENAI_API_KEY = getOpenAIKey();

  if (!aiSettings.enabled) {
    throw new Error('AI analysis is disabled. Please enable it in settings.');
  }

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const cleanedData = {
      headers: data.headers,
      rows: data.rows.map((row) => ({
        ...row
      }))
    };

    logger.info('[Balance Sheet AI] Starting trial balance analysis with OpenAI', cleanedData);

    const BALANCE_SHEET_PROMPT = `Analyze the trial balance data and generate financial statements following UzNAS account code standards:

1. Balance Sheet Account Codes:
   Assets (0000-4999):
   - Fixed Assets (0000-0999)
   - Long-term Investments (1000-1999)
   - Inventory (2000-2999)
   - Cash & Equivalents (3000-3999)
   - Receivables (4000-4999)

   Liabilities (6000-6999):
   - Current Liabilities (6000-6799)
   - Long-term Liabilities (6800-6899)

   Equity (5000-5999):
   - Charter Capital (5000-5099)
   - Legal Reserve (5100-5199)
   - Retained Earnings (5300-5399)

2. Income Statement Account Codes:
   Revenue (7000-7999):
   - Sales Revenue (7100-7199)
   - Service Revenue (7200-7299)
   - Other Revenue (7300-7999)

   Expenses (8000-8999):
   - Cost of Goods Sold (8000-8099)
   - Operating Expenses (8100-8499)
   - Other Expenses (8500-8999)

3. Accounting Rules:
   - Assets and Expenses are debit-normal
   - Liabilities, Equity, and Revenue are credit-normal
   - Assets = Liabilities + Equity
   - Net Income = Revenue - Expenses

Return JSON in this exact format:
{
  "balanceSheet": {
    "date": "ISO date string",
    "sections": {
      "assets": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      },
      "liabilities": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      },
      "equity": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      }
    }
  },
  "incomeStatement": {
    "date": "ISO date string",
    "sections": {
      "revenue": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      },
      "expenses": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      }
    },
    "total": number
  }
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: aiSettings.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analysis AI. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'system',
            content: BALANCE_SHEET_PROMPT,
          },
          {
            role: 'user',
            content: `Analyze this trial balance data and return ONLY a JSON response: ${JSON.stringify(cleanedData)}`,
          },
        ],
        temperature: 0,
        response_format: { type: 'json_object' },
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from OpenAI API');
    }

    const parsedResult = JSON.parse(content);
    logger.info('Trial balance analysis completed successfully', parsedResult);
    return parsedResult;

  } catch (error) {
    logger.error('Error analyzing trial balance:', error);
    throw error;
  }
}