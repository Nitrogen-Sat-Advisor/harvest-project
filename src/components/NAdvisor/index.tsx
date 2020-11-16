import React from 'react';
import axios from 'axios';

import { precision } from '../../utils/format';
import { LayoutStateContext } from '../Layouts/MainLayout';
import Inputs from './Inputs';
import Results from './Results';
import { createDatawolfRequestBody, getResults } from './datawolf';
import {
    datawolfConfig,
    initialInputs,
    inputsDistrictsLayer,
    resultsDistrictsLayer,
    N_FERTILIZER,
    STYLES
} from './config';

const inputsReducer = (
    state: NAdvisor.InputsType = initialInputs,
    action: NAdvisor.InputAction
): NAdvisor.InputsType => {
    switch (action.type) {
        case 'nFertilizer':
            return {
                ...state,
                nFertilizer: action.value,
                nPriceTon: N_FERTILIZER[action.value].price,
                nPrice: precision(N_FERTILIZER[action.value].price * N_FERTILIZER[action.value].conversion, 4)
            };
        case 'nPrice':
            return {
                ...state,
                nPrice: action.value,
                nPriceTon: action.value / N_FERTILIZER[state.nFertilizer].conversion
            };
        case 'nPriceTon':
            return {
                ...state,
                nPrice: precision(action.value * N_FERTILIZER[state.nFertilizer].conversion, 4),
                nPriceTon: action.value
            };
        default:
            return {
                ...state,
                [action.type]: action.value
            };
    }
};

export const InputsContext = React.createContext<NAdvisor.InputsContextType>({} as NAdvisor.InputsContextType);

const Index = (): JSX.Element => {
    const { layoutStateDispatch } = React.useContext(LayoutStateContext);

    React.useEffect(
        () => () => {
            // Clean up the map on unmount
            inputsDistrictsLayer.setStyle(STYLES.districts(''));
            resultsDistrictsLayer.setStyle(STYLES.districts(''));
        },
        []
    );

    const [inputs, inputsDispatch] = React.useReducer(inputsReducer, initialInputs);

    const areInputsValid = Object.entries(inputs).every(([k, v]) => (k === 'nFertilizer' ? v > -1 : v));

    const [activeView, updateActiveView] = React.useState<'inputs' | 'results'>('inputs');

    const [results, updateResults] = React.useState<NAdvisor.ResultsType>();

    const handleCalculate = () => {
        if (areInputsValid) {
            layoutStateDispatch({ type: 'isLoading', isLoading: true });
            axios
                .post(`${datawolfConfig.url}/executions`, createDatawolfRequestBody(inputs))
                .then(({ data: executionGUID }) => {
                    getResults(
                        executionGUID,
                        (data) => {
                            updateResults(data);
                            updateActiveView('results');
                            layoutStateDispatch({ type: 'isLoading', isLoading: false });
                        },
                        () => {
                            layoutStateDispatch({ type: 'isLoading', isLoading: false });
                        }
                    );
                })
                .catch((e) => {
                    console.error(`Could not start execution: ${e}`);
                    layoutStateDispatch({ type: 'isLoading', isLoading: false });
                });
        }
    };

    return (
        <InputsContext.Provider value={{ inputs, inputsDispatch }}>
            {activeView === 'results' && results ? (
                <Results results={results} handleBack={() => updateActiveView('inputs')} />
            ) : (
                <Inputs areInputsValid={areInputsValid} handleCalculate={handleCalculate} />
            )}
        </InputsContext.Provider>
    );
};

export default Index;
