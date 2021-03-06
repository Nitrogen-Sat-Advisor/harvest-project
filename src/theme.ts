import { createMuiTheme } from '@material-ui/core';

export const palette = {
    primary: {
        main: '#04a466',
        dark: '#008955',
        light: '#bbe2d3',
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
