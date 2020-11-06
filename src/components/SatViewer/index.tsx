import React from 'react';
import { Feature, Map as OLMap } from 'ol';
import { Polygon } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { getVectorContext } from 'ol/render';
import TileWMSSource from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import { Fill, Style } from 'ol/style';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import CLU_FIXTURE from '../../fixtures/clu.json';
import { leadingZero } from '../../utils/format';
import Map from '../Map';
import { MAP_CENTER, SOURCES, MONTHS, YEARS, getBasemap } from './config';

const getSource = (year: string, month: string): TileWMSSource => {
    const layerName = `${year}-${month}`;
    let source = SOURCES[layerName];
    if (!source) {
        source = new TileWMSSource({
            url: `${process.env.GEOSERVER_URL}/sat-viewer/wms`,
            params: {
                LAYERS: `sat-viewer:${year}.${month}.15.gcvi`
            }
        });
        SOURCES[layerName] = source;
    }

    return source;
};

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
    farmContainer: {
        background: theme.palette.primary.light,
        marginBottom: theme.spacing(1),
        borderRadius: 5,
        cursor: 'pointer'
    },
    farmContainerSelected: {
        'background': theme.palette.primary.main,
        '& > *': {
            color: '#fff'
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

const boundaryLayer = new VectorLayer({
    style: undefined,
    zIndex: 1000,
    source: new VectorSource({
        features: []
    })
});
const boundaryStyle = new Style({
    fill: new Fill({
        color: 'black'
    })
});

const geotiffLayer = new TileLayer({});
geotiffLayer.on('postrender', (e) => {
    const vectorContext = getVectorContext(e);
    e.context.globalCompositeOperation = 'destination-in';
    boundaryLayer.getSource().forEachFeature((feature) => {
        vectorContext.drawFeature(feature, boundaryStyle);
    });
    e.context.globalCompositeOperation = 'source-over';
});

const Index = (): JSX.Element => {
    const classes = useStyle();

    const [selectedBoundary, updateSelectedBoundary] = React.useState<number>();

    const [selectedYear, updateSelectedYear] = React.useState<string>(YEARS[0]);
    const [selectedMonth, updateSelectedMonth] = React.useState<string>(MONTHS[0]);

    const [opacity, setOpacity] = React.useState<number>(100);

    const [map, updateMap] = React.useState<OLMap>();

    React.useEffect(() => {
        updateLayer();
    }, [map, selectedBoundary, opacity, selectedYear, selectedMonth]);

    const handleOpacityBlur = () => {
        if (opacity < 0) {
            setOpacity(0);
        } else if (opacity > 100) {
            setOpacity(100);
        }
    };

    const updateLayer = () => {
        if (map) {
            const boundary = CLU_FIXTURE.find(({ id }) => id === selectedBoundary);
            const source = getSource(
                selectedYear,
                leadingZero(MONTHS.findIndex((month) => month === selectedMonth) + 4)
            );

            if (boundary) {
                const boundarySource = boundaryLayer.getSource();
                boundarySource.clear();
                boundarySource.addFeature(
                    new Feature({
                        geometry: new Polygon([boundary.boundary])
                    })
                );
                const extent = boundarySource.getExtent();
                map.getView().fit(extent);
                geotiffLayer.setSource(source);
                geotiffLayer.setOpacity(opacity);
                geotiffLayer.setExtent(extent);
            }
        }
    };

    return (
        <Grid className={classes.container} container>
            <Grid className={classes.containerItem} container item xs={4}>
                <Paper className={`${classes.sidebarContainer} fullwidth`} square elevation={1}>
                    <Grid className={classes.sidebarHeader} container alignItems="center">
                        <Grid item component={Fab} color="primary" size="medium">
                            <AddIcon />
                        </Grid>
                        <Grid item component={Typography} variant="h5">
                            Add Field
                        </Grid>
                    </Grid>
                    <Typography variant="h5">Your Fields</Typography>
                    <Typography variant="body2">Select a field below to view satellite images for the field</Typography>
                    <Grid container direction="column" spacing={1}>
                        {CLU_FIXTURE.map(({ id, title }) => (
                            <Grid
                                key={id}
                                className={`${classes.farmContainer} ${
                                    id === selectedBoundary ? classes.farmContainerSelected : ''
                                }`}
                                item
                                container
                                alignItems="center"
                                onClick={() => updateSelectedBoundary(id)}
                            >
                                <Grid item xs={1} />
                                <Grid item xs={9} component={Typography} variant="body1">
                                    {title}
                                </Grid>
                                <Grid
                                    item
                                    xs={2}
                                    component={IconButton}
                                    onClick={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.warn(`DELETING ${id}`);
                                    }}
                                >
                                    <DeleteIcon />
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
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
                                projection="EPSG:4326"
                                zoom={10}
                                maxZoom={20}
                                center={MAP_CENTER}
                                layers={[basemapLayer, geotiffLayer, boundaryLayer]}
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
