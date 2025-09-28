import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WeatherApiService } from '../services/index.js';
import { formatAlert } from '../utils/index.js';

export function registerAlertsTool(
  server: McpServer,
  weatherService: WeatherApiService
) {
  server.tool(
    'get_alerts',
    'Get weather alerts for a state',
    {
      state: z
        .string()
        .length(2)
        .describe("The two-letter state code (e.g., 'CA' for California)"),
    },
    async ({ state }) => {
      const stateCode = state.toUpperCase();
      const alertData = await weatherService.getAlerts(stateCode);

      if (!alertData) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to retrieve alerts for state code: ${stateCode}`,
            },
          ],
        };
      }

      const { features } = alertData;

      if (features.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No active alerts for state code: ${stateCode}`,
            },
          ],
        };
      }

      const formattedAlerts = features.map(formatAlert);
      const alertText =
        `Active alerts for state code ${stateCode}:\n\n` +
        formattedAlerts.join('\n');

      return {
        content: [
          {
            type: 'text',
            text: alertText,
          },
        ],
      };
    }
  );
}
