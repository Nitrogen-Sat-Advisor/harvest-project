import React from 'react';
import axios from 'axios';
import { Map as OLMap, MapBrowserEvent } from 'ol';
import Feature from 'ol/Feature';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Crop from 'ol-ext/filter/Crop';
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
import Alert from '@material-ui/lab/Alert';

import type { Layer as LayerType } from 'ol/layer';

import MapMarkerIcon from '../../images/map-marker.svg';
import { leadingZero } from '../../utils/format';
import { LayoutStateContext } from '../Layouts/MainLayout';
import Map from '../Map';
import { MAP_CENTER, MONTHS, YEARS, getBasemap, getCLULayer, getGCVISource } from './config';

const useStyle = makeStyles((theme) => ({
    container: {
        height: '100%'
    },
    containerItem: {
        padding: theme.spacing(2),
        paddingRight: 0,
        height: '100%',
        overflowY: 'auto'
    },
    sidebarContainer: {
        'width': '99%',
        '& > *': {
            padding: theme.spacing(2)
        }
    },
    sidebarHeader: {
        'background': theme.palette.secondary.light,
        '& > *': {
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(2)
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
        background:
            'linear-gradient(90deg, #5e4fa2 0%, #3288bd 10%, #66c2a5 20%, #abdda4 30%, #e6f598 40%, #ffffbf 50%, #fee08b 60%, #fdae61 70%, #f46d43 80%, #d53e4f 90%, #9e0142 100%)'
    },
    opacityInput: {
        fontSize: '0.8rem',
        padding: theme.spacing(1)
    }
}));

const basemapLayer = getBasemap();
const cluLayer = getCLULayer();

const cropFeature = new Feature(new MultiPolygon([]));
const cropLayer = new Crop({
    feature: cropFeature,
    inner: false
});

const geotiffLayer = new TileLayer({});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
geotiffLayer.addFilter(cropLayer);

const selectedFieldBoundary = new VectorLayer({
    source: new VectorSource(),
    visible: false
});

const selectedFieldMarker = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
        image: new Icon({
            src: MapMarkerIcon,
            color: 'blue'
        })
    }),
    visible: false
});

