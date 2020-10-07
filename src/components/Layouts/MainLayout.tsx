import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';

export const headerHeight = '75px';

const useStyles = makeStyles((theme) => ({
    container: {
        flexGrow: 1
    },
    header: {
        'height': headerHeight,
        'minHeight': headerHeight,
        'background': theme.palette.secondary.light,
        'color': theme.palette.secondary.contrastText,
        'textDecoration': 'none',

        '& a': {
            margin: 5
        },

        '& h5': {
            fontSize: '1.75rem'
        }
    },
    main: {
        position: 'relative',
        height: `calc(100vh - ${headerHeight})`
    }
}));

interface Props {
    children?: React.ReactNode;
    header: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children = undefined, header }: Props) => {
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

export default Layout;
