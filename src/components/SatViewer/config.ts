import { Map as OLMap } from 'ol';
import { transform } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import TileWMSSource from 'ol/source/TileWMS';

export const YEARS = ['2019'];

export const MONTHS = ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];

// Sat Viewer map config
export const MAP_CENTER = transform([-88.3, 40.2], 'EPSG:4326', 'EPSG:3857');

export const LAYERS: SatViewer.Layers = {};

export const getBasemap = (): TileLayer =>
    new TileLayer({
        source: new TileWMSSource({
            url: 'https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer',
            params: { LAYERS: 0 }
        })
    });

export const getLayer = (map: OLMap, opacity: number, category: string, year: string, month: string): TileLayer => {
    if (!LAYERS[category]) {
        LAYERS[category] = {};
    }

    Object.values(LAYERS[category]).forEach((layer) => layer.setVisible(false));

    const layerName = `${year}-${month}`;
    let layer = LAYERS[category][layerName];
    if (!layer) {
        layer = new TileLayer({
            source: new TileWMSSource({
                url: `${process.env.GEOSERVER_URL}/sat-viewer/wms`,
                params: {
                    LAYERS: `sat-viewer:${year}.${month}.15.gcvi`
                }
            })
        });
        map.addLayer(layer);
        LAYERS[category][layerName] = layer;
    }

    layer.setVisible(true);
    layer.setOpacity(opacity);

    return layer;
};
