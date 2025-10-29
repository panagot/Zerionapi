const fs = require('fs');

console.log('🔍 FINAL MOCK DATA VERIFICATION');
console.log('================================\n');

const files = ['server-hybrid.js', 'index.html', 'package.json', 'README.md'];
let totalIssues = 0;

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const randomMatches = content.match(/Math\.random\(\)/g);
    const simulateMatches = content.match(/simulate|Simulate/g);
    const mockMatches = content.match(/mock|Mock|MOCK/g);
    
    console.log(`📄 ${file}:`);
    if (randomMatches) {
      console.log(`  ⚠️  Math.random(): ${randomMatches.length} instances`);
      totalIssues += randomMatches.length;
    }
    if (simulateMatches) {
      console.log(`  ⚠️  'simulate': ${simulateMatches.length} instances`);
      totalIssues += simulateMatches.length;
    }
    if (mockMatches) {
      console.log(`  ⚠️  'mock': ${mockMatches.length} instances`);
      totalIssues += mockMatches.length;
    }
    if (!randomMatches && !simulateMatches && !mockMatches) {
      console.log(`  ✅ Clean - no mock data found`);
    }
    console.log('');
  }
});

console.log(`📊 SUMMARY: ${totalIssues} mock data issues found`);
if (totalIssues === 0) {
  console.log('🏆 SUCCESS: 100% Zerion API data throughout the application!');
} else {
  console.log('⚠️  Manual cleanup needed for remaining issues.');
}
