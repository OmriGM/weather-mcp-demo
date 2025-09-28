import { AlertFeature, ForecastPeriod } from '../types/index.js';

export function formatAlert(feature: AlertFeature): string {
  const props = feature.properties;
  return [
    `Event: ${props.event || 'Unknown'}`,
    `Area: ${props.areaDesc || 'Unknown'}`,
    `Severity: ${props.severity || 'Unknown'}`,
    `Status: ${props.status || 'Unknown'}`,
    `Headline: ${props.headline || 'No headline'}`,
    '---',
  ].join('\n');
}

export function formatForecastPeriod(period: ForecastPeriod): string {
  return [
    `${period.name || 'Unknown'}:`,
    `Temperature: ${period.temperature || 'Unknown'}°${period.temperatureUnit || 'F'}`,
    `Wind: ${period.windSpeed || 'Unknown'} ${period.windDirection || ''}`,
    `${period.shortForecast || 'No forecast available'}`,
    '---',
  ].join('\n');
}

export function formatForecast(
  periods: ForecastPeriod[],
  latitude: number,
  longitude: number
): string {
  const formattedForecast = periods.map(formatForecastPeriod);
  return `Forecast for ${latitude}, ${longitude}:\n\n${formattedForecast.join('\n')}`;
}
