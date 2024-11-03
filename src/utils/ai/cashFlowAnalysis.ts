import { FinancialData } from '../types';
import { logger } from '../logger';
import { getAISettings, getOpenAIKey } from '../settings/apiSettings';

export async function analyzeCashFlow(data: FinancialData) {
  const aiSettings = getAISettings();
  const OPENAI_API_KEY = getOpenAIKey();

  if (!aiSettings.enabled) {
    throw new Error('AI analysis is disabled. Please enable it in settings.');
  }

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const CASH_FLOW_PROMPT = `Analyze the transaction data and return a JSON object with this exact structure:
{
  "cashFlow": {
    "date": "ISO date string",
    "sections": {
      "operating": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      },
      "investing": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      },
      "financing": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      }
    },
    "total": number,
    "beginningCash": number,
    "endingCash": number
  }
}

Follow these rules:
1. Primary categorization by account code:
   - Operating Activities (4000-4999, 6000-6799, 7000-8999)
   - Investing Activities (0000-1999)
   - Financing Activities (5000-5999, 6800-6899)

2. Cash Accounts:
   - Cash on hand (3010)
   - Cash in bank - UZS (3110)
   - Cash in bank - USD (3120)

3. Secondary validation of transaction descriptions:
   Operating terms:
   - "sales", "payment", "salary", "rent", "inventory"
   - "operating", "revenue", "expense", "utilities"
   
   Investing terms:
   - "equipment", "property", "investment", "acquisition"
   - "purchase", "sale of asset", "disposal"
   
   Financing terms:
   - "loan", "dividend", "capital", "share"
   - "borrowing", "repayment", "equity"

4. Cash flow rules:
   - Cash account debits = Cash inflow (+)
   - Cash account credits = Cash outflow (-)
   - Categorize based on non-cash account codes
   - Calculate net cash flow for each category`;

  try {
    const cleanedData = {
      headers: data.headers,
      rows: data.rows.map((row) => ({
        ...row
      })),
    };

    logger.info(
      '[CashflowAnalysis] Starting cash flow analysis with OpenAI',
      cleanedData
    );

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: aiSettings.model || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a financial analysis AI. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'system',
            content: CASH_FLOW_PROMPT,
          },
          {
            role: 'user',
            content: `Analyze these transactions and return ONLY a JSON response: ${JSON.stringify(
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
    logger.info('Cash flow analysis completed successfully');
    return parsedResult;
  } catch (error) {
    logger.error('Error analyzing cash flow:', error);
    throw error;
  }
}
