import React from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';

import { LayoutStateContext } from '../Layouts/MainLayout';
import { USERS } from '../SatViewer/config';

interface Props {
    handleClose: () => void;
}

const Login = (props: Props): JSX.Element => {
    const { layoutStateDispatch } = React.useContext(LayoutStateContext);

    const [username, updateUsername] = React.useState(USERS[0]);
    const [password, updatePassword] = React.useState('123456');

    return (
        <>
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
                    props.handleClose();
                }}
            >
                Sign In
            </Button>
        </>
    );
};

export default Login;
