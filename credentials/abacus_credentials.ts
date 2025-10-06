import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AbacusAiApi implements ICredentialType {
	name = 'abacusAiApi';
	displayName = 'Abacus AI API';
	documentationUrl = 'https://api.abacus.ai/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Abacus AI API Key',
		},
	];
}
