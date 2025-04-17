// global.d.ts
declare namespace google {
    namespace accounts {
      namespace oauth2 {
        interface TokenClient {
          callback: (resp: {
            access_token: string;
            error?: string;
            expires_in: number;
            scope: string;
            token_type: string;
          }) => void;
          requestAccessToken: (options?: {
            prompt?: string;
          }) => void;
        }
        function initTokenClient(config: {
          client_id: string;
          scope: string;
          callback: string;
        }): TokenClient;
        function revoke(token: string, callback: () => void): void;
      }
    }
  }
  
  declare var gapi: {
    load: (api: string, callback: () => void) => void;
    client: {
      init: (config: any) => Promise<void>;
      getToken: () => { access_token: string } | null;
      setToken: (token: { access_token: string } | null) => void;
      calendar: {
        events: {
          list: (params: any) => Promise<any>;
          insert: (params: any) => Promise<any>;
        }
      }
    }
  };