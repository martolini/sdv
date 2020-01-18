import axios from 'axios';

const cache = {};

const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s
    .split(' ')
    .map(n => n.charAt(0).toUpperCase() + n.slice(1))
    .join(' ');
};

export default async function wikisearch(req, res) {
  const q = capitalize(req.query.q);
  if (cache[q]) {
    return res.json({ results: cache[q] });
  }
  try {
    const data = await axios.get(
      `https://stardewvalleywiki.com/mediawiki/api.php?action=opensearch&format=json&search=${encodeURIComponent(
        q
      )}&namespace=0&limit=10&suggest=`
    );
    if (data.data && data.data.length) {
      const [, labels, , urls] = data.data;
      const results = labels.map((label, i) => ({
        text: label,
        value: urls[i],
      }));
      cache[q] = results;
      return res.json({
        results,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  return res.status(500).json({ error: 'humzz' });
}
