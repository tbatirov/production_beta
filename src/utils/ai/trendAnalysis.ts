import { FinancialAnalysis } from '../types';
import { logger } from '../logger';
import i18next from 'i18next';

export function analyzeTrends(
  currentPeriod: FinancialAnalysis,
  previousPeriod: FinancialAnalysis,
  metric: string
) {
  const currentLanguage = i18next.language || 'en';
  
  try {
    const currentValue = getMetricValue(currentPeriod, metric);
    const previousValue = getMetricValue(previousPeriod, metric);
    const percentageChange = calculatePercentageChange(currentValue, previousValue);
    
    return generateTrendAnalysis(
      metric,
      currentValue,
      previousValue,
      percentageChange,
      currentLanguage
    );
  } catch (error) {
    logger.error('Error analyzing trends:', error);
    throw error;
  }
}

function getMetricValue(data: FinancialAnalysis, metric: string): number {
  switch (metric) {
    case 'revenue':
      return data.statements.incomeStatement?.sections.revenue.total || 0;
    case 'netIncome':
      return data.statements.incomeStatement?.total || 0;
    case 'assets':
      return data.statements.balanceSheet?.sections.assets.total || 0;
    case 'cashFlow':
      return data.statements.cashFlow?.total || 0;
    default:
      return 0;
  }
}

