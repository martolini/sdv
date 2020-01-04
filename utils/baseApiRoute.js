import Cache from 'node-cache';
import { getFarmState } from './firebase-admin';

const defaultConfig = {
  stateKey: undefined,
  cacheTTL: 60 * 60,
};

export default function createBaseApiRoute({ stateKey, cacheTTL }) {
  const config = {
    ...defaultConfig,
    stateKey,
    cacheTTL,
  };
  const cache = new Cache({ stdTTL: config.cacheTTL });

  return async function handler(req, res) {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        error: 'No ID found',
      });
    }

    if (cache.has(id)) {
      return res.json(cache.get(id));
    }
    try {
      const output = await getFarmState(id);
      cache.set(id, output[config.stateKey]);
      return handler(req, res);
    } catch (ex) {
      res.status(404).json({ error: ex.message });
    }
  };
}
