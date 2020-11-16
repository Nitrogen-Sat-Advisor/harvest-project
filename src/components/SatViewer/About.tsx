import React from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const About = (): JSX.Element => {
    return (
        <>
            <Typography variant="h6">How to use the Satellite Viewer tool:</Typography>
            <List className="smallText">
                <ListItem>1. Create or log into your account.</ListItem>
                <ListItem>2. Select your fields by clicking the “add field” button and give their name.</ListItem>
                <ListItem>3. Choose the month you are interested in and adjust the layer transparency.</ListItem>
                <ListItem>
                    4. You could switch to different fields to view the satellite image for your fields.
                </ListItem>
            </List>
        </>
    );
};

export default About;
