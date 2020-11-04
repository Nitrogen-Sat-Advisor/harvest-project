import { transform } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import TileWMSSource from 'ol/source/TileWMS';

export const YEARS = ['2019'];

export const MONTHS = ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];

// Sat Viewer map config
export const MAP_CENTER = transform([-89.44, 40.08], 'EPSG:4326', 'EPSG:3857');

export const getBasemap = (): TileLayer =>
    new TileLayer({
        source: new TileWMSSource({
            url: 'https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer',
            params: { LAYERS: 0 }
        })
    });
