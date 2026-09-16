# JPN Creative Asset Checklist v1

Status: **INTERNAL / PRE-PUBLICATION**  
Publication authorized: **NO**

## Purpose

Operational checklist for turning the approved commercial copy, visual briefs, production manifest and layout specification into editable sources and preview assets without silently promoting them to published material.

## Source chain

Every creative candidate must be checked against:

1. `JPN_VISUAL_CREATIVE_BRIEFS_v1.md` — visual intent;
2. `JPN_CREATIVE_PRODUCTION_MANIFEST_v1.md` — asset IDs and production queue;
3. `JPN_CREATIVE_COPY_DECK_v1.md` — controlled commercial copy;
4. `JPN_CREATIVE_LAYOUT_SPEC_v1.md` — hierarchy, dimensions and composition.

If these sources disagree, the candidate remains blocked until the tracked source documents are reconciled. A preview never overrides product documentation.

## Production matrix

| ID | Product / purpose | Format | Editable source | Preview | Automated gate | Human visual review | Publication |
|---|---|---:|---|---|---|---|---|
| JPN-CR-01 | Método JPN | 1080×1080 | PENDING | PENDING | PENDING | PENDING_HUMAN | BLOCKED |
| JPN-CR-02 | Prompt Builder | 1080×1080 | PENDING | PENDING | PENDING | PENDING_HUMAN | BLOCKED |
| JPN-CR-03 | Prompt Pack | 1080×1080 | PENDING | PENDING | PENDING | PENDING_HUMAN | BLOCKED |
| JPN-CR-04 | JPN Business | 1080×1080 | PENDING | PENDING | PENDING | PENDING_HUMAN | BLOCKED |
| JPN-CR-05 | Gestão Fácil | 1080×1080 | PENDING | PENDING | PENDING | PENDING_HUMAN | BLOCKED |
| JPN-CR-06 | JPN Pro Kit | 1080×1080 | PENDING | PENDING | PENDING | PENDING_HUMAN | BLOCKED |
| JPN-CR-07 | Ecossistema / jornada | 1080×1920 | PENDING | PENDING | PENDING | PENDING_HUMAN | BLOCKED |
| JPN-CR-08 | Ecossistema / hero | 16:9 | PENDING | PENDING | PENDING | PENDING_HUMAN | BLOCKED |

## Required file convention

Use deterministic names so sources and previews can be audited:

- editable source: `JPN-CR-XX_<slug>_source.<ext>`;
- preview: `JPN-CR-XX_<slug>_preview.png`;
- optional review export: `JPN-CR-XX_<slug>_review.pdf`.

Do not use `final`, `approved`, `published`, `release` or similar words before the corresponding gate exists.

## Per-asset preflight

Before marking `SOURCE_READY`:

- asset ID matches the production manifest;
- canvas size/aspect ratio matches the layout specification;
- headline and supporting copy come from the copy deck;
- hierarchy and spacing follow the layout specification;
- product name and status are exact;
- no invented feature, integration or compatibility claim;
- no price, discount, countdown, artificial scarcity or transactional CTA;
- no revenue, profit or guaranteed-result promise;
- no real customer, financial, credential or account data;
- no third-party logo/image unless its use is already documented and permitted.

Before marking `PREVIEW_READY`:

- preview is generated from the tracked editable source;
- no text clipping or overflow is visible;
- contrast and reading order remain clear at mobile scale;
- status labels remain visible where required;
- preview filename maps one-to-one to the source filename;
- preview is still treated as internal evidence, not publication authorization.

## Product-specific guardrails

### Método JPN

Keep the method centered on Jornada, Precisão and Narrativa. Do not imply guaranteed AI correctness or guaranteed outcomes.

### JPN Prompt Builder

Describe it as a tool that structures/refines instructions. Do not present it as if it executes the user's business task by itself. Mobile/contextual QA remains evidence-dependent.

### JPN Prompt Pack

Use only the tracked template inventory and demonstrated categories. Do not inflate template counts or imply universal suitability.

### JPN Business

Keep claims aligned with the tracked 12-playbook product. Do not introduce integrations, automations or operational capabilities that are not part of the product evidence.

### Gestão Fácil

Do not call it an ERP, accounting system or guaranteed replacement for professional/accounting processes. `REPOR` is an operational alert only. Cross-platform compatibility remains blocked until `GF-QA-10` is physically evidenced on the same XLSX in Microsoft Excel, LibreOffice Calc and Google Sheets. No real financial data may be used in creative examples.

### JPN Pro Kit

The visible status must remain **EM PREPARAÇÃO** while that is the tracked product state. Do not present the bundle as available for purchase or delivery before release evidence changes that state.

## State transition rules

Allowed mechanical progression:

`SPEC_READY → SOURCE_READY → PREVIEW_READY → GATE_PASS → PENDING_HUMAN → APPROVED_INTERNAL`

Rules:

- a state may advance only when its evidence exists;
- `PENDING_HUMAN` cannot be converted automatically into approval;
- `APPROVED_INTERNAL` still does not authorize publication;
- publication requires a separate explicit authorization outside this checklist;
- release flags must remain independent from creative-production status.

## Batch acceptance gate

The creative batch can be considered internally complete only when all eight IDs have:

- a tracked editable source;
- a matching preview;
- successful applicable automated checks;
- recorded human visual/editorial review;
- no unresolved product-specific guardrail violation.

Until then, the batch status is **IN PRODUCTION**.

## Current status

This checklist prepares the production/audit layer only. It does not claim that `JPN-CR-01..08` sources or previews already exist. Physical QA, human visual/editorial review, release freeze and publication authorization remain separate evidence-based steps.
