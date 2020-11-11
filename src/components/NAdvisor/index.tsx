import React from 'react';
import axios from 'axios';

import { LayoutStateContext } from '../Layouts/MainLayout';
import Inputs from './Inputs';
import Results from './Results';
import { createDatawolfRequestBody, getResults } from './datawolf';
import { datawolfConfig, initialInputs } from './config';

const inputsReducer = (
    state: NAdvisor.InputsType = initialInputs,
    action: NAdvisor.InputAction
): NAdvisor.InputsType => ({
    ...state,
    [action.type]: action.value
});

export const InputsContext = React.createContext<NAdvisor.InputsContextType>({} as NAdvisor.InputsContextType);

const Index = (): JSX.Element => {
    const { layoutStateDispatch } = React.useContext(LayoutStateContext);

    const [inputs, inputsDispatch] = React.useReducer(inputsReducer, initialInputs);

    const areInputsValid = Object.values(inputs).every((v) => v);

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
