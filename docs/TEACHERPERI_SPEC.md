# TeacherPeri — Complete Product & Design Specification

**Status:** Living specification  
**Purpose:** Preserve the complete agreed product model, design logic, UX rules, domain concepts, and deferred ideas for TeacherPeri.  
**Relationship to other docs:** `PRODUCT.md` should remain the concise canonical product contract. This file is the detailed companion containing the full reasoning, examples, UX behavior, and implementation-facing product decisions.  
**Important:** Legacy Axioma code, comments, README content, routes, or assumptions do **not** define TeacherPeri requirements unless explicitly retained here or in `PRODUCT.md`.

---

# 1. Product Vision

TeacherPeri is a Spanish-language platform designed to help students:

1. Prepare for Mathematics Olympiads.
2. Understand and navigate the undergraduate application process for highly competitive universities in the United States and selected universities in Canada.

The platform is especially motivated by students who have ambition but lack a clear local ecosystem, mentor network, structured training path, or centralized set of application resources.

TeacherPeri should reduce the problem of fragmented information by helping students understand:

- What they can do.
- In what order they can do it.
- Where to find the relevant material.
- How to track what they have already done.
- What they may want to do next.

TeacherPeri is not intended to guarantee outcomes. Its role is to improve access to information, structure, guidance, and opportunities for students to develop themselves.

A central product principle is:

> **TeacherPeri should help students understand and organize their journey without turning the platform into a rigid LMS.**

---

# 2. Core Product Layers

TeacherPeri has four major conceptual layers.

## 2.1 Public Knowledge Layer

Public material anyone can browse without logging in.

Includes:

- Teoría
- Problemas
- Listas
- Exámenes
- Experiencias
- Rutas
- Universidad
- Threads

## 2.2 Guidance Layer

The Path / Ruta system.

Paths tell students how to move through TeacherPeri material in a meaningful order.

## 2.3 Community Layer

Threads provide independent public discussions where users can ask questions, answer others, and refer to TeacherPeri material.

## 2.4 Personal Layer

`Mi Espacio` gives logged-in users persistent progress, saved items, active Paths, badges, thread activity, and recent activity.

---

# 3. Current Intended Main Navigation

The primary navbar is currently intended to contain, in this order:

1. **Inicio**
2. **Rutas**
3. **Zona de Entrenamiento**
4. **Universidad**
5. **Experiencias**
6. **Threads**
7. **Sobre mí**
8. **Mi Espacio**

`Mi Espacio` should be visually distinguishable as the account/personal area.

## 3.1 Contacto

Contacto should remain available but is not currently intended to occupy a primary navbar slot. It can be reachable through the footer, Sobre mí, or another contextual location.

## 3.2 Agradecimientos / Colaboradores

Agradecimientos should initially be incorporated into `Inicio`.

A separate acknowledgements page may be introduced later if the content becomes large enough to justify it.

The current legacy `Colaboradores` page should not automatically be treated as a permanent top-level navigation item.

---

# 4. Inicio

Inicio is the orientation layer for first-time and returning users.

It should eventually explain:

- What TeacherPeri is.
- Who it is for.
- How to use the platform.
- Mission.
- Vision.
- Main ways to enter the platform.
- Acknowledgements.
- Direct links into the two major journeys:
  - Mathematics Olympiad preparation.
  - University applications.

A major homepage interaction may ask something similar to:

- Quiero prepararme para Olimpiadas.
- Quiero prepararme para estudiar en el extranjero.
- Quiero hacer ambas.

Users who already know what they want should not be forced through the homepage. This is one reason `Universidad`, `Rutas`, and `Zona de Entrenamiento` remain directly accessible from the navbar.

---

# 5. Fundamental Domain Distinctions

TeacherPeri must preserve these distinctions.

## 5.1 Content ≠ Path

**Content** is material users consume.

**Paths** are curated guidance through content.

A Path does not own the content it references.

The same content may be reused by many Paths without duplication.

## 5.2 Path ≠ Folder

A folder organizes material.

A Path organizes learning or action.

A folder answers:

> “Where is this material classified?”

A Path answers:

> “What should I do, and in what order?”

## 5.3 Tags ≠ Folders

Folders are curated hierarchical navigation.

Tags are many-to-many classification and filtering metadata.

Tags complement folders rather than replacing them.

## 5.4 Reference ≠ Attachment

In Threads and other future systems:

- A **reference** points to an existing TeacherPeri object.
- An **attachment** is supporting uploaded material.

These are separate concepts.

---

# 6. Rutas / Paths

## 6.1 Core Definition

A Path is a reusable, recursive guide.

A Path contains **either**:

- an ordered collection of child Paths,

**or**

- an ordered collection of Steps.

A Path must **never contain both child Paths and Steps at the same level** in the current product model.

This is a core invariant.

## 6.2 Recursive Example — OMM

```text
Preparación para la OMM
│
├── Álgebra para la OMM
├── Geometría para la OMM
│   │
│   ├── Fundamentos
│   ├── Círculos
│   │   │
│   │   ├── Cuadriláteros Cíclicos
│   │   └── Potencia de un Punto
│   │       │
│   │       ├── Step
│   │       ├── Step
│   │       └── Step
│   │
│   └── ...
│
├── Combinatoria para la OMM
├── Teoría de Números para la OMM
├── Técnicas de Demostración
├── Simulacros
└── Consejos
```

