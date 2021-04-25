import Fuse from 'fuse.js';
import searchData from 'data/allWikiPages.json';

type SearchDataEntry = {
  // Link to stardew wiki
  href: string;
  // Text to index
  name: string;
};

const fuse = new Fuse<SearchDataEntry>(searchData, {
  includeScore: true,
  keys: ['name', 'href'],
});

export default async function wikisearch(req, res) {
  const query = req.query.q;
  const results = fuse
    .search<SearchDataEntry>(query, {
      limit: 10,
    })
    .map((entry) => ({
      text: entry.item.name,
      value: `https://stardewvalleywiki.com${entry.item.href}`,
    }));
  res.json({
    results,
  });
}
