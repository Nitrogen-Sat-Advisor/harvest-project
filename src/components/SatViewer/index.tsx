import React from 'react';
import { Map as OLMap } from 'ol';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import Map from '../Map';
import { leadingZero } from '../../utils/format';
import { MAP_CENTER, MONTHS, YEARS, getBasemap, getLayer } from './config';

const useStyle = makeStyles((theme) => ({
    container: {
        height: '100%'
    },
    containerItem: {
        padding: theme.spacing(2),
        paddingRight: 0
    },
    sidebarContainer: {
        '& > *': {
            padding: theme.spacing(2)
        }
    },
    sidebarHeader: {
        'background': theme.palette.secondary.light,
        '& > *': {
            marginRight: theme.spacing(1)
        }
    },
    monthYearContainer: {
        '& > *': {
            paddingRight: theme.spacing(1),
            paddingBottom: theme.spacing(1)
        }
    },
    inputLabel: {
        marginTop: theme.spacing(2),
        textTransform: 'uppercase'
    },
    monthButton: {
        color: '#eee'
    },
    mapContainer: {
        height: '100%',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
    legend: {
        height: theme.spacing(4),
        background: 'linear-gradient(90deg, #F8F700 0%, #0E7001 100%)'
    },
    opacityInput: {
        fontSize: '0.8rem',
        padding: theme.spacing(1)
    }
}));

const basemapLayer = getBasemap();

const Index = (): JSX.Element => {
    const classes = useStyle();

    const [selectedYear, updateSelectedYear] = React.useState<string>(YEARS[0]);
    const [selectedMonth, updateSelectedMonth] = React.useState<string>(MONTHS[0]);

    const [opacity, setOpacity] = React.useState<number>(30);

    const [map, updateMap] = React.useState<OLMap>();

    React.useEffect(() => {
        updateLayer();
    }, [map, opacity, selectedYear, selectedMonth]);

    const handleOpacityBlur = () => {
        if (opacity < 0) {
            setOpacity(0);
        } else if (opacity > 100) {
            setOpacity(100);
        }
    };

    const updateLayer = () => {
        if (map) {
            getLayer(
                map,
                opacity / 100,
                'gcvi',
                selectedYear,
                leadingZero(MONTHS.findIndex((month) => month === selectedMonth) + 4)
            );
        }
    };

    return (
        <Grid className={classes.container} container>
            <Grid className={classes.containerItem} container item xs={4}>
                <Paper className={`${classes.sidebarContainer} fullwidth`} square elevation={1}>
                    <Grid className={classes.sidebarHeader} container item alignItems="center">
                        <Grid item component={Fab} color="primary" size="medium">
                            <AddIcon />
                        </Grid>
                        <Grid item component={Typography} variant="h5">
                            Add Field
                        </Grid>
                    </Grid>
                    <Grid item component={Typography} variant="h5">
                        Your Fields
                    </Grid>
                    <Typography variant="body2">Select a field below to view satellite images for the field</Typography>
                </Paper>
            </Grid>
            <Grid className={classes.containerItem} item xs={8}>
                <Paper className="fillContainer" square elevation={0}>
                    <Box className="fillContainer" display="flex" flexDirection="column">
                        <Typography variant="h4">South Farm</Typography>

                        <Grid className={classes.monthYearContainer} container>
                            <Grid item xs={3}>
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <Typography className={classes.inputLabel} variant="body2">
                                        Year
                                    </Typography>
                                    <Select
                                        value={selectedYear}
                                        onChange={({ target: { value } }) => updateSelectedYear(value as string)}
                                    >
                                        {YEARS.map((year) => (
                                            <MenuItem key={year} value={year}>
                                                {year}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={9}>
                                <FormControl variant="outlined" fullWidth>
                                    <Typography className={classes.inputLabel} variant="body2">
                                        Month
                                    </Typography>
                                    <ButtonGroup
                                        size="medium"
                                        disableFocusRipple
                                        disableRipple
                                        disableElevation
                                        fullWidth
                                    >
                                        {MONTHS.map((month) => (
                                            <Button
                                                key={month}
                                                className={selectedMonth === month ? '' : classes.monthButton}
                                                color={selectedMonth === month ? 'primary' : 'secondary'}
                                                variant={selectedMonth === month ? 'outlined' : 'contained'}
                                                onClick={() => updateSelectedMonth(month)}
                                            >
                                                {month}
                                            </Button>
                                        ))}
                                    </ButtonGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid className={classes.mapContainer} container>
                            <Map
                                className="fillContainer"
                                zoom={10}
                                center={MAP_CENTER}
                                layers={[basemapLayer]}
                                updateMap={updateMap}
                            />
                        </Grid>
                        <Grid container>
                            <Grid item container xs={6} direction="column">
                                <Typography variant="body2">GREEN CHLOROPHYLL VEGETATION INDEX</Typography>
                                <Container disableGutters>
                                    <div className={classes.legend} />
                                </Container>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2">LESS</Typography>
                                    <Typography variant="body2">MORE</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={1} />
                            <Grid item container xs={4} direction="column">
                                <Typography variant="body2">LAYER TRANSPARENCY</Typography>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={7}>
                                        <Slider value={opacity} onChange={(e, value) => setOpacity(value as number)} />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            type="number"
                                            InputProps={{
                                                classes: { input: classes.opacityInput },
                                                inputProps: {
                                                    min: 0,
                                                    max: 100,
                                                    step: 5
                                                }
                                            }}
                                            variant="outlined"
                                            size="small"
                                            value={opacity}
                                            onChange={({ target: { value } }) => value && setOpacity(parseFloat(value))}
                                            onBlur={handleOpacityBlur}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Index;
