import TileLayer from 'ol/layer/Tile';
import TileWMSSource from 'ol/source/TileWMS';

export const YEARS = ['2019'];

export const MONTHS = ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];

// Sat Viewer map config
export const MAP_CENTER = [-88.3, 40.2];

const SOURCES: SatViewer.Sources = {};

export const getBasemap = (): TileLayer =>
    new TileLayer({
        source: new TileWMSSource({
            url: 'https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer',
            params: { LAYERS: 0 }
        })
    });

export const getCLULayer = (): TileLayer => {
    const layer = new TileLayer({
        source: new TileWMSSource({
            url: `${process.env.GEOSERVER_URL}/sat-viewer/wms`,
            params: {
                LAYERS: 'sat-viewer:clu'
            }
        })
    });
    layer.set('clu', true);
    return layer;
};

export const getGCVISource = (year: string, month: string): TileWMSSource => {
    const layerName = `${year}-${month}`;
    let source = SOURCES[layerName];
    if (!source) {
        source = new TileWMSSource({
            url: `${process.env.GEOSERVER_URL}/sat-viewer/wms`,
            params: {
                LAYERS: `sat-viewer:${year}.${month}.15.gcvi`
            },
            projection: 'EPSG:32616'
        });
        SOURCES[layerName] = source;
    }

    return source;
};
