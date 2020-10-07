import React from 'react';

import type { InputsType } from './reducer';

interface Props {
    inputs: InputsType;
    handleBack: () => void;
}

const Results = (props: Props): JSX.Element => (
    <div>
        <b>Inputs passed to the api:</b>
        <br />
        <button type="button" onClick={props.handleBack}>
            back
        </button>
        <ul>
            {Object.entries(props.inputs).map(([k, v]) => (
                <li key={k}>
                    {k}: {v}
                </li>
            ))}
        </ul>
    </div>
);

export default Results;
