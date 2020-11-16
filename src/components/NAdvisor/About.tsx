import React from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const About = (): JSX.Element => {
    return (
        <>
            <Typography variant="h6">How to use the MRTN tool:</Typography>
            <List className="smallText">
                <ListItem>1. Choose which regions you are interested in.</ListItem>
                <ListItem>
                    2. Choose the rotation pattern (two options: corn following soybean, or corn following corn).
                </ListItem>
                <ListItem>
                    3. Choose the N fertilizer product and price, and corn grain price. The prices for N and corn have
                    default values already entered. Users can make changes to reflect the actual current price.
                </ListItem>
                <ListItem>
                    4. Click the calculate button to run the calculations. If you choose N or corn prices that are
                    unreasonable (e.g. too high or low), you may get a wrong figure. If that happens, please use a
                    realistic price.
                </ListItem>
            </List>
            <Typography variant="h6">Definitions:</Typography>
            <List className="smallText">
                <ListItem>
                    <b>EONR:</b>
                    &nbsp;Economic Optimum N Rate, the x coordinate of the maximum point for the Net Return curve
                    generated based on one experiment data in one selected region under one specific rotation.
                </ListItem>
                <ListItem>
                    <b>MRTN:</b>
                    &nbsp;Maximum Return to N rate, the N rate where the economic net return to N application is
                    maximized.
                </ListItem>
                <ListItem>
                    <b>Maximum Yield:</b>
                    &nbsp;The yield where application of more N does not result in yield increase.
                </ListItem>
                <ListItem>
                    <b>Net Return:</b>
                    &nbsp;The value of corn grain produced (averaging multi-year Nitrogen-yield response) minus the N
                    fertilization cost.
                </ListItem>
                <ListItem>
                    <b>Price Ratio:</b>
                    &nbsp;The ratio of N fertilizer price to corn grain price ($/lb:$/bu).
                </ListItem>
                <ListItem>
                    <b>Site:</b>
                    &nbsp;The land area occupied by a N rate trial, either replicated small plots in a specific field
                    area or replicated field-length strips.
                </ListItem>
                <ListItem>
                    <b>Gross (Yield) Return:</b>
                    &nbsp;The value of corn grain increases due to N application.
                </ListItem>
            </List>
        </>
    );
};

export default About;
