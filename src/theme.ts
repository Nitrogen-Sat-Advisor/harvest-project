import { createMuiTheme } from '@material-ui/core';

export const palette = {
    primary: {
        main: '#04A466',
        light: '#BBE2D3',
        contrastText: '#fff'
    },
    secondary: {
        main: '#455A64',
        light: '#DFE2E4',
        contrastText: '#000'
    }
};

export const theme = createMuiTheme({
    palette
});