function calculatePercentageChange(current: number, previous: number): number {
  if (!previous) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function generateTrendAnalysis(
  metric: string,
  currentValue: number,
  previousValue: number,
  percentageChange: number,
  language: string
) {
  const direction = percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable';
  
  const analysis = {
    direction,
    percentage: Math.abs(percentageChange),
    analysis: '',
    factors: [] as string[],
    recommendations: [] as string[]
  };

  switch (language) {
    case 'ru':
      generateRussianAnalysis(analysis, metric, percentageChange);
      break;
    case 'uz':
      generateUzbekAnalysis(analysis, metric, percentageChange);
      break;
    default:
      generateEnglishAnalysis(analysis, metric, percentageChange);
  }

  return analysis;
}

function generateEnglishAnalysis(analysis: any, metric: string, change: number) {
  switch (metric) {
    case 'revenue':
      analysis.analysis = `Revenue has ${change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% compared to the previous period.`;
      analysis.factors = [
        'Market conditions impact on sales',
        'Pricing strategy effectiveness',
        'Customer base changes'
      ];
      analysis.recommendations = [
        'Review pricing strategy',
        'Explore new market opportunities',
        'Strengthen customer relationships'
      ];
      break;
    case 'netIncome':
      analysis.analysis = `Net income has ${change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% compared to the previous period.`;
      analysis.factors = [
        'Operational efficiency',
        'Cost management effectiveness',
        'Revenue growth impact'
      ];
      analysis.recommendations = [
        'Optimize operational costs',
        'Improve profit margins',
        'Review expense allocation'
      ];
      break;
    case 'assets':
      analysis.analysis = `Total assets have ${change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% compared to the previous period.`;
      analysis.factors = [
        'Asset utilization efficiency',
        'Investment in new assets',
        'Asset disposal impact'
      ];
      analysis.recommendations = [
        'Review asset utilization',
        'Consider strategic investments',
        'Optimize asset portfolio'
      ];
      break;
    case 'cashFlow':
      analysis.analysis = `Cash flow has ${change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% compared to the previous period.`;
      analysis.factors = [
        'Operating cash flow efficiency',
        'Investment activities impact',
        'Financing decisions effect'
      ];
      analysis.recommendations = [
        'Improve working capital management',
        'Review investment strategy',
        'Optimize cash flow cycle'
      ];
      break;
  }
}

function generateRussianAnalysis(analysis: any, metric: string, change: number) {
  switch (metric) {
    case 'revenue':
      analysis.analysis = `Выручка ${change >= 0 ? 'увеличилась' : 'уменьшилась'} на ${Math.abs(change).toFixed(1)}% по сравнению с предыдущим периодом.`;
      analysis.factors = [
        'Влияние рыночных условий на продажи',
        'Эффективность ценовой стратегии',
        'Изменения в клиентской базе'
      ];
      analysis.recommendations = [
        'Пересмотреть ценовую стратегию',
        'Исследовать новые рыночные возможности',
        'Укрепить отношения с клиентами'
      ];
      break;
    case 'netIncome':
      analysis.analysis = `Чистая прибыль ${change >= 0 ? 'увеличилась' : 'уменьшилась'} на ${Math.abs(change).toFixed(1)}% по сравнению с предыдущим периодом.`;
      analysis.factors = [
        'Операционная эффективность',
        'Эффективность управления затратами',
        'Влияние роста выручки'
      ];
      analysis.recommendations = [
        'Оптимизировать операционные расходы',
        'Улучшить маржинальность',
        'Пересмотреть распределение расходов'
      ];
      break;
    case 'assets':
      analysis.analysis = `Общие активы ${change >= 0 ? 'увеличились' : 'уменьшились'} на ${Math.abs(change).toFixed(1)}% по сравнению с предыдущим периодом.`;
      analysis.factors = [
        'Эффективность использования активов',
        'Инвестиции в новые активы',
        'Влияние выбытия активов'
      ];
      analysis.recommendations = [
        'Проанализировать использование активов',
        'Рассмотреть стратегические инвестиции',
        'Оптимизировать портфель активов'
      ];
      break;
    case 'cashFlow':
      analysis.analysis = `Денежный поток ${change >= 0 ? 'увеличился' : 'уменьшился'} на ${Math.abs(change).toFixed(1)}% по сравнению с предыдущим периодом.`;
      analysis.factors = [
        'Эффективность операционного денежного потока',
        'Влияние инвестиционной деятельности',
        'Эффект финансовых решений'
      ];
      analysis.recommendations = [
        'Улучшить управление оборотным капиталом',
        'Пересмотреть инвестиционную стратегию',
        'Оптимизировать цикл денежного потока'
      ];
      break;
  }
}

function generateUzbekAnalysis(analysis: any, metric: string, change: number) {
  switch (metric) {
    case 'revenue':
      analysis.analysis = `Daromad oldingi davrga nisbatan ${Math.abs(change).toFixed(1)}% ${change >= 0 ? 'oshdi' : 'kamaydi'}.`;
      analysis.factors = [
        'Bozor sharoitlarining savdoga ta\'siri',
        'Narxlash strategiyasining samaradorligi',
        'Mijozlar bazasidagi o\'zgarishlar'
      ];
      analysis.recommendations = [
        'Narxlash strategiyasini qayta ko\'rib chiqish',
        'Yangi bozor imkoniyatlarini o\'rganish',
        'Mijozlar bilan munosabatlarni mustahkamlash'
      ];
      break;
    case 'netIncome':
      analysis.analysis = `Sof foyda oldingi davrga nisbatan ${Math.abs(change).toFixed(1)}% ${change >= 0 ? 'oshdi' : 'kamaydi'}.`;
      analysis.factors = [
        'Operatsion samaradorlik',
        'Xarajatlarni boshqarish samaradorligi',
        'Daromad o\'sishining ta\'siri'
      ];
      analysis.recommendations = [
        'Operatsion xarajatlarni optimallashtirish',
        'Foyda marjasini yaxshilash',
        'Xarajatlar taqsimotini qayta ko\'rib chiqish'
      ];
      break;
    case 'assets':
      analysis.analysis = `Jami aktivlar oldingi davrga nisbatan ${Math.abs(change).toFixed(1)}% ${change >= 0 ? 'oshdi' : 'kamaydi'}.`;
      analysis.factors = [
        'Aktivlardan foydalanish samaradorligi',
        'Yangi aktivlarga investitsiyalar',
        'Aktivlar chiqishining ta\'siri'
      ];
      analysis.recommendations = [
        'Aktivlardan foydalanishni tahlil qilish',
        'Strategik investitsiyalarni ko\'rib chiqish',
        'Aktivlar portfelini optimallashtirish'
      ];
      break;
    case 'cashFlow':
      analysis.analysis = `Pul oqimi oldingi davrga nisbatan ${Math.abs(change).toFixed(1)}% ${change >= 0 ? 'oshdi' : 'kamaydi'}.`;
      analysis.factors = [
        'Operatsion pul oqimi samaradorligi',
        'Investitsion faoliyat ta\'siri',
        'Moliyaviy qarorlar ta\'siri'
      ];
      analysis.recommendations = [
        'Aylanma kapital boshqaruvini yaxshilash',
        'Investitsiya strategiyasini qayta ko\'rib chiqish',
        'Pul oqimi tsiklini optimallashtirish'
      ];
      break;
  }
}