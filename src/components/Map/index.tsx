import React from 'react';
import { Map as OLMap, View } from 'ol';
import { defaults as defaultControls, Control } from 'ol/control';
import { Extent } from 'ol/extent';
import Layer from 'ol/layer/Layer';

import type { MapBrowserEvent } from 'ol';
import type { DefaultsOptions } from 'ol/control';
import type { Coordinate } from 'ol/coordinate';
import type { ViewOptions } from 'ol/View';

interface Props {
    children?: JSX.Element;
    id?: string;
    className?: string;
    projection?: string;
    zoom?: number;
    center?: [number, number] | Coordinate;
    minZoom?: number;
    maxZoom?: number;
    extent?: Extent;
    defaultControlsOptions?: DefaultsOptions;
    controls?: Control[];
    layers?: Array<Layer>;
    updateMap?: (map: OLMap) => void;
    events?: { [k: string]: (e: MapBrowserEvent) => void };
}

export const MapContext = React.createContext<{ map?: OLMap }>({});

const renderChildren = (mapContainer: React.RefObject<HTMLDivElement>, children: JSX.Element): JSX.Element[] => {
    return React.Children.map(children, (child) => {
        if (!child || !child.props) {
            return child;
        }

        const nestedChildren = child.props.children ? renderChildren(mapContainer, child.props.children) : [];

        if (child.props.mapcontainer) {
            return React.cloneElement(
                child,
                {
                    ref: mapContainer
                },
                [...nestedChildren]
            );
        }

        if (nestedChildren.length) {
            return React.cloneElement(child, { children: nestedChildren });
        }
        return child;
    });
};

const Map = (props: Props): JSX.Element => {
    const {
        children = null,
        id = '',
        className = '',
        projection = 'EPSG:3857',
        center = [0, 0],
        zoom = 7,
        minZoom = 0,
        maxZoom = 14,
        extent = null,
        defaultControlsOptions = {},
        controls = [],
        layers = [],
        updateMap = null,
        events = null
    } = props;

    const mapContainer = React.createRef<HTMLDivElement>();
    const mapRef = React.useRef<OLMap>();

    React.useEffect(() => {
        if (mapContainer.current) {
            const viewOptions: ViewOptions = {
                projection,
                center,
                zoom,
                minZoom,
                maxZoom
            };

            if (extent) {
                viewOptions.extent = extent;
            }

            const map = new OLMap({
                target: mapContainer.current,
                view: new View(viewOptions),
                layers,
                controls: defaultControls(defaultControlsOptions).extend(controls)
            });

            mapRef.current = map;

            if (events) {
                Object.entries(events).forEach(([event, handler]) => {
                    map.on(event, handler);
                });
            }

            if (updateMap) {
                updateMap(map);
            }
        }
    }, []);

    return (
        <div id={id} className={`ol-map ${className}`} ref={mapContainer}>
            {children ? (
                <MapContext.Provider value={{ map: mapRef.current }}>
                    {renderChildren(mapContainer, children)}
                </MapContext.Provider>
            ) : null}
        </div>
    );
};

export default Map;
