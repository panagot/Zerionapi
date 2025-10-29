const axios = require('axios');

function getAuthHeader() {
  const apiKey = process.env.ZERION_API_KEY || '';
  const token = Buffer.from(`${apiKey}:`).toString('base64');
  return `Basic ${token}`;
}

module.exports = async (req, res) => {
  const { address } = req.query || req.params || {};
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Invalid address' });
  }

  const headers = { Authorization: getAuthHeader() };
  const base = 'https://api.zerion.io/v1';

  try {
    const [portfolioRes, positionsRes, txRes] = await Promise.all([
      axios.get(`${base}/wallets/${address}/portfolio`, { headers }),
      axios.get(`${base}/wallets/${address}/positions/?filter[positions]=wallet`, { headers }),
      axios.get(`${base}/wallets/${address}/transactions`, { headers })
    ]);

    const totalValue = portfolioRes.data?.data?.attributes?.total_value_usd || 0;
    let totalPnL = portfolioRes.data?.data?.attributes?.total_pnl_usd || 0;

    const positions = positionsRes.data?.data || [];
    const assets = positions.map(p => {
      const quantity = p.attributes?.quantity?.float || 0;
      const price = p.attributes?.price?.value || p.attributes?.price || 0;
      const value = quantity * price;
      const symbol = p.attributes?.fungible_info?.symbol || 'Unknown';
      const name = p.attributes?.fungible_info?.name || symbol || 'Unknown Token';
      return { symbol, name, quantity, price, value };
    }).filter(a => a.value > 0);

    const calcValue = assets.reduce((s, a) => s + (a.value || 0), 0);
    const finalTotalValue = totalValue || calcValue;
    if (!totalPnL && finalTotalValue) {
      totalPnL = 0; // leave as 0 if API doesn't provide
    }

    const transactions = txRes.data?.data?.slice?.(0, 20) || [];

    res.status(200).json({
      address,
      name: `Wallet ${address.slice(0,6)}...${address.slice(-4)}`,
      totalValue: finalTotalValue,
      totalPnL: totalPnL,
      portfolio: {
        assets,
        positionsCount: positions.length,
        rawData: { transactions }
      },
      isRealData: true,
      lastUpdated: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load wallet', details: e.message });
  }
};


