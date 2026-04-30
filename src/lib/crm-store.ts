import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type LeadStatus = "new" | "in_progress" | "won" | "closed";
export type LeadType = "contact" | "career" | "demo";

export interface CrmLead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  fleetSize?: string;
  message?: string;
  metadata?: Record<string, string>;
}

const CRM_DIR = path.join(process.cwd(), ".crm");
const CRM_FILE = path.join(CRM_DIR, "leads.json");

async function ensureStore() {
  await fs.mkdir(CRM_DIR, { recursive: true });
  try {
    await fs.access(CRM_FILE);
  } catch {
    await fs.writeFile(CRM_FILE, "[]", "utf-8");
  }
}

async function readLeads(): Promise<CrmLead[]> {
  await ensureStore();
  const raw = await fs.readFile(CRM_FILE, "utf-8");
  const parsed = JSON.parse(raw) as CrmLead[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeLeads(leads: CrmLead[]) {
  await ensureStore();
  await fs.writeFile(CRM_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

export async function getLeads() {
  const leads = await readLeads();
  return leads.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function addLead(
  input: Omit<CrmLead, "id" | "createdAt" | "updatedAt" | "status"> & { status?: LeadStatus }
) {
  const now = new Date().toISOString();
  const leads = await readLeads();
  const lead: CrmLead = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: input.status ?? "new",
  };
  leads.push(lead);
  await writeLeads(leads);
  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const leads = await readLeads();
  const idx = leads.findIndex((lead) => lead.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], status, updatedAt: new Date().toISOString() };
  await writeLeads(leads);
  return leads[idx];
}
