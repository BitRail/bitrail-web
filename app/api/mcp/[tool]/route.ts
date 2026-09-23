import type { NextRequest } from "next/server";

// MCP Server configuration
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:3001";
const MCP_SERVER_TOKEN = process.env.MCP_SERVER_TOKEN;

// Mock data for development/testing when MCP server is not running
const mockResponses: Record<string, any> = {
  arkadiko_get_swap_pair: {
    success: true,
    data: {
      tokenX: "wstx-token",
      tokenY: "usda-token",
      lpToken: "arkadiko-swap-token-wstx-token-usda-token",
      name: "WSTX-USDA",
      reserveX: "1000000000",
      reserveY: "2000000000",
      totalSupply: "1500000000"
    },
    message: "Retrieved swap pair wstx-token/usda-token"
  },
  zest_get_tvl: {
    success: true,
    data: { tvl: 42500000, utilizationRate: 0.71 },
    message: "Retrieved Zest TVL"
  },
  bitflow_get_tvl: {
    success: true,
    data: { tvl: 18200000, utilizationRate: 0.58 },
    message: "Retrieved Bitflow TVL"
  },
  alex_get_tvl: {
    success: true,
    data: { tvl: 67800000, utilizationRate: 0.44 },
    message: "Retrieved ALEX TVL"
  },
  stacking_get_info: {
    success: true,
    data: { tvl: 545000000, apy: 4.2, utilizationRate: 0.88 },
    message: "Retrieved Stacking info"
  },
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ tool: string }> }
) {
  try {
    const { tool } = await context.params;
    const body = await request.json();

    if (!tool) {
      return Response.json(
        { error: "Tool name is required" },
        { status: 400 }
      );
    }

    // Use mock data if MCP server token not configured or in dev without server
    const mockResponse = mockResponses[tool];
    if (!MCP_SERVER_TOKEN && mockResponse) {
      console.log(`[MCP Bridge] Using mock for tool: ${tool}`);
      return Response.json(mockResponse);
    }

    // Forward to actual MCP server
    const mcpResponse = await fetch(`${MCP_SERVER_URL}/tools/${tool}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(MCP_SERVER_TOKEN && { Authorization: `Bearer ${MCP_SERVER_TOKEN}` }),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });

    if (!mcpResponse.ok) {
      // Fall back to mock if available
      if (mockResponse) return Response.json(mockResponse);
      return Response.json(
        { error: `MCP server error: ${mcpResponse.statusText}` },
        { status: mcpResponse.status }
      );
    }

    const data = await mcpResponse.json();
    return Response.json(data);

  } catch (error) {
    console.error(`[MCP Bridge] Error:`, error);
    // Fall back to mock on network error
    try {
      const { tool } = await context.params;
      const mock = mockResponses[tool];
      if (mock) return Response.json(mock);
    } catch {}
    return Response.json(
      { error: `Failed to execute tool: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 502 }
    );
  }
}
