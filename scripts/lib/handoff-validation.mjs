const timestampPattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?(Z|([+-])(\d{2}):(\d{2}))$/;

export const isSemanticallyValidTimestamp = (value) => {
  if (value === null || value === undefined) return true;
  const match = timestampPattern.exec(value);
  if (!match) return false;
  const [, y, mo, d, h, mi, s, , zone, , oh, om] = match;
  const year = Number(y), month = Number(mo), day = Number(d), hour = Number(h), minute = Number(mi), second = Number(s);
  if (month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) return false;
  if (day < 1 || day > new Date(Date.UTC(year, month, 0)).getUTCDate()) return false;
  if (zone !== 'Z' && (Number(oh) > 14 || Number(om) > 59 || (Number(oh) === 14 && Number(om) !== 0))) return false;
  return true;
};

export const validateHandoffReferences = (handoff) => {
  const ids = handoff.evidence.map((item) => item.id);
  const unique = new Set(ids);
  if (unique.size !== ids.length) return { valid: false, reason: 'IDs de evidência duplicados' };
  for (const [i, evidence] of handoff.evidence.entries()) {
    if (!isSemanticallyValidTimestamp(evidence.captured_at)) return { valid: false, reason: `evidence[${i}].captured_at não representa data/hora ISO 8601 válida` };
  }
  for (const [i, decision] of (handoff.decisions ?? []).entries()) {
    for (const id of decision.basis_evidence_ids) if (!unique.has(id)) return { valid: false, reason: `decisions[${i}] referencia evidência inexistente: ${id}` };
  }
  return { valid: true };
};
