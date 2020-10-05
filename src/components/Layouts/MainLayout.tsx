import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';

import { headerHeight, headerStyle } from './styles';

const useStyles = makeStyles({
    container: {
        flexGrow: 1
    },
    header: headerStyle,
    main: {
        position: 'relative',
        height: `calc(100vh - ${headerHeight})`
    }
});

type Props = {
    children?: React.ReactNode;
    header: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children, header }: Props) => {
    const classes = useStyles();

    return (
        <Grid className={classes.container} container component="main">
            <Grid item xs={12}>
                <AppBar className={classes.header} position="relative" elevation={0}>
                    <Toolbar>{header}</Toolbar>
                </AppBar>
            </Grid>

            <Grid className={classes.main} container item xs={12} alignItems="center">
                {children}
            </Grid>
        </Grid>
    );
};

Layout.defaultProps = {
    children: undefined
};

export default Layout;