const Index = (): JSX.Element => {
    const classes = useStyle();

    const {
        layoutState: { userId, clus },
        layoutStateDispatch
    } = React.useContext(LayoutStateContext);

    const [isAddingCLU, updateIsAddingCLU] = React.useState(false);
    const isAddingCLURef = React.useRef(isAddingCLU);
    const [newFieldName, updateNewFieldName] = React.useState('');
    const [newFieldCLUId, updateNewFieldCLUId] = React.useState<number | null>(null);

    const [userFields, updateUserFields] = React.useState<SatViewer.UserField[]>([]);

    const [selectedCLU, updateSelectedCLU] = React.useState<GeoJSONType.MultiPolygon>();

    const [selectedYear, updateSelectedYear] = React.useState<string>(YEARS[0]);
    const [selectedMonth, updateSelectedMonth] = React.useState<string>(MONTHS[0]);

    const [opacity, setOpacity] = React.useState<number>(100);

    const [map, updateMap] = React.useState<OLMap>();

    const isNewField = userFields.findIndex(({ clu: cluId }) => cluId === newFieldCLUId) === -1;

    React.useEffect(
        () => () => {
            // Clean up the map on unmount
            cropFeature.getGeometry().setCoordinates([]);
        },
        []
    );

    React.useEffect(() => {
        if (userId) {
            layoutStateDispatch({ type: 'isLoading', isLoading: true });
            axios
                .get(`${process.env.CLU_SERVER_URL}/user-field?user_id=${userId}`)
                .then(({ data }) => {
                    updateUserFields(data);
                })
                .catch((e) => {
                    console.error(`Could not get user fields ${userId}: ${e}`);
                })
                .finally(() => {
                    layoutStateDispatch({ type: 'isLoading', isLoading: false });
                });
        } else {
            updateUserFields([]);
            updateSelectedCLU(undefined);
        }
    }, [userId]);

    React.useEffect(() => {
        updateLayer();
    }, [map, selectedCLU, selectedYear, selectedMonth]);

    React.useEffect(() => {
        geotiffLayer.setOpacity(opacity / 100);
    }, [opacity]);

    const handleNewFieldCancel = () => {
        isAddingCLURef.current = false;
        updateIsAddingCLU(false);
        updateNewFieldName('');
        updateNewFieldCLUId(null);
        selectedFieldBoundary.setVisible(false);
        selectedFieldBoundary.getSource().clear();
        selectedFieldMarker.setVisible(false);
        selectedFieldMarker.getSource().clear();
    };

    const handleCLUToggle = (cluId: number) => {
        if (cluId && selectedCLU?.properties.clu_id === cluId) {
            // Deselect the field
            updateSelectedCLU(undefined);
        } else if (clus[cluId]) {
            // Get field from cache
            updateSelectedCLU(clus[cluId]);
        } else {
            // Fetch field from the API
            layoutStateDispatch({ type: 'isLoading', isLoading: true });
            axios
                .get(`${process.env.CLU_SERVER_URL}/CLUs/${cluId}`)
                .then(({ data }) => {
                    updateSelectedCLU(data);
                    layoutStateDispatch({ type: 'addCLU', clu: data as GeoJSONType.MultiPolygon });
                })
                .catch((e) => {
                    console.error(`Could not get CLU ${cluId}: ${e}`);
                })
                .finally(() => {
                    layoutStateDispatch({ type: 'isLoading', isLoading: false });
                });
        }
    };

    const handleOpacityBlur = () => {
        if (opacity < 0) {
            setOpacity(0);
        } else if (opacity > 100) {
            setOpacity(100);
        }
    };

    const handleMapClick = (event: MapBrowserEvent) => {
        if (isAddingCLURef.current) {
            const clickedLayer: LayerType | null = event.map.forEachLayerAtPixel(
                event.pixel,
                (layer) => layer.get('clu') && layer
            );
            if (clickedLayer) {
                const [long, lat] = event.coordinate;
                axios
                    .get(`${process.env.CLU_SERVER_URL}/CLUs?lat=${lat}&long=${long}`)
                    .then(({ data }) => {
                        const clu = data as GeoJSONType.MultiPolygon;
                        updateNewFieldCLUId(clu.properties.clu_id);
                        layoutStateDispatch({ type: 'addCLU', clu });
                        const selectedFieldSource = selectedFieldBoundary.getSource();
                        selectedFieldSource.clear();
                        const selectedFieldPolygon = new MultiPolygon(clu.coordinates);
                        selectedFieldSource.addFeature(new Feature(selectedFieldPolygon));
                        selectedFieldBoundary.setVisible(true);
                        const selectedFieldMarkerSource = selectedFieldMarker.getSource();
                        selectedFieldMarkerSource.clear();
                        const [xMin, yMin, xMax, yMax] = selectedFieldPolygon.getExtent();
                        selectedFieldMarker
                            .getSource()
                            .addFeature(new Feature(new Point([(xMin + xMax) / 2, (yMin + yMax) / 2])));
                        selectedFieldMarker.setVisible(true);
                    })
                    .catch((e) => {
                        console.error(`Could not get clu info: ${e}`);
                    });
            }
        }
    };

    const handleAddField = () => {
        if (newFieldCLUId && isNewField) {
            layoutStateDispatch({ type: 'isLoading', isLoading: true });
            axios
                .post(`${process.env.CLU_SERVER_URL}/user-field`, {
                    user_id: userId,
                    clu: newFieldCLUId,
                    clu_name: newFieldName
                })
                .then(() => {
                    updateUserFields([...userFields, { clu: newFieldCLUId, clu_name: newFieldName }]);
                    handleCLUToggle(newFieldCLUId);
                    handleNewFieldCancel();
                })
                .catch((e) => {
                    console.error(`Could not add new field: ${e}`);
                })
                .finally(() => {
                    layoutStateDispatch({ type: 'isLoading', isLoading: false });
                });
        }
    };

    const handleDeleteField = (cluId: number) => {
        layoutStateDispatch({ type: 'isLoading', isLoading: true });
        axios
            .delete(`${process.env.CLU_SERVER_URL}/user-field?user_id=${userId}&clu=${cluId}`)
            .then(() => {
                updateUserFields(userFields.filter(({ clu }) => clu !== cluId));
                if (cluId === selectedCLU?.properties.clu_id) {
                    updateSelectedCLU(undefined);
                }
            })
            .catch((e) => {
                console.error(`Could not delete field: ${e}`);
            })
            .finally(() => {
                layoutStateDispatch({ type: 'isLoading', isLoading: false });
            });
    };

    const updateLayer = () => {
        if (map) {
            const source = getGCVISource(
                selectedYear,
                leadingZero(MONTHS.findIndex((month) => month === selectedMonth) + 4)
            );

            if (selectedCLU) {
                cropFeature.getGeometry().setCoordinates(selectedCLU.coordinates);
                const extent = cropFeature.getGeometry().getExtent();
                map.getView().fit(extent, { padding: [200, 200, 200, 200] });
                geotiffLayer.setSource(source);
                geotiffLayer.setExtent(extent);
                geotiffLayer.setVisible(true);
            } else {
                geotiffLayer.setVisible(false);
            }
        }
    };

    return (
        <Grid className={classes.container} container>
            <Grid className={classes.containerItem} container item xs={4}>
                <Paper className={classes.sidebarContainer} square elevation={1}>
                    <Grid className={classes.sidebarHeader} container alignItems="center">
                        <Grid
                            item
                            component={Fab}
                            color="primary"
                            size="medium"
                            disabled={!userId}
                            onClick={() => {
                                updateIsAddingCLU(true);
                                isAddingCLURef.current = true;
                            }}
                        >
                            <AddIcon />
                        </Grid>
                        <Grid item component={Typography} variant="h5">
                            Add Field
                        </Grid>
                        {isAddingCLU ? (
                            <Grid item container xs={12} spacing={1}>
                                <Grid item xs={12} component={FormControl} variant="outlined" fullWidth>
                                    <Typography variant="body2" gutterBottom>
                                        Click on the map to select a field.
                                    </Typography>
                                    <Typography variant="body2">
                                        <i>Selected field:</i>
                                        &nbsp;
                                        <b>{newFieldCLUId || 'None'}</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} component={FormControl} variant="outlined" fullWidth>
                                    <Typography variant="body2">Field Name</Typography>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        placeholder="Field Name"
                                        value={newFieldName}
                                        onChange={({ target: { value } }) => updateNewFieldName(value)}
                                    />
                                </Grid>
                                <Grid item xs={4} />
                                <Grid item xs={4}>
                                    <Button fullWidth variant="contained" size="small" onClick={handleNewFieldCancel}>
                                        Cancel
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        disabled={!newFieldName || !newFieldCLUId || !isNewField}
                                        onClick={handleAddField}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Alert className={isNewField ? 'hidden' : ''} severity="warning">
                                        This field is already in your list
                                    </Alert>
                                </Grid>
                            </Grid>
                        ) : null}
                    </Grid>
                    <Typography variant="h5">Your Fields</Typography>
                    <Typography variant="body2">Select a field below to view satellite images for the field</Typography>
                    <Grid container direction="column" spacing={1}>
                        {userFields.map(({ clu: cluId, clu_name: cluName }) => (
                            <Grid
                                key={cluId}
                                className={`${classes.farmContainer} ${
                                    cluId === selectedCLU?.properties.clu_id ? classes.farmContainerSelected : ''
                                }`}
                                item
                                container
                                alignItems="center"
                                onClick={() => handleCLUToggle(cluId)}
                            >
                                <Grid item xs={1} />
                                <Grid item xs={9} component={Typography} variant="body1">
                                    {cluName}
                                </Grid>
                                <Grid
                                    item
                                    xs={2}
                                    component={IconButton}
                                    onClick={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteField(cluId);
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
                        <Typography variant="h4">
                            {userFields.find(({ clu: cluId }) => selectedCLU?.properties.clu_id === cluId)?.clu_name ||
                                'Select a field'}
                        </Typography>

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
                                maxZoom={16}
                                center={MAP_CENTER}
                                layers={[
                                    basemapLayer,
                                    cluLayer,
                                    geotiffLayer,
                                    selectedFieldBoundary,
                                    selectedFieldMarker
                                ]}
                                updateMap={updateMap}
                                events={{ click: handleMapClick }}
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
