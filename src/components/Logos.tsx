import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import logoACES from '../images/logo_aces.png';
import logoNASA from '../images/logo_nasa.png';
import logoHarvest from '../images/logo_harvest.png';
import logoICGA from '../images/logo_icga.png';

const useStyle = makeStyles((theme) => ({
    logo: {
        height: theme.spacing(8),
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
            <img className={classes.logo} src={logoACES} alt="ACES logo" />
            <img className={classes.logo} src={logoNASA} alt="ACES logo" />
            <img className={classes.logo} src={logoHarvest} alt="ACES logo" />
            <img className={classes.logo} src={logoICGA} alt="ACES logo" />
        </Box>
    );
};

export default Logos;
