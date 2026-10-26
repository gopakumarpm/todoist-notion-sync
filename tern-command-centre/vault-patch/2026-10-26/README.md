# Vault patch — Tern Finserve (26 Oct 2026)

The Drive mirror of the Gopa Vault has been empty since the Mac migration of 7 Oct, so this patch could not be applied from the cloud. Apply it on the Mac (or ask Max in a session that can see the vault folder: "apply the vault patch 2026-10-26").

## Drop in as whole files (replace the existing note where one exists)
| File in this folder | Vault path | Note |
|---|---|---|
| `02 Areas/Tern Finserve.md` | `02 Areas/Tern Finserve.md` | **new** |
| `02 Areas/Tern Group.md` | `02 Areas/Tern Group.md` | replaces the 13 Sep version (chart, six companies, 12 Oct section, open items) |
| `Projects/Tern Group — Org Chart.md` | `Projects/Tern Group — Org Chart.md` | replaces the 13 Sep version |

If `02 Areas/Tern Group.md` or the Org Chart note was edited by hand after 13 Sep, merge instead of replacing.

## Edit in place (small, surgical)
**`Home.md`**
- Heading `## 🏛️ Tern Group (112 people · 5 companies · 9 practices)` → `(118 people · 6 companies · 9 practices)`.
- Company line: add ` · [[02 Areas/Tern Finserve|💳 Tern Finserve]] (Meera Kulkarni, 6)` after the eSource entry.
- Footer: `*Updated 26 Oct 2026 by Max: Tern Finserve, the sixth company (loan distribution / DSA), synced into every record.*`

**`02 Areas/_Areas Index.md`**
- After the eSource entry add, in the same format: `[[02 Areas/Tern Finserve|💳 Tern Finserve]] — loan distribution (DSA) for HL, PL, BL, LAP under eSource Consultancy Pvt. Ltd.; Meera Kulkarni, CEO (6). Sixth company, 12 Oct 2026.`
- Set `updated: 2026-10-26`.

**`Projects/_Projects Index.md`**
- Org Structure row: `Full tree: 118 people, 6 companies, 9 practices, reporting lines` · status `✅ Recorded 11 Sep · synced 26 Oct`.
- After the eSource section add:
  ```
  ## 💳 Tern Finserve
  | Project | What | Status |
  |---|---|---|
  | [[02 Areas/Tern Finserve\|Tern Finserve]] | Loan distribution (DSA) for HL, PL, BL, LAP under eSource Consultancy Pvt. Ltd.; team of 6 under Meera Kulkarni | 🌱 Set up 12 Oct 2026; entity checks open |
  ```
- CredSuvidha row: append `(separate from Tern Finserve)` to its description.
- Date line: add `**26 Oct 2026** (Tern Finserve)`; set `updated: 2026-10-26`.

**`Projects/Tern Group — Org Structure.md`**
- Headcount 118 (Max + 117), balance 59 / 59, six operating companies, as of 26 Oct 2026.
- After the eSource block add:
  ```
  ### 💳 Tern Finserve (6) — Meera Kulkarni, CEO → Max
  - Arvind Menon — Head, Credit & Eligibility Advisory → Meera
  - Elena Fischer — Head, Lender Partnerships → Meera
  - Samuel Reyes — Head, Sales & Lead Operations → Meera
  - Pooja Deshpande — Loan Processing & Disbursement Lead → Meera
  - Thomas Becker — Compliance & Customer Grievance Officer → Meera (dotted Vikram Desai)
  Loan distributor (DSA), not a lender; under eSource Consultancy Pvt. Ltd., separate from CredSuvidha; Pune first, then PAN India. Decided 12 Oct 2026; records synced 26 Oct.
  ```
- Related line: add `[[02 Areas/Tern Finserve|Tern Finserve]]`.

**`Projects/Tern OS Command Centre.md`**
- Version line → `v3.3 (26 Oct 2026): Tern Finserve synced, 118 agents, Sprint 44; the refresh now starts by reading the live artifacts.`

**`Projects/Obsidian Second Brain.md`**
- Add under the 13 Sep update: `- 26 Oct 2026: Tern Finserve patch (this folder) — the Drive mirror of the vault was empty, so the notes were patched from the Mac.`

## Graph colours
`.obsidian/graph.json` already colours `path:"02 Areas/Tern"` deep teal, so the new note picks up the Tern colour. To give Finserve its own colour (violet `#7A52B0`, as on the org chart), add a group `path:"02 Areas/Tern Finserve"` above the Tern one.
