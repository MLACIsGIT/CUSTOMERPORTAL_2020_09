const authConfig = {
  credentials: {
    tenantID: process.env.MSAL_TENANT_ID,
    clientID: process.env.MSAL_BACKEND_APPLICATION_ID,
  },
  metadata: {
    authority: 'login.microsoftonline.com',
    discovery: '.well-known/openid-configuration',
    version: 'v2.0',
  },
  settings: {
    validateIssuer: true,
    passReqToCallback: true,
    loggingLevel: 'info',
    loggingNoPII: true,
  },
  protectedRoutes: {
    todolist: {
      endpoint: '/api/seldata',
      delegatedPermissions: {
        read: ['selData.read'],
        // read: ['Todolist.Read', 'Todolist.ReadWrite'],
        // write: ['Todolist.ReadWrite'],
      },
      // applicationPermissions: {
      //   read: ['Todolist.Read.All', 'Todolist.ReadWrite.All'],
      //   write: ['Todolist.ReadWrite.All'],
      // },
    },
  },
};

export default authConfig;
