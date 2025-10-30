const fs = require('fs');

// Read the original index.html
const html = fs.readFileSync('index.html', 'utf8');

// Extract each page section
const pages = {};

// Home page
const homeMatch = html.match(/<!-- Home Page -->([\s\S]*?)<!-- Leaderboard Page -->/);
if (homeMatch) {
  pages.home = homeMatch[1].trim();
}

// Leaderboard page
const leaderboardMatch = html.match(/<!-- Leaderboard Page -->([\s\S]*?)<!-- Tournaments Page -->/);
if (leaderboardMatch) {
  pages.leaderboard = leaderboardMatch[1].trim();
}

// Tournaments page
const tournamentsMatch = html.match(/<!-- Tournaments Page -->([\s\S]*?)<!-- Analytics Page -->/);
if (tournamentsMatch) {
  pages.tournaments = tournamentsMatch[1].trim();
}

// Analytics page
const analyticsMatch = html.match(/<!-- Analytics Page -->([\s\S]*?)<!-- Community Page -->/);
if (analyticsMatch) {
  pages.analytics = analyticsMatch[1].trim();
}

// Community page
const communityMatch = html.match(/<!-- Community Page -->([\s\S]*?)<!-- Footer -->/);
if (communityMatch) {
  pages.community = communityMatch[1].trim();
}

// Also extract the navigation and footer
const navMatch = html.match(/<nav class="nav">([\s\S]*?)<\/nav>/);
if (navMatch) {
  pages.navigation = navMatch[1].trim();
}

const footerMatch = html.match(/<!-- Footer -->([\s\S]*?)<\/main>/);
if (footerMatch) {
  pages.footer = footerMatch[1].trim();
}

// Write each page to separate files for inspection
Object.keys(pages).forEach(pageName => {
  fs.writeFileSync(`extracted-${pageName}.html`, pages[pageName]);
  console.log(`Extracted ${pageName}: ${pages[pageName].length} characters`);
});

// Also extract the CSS
const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (cssMatch) {
  fs.writeFileSync('extracted-styles.css', cssMatch[1]);
  console.log(`Extracted CSS: ${cssMatch[1].length} characters`);
}

// Extract JavaScript
const jsMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (jsMatch) {
  fs.writeFileSync('extracted-script.js', jsMatch[1]);
  console.log(`Extracted JavaScript: ${jsMatch[1].length} characters`);
}

console.log('\nPage extraction complete!');
console.log('Files created:');
Object.keys(pages).forEach(pageName => {
  console.log(`- extracted-${pageName}.html`);
});
console.log('- extracted-styles.css');
console.log('- extracted-script.js');
