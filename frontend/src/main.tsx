import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  BadgeCheck,
  Bot,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Database,
  Gauge,
  HelpCircle,
  Loader2,
  MapPin,
  RadioTower,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import "./styles.css";

type View = "mission" | "guide" | "tools" | "approval" | "audit";

type PlanStep = {
  id: string;
  title: string;
  rationale: string;
  tool: string;
};

type ToolResult = {
  tool: string;
  status: string;
  output: Record<string, unknown>;
};

type Recommendation = {
  title: string;
  impact: string;
  confidence: number;
};

type AgentResponse = {
  run_id: string;
  integration_status: {
    gemini: string;
    partner_mcp: string;
    mode: string;
  };
  summary: string;
  plan: PlanStep[];
  tool_results: ToolResult[];
  recommendations: Recommendation[];
  next_actions: string[];
};

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/agent/run";

const starterGoal =
  "Help event staff spot crowding early, send the right response teams, and write clear visitor updates.";

const liveSignals = [
  { zone: "North Gate", label: "Crowd pressure", value: 82, tone: "hot" },
  { zone: "Transit Hub", label: "Queue delay", value: 74, tone: "warn" },
  { zone: "Market Lane", label: "Vendor demand", value: 63, tone: "watch" },
  { zone: "Family Plaza", label: "Access route", value: 56, tone: "calm" },
];

function App() {
  const [goal, setGoal] = useState(starterGoal);
  const [city, setCity] = useState("Toronto");
  const [partnerTrack, setPartnerTrack] = useState("MongoDB");
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState(
    "I can help you run this event safety agent. Start in Mission, click Run agent, then review the actions before approving them.",
  );
  const [riskTolerance, setRiskTolerance] = useState(45);
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [activeView, setActiveView] = useState<View>("mission");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const healthScore = useMemo(() => {
    if (!result) return 72;
    const average =
      result.recommendations.reduce((sum, item) => sum + item.confidence, 0) /
      result.recommendations.length;
    return Math.round(average);
  }, [result]);

  async function runAgent() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          city,
          partner_track: partnerTrack,
          risk_tolerance: riskTolerance,
        }),
      });

      if (!response.ok) {
        throw new Error("The agent API rejected the request.");
      }

      setResult(await response.json());
      setActiveView("approval");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong while running the agent.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brandMark">
            <Bot size={22} />
          </span>
          <div>
            <strong>Event Safety Agent</strong>
            <small>Plan safer crowd operations</small>
          </div>
        </div>

        <nav className="nav">
          <NavButton
            active={activeView === "mission"}
            icon={<Activity size={18} />}
            label="Mission"
            onClick={() => setActiveView("mission")}
          />
          <NavButton
            active={activeView === "guide"}
            icon={<HelpCircle size={18} />}
            label="Guide"
            onClick={() => setActiveView("guide")}
          />
          <NavButton
            active={activeView === "tools"}
            icon={<Database size={18} />}
            label="Event memory"
            onClick={() => setActiveView("tools")}
          />
          <NavButton
            active={activeView === "approval"}
            icon={<ClipboardCheck size={18} />}
            label="Actions"
            onClick={() => setActiveView("approval")}
          />
          <NavButton
            active={activeView === "audit"}
            icon={<ShieldCheck size={18} />}
            label="Activity log"
            onClick={() => setActiveView("audit")}
          />
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow"><Sparkles size={16} /> Event operations assistant</p>
            <h1>Keep crowds moving and visitors informed.</h1>
          </div>
          <button className="ghostButton" onClick={runAgent} disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
            Run safety check
          </button>
        </header>

        {activeView === "mission" && (
          <>
            <section className="metricRow">
              <Metric icon={<Gauge size={18} />} label="Readiness" value={`${healthScore}%`} />
              <Metric icon={<Database size={18} />} label="Event memory" value="On" />
              <Metric icon={<MapPin size={18} />} label="City" value={city} />
              <Metric icon={<ShieldCheck size={18} />} label="Approval" value="You decide" />
            </section>

            <section className="heroGrid">
              <div className="missionPanel">
                <label>What should the agent help with?</label>
                <textarea value={goal} onChange={(event) => setGoal(event.target.value)} />

                <div className="controlGrid">
                  <label>
                    City
                    <input value={city} onChange={(event) => setCity(event.target.value)} />
                  </label>

                  <label>
                    Event records
                    <select
                      value={partnerTrack}
                      onChange={(event) => setPartnerTrack(event.target.value)}
                    >
                      <option value="MongoDB">Event Operations Memory</option>
                      <option value="Elastic">Searchable Incident History</option>
                      <option value="Arize">AI Quality Monitor</option>
                      <option value="Fivetran">Connected Data Feed</option>
                      <option value="GitLab">Response Playbook</option>
                      <option value="Dynatrace">System Health Signals</option>
                    </select>
                  </label>
                </div>

                <label>
                  Response urgency <span>{riskTolerance}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={riskTolerance}
                    onChange={(event) => setRiskTolerance(Number(event.target.value))}
                  />
                </label>
              </div>

              <div className="signalPanel">
                <div className="scoreRing" style={{ "--score": `${healthScore * 3.6}deg` } as React.CSSProperties}>
                  <span>{healthScore}</span>
                  <small>readiness</small>
                </div>
                <div className="signalCopy">
                  <p className="eyebrow"><RadioTower size={16} /> Current situation</p>
                  <h2>{result ? "Safety check complete" : "Ready to help"}</h2>
                  <p>{result?.summary ?? "Tell the agent what you want to protect or improve, run a safety check, then review the suggested actions."}</p>
                </div>
              </div>
            </section>

            <section className="liveMap">
              <div className="liveMapHeader">
                <div>
                  <p className="eyebrow"><RadioTower size={16} /> Situation board</p>
                  <h2>Areas that may need attention</h2>
                </div>
                <span>{result ? "Updated after safety check" : "Example event signals"}</span>
              </div>
              <div className="zoneGrid">
                {liveSignals.map((signal) => (
                  <article className={`zoneTile ${signal.tone}`} key={signal.zone}>
                    <strong>{signal.zone}</strong>
                    <span>{signal.label}</span>
                    <div>
                      <i style={{ width: `${signal.value}%` }} />
                    </div>
                    <b>{signal.value}</b>
                  </article>
                ))}
              </div>
            </section>

            <section className="resultGrid">
              <PlanPanel result={result} />
              <RecommendationPanel result={result} />
            </section>
          </>
        )}

        {error && <p className="error">{error}</p>}

        {activeView === "guide" && (
          <GuidePanel
            question={assistantQuestion}
            answer={assistantAnswer}
            onQuestionChange={setAssistantQuestion}
            onAsk={() => setAssistantAnswer(answerGuideQuestion(assistantQuestion))}
            onUseExample={(example) => {
              setGoal(example);
              setActiveView("mission");
            }}
          />
        )}
        {activeView === "tools" && <ToolPanel result={result} />}
        {activeView === "approval" && <ApprovalPanel result={result} onRun={runAgent} loading={loading} />}
        {activeView === "audit" && <AuditPanel result={result} />}
      </section>
    </main>
  );
}

