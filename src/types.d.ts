interface ElementRect {
    width: number | null;
    height: number | null;
    top: number | null;
    right: number | null;
    bottom: number | null;
    left: number | null;
    marginTop: number | null;
    marginRight: number | null;
    marginBottom: number | null;
    marginLeft: number | null;
    paddingTop: number | null;
    paddingRight: number | null;
    paddingBottom: number | null;
    paddingLeft: number | null;
}

declare namespace GeoJSONType {
    interface MultiPolygon {
        type: 'MultiPolygon';
        coordinates: [number, number][][][];
        properties: {
            clu_id: number;
        };
    }
}

declare namespace Plot {
    import { ScaleBand, ScaleContinuousNumeric } from 'd3-scale';

    type xScale = ScaleContinuousNumeric | ScaleBand | null;
    type yScale = ScaleContinuousNumeric | null;

    interface Context {
        xScale: xScale;
        yScale: yScale;
        width: number;
        height: number;
    }

    interface Datum {
        x: number | string;
        y: number;
    }

    interface LegendDatum {
        label: string;
        type: 'line' | 'polygon';
        color: string;
        opacity?: number;
        width?: number;
        size?: number;
    }
}

declare namespace Layout {
    import React from 'react';

    interface UpdateLoadingAction {
        type: 'isLoading';
        isLoading: boolean;
    }

    interface UpdateUserAction {
        type: 'userId';
        userId: string | null;
    }

    interface AddCLUAction {
        type: 'addCLU';
        clu: GeoJSONType.MultiPolygon;
    }

    type StateAction = UpdateLoadingAction | UpdateUserAction | AddCLUAction;

    interface StateType {
        isLoading: boolean;
        userId: string | null;
        clus: {
            [cluId: string]: GeoJSONType.MultiPolygon;
        };
    }

    interface StateContextType {
        layoutState: StateType;
        layoutStateDispatch: React.Dispatch<StateAction>;
    }
}

declare namespace NAdvisor {
    import React from 'react';

    interface DatawolfWorkflowConfig {
        url: string;
        workflowId: string;
        creatorId: string;
        xUserInfo: string;
        stepId: string;
        resultsDatasetId: string;
        parameters: {
            [k: keyof InputsType]: string;
        };
    }

    interface DatawolfParams {
        [k: string]: string | number;
    }

    interface DatawolfExecutionPayload {
        workflowId: string;
        creatorId: string;
        title: string;
        parameters: DatawolfParams;
    }

    interface UpdateDistrictAction {
        type: 'district';
        value: number;
    }

    interface UpdateRotationAction {
        type: 'rotation';
        value: 'cc' | 'cs';
    }

    interface UpdateNFertilizerAction {
        type: 'nFertilizer';
        value: number;
    }

    interface UpdateNPriceAction {
        type: 'nPrice';
        value: number;
    }

    interface UpdateCornPriceAction {
        type: 'cornPrice';
        value: number;
    }

    type InputAction =
        | UpdateDistrictAction
        | UpdateRotationAction
        | UpdateNFertilizerAction
        | UpdateNPriceAction
        | UpdateCornPriceAction;

    interface InputsType {
        district: number;
        rotation: 'cc' | 'cs';
        nFertilizer: number;
        nPrice: number;
        cornPrice: number;
    }

    interface InputsContextType {
        inputs: InputsType;
        inputsDispatch: React.Dispatch<InputAction>;
    }

    interface ResultsType {
        yn: number[][];
        En: number[];
        Opy: number[];
        MRTN_rate: number;
        Ns: number;
        xn: number[];
        Yc: number[];
        Yf: number[];
        Yrtn: number[];
        Ypmy: number[];
        A: number[];
        Xmin: number;
        Xmax: number;
    }
}

declare namespace SatViewer {
    import TileWMSSource from 'ol/source/TileWMS';

    interface Sources {
        [date: string]: TileWMSSource;
    }

    interface UserField {
        clu: number;
        clu_name: string;
    }
}

declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly PUBLIC_PATH: string;
        readonly GEOSERVER_URL: string;
        readonly CLU_SERVER_URL: string;
    }
}

declare module '*.bmp' {
    const src: string;
    export default src;
}

declare module '*.gif' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    const src: string;
    export default src;
}

declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.less' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.json' {
    const src: string;
    export default src;
}

declare module '*.geojson' {
    const src: string;
    export default src;
}
