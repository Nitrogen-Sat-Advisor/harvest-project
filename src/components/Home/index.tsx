import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
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
import logoACES from '../../images/logo_aces.png';
import logoNASA from '../../images/logo_nasa.png';
import logoHarvest from '../../images/logo_harvest.png';
import logoICGA from '../../images/logo_icga.png';
import { headerHeight } from '../Layouts/MainLayout';
import { palette } from '../../theme';

const footerHeight = '120px';

const useStyle = makeStyles((theme) => ({
    main: {
        height: `calc(100vh - ${headerHeight} - ${footerHeight})`,
        background: `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.5) 100%), url(${background}) no-repeat center/cover`,
        margin: 0
    },
    footer: {
        'height': footerHeight,
        'background': palette.secondary.main,
        'color': '#fff',

        '& h5': {
            fontSize: '1.75rem'
        }
    },
    footerText: {
        'marginTop': theme.spacing(2),
        '& span': {
            lineHeight: '1rem'
        },
        '& a': {
            color: theme.palette.secondary.light
        }
    },
    footerLogos: {
        '& > div': {
            margin: 10
        }
    },
    logo: {
        height: theme.spacing(8),
        marginRight: theme.spacing(1)
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
                            Here we provide multiple tools for nitrogen rate calculators for Illinois corn growers. As
                            for now, we offer the classic MRTN tool to provide Maximum Return To Nitrogen rate (MRTN)
                            and Most Profitable N Rate, based on recent N rate research data funded previously by
                            Illinois Nutrient Research & Education Council. We plan to offer other tools here later.
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
                            This tool provides growers to view real-time fine-scale satellite datasets for their field.
                            Users could select their fields, and the corresponding satellite images will be visualized
                            at a given time period. The current tool provides the satellite STAIR fusion data for the
                            green-chlorophyll-vegetation-index, with high value meaning better crop growth.
                        </CardContent>
                        <CardActions className={classes.toolActions}>
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
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <Grid className={classes.footer} item xs={12} component="footer">
                <Grid container item xs={12} justify="center" spacing={2}>
                    <Grid item xs={1} />
                    <Grid className={classes.footerText} item xs={5}>
                        <Typography variant="caption">
                            This project is funded as a seed project by NASA Harvest Program.&nbsp;
                            <a href="http://faculty.nres.illinois.edu/~kaiyuguan/" target="_blank" rel="noreferrer">
                                Dr. Kaiyu Guan’s research group
                            </a>
                            &nbsp;leads this effort. For the MRTN tool, we are working with Dr. Emerson Nafziger to
                            provide the scientific foundation.&nbsp;
                            <a href="http://www.ncsa.illinois.edu/enabling/software" target="_blank" rel="noreferrer">
                                National Center for Supercomputing Applications (NCSA)
                            </a>
                            &nbsp;provides software development. Illinois Corn Growers Association provides outreach to
                            Illinois growers. For any questions, please contact:&nbsp;
                            <a href="mailto:ziyili5@illinois.edu">Ziyi Li</a>.
                        </Typography>
                    </Grid>
                    <Grid
                        className={classes.footerLogos}
                        container
                        item
                        xs={6}
                        justify="center"
                        alignItems="center"
                        alignContent="space-around"
                    >
                        <Box display="flex">
                            <img className={classes.logo} src={logoACES} alt="ACES logo" />
                            <img className={classes.logo} src={logoNASA} alt="ACES logo" />
                            <img className={classes.logo} src={logoHarvest} alt="ACES logo" />
                            <img className={classes.logo} src={logoICGA} alt="ACES logo" />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Home;