## 6.3 Recursive Example — University

```text
Aplicar a Universidades Competitivas
│
├── Entiende el Proceso
│   ├── Step
│   ├── Step
│   └── Step
│
├── Construye tu Preparación
│   ├── Preparación SAT
│   ├── Proyectos Personales
│   ├── Olimpiadas y Competencias
│   ├── Liderazgo e Impacto
│   └── Actividades Extracurriculares
│
├── Prepara tu Aplicación
│   ├── Lista de Universidades
│   ├── Essays
│   ├── Cartas de Recomendación
│   ├── Common App
│   ├── Financial Aid
│   └── ...
│
└── Después de Aplicar
    ├── Entrevistas
    ├── Decisiones
    ├── Comparar Ofertas
    └── ...
```

The exact university content remains to be authored later. The important product decision is that **the same Path engine supports both Olympiad and university journeys**.

Do not create separate `OlympiadPath` and `UniversityPath` engines.

---

# 7. Path Pages

Every Path is conceptually the same type of page regardless of depth.

A Path page should generally contain:

- Breadcrumbs.
- Path title.
- Path description.
- Progress information if relevant and the user is logged in.
- Actions such as:
  - Add to My Routes.
  - Save for later.
- The ordered next items.

If it is a parent Path, the ordered items are child Paths.

If it is a leaf Path, the ordered items are Steps.

## 7.1 Breadcrumbs

Breadcrumbs are important because Paths may be deeply nested.

Example:

```text
OMM › Geometría › Círculos › Potencia de un Punto
```

Example:

```text
Universidad › Aplicación › Essays › Personal Statement
```

Breadcrumbs should communicate where the user currently is in the overall guide.

## 7.2 Child-Path Presentation

A parent Path can show each child Path as a section/card with:

- Title.
- Short description.
- Progress if logged in.
- Link to open that Path.

A parent Path should not feel like a plain folder. It should still communicate why its children belong together.

---

# 8. Steps

Steps are deliberately general.

A Step contains:

- **Title**
- **Description / instruction**
- **References to TeacherPeri content**
- **Optional extra resources**

Conceptually:

```text
Step
├── title
├── description
├── teacherperiReferences[]
└── extraResources[]
```

## 8.1 TeacherPeri References

A Step may reference existing TeacherPeri objects such as:

- Teoría
- Problemas
- Listas
- Exámenes
- Experiencias
- potentially other approved object types later

## 8.2 Extra Resources

A Step may also include external resources such as:

- YouTube videos
- external articles
- books
- AoPS threads
- official competition pages
- other useful external references

## 8.3 Step Philosophy

A Step should describe an **action**, not merely display a link.

Better:

> Aprende la teoría  
> Estudia primero la explicación y revisa los ejemplos antes de comenzar la práctica.

Worse:

> Potencia de un Punto PDF

The Path should behave like a guide rather than a folder of hyperlinks.

## 8.4 Step Completion

Steps do **not** have their own completion checkboxes in the current model.

The user completes a leaf Path as a whole.

---

# 9. Path Progress

## 9.1 Logged-Out Users

Logged-out users can freely browse:

- Paths
- child Paths
- Steps
- referenced content

They do not get persistent progress/checkmarks.

No login should be required to learn or browse public content.

## 9.2 Logged-In Users

Logged-in users may add a Path to `Mis Rutas`.

They can then use completion/progress as a persistent aid.

Progress is intended to help the student understand:

- Where they are.
- What they have done.
- What remains.
- Whether the same Path was already completed elsewhere.

## 9.3 Leaf Completion

A logged-in user may manually mark a **leaf Path** complete.

The meaning is approximately:

> “I worked through this section to a level where I consider it complete.”

TeacherPeri is not attempting to scientifically prove mastery.

## 9.4 Parent Progress

Parent Path progress is recursively derived from descendant leaf Paths.

For the initial implementation:

> **Count unique descendant leaf Paths equally.**

If the same leaf Path appears multiple times under the same ancestor through different branches, it contributes only once to that ancestor's completion percentage.

## 9.5 Progress Is Descriptive, Not Restrictive

This is a locked product rule:

> **Path progress is descriptive, not restrictive.**

TeacherPeri should never prevent users from opening content or another Path because a prerequisite checkbox is incomplete.

TeacherPeri may display recommendations such as:

- Recommended before continuing.
- You have not marked this section complete.

But access remains open.

Reasons include:

- the student may have learned the concept elsewhere,
- they may simply not have checked it,
- they may be reviewing advanced material,
- they may intentionally choose a different order.

---

# 10. Reusable Path Completion

Completion belongs to the relationship:

```text
User ↔ Path
```

It does **not** belong to:

```text
User ↔ Parent Path ↔ Child Path
```

Therefore, if the same Path appears in multiple larger Paths, completing it once is recognized everywhere.

---

# 11. Future Path Versioning

