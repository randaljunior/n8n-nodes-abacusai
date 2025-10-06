import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

export class AbacusAiChat implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Abacus.ai Chat Model',
        name: 'abacusAiChat',
        icon: 'file:abacusai.svg',
        group: ['ai'],
        version: 1,
        subtitle: '=Abacus.ai',
        description: 'Uses Abacus.ai RouteLLM API to interact with chat models',
        defaults: {
            name: 'Abacus.ai Chat',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'abacusAiApi',
                required: true,
            },
        ],
        properties: [
            // Input para o nome do modelo
            {
                displayName: 'Model',
                name: 'model',
                type: 'string',
                default: 'gemini-2.5-pro',
                required: true,
                description: 'The model to use for the chat completion, e.g., gemini-2.5-pro',
            },
            // Input para o prompt do usuário
            {
                displayName: 'Prompt',
                name: 'prompt',
                type: 'string',
                default: '',
                required: true,
                typeOptions: {
                    rows: 5,
                },
                description: 'The prompt to send to the chat model',
            },
            // Opções Adicionais (como temperatura)
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add Option',
                default: {},
                options: [
                    {
                        displayName: 'Temperature',
                        name: 'temperature',
                        type: 'number',
                        typeOptions: {
                            minValue: 0,
                            maxValue: 2,
                        },
                        default: 0.7,
                        description: 'Controls randomness. Lower values make the model more deterministic.',
                    },
                    {
                        displayName: 'Max Tokens',
                        name: 'maxTokens',
                        type: 'number',
                        typeOptions: {
                            minValue: 1,
                        },
                        default: 2048,
                        description: 'The maximum number of tokens to generate in the completion.',
                    },
                ],
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const prompt = this.getNodeParameter('prompt', i, '') as string;
                const model = this.getNodeParameter('model', i, '') as string;
                const options = this.getNodeParameter('options', i, {}) as {
                    temperature?: number;
                    maxTokens?: number;
                };
                const credentials = await this.getCredentials('abacusAiApi');

                const body = {
                    model: model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: options.temperature,
                    max_tokens: options.maxTokens,
                };

                // Use o helper httpRequest do n8n para fazer a chamada
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    // IMPORTANTE: Substitua pelo endpoint correto da documentação do RouteLLM
                    url: 'https://api.abacus.ai/v1/route-llm/chat/completions',
                    headers: {
                        'Authorization': `Bearer ${credentials.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: body,
                    json: true,
                });

                // Adiciona a resposta completa da API ao item de saída
                const executionData = this.helpers.constructExecutionMetaData(
                    this.helpers.returnJsonArray(response as any),
                    { itemData: { item: i } },
                );
                returnData.push(...executionData);

            } catch (error) {
                if (this.continueOnFail()) {
                    const executionError = this.helpers.constructExecutionMetaData(
                        this.helpers.returnJsonArray({ error: error.message }),
                        { itemData: { item: i } },
                    );
                    returnData.push(...executionError);
                    continue;
                }
                throw error;
            }
        }

        return this.prepareOutputData(returnData);
    }
}
