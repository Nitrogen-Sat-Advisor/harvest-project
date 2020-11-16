import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { transform } from 'ol/proj';
import TileWMSSource from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style, Text } from 'ol/style';

import type { FeatureLike as FeatureType } from 'ol/Feature';

import countiesGeoJSON from '../../files/counties.geojson';
import districtsGeoJSON from '../../files/districts.geojson';
import { precision } from '../../utils/format';
import DATAWOLF_CONFIG from './datawolf_config.json';

export const datawolfConfig = DATAWOLF_CONFIG as NAdvisor.DatawolfWorkflowConfig;

export const ROTATIONS = {
    cc: 'Corn Following Corn',
    cs: 'Corn Following Soybean'
};

export const N_FERTILIZER = [
    {
        label: 'Anhydrous Ammonia (82%)',
        price: 512,
        conversion: 0.000609756
    },
    {
        label: 'UAN (28%)',
        price: 840,
        conversion: 0.001785714
    },
    {
        label: 'UAN (32%)',
        price: 860,
        conversion: 0.0015625
    },
    {
        label: 'UAN (45%)',
        price: 920,
        conversion: 0.001111111
    },
    {
        label: 'Ammonium Sulfate (21%)',
        price: 266,
        conversion: 0.002380952
    }
];

export const initialInputs: NAdvisor.InputsType = {
    district: '',
    rotation: 'cc',
    nFertilizer: 0,
    nPrice: precision(N_FERTILIZER[0].price * N_FERTILIZER[0].conversion, 4),
    nPriceTon: N_FERTILIZER[0].price,
    cornPrice: 4.23
};

// N Advisor map config
export const MAP_CENTER = transform([-89.44, 40.08], 'EPSG:4326', 'EPSG:3857');

export const STYLES = {
    counties: new Style({
        stroke: new Stroke({
            color: '#000',
            width: 1
        })
    }),
    districts: (selectedDistrict: string) => (feature: FeatureType): Style => {
        const districtId = feature.get('id');
        const isSelected = districtId === selectedDistrict;
        return new Style({
            fill: new Fill({
                color: isSelected ? 'rgba(0, 137, 35, 0.3)' : 'rgba(187, 226, 211, 0.6)'
            }),
            stroke: new Stroke({
                color: isSelected ? '#000' : '#319FD3',
                width: 1
            }),
            text: new Text({
                text: `District ${districtId}`,
                font: '10px Roboto,sans-serif',
                fill: new Fill({
                    color: '#000'
                })
            })
        });
    }
};

export const getBasemap = (): TileLayer =>
    new TileLayer({
        source: new TileWMSSource({
            url: 'https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer',
            params: { LAYERS: 0 }
        })
    });

export const getCountiesLayer = (): VectorLayer =>
    new VectorLayer({
        source: new VectorSource({
            url: countiesGeoJSON,
            format: new GeoJSON({
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: STYLES.counties
    });

const getDistrictsLayer = (): VectorLayer => {
    const districtsLayer = new VectorLayer({
        source: new VectorSource({
            url: districtsGeoJSON,
            useSpatialIndex: true,
            format: new GeoJSON({
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        }),
        style: STYLES.districts('')
    });
    districtsLayer.set('interactive', true);
    return districtsLayer;
};
export const inputsDistrictsLayer = getDistrictsLayer();
export const resultsDistrictsLayer = getDistrictsLayer();

export const RESULTS_TEXTS: { [k: string]: string } = {
    return_to_n:
        'The MRTN Rate (the x coordinate for the blue point; and the y coordinate for the blue point is the Net Return to N at MRTN Rate) provides the greatest Economic Optimal N Rate (EONR) , which will be the suggested N application rate. This figure demonstrates how MRTN Rate is calculated. Basically, the Net Return to N (blue line) for a selected region under one specific rotation pattern is derived by calculating the differences between gross return from yield increase (green line) and fertilizer cost (orange line). The profitable N rate range (yellow shaded symbol; within $1/acre of the maximum) is also shown on the figure. ',
    percent_of_max_yield:
        'This figure shows the percentage between each yield across all N rates and the maximum yield. The MRTN rate and the profitable N rate range (within $1/acre of the maximum) are also highlighted. As the N rates increase, the yield increases accordingly. The larger the price ratio (fertilizer price:crop price), the lower the economic rate, and the lower percentage of maximum yield for the MRTN rate.',
    fonr:
        'This figure shows the frequency distribution (in 25 lb N increments) of the EONR for all sites in one selected region under one specific rotation. Generally, the MRTN rate should be located in the ENOR range with the highest frequency.',
    fonr_vs_yield:
        'This figure shows the relationship between the ENOR and the corresponding yield for all experiments in one selected region under one specific rotation.'
};