**Not implemented for MVP, but architecture should not prevent it.**

Expected behavior:

- Editorial/copy changes do not necessarily invalidate completion.
- Meaningful changes to learning requirements may increment a Path version.
- Historical completion should remain preserved.
- TeacherPeri may later indicate that a previously completed Path has been updated.

Badges earned historically should not automatically disappear because a Path is later edited.

---

# 12. Path Discovery and Personal Actions

Every public Path page should eventually offer actions near the top such as:

- `+ Añadir a mis rutas`
- `Guardar para después`

These actions are intentionally different.

## 12.1 Add to My Routes

Means:

> “I am actively following this.”

## 12.2 Save for Later

Means:

> “I may want this later.”

Saved Paths are bookmarks.

Active Paths belong in `Mis Rutas`.

---

# 13. Mi Espacio

`Mi Espacio` is the logged-in student's private workspace.

The current conceptual structure is:

```text
Mi Espacio
│
├── Inicio / Dashboard
│   ├── Continuar
│   ├── Rutas activas
│   ├── Progreso reciente
│   └── Logros recientes
│
├── Mis Rutas
├── Guardados
├── Threads
├── Logros / Badges
└── Actividad / Historial
```

Not every section must become a separate visible tab in MVP. This is the conceptual model.

---

# 14. Mis Rutas

Contains Paths the student is actively following.

For MVP, route organization should remain deliberately simple:

- **Pinned**
- **Normal**

Do **not** introduce high/medium/low priority levels for MVP.

Potential future status concepts such as `paused` may be considered later, but they are not required for MVP.

---

# 15. Guardados

Guardados is independent from Paths.

Users should be able to save:

- Rutas
- Teoría
- Problemas
- Listas
- Exámenes
- Experiencias
- potentially Threads or other objects if later desired

Saving means:

> “I want to come back to this.”

It does not mean the user is actively following it.

---

# 16. Continue / Recent Activity

Mi Espacio should eventually make it easy to continue where the user left off.

This does not require AI recommendations initially.

TeacherPeri can simply use recent activity/history to show recently viewed Paths/content and recent completions.

---

# 17. Badges and Gamification

Gamification should reinforce meaningful progress rather than become arbitrary.

## 17.1 Earned Badges

Examples:

- Geometría OMM
- Preparación OMM
- Primer Simulacro
- Application Foundations
- SAT Preparation

Badges can be connected to meaningful Path completion or achievements.

## 17.2 Role Badges

Special system roles may have automatic public badges:

- Admin
- Moderator
- Content Creator

A Content Creator is someone trusted to contribute official TeacherPeri material. Creating a Thread alone should not earn the Content Creator role.

## 17.3 Public Showcase Badge

A user may choose one earned badge to showcase publicly.

Role badges may appear automatically.

## 17.4 Not MVP

Do not build, unless later explicitly approved:

- XP
- points
- streaks
- levels
- leaderboards

Progress bars + meaningful badges are sufficient for the initial gamification model.

---

# 18. Zona de Entrenamiento

Zona de Entrenamiento is TeacherPeri's direct-access Olympiad material library.

It contains four main libraries in the current design:

1. **Problemas**
2. **Listas**
3. **Teoría**
4. **Exámenes**

This is current product scope, not a statement that TeacherPeri can never add another library later.

---

# 19. Zona de Entrenamiento Landing Page

The landing page should eventually provide:

- A global search bar across all four libraries.
- Direct navigation into Problemas, Listas, Teoría, Exámenes.

A global search should ignore folder boundaries and return mixed results from all four content libraries.

---

# 20. Library-Level Navigation

Each individual library should support three complementary discovery mechanisms:

1. **Folder navigation**
2. **Local search**
3. **Filters**

This principle can be summarized as:

> **Folders provide structure. Filters provide precision. Search provides speed.**

Folder navigation is inspired by AoPS and the current Axioma problem-browser behavior.

The exact filter sets can differ by library.

---

# 21. Problemas

A Problem is a stable native TeacherPeri object.

## 21.1 Problem Object — Product Concept

A Problem may contain or be associated with:

- stable internal identifier
- statement
- source / attribution
- competition, if applicable
- year, if applicable
- round, if applicable
- problem number, if applicable
- topics
- difficulty, if used
- folder/category memberships
- tags
- hints, potentially later
- solutions, potentially later
- metadata

A human-written creative title is **not required**.

## 21.2 Problem Display Labels

TeacherPeri should generate useful display labels when possible.

Examples:

```text
OMM 2025 · Nacional · Problema 5
OMMU 2024 · Nacional · Problema 3
TP-GEO-0042
```

The exact formatting can be refined later.

## 21.3 Problem Listing UX

Problem lists should **not display the full problem statement as a preview**.

The listing should stay compact.

Long term, a dedicated addressable Problem page is preferred because Paths, Threads, and search results can link directly to it.

A modal may be retained temporarily during migration if useful.

## 21.4 Problem Folder Philosophy

A Problem may appear in **multiple folder/category views** without duplicating the Problem record.

This is a deliberate refinement from a strict “one canonical folder” model.

Example:

```text
Por tema
→ Geometría
  → Círculos
    → Potencia de un Punto
```

