import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';

export const headerHeight = '75px';

const useStyles = makeStyles((theme) => ({
    container: {
        overflow: 'auto'
    },
    scrim: {
        position: 'absolute',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 2000
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

const initialLayoutState: Layout.StateType = {
    isLoading: false
};

const layoutStateReducer = (
    state: Layout.StateType = initialLayoutState,
    action: Layout.StateAction
): Layout.StateType => ({
    ...state,
    [action.type]: action.value
});

export const LayoutStateContext = React.createContext<Layout.StateContextType>({} as Layout.StateContextType);

interface Props {
    children?: React.ReactNode;
    header: React.ReactNode;
}

const Layout = ({ children = undefined, header }: Props): JSX.Element => {
    const classes = useStyles();

    const [layoutState, layoutStateDispatch] = React.useReducer(layoutStateReducer, initialLayoutState);

    return (
        <LayoutStateContext.Provider value={{ layoutState, layoutStateDispatch }}>
            {layoutState.isLoading ? (
                <Box
                    className={`fillContainer ${classes.scrim}`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CircularProgress />
                </Box>
            ) : null}
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
        </LayoutStateContext.Provider>
    );
};

export default Layout;
