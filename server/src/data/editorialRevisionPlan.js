// Pure compare-and-set planning. The caller handles lookup, transactions and IO.
export function planEditorialRevision(current, desired, baselines) {
  if (current.content === desired.content && current.engagement === desired.engagement) return null
  const known = baselines.some((baseline) => baseline && current.content === baseline.content && (current.engagement ?? null) === (baseline.engagement ?? null))
  if (!known) throw new Error('Independent editorial changes detected; no lessons changed.')
  return {
    filter: { _id: current._id, content: current.content, engagement: current.engagement ?? null },
    update: { $set: { content: desired.content, engagement: desired.engagement } },
  }
}
