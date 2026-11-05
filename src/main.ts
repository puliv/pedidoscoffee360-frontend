import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app'; // Importamos tu verdadero componente
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_4kFYvMGOb', 
      userPoolClientId: '1blnv1c5da5hp2hn9v57hfogi1',
      loginWith: {
        oauth: {
          // Quitamos el https://, Amplify solo necesita el dominio
          domain: 'us-east-14kfyvmgob.auth.us-east-1.amazoncognito.com', 
          scopes: [
            'email',
            'openid',
            'profile',
            'pedidoscoffee360-api/pedidos-api-read' 
          ],
          redirectSignIn: ['http://localhost:4200'],
          redirectSignOut: ['http://localhost:4200'],
          responseType: 'code'
        }
      }
    }
  }
});

// Arrancamos con tu componente App real
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));