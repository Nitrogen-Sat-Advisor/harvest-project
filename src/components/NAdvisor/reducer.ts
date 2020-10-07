import React from 'react';

import { N_FERTILIZER } from '../../config';

interface UpdateDistrictAction {
    type: 'district';
    value: string;
}

interface UpdateRotationAction {
    type: 'rotation';
    value: 'cc' | 'cs';
}

interface UpdateNFertilizerAction {
    type: 'nFertilizer';
    value: keyof typeof N_FERTILIZER;
}

interface UpdateNPriceAction {
    type: 'nPrice';
    value: number;
}

interface UpdateCornPriceAction {
    type: 'cornPrice';
    value: number;
}

export type InputAction =
    | UpdateDistrictAction
    | UpdateRotationAction
    | UpdateNFertilizerAction
    | UpdateNPriceAction
    | UpdateCornPriceAction;

export interface InputsType {
    district: string;
    rotation: 'cc' | 'cs';
    nFertilizer: keyof typeof N_FERTILIZER;
    nPrice: number;
    cornPrice: number;
}

export const initialInputs: InputsType = {
    district: '',
    rotation: 'cc',
    nFertilizer: 'UAN',
    nPrice: 0,
    cornPrice: 0
};

export const inputsReducer = (state: InputsType = initialInputs, action: InputAction): InputsType => ({
    ...state,
    [action.type]: action.value
});

export interface InputsContextType {
    inputs: InputsType;
    inputsDispatch: React.Dispatch<InputAction>;
}

export const InputsContext = React.createContext<InputsContextType>({} as InputsContextType);
