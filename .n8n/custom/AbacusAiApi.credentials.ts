import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class AbacusAiApi implements ICredentialType {
    name = 'abacusAiApi';
    displayName = 'Abacus.ai API';
    documentationUrl = 'https://abacus.ai/app/route-llm-apis';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
    ];
}
