import { FinancialData } from '../types';
import { logger } from '../logger';
import { getAISettings, getOpenAIKey } from '../settings/apiSettings';
import i18n from '../i18n';


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
        ...row,
      })),
    };

    logger.info(
      '[Trial Balance AI] Starting trial balance analysis with OpenAI',
      cleanedData
    );

    const TRIAL_BALANCE_PROMPT = `Analyze the trial balance data and return a JSON object with this exact structure in "${i18n.language}" language:
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
}

Follow these rules:
1. Balance Sheet accounts:
   - Assets (0000-4999)
   - Liabilities (6000-6999)
   - Equity (5000-5999)

2. Income Statement accounts:
   - Revenue (7000-7999)
   - Expenses (8000-8999)

3. Accounting rules:
   - Assets and Expenses are debit-normal
   - Liabilities, Equity, and Revenue are credit-normal
   - Assets = Liabilities + Equity
   - Net Income = Revenue - Expenses

4. Secondary validation using account labels:
   - Asset terms: "cash", "inventory", "receivable", "equipment", "property"
   - Liability terms: "payable", "loan", "debt", "accrued"
   - Equity terms: "capital", "retained", "reserve", "surplus"
   - Revenue terms: "sales", "income", "revenue", "service"
   - Expense terms: "cost", "expense", "salary", "rent", "utilities"

5. Group accumulated depreciation with parent assets:
   - Match depreciation accounts with their related assets
   - Show as a reduction under the parent asset
   - Calculate net book value (asset cost - accumulated depreciation)`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a financial analysis AI. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'system',
            content: TRIAL_BALANCE_PROMPT,
          },
          {
            role: 'user',
            content: `Analyze this trial balance data and return ONLY a JSON response: ${JSON.stringify(
              cleanedData
            )}`,
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
