# Weather MCP Server

An MCP server that provides weather data from the National Weather Service API.

> This project was created for learning purposes to understand how MCP (Model Context Protocol) works.

## Install

```bash
npm install -g weather-mcp
```

## Setup

Add to your MCP client config:

```json
{
  "mcpServers": {
    "weather": {
      "command": "weather-mcp"
    }
  }
}
```

## Tools

### get_forecast

Get weather forecast for any US location.

- `latitude` (number)
- `longitude` (number)

### get_alerts

Get weather alerts for a US state.

- `state` (string): Two-letter state code like "CA" or "NY"

## Development

```bash
git clone https://github.com/omrigrossman/weather-mcp.git
cd weather-mcp
npm install
npm run build
npx node build/index.js      
```

## Notes

- US locations only (NWS API limitation)
- Free to use, no API key needed
