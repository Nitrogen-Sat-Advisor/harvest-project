import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';

import type { Theme } from '@material-ui/core/styles';

import logoNAdvisor from '../../images/logo_n_advisor.png';

const useStyle = makeStyles((theme: Theme) => ({
    text: {
        fontWeight: 400,
        marginLeft: theme.spacing(1)
    },
    title: {
        flexGrow: 1
    }
}));

export const Header = (): JSX.Element => {
    const classes = useStyle();

    return (
        <Box display="flex" justifyItems="center" alignContent="center" alignItems="center" flexGrow={1}>
            <IconButton edge="start" component={Link} to="/">
                <HomeIcon />
            </IconButton>
            <Avatar src={logoNAdvisor} variant="square" />
            <Typography className={`${classes.text} ${classes.title}`} variant="h6">
                Nitrogen Advisor
            </Typography>
            <Typography className={classes.text} variant="h6">
                About
            </Typography>
        </Box>
    );
};
