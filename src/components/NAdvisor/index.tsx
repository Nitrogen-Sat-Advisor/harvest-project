import React from 'react';

import { initialInputs, inputsReducer, InputsContext } from './reducer';
import Inputs from './Inputs';
import Results from './Results';

const NAdvisor = (): JSX.Element => {
    const [inputs, inputsDispatch] = React.useReducer(inputsReducer, initialInputs);

    const [activeView, updateActiveView] = React.useState<'inputs' | 'results'>('inputs');

    return (
        <InputsContext.Provider value={{ inputs, inputsDispatch }}>
            {activeView === 'results' ? (
                <Results inputs={inputs} handleBack={() => updateActiveView('inputs')} />
            ) : (
                <Inputs handleRun={() => updateActiveView('results')} />
            )}
        </InputsContext.Provider>
    );
};

export default NAdvisor;
