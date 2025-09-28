import {
  AlertsResponse,
  ForecastResponse,
  PointsResponse,
} from '../types/index.js';
import { Logger } from '../utils/index.js';

const NWS_API_BASE = 'https://api.weather.gov';
const USER_AGENT = 'weather-mcp/1.0';

export class WeatherApiService {
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  private async makeRequest<T>(url: string): Promise<T | null> {
    const headers = {
      'User-Agent': USER_AGENT,
      Accept: 'application/geo+json',
    };

    this.logger.debug(`Making request to: ${url}`);

    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`;
        this.logger.error(errorMessage, { url, status: response.status });
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as T;
      this.logger.debug(`Request successful for: ${url}`);
      return data;
    } catch (error) {
      this.logger.error('Error making NWS request', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  async getAlerts(stateCode: string): Promise<AlertsResponse | null> {
    const alertUrl = `${NWS_API_BASE}/alerts?area=${stateCode.toUpperCase()}`;
    return this.makeRequest<AlertsResponse>(alertUrl);
  }

  async getGridPoint(
    latitude: number,
    longitude: number
  ): Promise<PointsResponse | null> {
    const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    return this.makeRequest<PointsResponse>(pointsUrl);
  }

  async getForecast(forecastUrl: string): Promise<ForecastResponse | null> {
    return this.makeRequest<ForecastResponse>(forecastUrl);
  }
}
