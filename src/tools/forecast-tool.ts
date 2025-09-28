import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WeatherApiService } from '../services/index.js';
import { formatForecast } from '../utils/index.js';

export function registerForecastTool(
  server: McpServer,
  weatherService: WeatherApiService
) {
  server.tool(
    'get_forecast',
    'Get weather forecast for a location',
    {
      latitude: z
        .number()
        .min(-90)
        .max(90)
        .describe('Latitude of the location'),
      longitude: z
        .number()
        .min(-180)
        .max(180)
        .describe('Longitude of the location'),
    },
    async ({ latitude, longitude }) => {
      const pointsData = await weatherService.getGridPoint(latitude, longitude);

      if (!pointsData) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
            },
          ],
        };
      }

      const { forecast: forecastUrl } = pointsData.properties;

      if (!forecastUrl) {
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to get forecast URL from grid point data',
            },
          ],
        };
      }

      const forecastData = await weatherService.getForecast(forecastUrl);

      if (!forecastData) {
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to retrieve forecast data',
            },
          ],
        };
      }

      const { periods } = forecastData.properties || [];

      if (periods.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No forecast periods available',
            },
          ],
        };
      }

      const forecastText = formatForecast(periods, latitude, longitude);

      return {
        content: [
          {
            type: 'text',
            text: forecastText,
          },
        ],
      };
    }
  );
}