and:

```text
Por competencia
→ OMM
  → 2025
    → Nacional
```

The Problem exists only once.

Folder membership is many-to-many classification/navigation.

## 21.5 Initial High-Level Problem Views

At minimum, strongly consider:

### Browse by Topic
- Álgebra
- Combinatoria
- Geometría
- Teoría de Números

### Browse by Competition
- OMM
- OMMU
- IMO
- Putnam
- other collections over time

These are not necessarily the only top-level views forever.

## 21.6 Problem Difficulty Model

Problem difficulty should not be represented only by a vague `easy / medium / hard` scale.

TeacherPeri should initially classify difficulty using **two dimensions**:

### Competition Tier

A problem can be assigned an approximate competition tier such as:

- Regional
- Estatal
- Pre-Nacional
- Nacional
- Pre-Internacional
- Internacional

This indicates the general competitive level at which the problem would be appropriate.

### Difficulty Within Tier

Within that tier, TeacherPeri can assign a difficulty from **1 to 6**.

Example:

```text
Nivel competitivo: Nacional
Dificultad dentro del nivel: 4 / 6
```

The six-point scale is intentionally granular and matches the common six-problem structure of major Olympiad exams, but the number should **not** be interpreted as literally meaning “this is Problem 4 of an exam.” It is an approximate difficulty placement within the selected competition tier.

This enables useful filtering such as:

```text
Geometría · Nacional · Dificultad 2–4
```

Difficulty remains an editorial estimate rather than an objective measurement.

### Success Percentage

The legacy `éxito` / success-percentage concept should be removed from the future TeacherPeri content model.

TeacherPeri should not display estimated success percentages as though they were measured data.

If the platform later collects enough real attempt/solve data, measured statistics may be introduced as a separate feature.

---

# 22. Teoría

Teoría consists of independent native TeacherPeri mathematical article pages.

They are conceptually similar to blog posts, but optimized for mathematical learning.

A Theory object/page may include:

- title
- short description
- topic(s)
- level
- rich article content
- LaTeX
- images
- diagrams
- examples
- related problems
- tags
- metadata
- optional downloadable file if useful

## 22.1 Multiple Theory Pages Per Topic

One mathematical topic may have multiple Theory pages.

Example:

```text
Potencia de un Punto
├── Introducción
├── Técnicas Intermedias
└── Configuraciones Avanzadas
```

These are independent articles rather than multiple versions of the same database record.

## 22.2 Levels

TeacherPeri should be able to distinguish:

- Beginner
- Intermediate
- Advanced

Exact Spanish labels can be decided later.

## 22.3 Theory Is Not Fundamentally a PDF

Theory should be treated as structured native web content.

A Theory page may optionally offer a PDF/downloadable file, but TeacherPeri should not be designed as merely a PDF folder.

---

# 23. Listas

A Lista is primarily an **externally authored problem-list document**, often a PDF created by another person or organization and not specifically designed for TeacherPeri.

TeacherPeri is cataloguing and organizing useful training lists.

A List object may contain:

- title
- short description
- author(s)
- source organization
- original website URL
- PDF URL or permitted hosted PDF
- topics
- level/difficulty, when useful
- tags
- metadata
- attribution information

## 23.1 Attribution

TeacherPeri should clearly show:

- author
- organization if relevant
- original source website when available

## 23.2 Copyright / Hosting Principle

If TeacherPeri has permission to host a PDF, it may store it.

Otherwise, TeacherPeri should prefer linking to the author's or organization's original copy rather than re-uploading copyrighted material without permission.

---

# 24. Exámenes

An Exam is a native TeacherPeri object that references existing Problem objects.

This directly follows:

> **Store once, reference many times.**

An Exam object may include:

- stable identifier
- competition
- year
- round
- country/organization
- ordered Problem references
- original PDF if available/permitted
- source URL
- tags
- metadata

The same Problem may simultaneously appear in an Exam, topic folder, competition folder, Path Step, global search, and Thread reference without duplication.

---

# 25. Shared Content Identity

TeacherPeri should use stable object identities.

A content object should not need to be copied simply because it appears in multiple contexts.

The platform should prefer:

> **reference-over-duplication**

---

# 26. Shared Metadata

The exact schema is not finalized, but TeacherPeri content should support consistent metadata useful for search, filtering, discovery, and attribution.

Likely shared metadata includes:

- stable ID
- title or display label
- short description where applicable
- tags
- topics
- authorship/source
- publication status
- created date
- updated date
- language
- attribution/provenance when relevant

Type-specific fields may add competition, year, round, difficulty, level, problem number, PDF/source URL, etc.

---

# 27. Folder / Category Model

Folders are curated navigation.

They may differ by content type.

Do **not** force the same hierarchy onto Problemas, Listas, Teoría, and Exámenes.

Examples:

- Problemas: topic and competition views
- Exámenes: competition → year → round
- Teoría: topic → subtopic
- Listas: topic, level, source, or curated collections

The interaction pattern should remain consistent even when the taxonomies differ.

---

# 28. Tags

Tags are controlled classification metadata used primarily for:

