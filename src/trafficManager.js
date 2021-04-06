const { randomRouting } = require('./splitAlgorithms');

/**
 * Initializes routing algorithms based on ab testing configurations,
 * returns the traffic manager middleware
 */
function trafficManagerInit(splitConfig) {
  const defaultConfig = {
    enabled: true,
    cookieName: 'variant',
    maxUsers: 100,
    splitTraffic: {
      ratio: [
        { name: 'variantA', percentage: 50 },
        { name: 'variantB', percentage: 50 },
      ],
    },
    cookieAttributes: {
      httpOnly: true,
      secure: true,
      maxAge: 86400000,
    },
  };
  const abTestingConfig = { ...defaultConfig, ...splitConfig };
  const algoFactory = (initConfig) => randomRouting(initConfig);
  const splittingAlgo = algoFactory(abTestingConfig);

  /**
       * Set variant cookie and update request headers
       * @param  {} req - http request object
       * @param  {} res - http response object
      */
  const setCookieUpdateHeaders = (req, res) => {
    const cookieValue = splittingAlgo();
    const {
      cookies,
      headers,
    } = req;
    const {
      cookieName,
      cookieAttributes,
    } = abTestingConfig;
    const existingCookieValue = cookies[cookieName];

    if (!existingCookieValue) {
      res.cookie(cookieName, cookieValue, cookieAttributes);
      req.headers = { ...headers, cookieName: cookieValue };
    }
  };

  /**
       * Clear variant cookie
       * @param  {} req - http request object
       * @param  {} res - http response object
      */
  const clearCookie = (req, res) => {
    const {
      cookies,
    } = req;
    const { cookieName } = abTestingConfig;
    const cookieValue = cookies[cookieName];
    if (cookieValue) {
      res.clearCookie(cookieName);
    }
  };

  /**
       * Actual traffic manager middleware
       * @param  {} req - http request object
       * @param  {} res - http response object
       * @param  {} next - trigger next middleware
      */
  const trafficManager = (req, res, next) => {
    if (abTestingConfig.enabled) {
      try {
        setCookieUpdateHeaders(req, res);
      } catch (e) {
        next(e);
      }
    } else {
      clearCookie(req, res);
    }
    return next();
  };

  return trafficManager;
}

module.exports = trafficManagerInit;