function answerGuideQuestion(question: string) {
  const normalized = question.toLowerCase();
  if (normalized.includes("what") || normalized.includes("for")) {
    return "This agent helps event teams handle crowding, queues, blocked routes, and visitor updates. It turns a safety goal into suggested actions you can approve.";
  }
  if (normalized.includes("how") || normalized.includes("use") || normalized.includes("operate")) {
    return "Go to Mission, describe the event problem, choose the city, set response urgency, and click Run safety check. Then open Actions, Event memory, and Activity log.";
  }
  if (normalized.includes("risk") || normalized.includes("urgency")) {
    return "Lower urgency means the agent suggests calmer, safer actions. Higher urgency means it recommends faster intervention for serious crowd pressure.";
  }
  if (normalized.includes("mongodb") || normalized.includes("memory") || normalized.includes("records")) {
    return "Event Memory is where the agent can save incidents, actions, and past safety checks. For the hackathon, this maps to MongoDB behind the scenes.";
  }
  if (normalized.includes("demo") || normalized.includes("submit")) {
    return "For the demo, run a safety check, show the suggested actions, open Event memory to show tool results, and open Activity log to show traceability.";
  }
  return "Try asking: What is this agent for? How do I use it? What should I put in the mission? What does Event Memory mean?";
}

function GuidePanel({
  question,
  answer,
  onQuestionChange,
  onAsk,
  onUseExample,
}: {
  question: string;
  answer: string;
  onQuestionChange: (value: string) => void;
  onAsk: () => void;
  onUseExample: (value: string) => void;
}) {
  const examples = [
    "Reduce crowding near the main gate and guide visitors to safer entry points.",
    "Find long queue areas, assign support staff, and prepare a visitor update.",
    "Protect accessible routes and send help if any path becomes blocked.",
  ];

  return (
    <section className="singleView">
      <Panel title="Guide assistant" icon={<HelpCircle size={18} />}>
        <div className="assistantBox">
          <div className="assistantBubble">
            <Bot size={20} />
            <p>{answer}</p>
          </div>
          <div className="assistantInput">
            <input
              value={question}
              onChange={(event) => onQuestionChange(event.target.value)}
              placeholder="Ask what this agent does or how to use it"
            />
            <button type="button" onClick={onAsk}>
              <Send size={17} />
              Ask
            </button>
          </div>
        </div>
      </Panel>

      <Panel title="Ready-made missions" icon={<Sparkles size={18} />}>
        {examples.map((example) => (
          <button
            className="exampleMission"
            key={example}
            onClick={() => onUseExample(example)}
            type="button"
          >
            {example}
          </button>
        ))}
      </Panel>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="metric">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function NavButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className={active ? "active" : ""} onClick={onClick} type="button">
      {icon}
      {label}
    </button>
  );
}

