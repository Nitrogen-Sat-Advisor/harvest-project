import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { transform, transformExtent } from 'ol/proj';
import TileWMSSource from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style, Text } from 'ol/style';

import type { FeatureLike as FeatureType } from 'ol/Feature';

import districtsGeoJSON from './files/districts.geojson';

export const N_FERTILIZER = {
    UAN: 'UAN (28%)'
};

export const MAP_EXTENT = transformExtent([-92, 36, -87, 43], 'EPSG:4326', 'EPSG:3857');

export const MAP_CENTER = transform([-89.44, 40.08], 'EPSG:4326', 'EPSG:3857');

export const STYLES = {
    districts: (selectedDistrict: string) => (feature: FeatureType): Style => {
        const districtId = feature.get('id');
        const isSelected = districtId === selectedDistrict;
        return new Style({
            fill: new Fill({
                color: isSelected ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.6)'
            }),
            stroke: new Stroke({
                color: isSelected ? '#000' : '#319FD3',
                width: 1
            }),
            text: new Text({
                text: `District ${districtId}`,
                font: '12px Roboto,sans-serif',
                fill: new Fill({
                    color: '#000'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 3
                })
            })
        });
    }
};

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

export const LAYERS = {
    basemap: new TileLayer({
        source: new TileWMSSource({
            url: 'https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer',
            params: { LAYERS: 0 }
        })
    }),
    districts: districtsLayer
};
