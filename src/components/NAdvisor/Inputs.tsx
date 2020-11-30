import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import type { MapBrowserEvent } from 'ol';
import type { FeatureLike as FeatureType } from 'ol/Feature';
import type { Layer as LayerType, VectorTile as VectorTileType } from 'ol/layer';

import {
    MAP_CENTER,
    N_FERTILIZER,
    ROTATIONS,
    STYLES,
    getBasemap,
    getCountiesLayer,
    inputsDistrictsLayer
} from './config';

import Map from '../Map';
import { InputsContext } from './index';

const useStyle = makeStyles((theme) => ({
    container: {
        height: '100%'
    },
    containerItem: {
        'padding': theme.spacing(2),
        'display': 'flex',
        '& > *': {
            flexGrow: 1,
            padding: theme.spacing(2)
        }
    },
    lastColumn: {
        'flexDirection': 'column',
        '& > :first-child': {
            flexGrow: 0,
            marginBottom: theme.spacing(3)
        }
    },
    header: {
        height: 62,
        alignItems: 'center',
        background: theme.palette.primary.light,
        padding: `0 ${theme.spacing(2)}px`,
        marginBottom: theme.spacing(4)
    },
    step: {
        display: 'flex',
        marginRight: theme.spacing(2)
    },
    inputLabel: {
        marginTop: theme.spacing(2),
        textTransform: 'uppercase'
    },
    introContainer: {
        '& > *': {
            padding: theme.spacing(2)
        },
        '& a': {
            color: theme.palette.primary.dark,
            textDecoration: 'unset',
            fontWeight: 500
        }
    },
    intro: {
        background: theme.palette.secondary.light
    },
    introTitle: {
        color: theme.palette.primary.dark,
        marginBottom: theme.spacing(2)
    },
    introText: {
        fontSize: '0.9rem'
    },
    mapContainer: {
        flexGrow: 1,
        marginTop: theme.spacing(2)
    },
    rotationButtonGroup: {
        background: theme.palette.secondary.light,
        width: '100%'
    },
    rotationButton: {
        lineHeight: '1.3rem',
        textTransform: 'none',
        margin: theme.spacing(1),
        color: theme.palette.secondary.main,
        border: 'none',
        borderRadius: `${theme.spacing(0.5)}px !important`
    },
    rotationButtonSelected: {
        color: `${theme.palette.primary.main} !important`,
        borderRadius: `${theme.spacing(0.5)}px !important`,
        border: `2px solid ${theme.palette.primary.main} !important`,
        background: '#fff !important'
    }
}));

interface Props {
    areInputsValid: boolean;
    handleCalculate: () => void;
}

const basemapLayer = getBasemap();
const countiesLayer = getCountiesLayer();

