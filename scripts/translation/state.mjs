import fs from 'node:fs/promises';
import path from 'node:path';

export function cycleKey(now = new Date(), day = 1, timezone = 'UTC') {
  if (!Number.isInteger(day) || day < 1 || day > 31) throw new Error('Billing cycle day must be an integer from 1 to 31');
  const values = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).map(part => [part.type, part.value]));
  const startDay = Math.min(day, new Date(Date.UTC(Number(values.year), Number(values.month), 0)).getUTCDate());
  const date = new Date(Date.UTC(Number(values.year), Number(values.month) - 1 - (Number(values.day) < startDay ? 1 : 0), 1));
  return date.toISOString().slice(0, 7);
}

export class TranslationState {
  constructor(directory, { budget = 1800000, day = 1, timezone = 'UTC', now = new Date(), checkpoint } = {}) {
    if (!Number.isSafeInteger(budget) || budget < 1 || budget > 1800000) throw new Error('Budget must be between 1 and 1800000');
    this.directory = directory;
    this.budget = budget;
    this.cycle = cycleKey(now, day, timezone);
    this.shards = new Map();
    this.checkpoint = checkpoint;
  }
  async load() {
    let usage;
    try { usage = JSON.parse(await fs.readFile(path.join(this.directory, 'usage.json'), 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (usage && (!Number.isSafeInteger(usage.estimated_used) || usage.estimated_used < 0 || !/^\d{4}-\d{2}$/.test(usage.cycle) || typeof usage.paused_for_quota !== 'boolean' || (usage.known_sources !== undefined && (!Array.isArray(usage.known_sources) || usage.known_sources.some(source => typeof source !== 'string'))))) throw new Error('Invalid persisted budget counter');
    this.usage = usage?.cycle === this.cycle ? usage : { cycle: this.cycle, estimated_used: 0, paused_for_quota: false, known_sources: usage?.known_sources || [] };
    return this;
  }
  async save() {
    await fs.mkdir(this.directory, { recursive: true });
    await fs.writeFile(path.join(this.directory, 'usage.json'), JSON.stringify(this.usage, null, 2) + '\n');
  }
  async reserve(characters) {
    if (!Number.isSafeInteger(characters) || characters < 0) throw new Error('Invalid character estimate');
    if (this.usage.paused_for_quota) throw new Error('cycle_quota_exhausted');
    if (this.usage.estimated_used + characters > this.budget) throw new Error('soft_budget_exhausted');
    this.usage.estimated_used += characters;
    await this.save();
    await this.checkpoint?.();
  }
  async pauseForQuota() { this.usage.paused_for_quota = true; await this.save(); await this.checkpoint?.(); }
  async cache(key, value) {
    if (!/^[a-f\d]{64}$/.test(key)) throw new Error('Invalid cache key');
    const shard = (Number.parseInt(key.slice(0, 2), 16) % 4).toString(16).padStart(2, '0');
    const filename = path.join(this.directory, 'cache', shard + '.json');
    if (!this.shards.has(shard)) {
      let data = {};
      try { data = JSON.parse(await fs.readFile(filename, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
      this.shards.set(shard, data);
    }
    const data = this.shards.get(shard);
    if (value === undefined) return data[key];
    if (value === null) delete data[key];
    else data[key] = value;
    await fs.mkdir(path.dirname(filename), { recursive: true });
    await fs.writeFile(filename, JSON.stringify(data) + '\n');
    return value;
  }
}
