const DATAWOLF_CONFIG = JSON.parse(process.env.DATAWOLF_CONFIG) as NAdvisor.DatawolfWorkflowConfig;

export const createDatawolfRequestBody = (values: NAdvisor.InputsType): NAdvisor.DatawolfRequestConfig => ({
    url: DATAWOLF_CONFIG.url || '',
    workflowId: DATAWOLF_CONFIG.workflowId || '',
    params: Object.entries<keyof NAdvisor.InputsType>(DATAWOLF_CONFIG.params).reduce((params, [label, id]) => {
        params[id] = values[label as keyof NAdvisor.InputsType];
        return params;
    }, {} as NAdvisor.DatawolfParams)
});
