import React from 'react';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleBand, scaleLinear } from 'd3-scale';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { precision, precisionStr } from '../../utils/format';
import { useElementRect } from '../../utils/hooks';
import Map from '../Map';
import Legend from '../Plots/Legend';
import PlotBarChart from '../Plots/PlotBarChart';
import PlotGrid from '../Plots/PlotGrid';
import PlotLine from '../Plots/PlotLine';
import {
    MAP_CENTER,
    N_FERTILIZER,
    RESULTS_TEXTS,
    ROTATIONS,
    STYLES,
    getBasemap,
    resultsDistrictsLayer
} from './config';
import { InputsContext } from './index';
import PlotDots from '../Plots/PlotDots';

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
        background: theme.palette.secondary.light
    },
    inputsContainer: {
        'height': '75%',
        'width': '100%',
        'marginTop': theme.spacing(2),
        '& > *': {
            paddingRight: 0
        }
    },
    mapContainer: {
        height: 160,
        width: '45%'
    },
    columnKey: {
        color: theme.palette.secondary.main
    },
    columnValue: {
        fontWeight: 500
    },
    resultsHighlight: {
        backgroundSize: '20px 20px',
        backgroundPosition: '25px 50px'
    },
    plotContainer: {
        height: '50%',
        padding: theme.spacing(2)
    },
    helpTextContainer: {
        flexGrow: 1,
        marginTop: theme.spacing(3)
    }
}));

interface Props {
    results: NAdvisor.ResultsType;
    handleBack: () => void;
}

const basemapLayer = getBasemap();

