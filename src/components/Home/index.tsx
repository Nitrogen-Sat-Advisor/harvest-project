import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import background from '../../images/background.jpg';
import logoNAdvisor from '../../images/logo_n_advisor.png';
import logoSatViewer from '../../images/logo_sat_viewer.png';
import { footerHeight, footerStyle, headerHeight } from '../Layouts/styles';

const useStyle = makeStyles((theme) => ({
    main: {
        height: `calc(100vh - ${headerHeight} - ${footerHeight})`,
        background: `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.5) 100%), url(${background}) no-repeat center/cover`,
        margin: 0
    },
    footer: footerStyle,
    footerText: {
        'maxWidth': 365,
        'marginTop': 20,
        '& span': {
            lineHeight: '1rem'
        }
    },
    footerLogos: {
        '& > div': {
            margin: 10
        }
    },
    toolCardHeader: {
        flexDirection: 'column'
    },
    toolCard: {
        maxWidth: 410,
        lineHeight: '1.5rem'
    },
    toolAvatar: {
        'width': 107,
        'height': 107,
        '&.n-advisor': {
            background: '#506B72'
        },
        '&.sat-viewer': {
            background: '#C3C9CC'
        },
        '& img': {
            width: 80,
            height: 80
        }
    },
    toolTitle: {
        fontWeight: 'bold',
        fontSize: '2rem'
    },
    toolContent: {
        background: theme.palette.primary.light,
        color: theme.palette.secondary.main,
        margin: '15px 25px'
    },
    toolActions: {
        justifyContent: 'center',
        padding: '8px 60px',
        marginBottom: 20
    }
}));

const Home: React.FC = () => {
    const classes = useStyle();

    return (
        <>
            <Grid
                className={classes.main}
                container
                item
                xs={12}
                justify="center"
                alignContent="space-around"
                spacing={5}
            >
                <Grid item xs={4}>
                    <Card classes={{ root: classes.toolCard }} square>
                        <CardHeader
                            classes={{
                                root: classes.toolCardHeader,
                                title: classes.toolTitle
                            }}
                            avatar={
                                <Avatar
                                    className={`${classes.toolAvatar} n-advisor`}
                                    src={logoNAdvisor}
                                    variant="square"
                                />
                            }
                            title="Nitrogen Advisor"
                            titleTypographyProps={{ component: 'b', variant: 'h4', align: 'center' }}
                        />
                        <CardContent className={classes.toolContent}>
                            iLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non leo consectetur,
                            condimentum neque id, sodales nulla. Integer a lorem consectetur, efficitur justo in,
                            malesuada est. Phasellus sed ex vel mauris luctus mattis. Aenean sed velit at leo porttitor
                            fringilla.
                        </CardContent>
                        <CardActions className={classes.toolActions}>
                            <Button
                                component={Link}
                                to="nitrogen-advisor"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                            >
                                Go To Tool
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card classes={{ root: classes.toolCard }} square>
                        <CardHeader
                            classes={{
                                root: classes.toolCardHeader,
                                title: classes.toolTitle
                            }}
                            avatar={
                                <Avatar
                                    className={`${classes.toolAvatar} sat-viewer`}
                                    src={logoSatViewer}
                                    variant="square"
                                />
                            }
                            title="Satellite Viewer"
                            titleTypographyProps={{ component: 'b', variant: 'h4', align: 'center' }}
                        />
                        <CardContent className={classes.toolContent}>
                            iLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non leo consectetur,
                            condimentum neque id, sodales nulla. Integer a lorem consectetur, efficitur justo in,
                            malesuada est. Phasellus sed ex vel mauris luctus mattis. Aenean sed velit at leo porttitor
                            fringilla.
                        </CardContent>
                        <CardActions className={classes.toolActions}>
                            <Button
                                component={Link}
                                to="/satellite-viewer"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                            >
                                Go To Tool
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <Grid className={classes.footer} item xs={12} component="footer">
                <Grid container item xs={12} justify="center" spacing={2}>
                    <Grid className={classes.footerText} item xs={4}>
                        <Typography variant="caption">
                            iLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non leo consectetur,
                            condimentum neque id, sodales nulla. Integer a lorem consectetur, efficitur justo in,
                            malesuada est. Phasellus sed ex vel mauris luctus mattis. Aenean sed velit at leo porttitor
                            fringilla.
                        </Typography>
                    </Grid>
                    <Grid
                        className={classes.footerLogos}
                        container
                        item
                        xs={4}
                        justify="center"
                        alignItems="center"
                        alignContent="space-around"
                    >
                        <Avatar />
                        <Avatar />
                        <Avatar />
                        <Avatar />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Home;