function PlanPanel({ result }: { result: AgentResponse | null }) {
  return (
    <Panel title="Safety plan" icon={<MapPin size={18} />}>
      {(result?.plan ?? []).map((step) => (
        <article className="step" key={step.id}>
          <span>{step.id.replace("step-", "")}</span>
          <div>
            <strong>{step.title}</strong>
            <p>{step.rationale}</p>
            <code>{step.tool}</code>
          </div>
        </article>
      ))}
      {!result && <EmptyState text="Run a safety check to generate the plan." />}
    </Panel>
  );
}

function RecommendationPanel({ result }: { result: AgentResponse | null }) {
  return (
    <Panel title="Suggested actions" icon={<BadgeCheck size={18} />}>
      {(result?.recommendations ?? []).map((item) => (
        <article className="recommendation" key={item.title}>
          <div>
            <strong>{item.title}</strong>
            <p>{item.impact}</p>
          </div>
          <span>{item.confidence}%</span>
        </article>
      ))}
      {!result && <EmptyState text="Suggested actions will appear here." />}
    </Panel>
  );
}

function ToolPanel({ result }: { result: AgentResponse | null }) {
  return (
    <section className="singleView">
      <Panel title="Event memory" icon={<Database size={18} />}>
        {result && (
          <div className="statusStrip">
            <span>Gemini: {result.integration_status.gemini}</span>
            <span>Saved records: {result.integration_status.partner_mcp}</span>
            <span>{result.integration_status.mode}</span>
          </div>
        )}
        {(result?.tool_results ?? []).map((tool) => (
          <details className="trace" key={tool.tool} open>
            <summary>
              <span>{tool.tool}</span>
              <ChevronRight size={16} />
            </summary>
            <pre>{JSON.stringify(tool.output, null, 2)}</pre>
          </details>
        ))}
        {!result && <EmptyState text="Run a safety check first, then saved records and tool results will appear here." />}
      </Panel>
    </section>
  );
}

function ApprovalPanel({
  result,
  onRun,
  loading,
}: {
  result: AgentResponse | null;
  onRun: () => void;
  loading: boolean;
}) {
  return (
    <section className="singleView">
      <Panel title="Actions for you to approve" icon={<ClipboardCheck size={18} />}>
        {!result && (
          <div className="emptyAction">
            <p>No actions yet. Run a safety check to create recommended next steps.</p>
            <button className="ghostButton" onClick={onRun} disabled={loading} type="button">
              {loading ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
              Run safety check
            </button>
          </div>
        )}
        {(result?.next_actions ?? []).map((action) => (
          <div className="approvalAction" key={action}>
            <div>
              <ShieldCheck size={18} />
              <span>{action}</span>
            </div>
            <button type="button">
              <CheckCircle2 size={17} />
              Approve
            </button>
          </div>
        ))}
      </Panel>
      {result && <RecommendationPanel result={result} />}
    </section>
  );
}

function AuditPanel({ result }: { result: AgentResponse | null }) {
  return (
    <section className="singleView">
      <Panel title="Activity log" icon={<ShieldCheck size={18} />}>
        {result ? (
          <div className="auditList">
            <div><strong>Run ID</strong><span>{result.run_id}</span></div>
            <div><strong>Gemini</strong><span>{result.integration_status.gemini}</span></div>
            <div><strong>Saved records</strong><span>{result.integration_status.partner_mcp}</span></div>
            <div><strong>Mode</strong><span>{result.integration_status.mode}</span></div>
            <div><strong>Plan steps</strong><span>{result.plan.length}</span></div>
            <div><strong>Tool calls</strong><span>{result.tool_results.length}</span></div>
          </div>
        ) : (
          <EmptyState text="Run a safety check first, then the activity log will appear here." />
        )}
      </Panel>
      {result && <PlanPanel result={result} />}
    </section>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="panel">
      <header>
        <div className="panelTitle">
          {icon}
          <h2>{title}</h2>
        </div>
      </header>
      {children}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="empty">{text}</p>;
}

createRoot(document.getElementById("root")!).render(<App />);
