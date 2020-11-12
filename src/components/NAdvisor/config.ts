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
    nPrice: N_FERTILIZER[0].price,
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
