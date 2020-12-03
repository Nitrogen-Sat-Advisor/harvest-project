import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import logoUIUC from '../images/logo_uiuc.png';
import logoNASA from '../images/logo_nasa.png';
import logoHarvest from '../images/logo_harvest.png';
import logoICGA from '../images/logo_icga.png';

const useStyle = makeStyles((theme) => ({
    logo: {
        height: theme.spacing(7),
        marginLeft: theme.spacing(2)
    }
}));

interface Props {
    containerClasses?: string;
}

const Logos = ({ containerClasses = '' }: Props): JSX.Element => {
    const classes = useStyle();

    return (
        <Box className={containerClasses} display="flex">
            <img className={classes.logo} src={logoUIUC} alt="UIUC logo" />
            <img className={classes.logo} src={logoNASA} alt="NASA logo" />
            <img className={classes.logo} src={logoHarvest} alt="Harvest logo" />
            <img className={classes.logo} src={logoICGA} alt="ICGA logo" />
        </Box>
    );
};

export default Logos;
