import axios from 'axios';

const cache = {};

export default async function wikisearch(req, res) {
  const { q } = req.query;
  if (cache[q]) {
    return res.json({ results: cache[q] });
  }
  try {
    const data = await axios.get(
      `https://stardewvalleywiki.com/mediawiki/api.php?action=opensearch&format=json&search=${q}&namespace=0&limit=10&suggest=`
    );
    if (data.data && data.data.length) {
      const [_, labels, __, urls] = data.data;
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
}
