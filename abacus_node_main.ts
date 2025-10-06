import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeExecutionData,
} from 'n8n-workflow';

export class AbacusAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Abacus AI',
		name: 'abacusAi',
		icon: 'file:abacusai.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Abacus AI LLM models',
		defaults: {
			name: 'Abacus AI',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'abacusAiApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Chat',
						value: 'chat',
						description: 'Send a chat message to Abacus AI LLM',
						action: 'Send a chat message',
					},
				],
				default: 'chat',
			},
			{
				displayName: 'Deployment ID',
				name: 'deploymentId',
				type: 'string',
				default: '',
				required: true,
				description: 'The Deployment ID or Deployment Token from Abacus AI',
				displayOptions: {
					show: {
						operation: ['chat'],
					},
				},
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				required: true,
				typeOptions: {
					rows: 4,
				},
				description: 'The message to send to the AI',
				displayOptions: {
					show: {
						operation: ['chat'],
					},
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['chat'],
					},
				},
				options: [
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						default: 0.7,
						typeOptions: {
							minValue: 0,
							maxValue: 2,
							numberPrecision: 1,
						},
						description: 'Controls randomness in the output. Higher values make output more random.',
					},
					{
						displayName: 'Max Tokens',
						name: 'maxTokens',
						type: 'number',
						default: 1024,
						description: 'Maximum number of tokens to generate',
					},
					{
						displayName: 'System Prompt',
						name: 'systemPrompt',
						type: 'string',
						default: '',
						typeOptions: {
							rows: 3,
						},
						description: 'System prompt to set the behavior of the assistant',
					},
					{
						displayName: 'Conversation History',
						name: 'conversationHistory',
						type: 'json',
						default: '[]',
						description: 'Previous conversation messages in JSON format',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'chat') {
					const credentials = await this.getCredentials('abacusAiApi');
					const deploymentId = this.getNodeParameter('deploymentId', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const options = this.getNodeParameter('options', i, {}) as {
						temperature?: number;
						maxTokens?: number;
						systemPrompt?: string;
						conversationHistory?: string;
					};

					// Build messages array
					const messages: any[] = [];
					
					// Add system prompt if provided
					if (options.systemPrompt) {
						messages.push({
							role: 'system',
							content: options.systemPrompt,
						});
					}

					// Add conversation history if provided
					if (options.conversationHistory) {
						try {
							const history = typeof options.conversationHistory === 'string' 
								? JSON.parse(options.conversationHistory)
								: options.conversationHistory;
							
							if (Array.isArray(history)) {
								messages.push(...history);
							}
						} catch (error) {
							// Ignore invalid JSON in conversation history
						}
					}

					// Add current message
					messages.push({
						role: 'user',
						content: message,
					});

					// Build request body
					const body: any = {
						messages,
					};

					if (options.temperature !== undefined) {
						body.temperature = options.temperature;
					}

					if (options.maxTokens !== undefined) {
						body.max_tokens = options.maxTokens;
					}

					// Make request to Abacus AI
					const response = await this.helpers.httpRequest({
						method: 'POST',
						url: `https://api.abacus.ai/v0/deployments/${deploymentId}/chat`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					});

					returnData.push({
						json: response,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}