- filtering
- search
- related content
- discovery

For MVP, tags should be centrally curated/controlled rather than freely invented by every public user.

---

# 29. Global Search and Related Content

## 29.1 Global Training Search

Zona de Entrenamiento should eventually support search across:

- Problemas
- Listas
- Teoría
- Exámenes

## 29.2 Local Search

Each library gets its own search context.

## 29.3 Related Content

Metadata can later power related-content sections and link free exploration back into guided Paths.

---

# 30. Sources — Future Concept

A structured `Source` concept may eventually reduce repeated attribution strings across the system.

Possible future Source object:

```text
Source
├── name
├── type
│   ├── person
│   ├── competition
│   ├── organization
│   └── website
├── website
└── attribution information
```

TeacherPeri objects could reference Sources.

## MVP STATUS

> **Sources are NOT implemented for MVP.**

The architecture should avoid blocking a future structured Source system, but Phase 2 does not need to build it unless explicitly approved later.

---

# 31. Experiencias

Experiencias is a public blog/post section.

It is not the same as Teoría, even though both may reuse similar article-rendering infrastructure.

## 31.1 Experiences Listing Page

Each entry should show:

- title
- 2–3 sentence description
- relevant metadata/tags

Potential filtering/categories include Olimpiadas, Universidad, and Todas, plus more specific tags.

## 31.2 Individual Experience Page

An Experience page may contain:

- title
- introduction
- long-form text
- headings
- images
- videos
- captions
- metadata/tags
- author/date where appropriate

LaTeX is not a core requirement for Experiences.

## 31.3 Reuse

Paths and Threads may reference Experiences.

---

# 32. Threads

Threads replace the idea of embedding comment sections beneath every Problem/List/Exam page.

Core principle:

> **Materials are for learning. Threads are for discussion.**

Threads are independent public discussion objects.

## 32.1 Thread Creation

Users should be able to create a Thread with:

- title
- body
- LaTeX support
- TeacherPeri references
- attachments
- tags
- answer status

## 32.2 TeacherPeri References

A Thread may refer to:

- Path
- Theory
- Problem
- List
- Exam
- Experience
- other approved TeacherPeri objects later

One Thread may eventually reference more than one item.

## 32.3 Attachments

Attachments are user-uploaded supporting material.

For MVP, uploads should eventually be restricted to safe, necessary file types such as images and PDFs. Exact limits/policies remain to be implemented later.

---

# 33. Thread Replies

Users can reply to Threads.

For MVP, avoid unlimited nested discussions.

Preferred initial model:

- flat replies

or at most:

- one nested reply level

Unlimited Reddit-style indentation is intentionally not part of the MVP.

---

# 34. Thread Answer State

A Thread may have one of three states:

- `unanswered`
- `answered`
- `no_answer_needed`

Thread authors can normally change their own status.

Moderators/Admins may change and lock the answer state.

If a moderator/admin locks the state, the author cannot override it.

## 34.1 Accepted Answers — Future

A Thread author may eventually be able to mark a specific reply as the accepted answer.

Useful, but **not required for the earliest MVP**.

---

# 35. Thread Discovery

Potential discovery features include:

- search
- tags/categories
- recent
- most active
- unanswered
- answered
- no answer needed

`Unanswered` is especially useful for a learning community.

Exact ranking can be deferred.

---

# 36. Thread Following / Saving

Users should eventually be able to follow/save Threads.

Potential Mi Espacio Thread areas:

- Threads I created
- Threads I participated in
- Threads I follow/save

Notifications for new replies may be added later and are not required for the earliest MVP.

---

# 37. Public User Identity

Users should have lightweight public identities.

Publicly visible identity may include:

- public display name
- profile picture/avatar
- selected earned badge
- automatic role badge(s)

## 37.1 Default Identity

Normal users should be pseudonymous by default.

Their public display name is their username unless a future product decision explicitly introduces another privacy-safe option.

A normal user might appear as:

```text
GeometryFox  🏅 Geometría OMM
```

## 37.2 Privileged Contributor Display Name

Trusted privileged contributors such as Content Creators may choose to publicly display their real name instead of their username.

This must be:

- **opt-in**
- **reversible**
- private by default
- controlled explicitly by the user

TeacherPeri must never automatically expose a private/legal-name field merely because a user receives a privileged role.

Examples:

```text
Ana Pérez  🏅 Content Creator
```

or, if the contributor prefers to remain pseudonymous:

```text
GeometryFox  🏅 Content Creator
```

A suitable future account preference is conceptually:

```text
Public display name:
○ Username
○ Real name
```

Username should remain the default.

## 37.3 Public Badges

There are two distinct badge concepts:

### Earned Badge

A user may choose one earned achievement badge to showcase publicly.

Examples:

- Geometría OMM
- Preparación OMM
- SAT Preparation

### Role Badge

Role badges are automatic trust/authority indicators tied to actual system permissions.

Examples:

- Content Creator
- Moderator
- Admin

Role badges should not be manually selectable in a way that misrepresents permissions.

## 37.4 Public Profiles

User identity should **not currently open into a social-network-style public profile page**.

