import fs from 'fs';
import path from 'path';

// Path to the directory you want to scan
const DIRECTORY_PATH = 'src/components';
// Path to the i18n JSON file
const I18N_FILE_PATH = 'src/i18n/locales/uz.json';

// Load the i18n file
let i18nData;
try {
  i18nData = JSON.parse(fs.readFileSync(I18N_FILE_PATH, 'utf8'));
} catch (error) {
  console.error(`Error reading i18n file: ${error.message}`);
  process.exit(1);
}

// List of labels to add
const labelsToAdd = [
  "statements.financialStatements",
  "access_token",
  "refresh_token",
  "auth.signInSuccess",
  "auth.errors.authCallbackError",
  "auth.processingAuth",
  "auth.errors.unknownError",
  "auth.noAccount",
  "auth.emailPlaceholder",
  "auth.passwordPlaceholder",
  "auth.passwordResetSuccess",
  "auth.setNewPassword",
  "auth.setNewPasswordInstructions",
  "auth.newPassword",
  "auth.newPasswordPlaceholder",
  "auth.updatePassword",
  "auth.unknownError",
  "auth.resetPasswordInstructions",
  "auth.resetPasswordSuccess",
  "auth.emailPlaceholder",
  "auth.sendResetLink",
  "auth.backToSignIn",
  "auth.errors.acceptTerms",
  "auth.verificationEmailSent",
  "auth.errors.unknownError",
  "auth.signInInstead",
  "auth.fullNamePlaceholder",
  "auth.emailPlaceholder",
  "auth.company",
  "auth.companyPlaceholder",
  "auth.passwordPlaceholder",
  "auth.confirmPasswordPlaceholder",
  "auth.passwordRequirements.title",
  "auth.passwordRequirements.length",
  "auth.passwordRequirements.uppercase",
  "auth.passwordRequirements.lowercase",
  "auth.passwordRequirements.number",
  "auth.passwordRequirements.special",
  "auth.acceptTerms",
  "auth.termsAndConditions",
  "analysis.trends.needMoreData",
  "dashboard.monthToMonth",
  "companies.edit",
  "companies.add",
  "companies.form.name",
  "companies.form.industry",
  "companies.form.description",
  "companies.form.email",
  "companies.form.phone",
  "companies.confirmDelete",
  "companies.title",
  "companies.addNew",
  "companies.noCompanies",
  "companies.getStarted",
  "companies.addFirst",
  "analysis.trends.needMoreData",
  "dashboard.monthToMonth",
  "analysis.ratios.cashRatio",
  "analysis.ratios.receivablesTurnover",
  "analysis.previousPeriod",
  "analysis.benchmark",
  "analysis.noData",
  "analysis.benchmarkComparison",
  "statements.financialStatements",
  "analysis.selectPeriod",
  "analysis.selectPeriod",
  "analysis.selectPeriodsToCompare",
  "analysis.selectTwoPeriodsDescription",
  "sections.assets",
  "sections.liabilities",
  "sections.equity",
  "sections.revenue",
  "sections.expenses",
  "sections.netIncome",
  "analysis.ratios.cashRatio",
  "analysis.selectPeriod",
  "analysis.selectPeriod",
  "analysis.selectPeriod",
  "analysis.selectPeriod",
  "analysis.urgentIssues",
  "analysis.improvements",
  "analysis.selectPeriod",
  "excel",
  "pdf",
  "sections.assets",
  "sections.liabilities",
  "sections.equity",
  "sections.revenue",
  "sections.expenses",
  "sections.operating",
  "sections.investing",
  "sections.financing"
];

// Function to recursively scan the directory and process files
function scanDirectory(directoryPath) {
  fs.readdirSync(directoryPath, { withFileTypes: true }).forEach((file) => {
    const fullPath = path.join(directoryPath, file.name);

    if (file.isDirectory()) {
      scanDirectory(fullPath); // Recurse into subdirectory
    } else if (file.isFile() && file.name.endsWith('.tsx')) {
      checkFileForLabels(fullPath);
    }
  });
}

// Function to check each file for `t('label')` patterns
function checkFileForLabels(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const regex = /t\(['"`]([a-zA-Z0-9_.]+)['"`]\)/g;
  let match;
  const missingLabels = [];

  while ((match = regex.exec(fileContent)) !== null) {
    const label = match[1];
    const value = label.split('.').reduce((o, key) => (o || {})[key], i18nData);
    if (value === undefined) {
      console.log(`Missing label in i18n: '${label}' found in ${filePath}`);
      missingLabels.push(label);
    }
  }

  // Append missing labels to the i18n JSON file
  if (missingLabels.length > 0) {
    missingLabels.forEach((label) => {
      const keys = label.split('.');
      let currentLevel = i18nData;

      // Create nested structure if it doesn't exist
      keys.forEach((key, index) => {
        if (!currentLevel[key]) {
          currentLevel[key] = {};
        }
        if (index === keys.length - 1) {
          currentLevel[key] = ""; // Set default value as empty string
        }
        currentLevel = currentLevel[key];
      });
    });

    // Write updated i18n data back to the file
    fs.writeFileSync(I18N_FILE_PATH, JSON.stringify(i18nData, null, 2));
    console.log(`Updated i18n file with missing labels.`);
  }

  // Add predefined labels
//   labelsToAdd.forEach((label) => {
//     const keys = label.split('.');
//     let currentLevel = i18nData;

//     // Create nested structure if it doesn't exist
//     keys.forEach((key, index) => {
//       if (!currentLevel[key]) {
//         currentLevel[key] = {};
//       }
//       if (index === keys.length - 1) {
//         currentLevel[key] = ""; // Set default value as empty string
//       }
//       currentLevel = currentLevel[key];
//     });
//   });

//   // Write updated i18n data back to the file
//   fs.writeFileSync(I18N_FILE_PATH, JSON.stringify(i18nData, null, 2));
//   console.log(`Added predefined labels to i18n file.`);
}

// Start scanning the directory
scanDirectory(DIRECTORY_PATH);

