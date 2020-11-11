import React from 'react';
import axios from 'axios';
import { Map as OLMap, MapBrowserEvent } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { getVectorContext } from 'ol/render';
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

import type { Layer as LayerType } from 'ol/layer';
import type TileWMSSource from 'ol/source/TileWMS';

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
        background: 'linear-gradient(90deg, #F8F700 0%, #0E7001 100%)'
    },
    opacityInput: {
        fontSize: '0.8rem',
        padding: theme.spacing(1)
    }
}));

const basemapLayer = getBasemap();
const cluLayer = getCLULayer();

const boundaryLayer = new VectorLayer({
    style: undefined,
    zIndex: 1000,
    source: new VectorSource({
        features: []
    }),
    opacity: 0
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

    const [selectedYear, updateSelectedYear] = React.useState<string>(YEARS[0]);
    const [selectedMonth, updateSelectedMonth] = React.useState<string>(MONTHS[0]);

    const [opacity, setOpacity] = React.useState<number>(100);

    const [map, updateMap] = React.useState<OLMap>();

    React.useEffect(() => {
        updateLayer();
    }, [map, selectedCLU, selectedYear, selectedMonth]);

    React.useEffect(() => {
        geotiffLayer.setOpacity(opacity);
    }, [opacity]);

    const handleNewFieldCancel = () => {
        isAddingCLURef.current = false;
        updateIsAddingCLU(false);
        updateNewFieldName('');
        updateNewFieldCLUId(null);
    };

    const handleCLUSelect = (cluId: number) => {
        if (clus[cluId]) {
            updateSelectedCLU(clus[cluId]);
        } else {
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
                const cluSource = clickedLayer.getSource() as TileWMSSource;
                const infoUrl = cluSource.getFeatureInfoUrl(
                    event.coordinate,
                    event.map.getView().getResolution(),
                    'EPSG:4326',
                    {
                        INFO_FORMAT: 'application/json'
                    }
                );
                axios
                    .get(infoUrl)
                    .then(({ data: { features } }) => {
                        if (features[0]) {
                            updateNewFieldCLUId(parseInt(features[0].id.split('.')[1], 10));
                        }
                    })
                    .catch((e) => {
                        console.error(`Could not get clu info: ${e}`);
                    });
            }
        }
    };

    const handleAddField = () => {
        if (newFieldCLUId) {
            layoutStateDispatch({ type: 'isLoading', isLoading: true });
            axios
                .post(`${process.env.CLU_SERVER_URL}/user-field`, {
                    user_id: userId,
                    clu: newFieldCLUId,
                    clu_name: newFieldName
                })
                .then(() => {
                    updateUserFields([...userFields, { clu: newFieldCLUId, clu_name: newFieldName }]);
                    handleCLUSelect(newFieldCLUId);
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
                const boundarySource = boundaryLayer.getSource();
                boundarySource.clear();
                boundarySource.addFeatures(new GeoJSON().readFeatures(selectedCLU));
                const extent = boundarySource.getExtent();
                map.getView().fit(extent);
                geotiffLayer.setSource(source);
                geotiffLayer.setExtent(extent);
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
                                        disabled={!newFieldName || !newFieldCLUId}
                                        onClick={handleAddField}
                                    >
                                        Submit
                                    </Button>
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
                                onClick={() => handleCLUSelect(cluId)}
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
                                layers={[basemapLayer, cluLayer, geotiffLayer, boundaryLayer]}
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
