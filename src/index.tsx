import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';

import { theme } from './theme';
import routes from './routes';

ReactDOM.render(
    <Router>
        <ThemeProvider theme={theme}>
            {Object.entries(routes).map(([path, props]) => (
                <Route key={path} path={path} {...props} />
            ))}
        </ThemeProvider>
    </Router>,
    document.getElementById('root')
);