Other users can see the lightweight identity associated with Threads, replies, and official content attribution without browsing a full public personal page.

## 37.5 Private Identity

Private account data, including real names if collected, must not be publicly exposed unless the user explicitly opts in under an allowed privileged-contributor display-name setting.

Real-name/account information remains private administrative/account data by default.

---

# 38. Roles

Expected privileged roles include:

- User
- Content Creator
- Moderator
- Admin
- Super Admin

These represent permissions, not merely decorative badges.

Content Creator and Moderator are distinct concepts.

## 38.1 User

Can eventually:

- browse public content
- create Threads
- reply
- save items
- follow Paths
- track progress
- manage their own allowed account/community actions

Ordinary users cannot directly publish official TeacherPeri educational content.

## 38.2 Content Creator

A Content Creator is a trusted contributor who receives a special authoring interface for proposing official TeacherPeri material.

They may eventually create or edit drafts for content such as:

- Problems
- Lists
- Theory
- Experiences
- Exams
- Paths, if/when Path authoring is opened to this role

Content Creators can:

- create drafts
- edit their own drafts
- provide required metadata/tags/attribution
- submit proposals for review
- respond to requested changes
- resubmit content

Content Creators **cannot publish directly** in the initial model.

Their public identity receives the automatic **Content Creator** role badge.

They may choose to display their real name instead of their username for public attribution, following the opt-in privacy rules in Section 37.

## 38.3 Moderator

Moderators focus on community safety and discussion quality.

They may eventually:

- review reports
- moderate Threads/replies
- lock Threads where appropriate
- set/lock Thread answer state
- take permitted moderation actions
- inspect moderation-relevant audit history according to policy

Moderator permissions are conceptually separate from educational-content publishing permissions.

## 38.4 Admin

Admins are trusted reviewers/maintainers of official TeacherPeri content.

They may eventually:

- review Content Creator submissions
- request changes
- verify required metadata
- verify tags/category placement
- verify attribution/source information
- validate links/files
- review mathematical formatting/presentation
- publish approved official content
- edit/maintain official content according to policy

An Admin may also hold moderation permissions if explicitly granted, but Admin and Moderator should not be treated as synonymous roles in the permission model.

## 38.5 Super Admin

The platform should support a highest-trust role, internally referred to as **Super Admin**.

The initial Super Admin is the owner account.

Super Admin can perform all Admin-level actions and can additionally manage privileged roles, including:

- assign/revoke Admin
- assign/revoke Content Creator
- assign/revoke Moderator
- manage other high-level platform permissions/settings as defined later

Privileged role assignment must be enforced server-side.

A visual badge or frontend state must never be treated as authorization.

---

# 39. Content Publishing and Review

Official TeacherPeri content should use a review workflow.

The initial conceptual workflow is:

```text
draft
  ↓
submitted_for_review
  ↓
under_review
  ↓
┌────────────────┬───────────────┐
↓                ↓
changes_needed   published
↓
creator edits
↓
resubmitted
```

The exact implementation/status names may evolve, but the behavior should preserve these principles:

1. Content Creators prepare proposals/drafts.
2. Required metadata, tags, folder/category assignments, attribution, and links/files must be complete.
3. An Admin reviews the submission.
4. The Admin may request changes or publish it.
5. Ordinary users cannot publish official educational content.
6. Publishing authority must be enforced on the server.

## 39.1 Review Checklist

Admin review should verify more than spelling.

Depending on content type, review should consider:

- required metadata
- controlled tags
- folder/category placement
- attribution/source completeness
- copyright/hosting appropriateness
- mathematical formatting
- valid links/files
- consistency with TeacherPeri quality standards
- content completeness
- any type-specific required fields

## 39.2 Attribution and Contributor Recognition

TeacherPeri should distinguish between:

- the **original author/source** of material,
- the **TeacherPeri contributor** who added/authored/adapted the entry,
- the **reviewer/admin** who approved it.

These concepts must not be conflated.

### Native TeacherPeri Theory Example

```text
Escrito por:
Ana Pérez  🏅 Content Creator

Revisado por:
AdminName  🛡️ Admin
```

### External List Example

```text
Autor original:
Dr. X

Fuente:
Organization / Website

Añadido a TeacherPeri por:
GeometryFox  🏅 Content Creator
```

### Competition Problem Example

```text
Fuente:
OMM 2025 Nacional

Añadido por:
GeometryFox  🏅 Content Creator
```

Possible internal concepts include:

```text
originalAuthors[]
sourceAttribution
teacherperiContributors[]
reviewedBy[]
publishedBy
```

The exact schema remains a technical decision.

Contributor recognition should be visible where appropriate, but it must never falsely imply that the TeacherPeri contributor originally authored externally sourced material.

## 39.3 Contributor Workspace — Future

A Content Creator may eventually have a private contribution dashboard such as:

```text
Mis contribuciones

Drafts                3
En revisión           2
Publicadas            17
Cambios solicitados   1
```

This is useful but does not need to be fully implemented in the earliest MVP unless required by the authoring workflow.

---

# 40. Auditability, Editing, and Deletion

Core principle:

> **User-facing edits and deletions should not destructively erase moderation-relevant history.**

