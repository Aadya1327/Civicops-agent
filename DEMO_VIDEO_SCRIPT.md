# 3 Minute Demo Video Script

## 0:00-0:20 - Opening

"Hi, this is CivicOps Agent, an AI operations assistant for large public events. It helps teams detect pressure points, assign resources, draft public guidance, and keep humans in control of every action."

Show the dashboard.

## 0:20-0:50 - Problem

"At busy events, issues like crowding, transit queues, vendor shortages, and accessibility blocks can escalate quickly. A normal chatbot is not enough. Operators need an agent that can plan, use tools, and explain what it did."

Point to the mission goal, city, partner track, and risk tolerance controls.

## 0:50-1:25 - Run The Agent

"I’ll run a mission for a public event. The selected partner track is MongoDB, because event incidents, tool traces, response assignments, and public updates are document-shaped operational records."

Click **Run agent**.

"The agent creates a plan, executes tool-backed steps, and returns recommendations."

## 1:25-2:05 - Explain Results

Show the plan panel.

"Here is the multi-step plan: detect active pressure points, match resources, and draft public updates."

Show the recommendations panel.

"The agent prioritizes the highest-risk zone and gives confidence scores so an operator can review the decision."

Show next actions.

"The actions are human-approved. The agent does not blindly publish or dispatch without review."

## 2:05-2:35 - Show Tool Trace And Integrations

Open the tool trace panel.

"This is the tool trace. It shows what the agent called and what came back. The backend supports Gemini for planning and summarization through `GOOGLE_API_KEY`, and supports partner MCP calls through `MCP_SERVER_URL`."

If using mock bridge:

"For this local demo, the MCP path can run through the included mock bridge. For final deployment, the same adapter points to the real MongoDB MCP server."

## 2:35-3:00 - Closing

"CivicOps Agent moves beyond chat. It plans, uses tools, creates auditable recommendations, and helps event teams act faster while keeping humans in control. Next, we would connect MongoDB Atlas for live event records, action history, and geospatial operations context."
