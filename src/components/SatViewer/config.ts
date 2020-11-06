import TileLayer from 'ol/layer/Tile';
import TileWMSSource from 'ol/source/TileWMS';

export const YEARS = ['2019'];

export const MONTHS = ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];

// Sat Viewer map config
export const MAP_CENTER = [-88.3, 40.2];

export const SOURCES: SatViewer.Sources = {};

export const getBasemap = (): TileLayer =>
    new TileLayer({
        source: new TileWMSSource({
            url: 'https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer',
            params: { LAYERS: 0 }
        })
    });
