import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LoginIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import Alert from '@material-ui/lab/Alert';

import type { Theme } from '@material-ui/core/styles';

import logoSatViewer from '../../images/logo_sat_viewer.png';
import { LayoutStateContext } from '../Layouts/MainLayout';
import { USERS } from './config';

const useStyle = makeStyles((theme: Theme) => ({
    text: {
        fontWeight: 400,
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
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

    const [isLoginModalOpen, updateIsLoginModalOpen] = React.useState(false);

    const [username, updateUsername] = React.useState(USERS[0]);
    const [password, updatePassword] = React.useState('123456');

    return (
        <Box display="flex" justifyItems="center" alignContent="center" alignItems="center" flexGrow={1}>
            <IconButton edge="start" component={Link} to={process.env.PUBLIC_PATH}>
                <HomeIcon />
            </IconButton>
            <Avatar src={logoSatViewer} variant="square" />
            <Typography className={`${classes.text} ${classes.title}`} variant="h6">
                Satellite Viewer
            </Typography>
            <Typography className={classes.text} variant="h6">
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
                    onClick={() => updateIsLoginModalOpen(true)}
                >
                    Sign In
                </Button>
            )}
            <Modal open={isLoginModalOpen} onClose={() => updateIsLoginModalOpen(false)}>
                <Container className={`modal ${classes.loginContainer}`}>
                    <Alert severity="warning">
                        You can sign in by entering any of the following user emails with any password:
                        <List dense>
                            {USERS.map((user) => (
                                <ListItem key={user} dense>
                                    {user}
                                </ListItem>
                            ))}
                        </List>
                    </Alert>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        autoFocus
                        value={username}
                        onChange={({ target: { value } }) => updateUsername(value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={({ target: { value } }) => updatePassword(value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={!username || !password || !USERS.includes(username)}
                        onClick={() => {
                            layoutStateDispatch({ type: 'userId', userId: username });
                            updateIsLoginModalOpen(false);
                        }}
                    >
                        Sign In
                    </Button>
                </Container>
            </Modal>
        </Box>
    );
};
