import { palette } from '../../theme';

export const headerHeight = '75px';
export const footerHeight = '120px';

export const headerStyle = {
    'height': headerHeight,
    'minHeight': headerHeight,
    'background': palette.secondary.light,
    'color': palette.secondary.contrastText,
    'textDecoration': 'none',

    '& a': {
        margin: 5
    },

    '& h5': {
        fontSize: '1.75rem'
    }
};

export const footerStyle = {
    'height': footerHeight,
    'background': palette.secondary.main,
    'color': '#fff',

    '& h5': {
        fontSize: '1.75rem'
    }
};
