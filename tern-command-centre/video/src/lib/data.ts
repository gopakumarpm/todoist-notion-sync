// The video reads the same export the artifact is built from: ../dist/state.json (node build-static.js).
import state from '../../../dist/state.json';

export type Agent = { id: string; name: string; role: string; company: string; arm: string; reports_to: string; lead: boolean; status: string; skills: string[]; reports: string[] };
export type Company = { key: string; name: string; short: string; head: string; title: string; color: string; arms?: Record<string, string> };
export type Step = { id: string; name: string; agent: string; kind: string; detail: string };
export type Run = { id: string; name: string; status: string; steps: { id: string; status: string; ms: number; note: string }[] };
export type Flow = { id: string; name: string; description: string; steps: Step[]; runs: Run[] };
export type Task = { id: string; title: string; owner: string; company: string; status: string; priority: string; due: string };
export type Sprint = { id: string; name: string; goal: string; start: string; end: string; tasks: Task[] };
export type Cron = { id: string; name: string; human: string; agent: string; enabled: boolean; status: string; next_run: string };
export type State = { generated: string; chairman: string; brand: { name: string; essence: string }; companies: Company[]; agents: Agent[]; skills: { id: string }[]; flows: Flow[]; crons: Cron[]; generations: { title: string; type: string; date: string; agent: string }[]; docs: unknown[]; sprints: Sprint[]; counts: Record<string, number> };

export const S = state as unknown as State;
export const agent = (id: string) => S.agents.find((a) => a.id === id);
export const nameOf = (id: string) => (id === 'gopakumar' ? 'Gopakumar' : agent(id)?.name ?? id);
export const company = (key: string) => S.companies.find((c) => c.key === key);
export const colorOf = (a: Agent | undefined) => {
  if (!a) return '#8FA3BC';
  const c = company(a.company);
  return (a.arm && c?.arms?.[a.arm]) || c?.color || '#8FA3BC';
};
