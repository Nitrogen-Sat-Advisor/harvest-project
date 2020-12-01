import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import keycloak from './keycloak';
import { theme } from './theme';
import routes from './routes';

if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 0
    });
}

const App = () => {
    React.useEffect(() => {
        keycloak.init();
    }, []);

    return (
        <Router>
            <ThemeProvider theme={theme}>
                {Object.entries(routes).map(([path, props]) => (
                    <Route key={path} path={`${process.env.PUBLIC_PATH}${path}`} {...props} />
                ))}
            </ThemeProvider>
        </Router>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
