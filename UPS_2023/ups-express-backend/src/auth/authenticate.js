/* eslint-disable max-len */
import passport from 'passport';

export default function authenticate(req, res, next) {
  passport.authenticate('oauth-bearer', {
    session: false,

    /**
       * If you are building a multi-tenant application and you need supply the tenant ID or name dynamically,
       * uncomment the line below and pass in the tenant information. For more information, see:
       * https://github.com/AzureAD/passport-azure-ad#423-options-available-for-passportauthenticate
       */

    // tenantIdOrName: <some-tenant-id-or-name>

  // eslint-disable-next-line consistent-return
  }, (err, user, info) => {
    if (err) {
      /**
           * An error occurred during authorization. Either pass the error to the next function
           * for Express error handler to handle, or send a response with the appropriate status code.
           */
      return res.status(401).json({ error: err.message });
    }

    if (!user) {
      // If no user object found, send a 401 response.
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (info) {
      // access token payload will be available in req.authInfo downstream
      req.authInfo = info;
      return next();
    }
  })(req, res, next);
}