If a Thread or Reply is edited, the current version is public while historical versions may be retained internally for legitimate moderation/administrative purposes.

If deleted, it disappears from normal public view while appropriate internal audit information is retained according to policy.

Potential internal concepts include:

```text
currentVersion
editHistory[]
deletedAt
deletedBy
moderationHistory[]
```

## 40.1 Policy Boundary

TeacherPeri should **not** promise permanent indefinite retention of everything.

Before implementation is complete, explicit policy should define retention duration, privacy/account deletion behavior, administrative access, and legal/compliance requirements.

---

# 41. University Section

Universidad is a first-class public navbar section.

It should act as an entrance to the university-application ecosystem rather than merely a static article.

Potential responsibilities include:

- explanation of the application process
- main guided university Path
- important resources
- Experiences
- deadlines/information later
- direct continuation for logged-in users

The exact landing-page content remains to be authored.

---

# 42. University Path Philosophy

TeacherPeri should avoid presenting university admission as a simplistic checklist where students must “master” identical categories.

Instead, the main journey should help students:

1. Understand the process.
2. Understand themselves/their context.
3. Identify relevant opportunities for growth.
4. Prepare the application.
5. Submit/follow up.
6. Evaluate outcomes.

Potential subpaths may include:

- SAT preparation
- extracurricular activities
- personal projects
- leadership
- competitions
- research
- essays
- recommendations
- financial aid
- university research
- application systems

Not every student needs every subpath.

University guidance must work for students **without Olympiad experience**.

---

# 43. U.S. and Canadian Application Differences

The Path engine should be flexible enough to branch where U.S. and Canadian application processes differ.

Potential examples include:

```text
Aplicar a Universidades Competitivas
├── Fundamentos
├── Preparación
├── Aplicaciones en EE. UU.
└── Aplicaciones en Canadá
```

Specific institutions of interest may include University of Toronto, UBC, McGill, and Waterloo.

Exact content remains to be authored.

---

# 44. Sobre mí

`Sobre mí` is Elias's public creator/about page.

It is different from ordinary users' private `Mi Espacio`.

Potential content includes:

- personal story
- background
- motivation for TeacherPeri
- Olympiad experience
- university journey
- achievements/projects
- online resume-style information

Exact copy/design remains to be created later.

---

# 45. Public vs Logged-In Product Behavior

## Public / Logged-Out

Can:

- browse Paths
- browse content
- search
- read Experiences
- read Threads
- explore university material

No persistent checkmarks/progress.

## Logged-In

Adds:

- My Routes
- completion/progress
- saved items
- pinned Paths
- badges
- recent activity
- Thread creation/replies
- personal Thread activity
- selected public badge/avatar/username

Login should provide meaningful persistence rather than merely gate content.

---

# 46. Current MVP Philosophy

TeacherPeri MVP should prioritize:

- clear structure
- reusable content
- guided Paths
- direct material exploration
- persistent user progress
- useful community discussion
- safe moderation foundations

Avoid building unnecessary complexity before there is evidence users need it.

---

# 47. Explicitly Not MVP / Deferred

## Not MVP

- structured Source entity
- unlimited nested Thread replies
- accepted answer requirement
- XP
- points
- streaks
- levels
- leaderboards
- AI personalized recommendations
- complex Path priority levels
- strict prerequisites
- content locking
- automatic mastery determination
- separate Olympiad and University Path engines
- full public social profiles
- complex social graph/follow-user system

## Deferred Decisions

- exact content publishing/review workflow
- exact role permission matrix
- upload limits/file types
- moderation-history retention policy
- exact Path versioning schema
- exact badge catalog
- exact metadata schema
- exact controlled tag taxonomy
- exact folder trees
- exact university Path content
- exact homepage content
- exact search ranking
- exact notification system
- exact list/exam PDF hosting strategy per source/permission
- whether some future Resources directory deserves a standalone page
- whether Agradecimientos eventually needs its own page

---

# 48. Locked Decisions

