# City/municipal committee workflow review — 6 October 2026

Reviewed the nine authenticated pages, login/OTP, their CRUD endpoints, AI endpoints,
archive export, and session export. The sidebar, page arrangement, colors, tables,
and dialog patterns remain familiar. Branding is SP — Sangguniang Panlungsod.

## Procedural basis

[Republic Act 7160, section 50](https://lawphil.net/statutes/repacts/ra1991/ra_7160_1991.html)
places committee organization, membership, jurisdiction, and legislative procedure
within the sanggunian's internal rules of procedure. This software records the
committee arrangements authorized by the council. A committee record, task approval,
or a “Decision-making” level does not constitute ordinance enactment, plenary approval,
or general enforcement authority. Actual local rules and establishing instruments
must supply those facts.

Standing, Ad Hoc, and Advisory are the requested application classifications.
Decision-making, Recommendatory, and Monitoring are the client's requested scope
levels. Five committee members, five unfinished tasks, and the 50/20/30 score are
retained application policies; they are not presented as statutory requirements.

## Coverage and corrections

| Page or action | Final behavior |
| --- | --- |
| Login, OTP, navigation | SP branding; existing accounts/role codes preserved. Public OTP responses do not reveal diagnostic reasons; separate diagnostic routes require opt-in and administrator authentication. |
| Dashboard | Counts all unfinished task states; uses the same source resources as monitoring. |
| Members | Register/edit roster and availability. Record attendance from official records as a monthly summary. Re-recording the same member/committee/month updates the summary. Related operational records and linked accounts block deletion. |
| Committees | Free committee name removes the circular dependency on jurisdiction. Record type, issuance date, issuer, establishing reference, and optional end date. Existing types/positions remain readable and editable without invented replacements. |
| Jurisdiction | All accessible committees, the three requested new levels, legal basis, area, and optional start date. Effective-until is the committee's shared term end date; changing it updates linked scopes. Prior start dates are preserved. |
| Penalty matrix | Catalog existing provisions with their legal basis and offense descriptions/amounts. No adjudication or fine collection is performed. |
| Membership assignments | Committee/member relations; one Chairperson and Secretary per committee. Shared transaction locks protect capacity and office uniqueness. Inactive, dissolved, and expired committees cannot receive new assignments. Unfinished tasks prevent membership removal. |
| Operational tasks in Assignments | Handler must be on the committee roster. Open → In progress → Awaiting approval → Completed, or return for revision. A different authorized reviewer approves. Submission date, approval time, and authenticated approver are separate. Only unstarted tasks may be deleted. |
| Workload | Search/filter task inventory, due dates, completed dates, approver, and unfinished-task capacity. Monitoring only. |
| Performance | Completed-task chart and weighted scores derived from tasks and latest reporting-month attendance. Unknown completion/attendance evidence earns no corresponding points. |
| Reports | Committee scope and actual date filtering; immutable server-generated snapshot returned for preview. Reporting dates select task creation, attendance month, and committee issuance. Rosters reflect generation time. Scoped members cannot retrieve other members' performance snapshots. |
| Archives | Copy saved report snapshot, preserving the originally generated figures. Repeated requests reuse the archive reference. Old metadata-only reports require regeneration. |
| Session export | Recompute the same weighted scores and store a local session snapshot. This endpoint is not an external system delivery. |
| Users/roles | Existing identifiers retained; SP/council display labels. Scoped member/chair accounts require a member link. Existing self-deletion/deactivation restrictions retained. |
| AI | Advisory analysis only, with server authorization and scoped data before external AI calls. Workload includes all unfinished states. Requested workload limits are honored. AI summaries no longer silently create global report records. |

## Historical data and release preparation

The additive migrations in `database/migrations/002` through `005` preserve existing
records. Do not interpret old jurisdiction start dates as end dates or manufacture
issuance documents, historic completion evidence, or approvers. Existing snapshots
are not backfilled with today's figures. Apply migrations before releasing the APIs.

Local migration repeatability, PHP workflow checks, interface tests, PHP syntax checks,
format checking, and production build are the verification steps. No deployment is
part of this review. Screenshots are layout examples; their sample ordinances,
people, dates, sanctions, and attendance percentages are not imported as legal facts.

The application does not yet model bill readings, hearings/session minutes, quorum,
voting, mayoral approval/veto, publication, or ordinance effectivity. Adding those
would require local rules and a separately agreed legislative workflow, rather than
quietly changing this committee-management interface.
