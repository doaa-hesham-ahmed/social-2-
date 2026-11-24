
import container from "../di/container";
import {TOKENS} from "../di/token";
import {ICachProvider} from "../../pkg/cache/cach.interface";

const cacheProvider = container.resolve<ICachProvider>(TOKENS.CacheProvider)

export function idempotency(ttl = 3600) {
  return async (req, res, next) => {
    const idempotencyKey = req.headers["idempotency-key"];
        if (!idempotencyKey) {
              return res.status(400).json({
               message: "Idempotency-Key header is required"
         });
        }
    const key = `${req.method}:${req.originalUrl}:${idempotencyKey}`;

    const cached = await cacheProvider.get(key);

    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.json(JSON.parse(cached));
    }

    const originalJSON = res.json.bind(res);

    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await cacheProvider.set(key,JSON.stringify(body),ttl);
        res.setHeader("X-Cache", "MISS");
      }

      return originalJSON(body);
    };

    next();
  };
}