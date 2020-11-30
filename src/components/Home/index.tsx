import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import background from '../../images/background.jpg';
import logoNAdvisor from '../../images/logo_n_advisor.png';
import logoSatViewer from '../../images/logo_sat_viewer.png';
import { headerHeight } from '../Layouts/MainLayout';
import { palette } from '../../theme';

const footerHeight = 80;

const useStyle = makeStyles((theme) => ({
    main: {
        height: `calc(100vh - ${headerHeight}px - ${footerHeight}px)`,
        background: `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.5) 100%), url(${background}) no-repeat center/cover`,
        margin: 0
    },
    footer: {
        'height': footerHeight,
        'background': palette.secondary.main,
        'padding': theme.spacing(2),
        'color': '#fff',
        '& a': {
            color: theme.palette.primary.main,
            fontWeight: 500,
            textDecoration: 'unset'
        }
    },
    toolCard: {
        background: '#fff'
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
        textAlign: 'center'
    },
    toolContent: {
        margin: '15px 25px',
        background: theme.palette.primary.light,
        color: theme.palette.secondary.main,
        textAlign: 'justify',
        flexGrow: 1
    }
}));

const Home = (): JSX.Element => {
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
                <Grid container item xs={4}>
                    <Grid
                        className={classes.toolCard}
                        container
                        item
                        xs={12}
                        direction="column"
                        alignItems="center"
                        spacing={3}
                    >
                        <Grid item>
                            <Avatar className={`${classes.toolAvatar} n-advisor`} src={logoNAdvisor} variant="square" />
                        </Grid>
                        <Grid className={classes.toolTitle} item>
                            <Typography component="b" variant="h6">
                                Nitrogen Rate Calculator
                            </Typography>
                        </Grid>
                        <Grid item>
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
                        </Grid>
                        <Grid className={classes.toolContent} item>
                            <Typography variant="body1">
                                Here we provide multiple tools for nitrogen rate calculators for Illinois corn growers.
                                As for now, we offer the classic MRTN tool to provide Maximum Return To Nitrogen rate
                                (MRTN) and Most Profitable N Rate, based on recent N rate research data funded
                                previously by Illinois Nutrient Research & Education Council. We plan to offer other
                                tools here later.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item xs={4}>
                    <Grid
                        className={classes.toolCard}
                        container
                        item
                        xs={12}
                        direction="column"
                        alignItems="center"
                        spacing={3}
                    >
                        <Grid item>
                            <Avatar
                                className={`${classes.toolAvatar} n-advisor`}
                                src={logoSatViewer}
                                variant="square"
                            />
                        </Grid>
                        <Grid className={classes.toolTitle} item>
                            <Typography component="b" variant="h6">
                                Satellite Viewer
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                component={Link}
                                to="satellite-viewer"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                            >
                                Go To Tool
                            </Button>
                        </Grid>
                        <Grid className={classes.toolContent} item>
                            <Typography variant="body1">
                                This tool provides growers to view real-time fine-scale satellite datasets for their
                                field. Users could select their fields, and the corresponding satellite images will be
                                visualized at a given time period. The current tool provides the satellite STAIR fusion
                                data for the green-chlorophyll-vegetation-index, with high value meaning better crop
                                growth.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid className={classes.footer} item xs={12} component={Typography} variant="caption">
                This project is funded as a seed project by NASA Harvest Program.&nbsp;
                <a href="http://faculty.nres.illinois.edu/~kaiyuguan/" target="_blank" rel="noreferrer">
                    Dr. Kaiyu Guan’s research group
                </a>
                &nbsp;leads this effort. For the MRTN tool, we are working with Dr. Emerson Nafziger to provide the
                scientific foundation.&nbsp;
                <a href="http://www.ncsa.illinois.edu/enabling/software" target="_blank" rel="noreferrer">
                    National Center for Supercomputing Applications (NCSA)
                </a>
                &nbsp;provides software development. Illinois Corn Growers Association provides outreach to Illinois
                growers. For any questions, please contact:&nbsp;
                <a href="mailto:ziyili5@illinois.edu">Ziyi Li</a>.
            </Grid>
        </>
    );
};

export default Home;
