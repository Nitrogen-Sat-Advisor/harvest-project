import React from 'react';
import axios from 'axios';

import resultsFixture from '../../fixtures/results.json';
import { LayoutStateContext } from '../Layouts/MainLayout';
import Inputs from './Inputs';
import Results from './Results';
import { initialInputs } from './config';

const inputsReducer = (
    state: NAdvisor.InputsType = initialInputs,
    action: NAdvisor.InputAction
): NAdvisor.InputsType => ({
    ...state,
    [action.type]: action.value,
    isValid: !!(action.value && Object.entries(state).every(([k, v]) => k === 'isValid' || k === action.type || v))
});

export const InputsContext = React.createContext<NAdvisor.InputsContextType>({} as NAdvisor.InputsContextType);

const Index = (): JSX.Element => {
    const { layoutStateDispatch } = React.useContext(LayoutStateContext);

    const [inputs, inputsDispatch] = React.useReducer(inputsReducer, initialInputs);

    const [activeView, updateActiveView] = React.useState<'inputs' | 'results'>('inputs');

    const [results, updateResults] = React.useState<NAdvisor.ResultsType>();

    const handleCalculate = () => {
        if (inputs.isValid) {
            layoutStateDispatch({ type: 'isLoading', value: true });
            axios
                .get((resultsFixture as unknown) as string)
                .then((response) => {
                    updateResults(response.data as NAdvisor.ResultsType);
                    updateActiveView('results');
                    layoutStateDispatch({ type: 'isLoading', value: false });
                })
                .catch(console.error);
        }
    };

    return (
        <InputsContext.Provider value={{ inputs, inputsDispatch }}>
            {activeView === 'results' && results ? (
                <Results results={results} handleBack={() => updateActiveView('inputs')} />
            ) : (
                <Inputs handleCalculate={handleCalculate} />
            )}
        </InputsContext.Provider>
    );
};

export default Index;
