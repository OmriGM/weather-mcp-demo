import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WeatherApiService } from './services/index.js';
import { registerAlertsTool, registerForecastTool } from './tools/index.js';
import { Logger } from './utils/index.js';

const logger = Logger.getInstance();

const server = new McpServer({
  name: 'weather-mcp',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function main() {
  try {
    const weatherService = new WeatherApiService();

    registerAlertsTool(server, weatherService);
    registerForecastTool(server, weatherService);

    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info('Weather MCP server is running...');
  } catch (error) {
    logger.error('Error starting Weather MCP server', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Unhandled error in main', {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
