# Devpost Submission Draft

## Project title

CivicOps Agent

## Tagline

An AI operations agent that helps event teams detect pressure points, dispatch resources, and publish safer public guidance.

## Selected track

MongoDB

## Inspiration

Large public events are exciting, but operations teams often have to make fast decisions with scattered information. A small crowding issue near one entrance can become a transit delay, an accessibility problem, or a communication failure. We wanted to build an agent that does more than chat: it plans, calls tools, and gives human operators clear actions they can approve.

## What it does

CivicOps Agent turns an event operations goal into an executable response plan. The operator enters a mission, selects the city and partner track, and sets risk tolerance. The agent then:

- Creates a multi-step plan.
- Inspects active incident signals.
- Looks up partner context through an MCP-compatible bridge.
- Matches incidents to available response teams.
- Drafts public guidance.
- Returns traceable recommendations and human approval steps.

The interface shows the plan, recommendations, tool trace, integration status, and next actions in one dashboard.

## How we built it

The frontend is built with React, TypeScript, Vite, and a polished operations-dashboard UI. The backend is built with FastAPI and Pydantic. The agent follows a clear plan -> tool execution -> recommendation flow.

Gemini support is implemented through a dedicated `GeminiClient`, which can generate plans and summarize completed runs when `GOOGLE_API_KEY` is configured. The partner integration is implemented through a JSON-RPC MCP adapter. For local demos, a mock MCP bridge is included; for the MongoDB track, this adapter can point to a real MongoDB MCP bridge/server.

## Best use of MongoDB

CivicOps Agent is designed around operational records that fit MongoDB well: live incidents, resource assignments, action history, public messages, and agent tool traces. MongoDB can store flexible event documents, support changing incident schemas, and preserve auditable decision history. The MCP bridge gives the agent a tool interface for querying and updating that operational context.

## Challenges we ran into

The hardest part was designing the app so it is honest and demoable before real secrets are connected, while still being ready for real Gemini and MCP integration. We solved this by making integration status visible and by adding clean fallback behavior. The agent can run locally in demo mode, then switch to connected mode when environment variables are added.

## Accomplishments that we're proud of

- A polished frontend that feels like a real operations tool.
- A clean backend architecture with separate agent, Gemini, MCP, and tool-registry layers.
- Traceable tool execution instead of a black-box chatbot response.
- A local MCP bridge that lets the integration pathway be demonstrated before final partner credentials are available.

## What we learned

We learned that agent UX needs to show more than a final answer. Operators need to understand the plan, see what tools were called, review confidence, and stay in control before actions are taken.

## What's next

Next, CivicOps Agent can connect to a real MongoDB MCP server, store incidents and tool traces in MongoDB Atlas, add geospatial map views, and support approvals that write back to the operations database. The same pattern can be extended to stadiums, festivals, malls, transit hubs, and city emergency coordination.

## Built with

React, TypeScript, Vite, FastAPI, Pydantic, Gemini API, MCP, MongoDB track architecture.
