const axios = require('axios');

function getAuthHeader() {
  const apiKey = process.env.ZERION_API_KEY || '';
  const token = Buffer.from(`${apiKey}:`).toString('base64');
  return `Basic ${token}`;
}

const knownAddresses = [
  { address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', name: 'MakerDAO' },
  { address: '0x3cd751e6b0078be393132286c442345e5dc49699', name: 'Compound' },
  { address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', name: 'Uniswap' },
  { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', name: 'Vitalik Buterin' },
  { address: '0x28C6c06298d514Db089934071355E5743bf21d60', name: 'Binance Hot' }
];

async function fetchPortfolioSummary(address) {
  const headers = { Authorization: getAuthHeader() };
  const base = 'https://api.zerion.io/v1';
  try {
    const [portfolioRes, positionsRes] = await Promise.all([
      axios.get(`${base}/wallets/${address}/portfolio`, { headers }),
      axios.get(`${base}/wallets/${address}/positions/?filter[positions]=wallet`, { headers })
    ]);

    const totalValue = portfolioRes.data?.data?.attributes?.total_value_usd || 0;
    const positions = positionsRes.data?.data || [];

    let assets = positions.slice(0, 10).map(p => {
      const quantity = p.attributes?.quantity?.float || 0;
      const price = p.attributes?.price?.value || p.attributes?.price || 0;
      const symbol = p.attributes?.fungible_info?.symbol || 'Unknown';
      const name = p.attributes?.fungible_info?.name || symbol || 'Unknown Token';
      return { symbol, name, value: quantity * price };
    });
    const calcValue = assets.reduce((s, a) => s + (a.value || 0), 0);

    return {
      totalValue: totalValue || calcValue,
      totalPnL: 0,
      assets
    };
  } catch (e) {
    return { totalValue: 0, totalPnL: 0, assets: [] };
  }
}

module.exports = async (req, res) => {
  try {
    const results = await Promise.all(
      knownAddresses.map(async (k) => {
        const pf = await fetchPortfolioSummary(k.address);
        const score = Math.round(Math.log10((pf.totalValue || 0) + 1) * 10);
        return {
          address: k.address,
          name: k.name,
          totalValue: pf.totalValue || 0,
          totalPnL: pf.totalPnL || 0,
          score
        };
      })
    );

    results.sort((a, b) => (b.score || 0) - (a.score || 0));
    res.status(200).json({ leaderboard: results });
  } catch (e) {
    res.status(500).json({ error: 'Failed to build leaderboard' });
  }
};