const Results = (props: Props): JSX.Element => {
    const classes = useStyle();

    const { inputs } = React.useContext<NAdvisor.InputsContextType>(InputsContext);

    const [activePlot, updateActivePlot] = React.useState('return_to_n');

    const plotContainerRef = React.useRef<HTMLDivElement>(null);
    const plotContainerRect = useElementRect(plotContainerRef);

    const legendContainerRef = React.useRef<HTMLDivElement>(null);
    const legendContainerRect = useElementRect(legendContainerRef);

    resultsDistrictsLayer.setStyle(STYLES.districts(inputs.district));

    const { results } = props;
    const xMin = results.xn[0];
    const xMax = results.xn[results.xn.length - 1];
    let xScale: Plot.xScale;

    const yMin = 0;
    let yMax = 0;
    let yTickInterval = 50;

    let xTitle;
    let yTitle;

    const plots = [];
    const legends: Plot.LegendDatum[] = [];

    switch (activePlot) {
        case 'return_to_n':
            {
                xScale = scaleLinear().domain([xMin, xMax]);
                xTitle = 'N Rate - lb N/acre';
                yTitle = 'Return to N - $/acre';
                legends.push(
                    { label: 'Gross Return to N', color: '#1AB146', type: 'line', width: 4 },
                    { label: 'Net Return to N', color: '#0C64AB', type: 'line', width: 4 },
                    { label: 'Fertilizer N Cost', color: '#EC7E41', type: 'line', width: 4 },
                    { label: 'Profitable N Rate Range', color: '#F9E776', type: 'polygon' }
                );
                const dataYc = results.Yc.map((y, i) => {
                    if (y > yMax) {
                        yMax = y;
                    }
                    return { x: results.xn[i], y };
                });
                const dataYf = results.Yf.map((y, i) => {
                    if (y > yMax) {
                        yMax = y;
                    }
                    return { x: results.xn[i], y };
                });
                let xMaxYrtn = 0;
                let yMaxYrtn = 0;
                const dataYrtn = results.Yrtn.map((y, i) => {
                    const x = results.xn[i];
                    if (y > yMax) {
                        yMax = y;
                    }
                    if (y > yMaxYrtn) {
                        yMaxYrtn = y;
                        xMaxYrtn = x;
                    }
                    return { x, y };
                });
                yMax = Math.ceil(yMax * 0.022) * 50;
                plots.push(
                    <PlotBarChart
                        key="n_rate_range"
                        data={[{ x: results.xn[results.Xmin], y: yMax }]}
                        width={results.xn[results.Xmax] - results.xn[results.Xmin]}
                        fill="#F9E776"
                        fillOpacity={1}
                        strokeOpacity={0}
                    />,
                    <PlotLine
                        key="Yc"
                        data={dataYc}
                        stroke="#1AB146"
                        strokeWidth={4}
                        strokeOpacity={1}
                        fillOpacity={0}
                    />,
                    <PlotLine
                        key="Yf"
                        data={dataYf}
                        stroke="#EC7E41"
                        strokeWidth={4}
                        strokeOpacity={1}
                        fillOpacity={0}
                    />,
                    <PlotLine
                        key="Yrtn"
                        data={dataYrtn}
                        stroke="#0C64AB"
                        strokeWidth={4}
                        strokeOpacity={1}
                        fillOpacity={0}
                    />,
                    <PlotDots
                        key="maxYrtn"
                        data={[{ x: xMaxYrtn, y: yMaxYrtn }]}
                        radius={5}
                        strokeOpacity={1}
                        fill="#0C64AB"
                        fillOpacity={1}
                    />
                );
            }
            break;
        case 'percent_of_max_yield':
            {
                xScale = scaleLinear().domain([xMin, xMax]);
                xTitle = 'N Rate - lb N/acre';
                yTitle = 'Percent of Maximum Yield';
                legends.push({ label: 'Return to N', color: '#0C64AB', type: 'line', width: 4 });
                const dataYpmy = results.Ypmy.map((y, i) => {
                    if (y > yMax) {
                        yMax = y;
                    }
                    return { x: results.xn[i], y };
                });
                yMax = Math.ceil(yMax * 0.022) * 50;
                plots.push(
                    <PlotBarChart
                        key="n_rate_range"
                        data={[{ x: results.xn[results.Xmin], y: yMax }]}
                        width={results.xn[results.Xmax] - results.xn[results.Xmin]}
                        fill="#F9E776"
                        fillOpacity={1}
                        strokeOpacity={0}
                    />,
                    <PlotLine
                        key="Ypmy"
                        data={dataYpmy}
                        stroke="#0C64AB"
                        strokeWidth={4}
                        strokeOpacity={1}
                        fillOpacity={0}
                    />
                );
            }
            break;
        case 'fonr':
            {
                xTitle = 'Economic Optimum N Rate - lb/acre';
                yTitle = '% of sites';
                const data = Object.entries(
                    results.En.reduce((bins: { [k: number]: number }, en) => {
                        const bin = Math.floor(en * 0.04) * 25; // 0.04 is 0.999 * 25, which makes sure the upper range is inclusive and lower range is exclusive
                        bins[bin] = (bins[bin] || 0) + 1;
                        return bins;
                    }, {})
                )
                    .sort((d1, d2) => d1[0].localeCompare(d2[0]))
                    .map(([bin, count]) => {
                        const y = (100 * count) / results.En.length;
                        if (y > yMax) {
                            yMax = y;
                        }
                        return { x: bin, y };
                    });
                const categories = [];
                const maxBin = parseFloat(data[data.length - 1].x) + 25;
                for (let i = 0; i <= maxBin; i += 25) {
                    categories.push(i.toString());
                }
                xScale = scaleBand().domain(categories).paddingInner(0.1);
                yMax = Math.ceil(yMax * 0.022) * 50;
                yTickInterval = 5;
                plots.push(
                    <PlotBarChart key="fonr" data={data} width={20} fill="#0C64AB" fillOpacity={1} strokeOpacity={0} />
                );
            }
            break;
        case 'fonr_vs_yield':
            {
                xScale = scaleLinear().domain([xMin, xMax]);
                xTitle = 'Optimum N Rate - lb/acre';
                yTitle = 'Optimum Yield - bu/acre';
                const data = results.En.map((en, idx) => {
                    const y = results.Opy[idx];
                    if (y > yMax) {
                        yMax = y;
                    }
                    return { x: en, y };
                });
                yMax = Math.ceil(yMax * 0.022) * 50;
                plots.push(
                    <PlotDots
                        key="fonr_vs_yield"
                        data={data}
                        radius={5}
                        strokeOpacity={0}
                        fill="#0C64AB"
                        fillOpacity={1}
                    />
                );
            }
            break;
    }

    return (
        <Grid className={classes.container} container>
            <Grid className={classes.containerItem} container item xs={4}>
                <Paper className={`${classes.sidebarContainer} fullwidth`} square elevation={1}>
                    <Grid className={classes.sidebarHeader} container item>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<ArrowBackIcon />}
                            onClick={props.handleBack}
                        >
                            Return to input
                        </Button>
                        <Box className={classes.inputsContainer} display="flex">
                            <Map
                                className={classes.mapContainer}
                                zoom={5}
                                center={MAP_CENTER}
                                layers={[basemapLayer, resultsDistrictsLayer]}
                                defaultControlsOptions={{ zoom: false }}
                            />
                            <Container>
                                <Typography variant="body1">ANALYSIS INPUTS</Typography>
                                <Grid container item direction="column">
                                    <Grid container item>
                                        <Grid
                                            className={classes.columnKey}
                                            item
                                            xs={5}
                                            component={Typography}
                                            variant="subtitle2"
                                        >
                                            District
                                        </Grid>
                                        <Grid
                                            className={classes.columnValue}
                                            item
                                            xs={7}
                                            component={Typography}
                                            variant="subtitle2"
                                        >
                                            {inputs.district}
                                        </Grid>
                                    </Grid>
                                    <Grid container item>
                                        <Grid
                                            className={classes.columnKey}
                                            item
                                            xs={5}
                                            component={Typography}
                                            variant="subtitle2"
                                        >
                                            Rotation
                                        </Grid>
                                        <Grid
                                            className={classes.columnValue}
                                            item
                                            xs={7}
                                            component={Typography}
                                            variant="subtitle2"
                                        >
                                            {ROTATIONS[inputs.rotation]}
                                        </Grid>
                                    </Grid>
                                    <Grid container item>
                                        <Grid
                                            className={classes.columnKey}
                                            item
                                            xs={5}
                                            component={Typography}
                                            variant="subtitle2"
                                        >
                                            N Fertilizer
                                        </Grid>
                                        <Grid
                                            className={classes.columnValue}
                                            item
                                            xs={7}
                                            component={Typography}
                                            variant="subtitle2"
                                        >
                                            {N_FERTILIZER[inputs.nFertilizer].label}
                                        </Grid>
                                    </Grid>
                                    <Grid container item>
                                        <Grid
                                            className={classes.columnKey}
                                            item
                                            xs={5}
                                            component={Typography}
                                            variant="subtitle2"
                                        >
                                            N Price
                                        </Grid>
                                        <Grid
                                            className={classes.columnValue}
                                            item
                                            xs={7}
                                            component={Typography}
                                            variant="subtitle2"
                                        >
                                            {inputs.nPrice} $/lb N ({inputs.nPriceTon} $/Ton)
                                        </Grid>
                                    </Grid>
                                    <Grid container item>
                                        <Grid
                                            className={classes.columnKey}
                                            item
                                            xs={5}
                                            component={Typography}
                                            variant="subtitle2"
                                        >
                                            Corn Price
                                        </Grid>
                                        <Grid
                                            className={classes.columnValue}
                                            item
                                            xs={7}
                                            component={Typography}
                                            variant="subtitle2"
                                        >
                                            {inputs.cornPrice} $/BU
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Container>
                        </Box>
                    </Grid>
                    <Grid item component={Typography} variant="h5">
                        Results
                    </Grid>
                    <Grid className={`yellowHighlight ${classes.resultsHighlight}`} item>
                        <Typography variant="body1">PROFITABLE N RATE RANGE</Typography>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h5">
                                {precisionStr(results.xn[results.Xmin], 2)}-{precisionStr(results.xn[results.Xmax], 2)}
                            </Typography>
                            <Typography variant="subtitle1">(lb N/acre)</Typography>
                        </Box>
                    </Grid>
                    <Grid container item direction="column">
                        <Grid item component={Typography} variant="body1">
                            OTHER RESULTS
                        </Grid>
                        <Grid container item direction="column">
                            <Grid container item spacing={2}>
                                <Grid
                                    className={`${classes.columnKey} rightText`}
                                    item
                                    xs={8}
                                    component={Typography}
                                    variant="subtitle2"
                                >
                                    MRTN Rate
                                </Grid>
                                <Grid
                                    className={classes.columnValue}
                                    item
                                    xs={4}
                                    component={Typography}
                                    variant="subtitle2"
                                >
                                    <b>{precisionStr(results.MRTN_rate, 2)}</b>&nbsp;&nbsp;lb N/acre
                                </Grid>
                            </Grid>
                            <Grid container item spacing={2}>
                                <Grid
                                    className={`${classes.columnKey} rightText`}
                                    item
                                    xs={8}
                                    component={Typography}
                                    variant="subtitle2"
                                >
                                    Net Return to N at MRTN Rate
                                </Grid>
                                <Grid
                                    className={classes.columnValue}
                                    item
                                    xs={4}
                                    component={Typography}
                                    variant="subtitle2"
                                >
                                    <b>{precisionStr(Math.max(...results.Yrtn), 2)}</b>&nbsp;&nbsp;$ N/acre
                                </Grid>
                            </Grid>
                            <Grid container item spacing={2}>
                                <Grid
                                    className={`${classes.columnKey} rightText`}
                                    item
                                    xs={8}
                                    component={Typography}
                                    variant="subtitle2"
                                >
                                    % of Maximum Yield at MRTN rate
                                </Grid>
                                <Grid
                                    className={classes.columnValue}
                                    item
                                    xs={4}
                                    component={Typography}
                                    variant="subtitle2"
                                >
                                    <b>{precision(results.PMY * 100)}%</b>
                                </Grid>
                            </Grid>
                            <Grid container item spacing={2}>
                                <Grid
                                    className={`${classes.columnKey} rightText`}
                                    item
                                    xs={8}
                                    component={Typography}
                                    variant="subtitle2"
                                >
                                    Anhydrous Ammonia (82%) at MRTN Rate
                                </Grid>
                                <Grid
                                    className={classes.columnValue}
                                    item
                                    xs={4}
                                    component={Typography}
                                    variant="subtitle2"
                                >
                                    <b>1</b>&nbsp;&nbsp;lb product/acre
                                </Grid>
                            </Grid>
                            <Grid container item spacing={2}>
                                <Grid
                                    className={`${classes.columnKey} rightText`}
                                    item
                                    xs={8}
                                    component={Typography}
                                    variant="subtitle2"
                                >
                                    Anhydrous Ammonia (82%) Cost at MRTN Rate
                                </Grid>
                                <Grid
                                    className={classes.columnValue}
                                    item
                                    xs={4}
                                    component={Typography}
                                    variant="subtitle2"
                                >
                                    <b>1</b>&nbsp;&nbsp;$/acre
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid className={classes.containerItem} item xs={8}>
                <Box className="fillContainer" display="flex" flexDirection="column">
                    <Typography variant="h4">Graphs</Typography>
                    <Tabs
                        value={activePlot}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        centered
                        onChange={(e, value) => updateActivePlot(value)}
                    >
                        <Tab label="Return to Nitrogen" value="return_to_n" />
                        <Tab label="% of max yield" value="percent_of_max_yield" />
                        <Tab label="EONR frequency" value="fonr" />
                        <Tab label="EONR vs. Yield" value="fonr_vs_yield" />
                    </Tabs>
                    {plots.length ? (
                        <Container className={classes.plotContainer} ref={plotContainerRef} disableGutters>
                            <PlotGrid
                                width={(plotContainerRect.width || 0) * 0.9}
                                height={plotContainerRect.height || 0}
                                marginTop={20}
                                marginBottom={40}
                                marginRight={30}
                                marginLeft={60}
                                xAxisProps={{
                                    axis: (width, height) => {
                                        const scale = xScale.range([0, width]);
                                        const axis = axisBottom(scale);
                                        axis.ticks((xMax - xMin) / 50).tickSize(-height);
                                        return [axis, scale];
                                    },
                                    title: xTitle,
                                    titlePadding: 35,
                                    textOpacity: 1
                                }}
                                yAxisProps={{
                                    axis: (width, height) => {
                                        const scale = scaleLinear().domain([yMin, yMax]).range([height, 0]);
                                        const axis = axisLeft(scale);
                                        axis.ticks((yMax - yMin) / yTickInterval).tickSize(-width);
                                        return [axis, scale];
                                    },
                                    title: yTitle,
                                    titlePadding: 40,
                                    textOpacity: 1
                                }}
                            >
                                {plots}
                            </PlotGrid>
                        </Container>
                    ) : null}
                    {legends.length ? (
                        <Container ref={legendContainerRef}>
                            <Legend
                                width={(legendContainerRect.width || 0) * 0.5}
                                itemHeight={13}
                                marginBottom={4}
                                data={legends}
                            />
                        </Container>
                    ) : null}
                    <Container className={classes.helpTextContainer}>
                        <Typography variant="body1">{RESULTS_TEXTS[activePlot]}</Typography>
                    </Container>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Results;
