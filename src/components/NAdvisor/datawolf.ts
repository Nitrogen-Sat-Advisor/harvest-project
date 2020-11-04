import axios from 'axios';

import { datawolfConfig } from './config';

export const createDatawolfRequestBody = (values: NAdvisor.InputsType): NAdvisor.DatawolfExecutionPayload => ({
    workflowId: datawolfConfig.workflowId,
    creatorId: datawolfConfig.creatorId,
    title: new Date().toLocaleString(),
    parameters: Object.entries<keyof NAdvisor.InputsType>(datawolfConfig.parameters).reduce((params, [label, id]) => {
        params[id] = values[label as keyof NAdvisor.InputsType];
        return params;
    }, {} as NAdvisor.DatawolfParams)
});

export const getResults = (
    executionGUID: string,
    success: (data: NAdvisor.ResultsType) => void,
    error: () => void
): void => {
    axios
        .get(`${datawolfConfig.url}/executions/${executionGUID}`)
        .then(({ data: { stepState, datasets } }) => {
            const status = stepState[datawolfConfig.stepId];
            if (status === 'FINISHED') {
                const datasetId = datasets[datawolfConfig.resultsDatasetId];
                axios
                    .get(`${datawolfConfig.url}/datasets/${datasetId}/`, {
                        headers: { 'X-Userinfo': datawolfConfig.xUserInfo }
                    })
                    .then(({ data: { fileDescriptors } }) => {
                        const fileId = fileDescriptors[0].id;
                        axios
                            .get(`${datawolfConfig.url}/datasets/${datasetId}/${fileId}/file`, {
                                headers: { 'X-Userinfo': datawolfConfig.xUserInfo }
                            })
                            .then(({ data }) => success(data))
                            .catch((e) => {
                                console.error(`Could not get dataset ${datasetId}: ${e}`);
                                error();
                            });
                    })
                    .catch((e) => console.error(`Could not get info for dataset ${datasetId}: ${e}`));
            } else if (['WAITING', 'QUEUED', 'RUNNING'].includes(status)) {
                setTimeout(() => {
                    getResults(executionGUID, success, error);
                }, 1000);
            } else {
                console.error(`Step failed: ${status}`);
                error();
            }
        })
        .catch((e) => {
            console.error(`Could not get info for execution ${executionGUID}: ${e}`);
            error();
        });
};
