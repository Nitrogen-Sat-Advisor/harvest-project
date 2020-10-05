import React from 'react';
import { Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import routes from '../routes';

const useStyle = makeStyles({
    container: {
        width: '100%',
        height: '100%'
    }
});

const App = (): JSX.Element => {
    const classes = useStyle();

    return (
        <Container className={classes.container} maxWidth="lg">
            {Object.entries(routes).map(([path, props]) => (
                <Route key={path} path={path} {...props} />
            ))}
        </Container>
    );
};

export default App;
