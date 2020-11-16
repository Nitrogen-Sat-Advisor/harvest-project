import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LoginIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';

import type { Theme } from '@material-ui/core/styles';

import logoSatViewer from '../../images/logo_sat_viewer.png';
import { LayoutStateContext } from '../Layouts/MainLayout';
import Login from '../Login';
import About from './About';

const useStyle = makeStyles((theme: Theme) => ({
    text: {
        fontWeight: 400,
        marginLeft: theme.spacing(2),
        marginRight: `${theme.spacing(2)}px !important`
    },
    title: {
        flexGrow: 1
    },
    loginContainer: {
        width: 500
    }
}));

export const Header = (): JSX.Element => {
    const classes = useStyle();

    const {
        layoutState: { userId },
        layoutStateDispatch
    } = React.useContext(LayoutStateContext);

    const [modalContent, updateModalContent] = React.useState<'login' | 'about'>();

    return (
        <Box display="flex" justifyItems="center" alignContent="center" alignItems="center" flexGrow={1}>
            <IconButton edge="start" component={Link} to={process.env.PUBLIC_PATH}>
                <HomeIcon />
            </IconButton>
            <Avatar src={logoSatViewer} variant="square" />
            <Typography className={`${classes.text} ${classes.title}`} variant="h6">
                Satellite Viewer
            </Typography>
            <Typography
                className={`${classes.text} pointer`}
                variant="h6"
                component="a"
                onClick={() => updateModalContent('about')}
            >
                About
            </Typography>
            {userId ? (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AccountCircleIcon />}
                    onClick={() => {
                        layoutStateDispatch({ type: 'userId', userId: null });
                    }}
                >
                    {userId}
                </Button>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LoginIcon />}
                    onClick={() => updateModalContent('login')}
                >
                    Sign In
                </Button>
            )}
            <Modal open={!!modalContent} onClose={() => updateModalContent(undefined)}>
                <Container className={`modal ${modalContent === 'login' ? classes.loginContainer : ''}`}>
                    {modalContent === 'login' ? <Login handleClose={() => updateModalContent(undefined)} /> : null}
                    {modalContent === 'about' ? <About /> : null}
                </Container>
            </Modal>
        </Box>
    );
};