1. TeacherPeri serves both Mathematics Olympiad preparation and competitive university application guidance.
2. Universidad remains in the main navbar.
3. Rutas use one generic recursive Path engine.
4. A Path contains child Paths **or** Steps, never both.
5. Steps have title, description, TeacherPeri references, and optional extra resources.
6. Steps do not have completion checkboxes in the current model.
7. Logged-in users manually complete leaf Paths.
8. Parent progress is derived recursively.
9. Progress is descriptive, never restrictive.
10. Completion is reusable wherever the same Path appears.
11. For initial percentages, unique descendant leaf Paths count equally.
12. Breadcrumbs are important for nested Paths.
13. Add to My Routes and Save for Later are distinct.
14. Route priority for MVP is only pinned vs normal.
15. Badges should represent meaningful achievements/roles, not arbitrary points.
16. Zona de Entrenamiento currently has four libraries: Problemas, Listas, Teoría, Exámenes.
17. Zona de Entrenamiento has global cross-library search.
18. Each individual library has folder navigation + local search + filters.
19. Problems are native TeacherPeri objects.
20. Problems do not require creative titles.
21. Problem listings stay compact and do not preview full statements.
22. Problems may appear in multiple folder/category views without duplication.
23. Theory is native article content with LaTeX and multiple levels/pages per topic.
24. Lists are primarily externally authored PDF/resource entries with attribution.
25. Exams reference existing Problem objects and may include/source original PDFs.
26. Experiencias is a separate blog/post section.
27. Paths may reference Experiences.
28. Threads are independent discussions, not comments embedded under materials.
29. Threads support LaTeX.
30. Threads distinguish TeacherPeri references from uploaded attachments.
31. Thread replies are flat or at most one nested level for MVP.
32. Thread answer states are unanswered, answered, no_answer_needed.
33. Moderators/Admins can set and lock answer status.
34. Community edits/deletions must eventually be auditable internally.
35. Public user identity is lightweight and not a full public social profile.
36. Users may choose one earned public badge; role badges may be automatic.
37. Content Creator and Moderator are distinct roles.
38. Ordinary users cannot freely publish official TeacherPeri educational content.
39. Sources are a future concept and **not implemented for MVP**.
40. Legacy Axioma assumptions do not define TeacherPeri.
41. Problem difficulty uses a competition tier plus a 1–6 within-tier difficulty scale.
42. Legacy estimated success percentages should be removed rather than presented as measured data.
43. Content Creators submit official-content proposals for Admin review and do not publish directly in the initial model.
44. Admins review required metadata, tags, attribution, placement, links/files, and quality before publication.
45. Super Admin can assign/revoke privileged roles such as Admin, Moderator, and Content Creator.
46. Content attribution distinguishes original authors/sources from TeacherPeri contributors/reviewers.
47. Content Creators receive an automatic public Content Creator role badge.
48. Privileged contributors may opt in to display their real name publicly instead of their username; username remains the default.

---

# 49. Technical Migration Principles

1. Incrementally migrate the existing React/Vite + Express + MongoDB/Mongoose application.
2. Avoid unnecessary framework rewrites.
3. Preserve useful Axioma infrastructure where it helps TeacherPeri.
4. Do not treat the existing Category model as the Path system.
5. Extract reusable library/navigation behavior from the current Problem implementation.
6. Use stable object identities.
7. Prefer references over duplicated data.
8. Protect production data from destructive seed/test behavior.
9. Use safe, auditable community deletion/edit patterns.
10. Implement authorization server-side; never rely only on UI badges or frontend checks.
11. Maintain public browsing without login.
12. Keep official content publishing separate from ordinary community participation.

---

# 50. Current Recommended Implementation Sequence

## Phase 1 — Foundation / Safety
Already initiated/completed:
- canonical documentation
- database safeguards
- runtime baseline
- CI
- stale project-level identity cleanup

## Phase 2 — Shared Content / Library Foundation
Next:
- shared content identity concepts
- metadata/tags
- reusable folder/category browsing infrastructure
- addressable content routes
- Problems cleanup/refactor
- Theory infrastructure
- List infrastructure
- Exam infrastructure
- search/filter foundations

## Phase 3 — Path Engine
- recursive Paths
- ordered child Paths / Steps invariant
- references
- breadcrumbs
- completion/progress
- reuse
- add/save actions

## Phase 4 — Mi Espacio
- My Routes
- pinned/normal
- saved items
- recent activity
- badges

## Phase 5 — Experiencias
- listing
- detail pages
- rich content/media
- tags

Depending on implementation dependencies, Experiencias may move earlier because its article infrastructure can overlap with Theory.

## Phase 6 — Threads / Moderation
- independent Threads
- replies
- LaTeX
- TeacherPeri references
- attachments
- answer states
- moderation locking
- audit history
- roles

## Phase 7 — Universidad Integration
- university landing page
- main university Path
- supporting Experiences/resources/content

## Phase 8 — Navigation / UX / Content Polish
- final navigation behavior
- Inicio content
- Agradecimientos integration
- About/contact/footer structure
- search UX
- accessibility
- performance

## Phase 9 — Launch Hardening
- moderation policy
- privacy/retention policy
- deployment
- security review
- content provenance
- testing
- accessibility
- performance

---

# 51. Guiding Product Principles

> **Content is what students learn from. Paths are how TeacherPeri guides them through it.**

> **Categories organize information. Paths organize learning.**

> **Store knowledge once; organize and reference it many times.**

> **Paths guide students without restricting them.**

> **Progress is a memory aid, not a gatekeeper.**

> **Public TeacherPeri answers: “What can I learn or do?”**

> **Mi Espacio answers: “What am I doing, what have I completed, and where can I continue?”**

> **Materials are for learning. Threads are for discussion.**

> **A user account should add persistence and organization, not unnecessarily gate public knowledge.**

---

# 52. Living-Document Rule

This file should be updated whenever a major product decision is made.

When a decision changes:

1. Update the relevant section.
2. Update `Locked Decisions` if necessary.
3. Move rejected/deferred ideas into the appropriate section rather than silently deleting historical intent when that context may matter.
4. Keep `PRODUCT.md` concise and canonical.
5. Ensure contributors read the current docs before architectural work.

This file exists so TeacherPeri decisions remain grounded in documented context.