const Inputs = (props: Props): JSX.Element => {
    const classes = useStyle();

    const { inputs, inputsDispatch } = React.useContext<NAdvisor.InputsContextType>(InputsContext);

    const inputsRef = React.useRef<{ previous: NAdvisor.InputsType; current: NAdvisor.InputsType }>({
        previous: inputs,
        current: inputs
    });

    React.useEffect(() => {
        const previous = inputsRef.current.current;

        if (previous.district !== inputs.district) {
            // Update styling of districts
            inputsDistrictsLayer.setStyle(STYLES.districts(inputs.district));
        }

        inputsRef.current = {
            previous,
            current: inputs
        };
    }, [inputs]);

    const handleMapClick = React.useCallback(
        (e: MapBrowserEvent) => {
            const currentInputs = inputsRef.current.current;

            const clickedObject: [FeatureType, LayerType] | null = e.map.forEachFeatureAtPixel(
                e.pixel,
                (feature, layer) => (layer.get('interactive') ? [feature, layer] : null)
            );

            if (clickedObject && currentInputs) {
                const [clickedFeature, clickedLayer] = clickedObject;
                const clickedDistrict = clickedFeature.get('id');

                if (currentInputs.district !== clickedDistrict) {
                    // Select the new district
                    inputsDispatch({ type: 'district', value: clickedDistrict });
                    (clickedLayer as VectorTileType).setStyle(STYLES.districts(clickedDistrict));
                }
            }
        },
        [inputsRef]
    );

    return (
        <Grid className={classes.container} container>
            <Grid
                className={`${classes.introContainer} ${classes.containerItem}`}
                container
                item
                xs={4}
                direction="column"
            >
                <Box className={classes.intro}>
                    <Box className={classes.header} display="flex">
                        <Typography variant="h5">Get Started Here!</Typography>
                        <ArrowForwardIcon fontSize="large" />
                    </Box>
                    <Container>
                        <Typography className={classes.introTitle} variant="h5">
                            What is Nitrogen Rate Calculator?
                        </Typography>
                        <Typography className={classes.introText} variant="body2">
                            Here we provide the classic Maximum Return To Nitrogen rate (MRTN) tool for Illinois corn
                            growers. The MRTN tool is to provide Maximum Return To N (largest net benefits) and Most
                            Profitable N Rate, based on recent N rate research data funded previously by Illinois
                            Nutrient Research & Education Council. Generally, MRTN gets the Most Profitable N Rate by
                            finding the N rate leading to the largest net benefits, which are calculated by considering
                            both the yield benefits and fertilizer cost. The yield benefits are estimated based on the
                            nitrogen-yield response curve and the corn price. The MRTN approach is widely used in many
                            Midwest states as the corn N rate guidelines.
                        </Typography>
                        <Typography className={classes.introText} variant="body2">
                            This project is funded as a seed project by NASA Harvest Program. Dr. Kaiyu Guan’s research
                            group leads this effort. For the MRTN tool, we are working with Dr. Emerson Nafziger to
                            provide the scientific foundation. National Center for Supercomputing Applications (NCSA)
                            provides software development. Illinois Corn Growers Association provides outreach to
                            Illinois growers. For any questions, please contact&nbsp;
                            <a href="mailto:ziyili5@illinois.edu">Ziyi Li</a>.
                        </Typography>
                    </Container>
                </Box>
            </Grid>
            <Grid className={classes.containerItem} item xs={4}>
                <Paper square>
                    <Box className="fillContainer" display="flex" flexDirection="column">
                        <Box display="flex">
                            <Typography className={`${classes.header} ${classes.step}`} variant="h4">
                                1
                            </Typography>
                            <Typography variant="h6">Select the district in which your farm is located.</Typography>
                        </Box>

                        <FormControl fullWidth variant="outlined" size="small">
                            <Typography className={classes.inputLabel} variant="caption">
                                Select A District
                            </Typography>
                            <Select
                                value={inputs.district}
                                onChange={({ target: { value } }) =>
                                    inputsDispatch({
                                        type: 'district',
                                        value: (value || '') as string
                                    })
                                }
                            >
                                <MenuItem value="">---</MenuItem>
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((district) => (
                                    <MenuItem key={district} value={district}>
                                        District {district}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Container className={classes.mapContainer} disableGutters>
                            <Map
                                className="fillContainer"
                                zoom={6.5}
                                center={MAP_CENTER}
                                layers={[basemapLayer, countiesLayer, inputsDistrictsLayer]}
                                events={{ click: handleMapClick }}
                            />
                        </Container>
                    </Box>
                </Paper>
            </Grid>
            <Grid className={`${classes.containerItem} ${classes.lastColumn}`} item xs={4}>
                <Paper square>
                    <Box display="flex">
                        <Typography className={`${classes.header} ${classes.step}`} variant="h4">
                            2
                        </Typography>
                        <Typography variant="h6">Enter management practices</Typography>
                    </Box>

                    <Typography className={classes.inputLabel} variant="caption">
                        Rotation
                    </Typography>
                    <ToggleButtonGroup
                        classes={{ root: classes.rotationButtonGroup, grouped: classes.rotationButton }}
                        value={inputs.rotation}
                        exclusive
                        size="small"
                        onChange={(e, value) => {
                            if (value) {
                                inputsDispatch({ type: 'rotation', value });
                            }
                        }}
                    >
                        <ToggleButton classes={{ selected: classes.rotationButtonSelected }} value="cc">
                            {ROTATIONS.cc}
                        </ToggleButton>
                        <ToggleButton classes={{ selected: classes.rotationButtonSelected }} value="cs">
                            {ROTATIONS.cs}
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <FormControl fullWidth variant="outlined" size="small">
                        <Typography className={classes.inputLabel} variant="caption">
                            N Fertilizer
                        </Typography>
                        <Select
                            value={inputs.nFertilizer}
                            onChange={({ target: { value } }) =>
                                inputsDispatch({
                                    type: 'nFertilizer',
                                    value: parseInt(value as string, 10)
                                })
                            }
                        >
                            {N_FERTILIZER.map(({ label }, idx) => (
                                <MenuItem key={label} value={idx}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" fullWidth>
                        <Typography className={classes.inputLabel} variant="caption">
                            Nitrogen Price ($/Ton)
                        </Typography>
                        <TextField
                            type="number"
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            size="small"
                            value={inputs.nPriceTon}
                            onChange={({ target: { value } }) =>
                                inputsDispatch({
                                    type: 'nPriceTon',
                                    value: parseFloat(value)
                                })
                            }
                        />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth>
                        <Typography className={classes.inputLabel} variant="caption">
                            Nitrogen Price ($/ lb N)
                        </Typography>
                        <TextField
                            type="number"
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            size="small"
                            value={inputs.nPrice}
                            onChange={({ target: { value } }) =>
                                inputsDispatch({
                                    type: 'nPrice',
                                    value: parseFloat(value)
                                })
                            }
                        />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth>
                        <Typography className={classes.inputLabel} variant="caption">
                            Corn Price ($/bu)
                        </Typography>
                        <TextField
                            type="number"
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            size="small"
                            value={inputs.cornPrice}
                            onChange={({ target: { value } }) =>
                                inputsDispatch({
                                    type: 'cornPrice',
                                    value: parseFloat(value)
                                })
                            }
                        />
                    </FormControl>
                </Paper>

                <Paper square>
                    <Box display="flex">
                        <Typography className={`${classes.header} ${classes.step}`} variant="h4">
                            3
                        </Typography>
                        <Typography variant="h6">Run the Tool</Typography>
                    </Box>

                    <Box display="flex">
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            disabled={!props.areInputsValid}
                            onClick={props.handleCalculate}
                        >
                            Calculate
                        </Button>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Inputs;
