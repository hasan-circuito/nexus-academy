# 04. Coding Standards

---

## Document Information

| Property | Value |
|----------|-------|
| Document | Engineering Playbook |
| Section | 04 – Coding Standards |
| Project | NEXUS Academy |
| Version | 1.0.0 |
| Status | Active |
| Owner | Project Owner |
| Audience | Engineers, AI Coding Assistants, Future Contributors |
| Last Updated | YYYY-MM-DD |

---

# Part 1 — Coding Philosophy

---

# 1. Purpose

The Coding Standards define the rules that govern how source code is written, organized, reviewed, and maintained throughout the NEXUS Academy project.

The objective of these standards is not merely to produce working software, but to ensure that every line of code remains readable, maintainable, predictable, and extensible throughout the lifetime of the project.

These standards apply equally to human developers and AI coding assistants.

---

# 2. Coding Philosophy

Writing code is an act of communication before it is an act of programming.

Every implementation should communicate its purpose clearly to future contributors.

Code is expected to be read far more often than it is written.

Therefore, readability, consistency, and maintainability always take priority over cleverness or unnecessary optimization.

A feature is not considered well implemented simply because it works.

It is considered well implemented only when another engineer can understand, modify, test, and extend it with confidence.

---

# 3. Core Coding Principles

Every implementation within the project should satisfy the following principles.

---

## 3.1 Readability First

Code should be immediately understandable.

Developers should never need to mentally decode unnecessarily complex logic.

If code requires lengthy explanation, it should be simplified.

---

## 3.2 Consistency Over Preference

Individual coding preferences should never override project standards.

The codebase should appear as though it has been written by one engineering team following one consistent style.

Consistency reduces maintenance cost and improves long-term productivity.

---

## 3.3 Simplicity

Prefer the simplest implementation that correctly solves the problem.

Avoid unnecessary abstractions.

Avoid premature optimization.

Avoid clever solutions that reduce readability.

Simple software is easier to review, test, debug, and extend.

---

## 3.4 Explicitness

Code should express intent clearly.

Variable names, function names, and module names should describe their responsibilities without requiring external explanation.

Hidden behavior should be avoided.

---

## 3.5 Maintainability

Every implementation should assume that future engineers will modify it.

Maintainable code minimizes risk during future development.

Whenever multiple implementations are possible, choose the one that is easier to maintain.

---

## 3.6 Reusability

Reusable logic should be extracted rather than duplicated.

When identical or nearly identical implementations begin appearing across the project, evaluate whether they belong inside a shared utility, hook, service, or engine.

Duplication increases maintenance cost.

---

## 3.7 Predictability

The same problem should be solved in the same way throughout the project.

Developers should never encounter multiple unrelated patterns for identical responsibilities.

Predictable code improves onboarding and reduces engineering mistakes.

---

## 3.8 Testability

Code should naturally support testing.

Functions should remain focused.

Dependencies should remain clear.

Hidden side effects should be minimized.

Implementations that are difficult to test often indicate architectural or design problems.

---

# 4. Readability Standards

Readable software is considered a core engineering requirement.

Every implementation should satisfy the following expectations.

---

## Clear Intent

Every function should communicate what it does.

Every variable should communicate what it represents.

Every file should communicate why it exists.

---

## Logical Structure

Code should follow a logical order.

Related statements should remain grouped together.

Unrelated responsibilities should be separated.

Large blocks of unrelated logic should be decomposed.

---

## Minimize Cognitive Load

Developers should not need to remember multiple hidden assumptions while reading code.

Complex logic should be decomposed into smaller understandable pieces.

Readable software reduces engineering mistakes.

---

# 5. Naming Conventions

Naming is considered one of the most important aspects of software engineering.

Poor names increase engineering cost more than poor formatting.

---

## General Rules

Names should be:

- Descriptive
- Meaningful
- Consistent
- Unambiguous

Avoid abbreviations unless they are universally understood.

---

## Variables

Variables should describe stored information rather than implementation details.

Prefer:

- currentMission
- totalXP
- completedLessons

Avoid meaningless names such as:

- data
- temp
- value
- obj

unless their scope is extremely limited.

---

## Functions

Function names should describe behavior.

Functions should begin with a verb whenever practical.

Examples include:

- calculateXP
- completeMission
- validateAnswer
- loadProgress

Function names should describe what they do, not how they do it.

---

## Components

Component names should describe the interface they provide.

Components should use PascalCase.

Examples:

- MissionCard
- LessonViewer
- ProgressDashboard

---

## Constants

Constants should communicate immutable business meaning.

Avoid unexplained literal values throughout the codebase.

---

# 6. File Organization Standards

Each source file should have one primary responsibility.

Large unrelated implementations should not accumulate inside a single file.

Files should remain focused.

As complexity grows, implementations should be decomposed into additional modules rather than increasing file size indefinitely.

Related files should remain located near the business capability they support.

---

# 7. Function Design Principles

Functions are the primary building blocks of the application.

Every function should satisfy the following expectations.

---

## Single Responsibility

One function should perform one logical task.

If a function performs multiple unrelated operations, it should be decomposed.

---

## Small and Focused

Functions should remain reasonably small.

Smaller functions improve readability, testing, and reuse.

---

## Clear Inputs

Function parameters should clearly communicate required information.

Avoid unnecessary parameters.

Avoid hidden dependencies.

---

## Predictable Outputs

Functions should return predictable results.

Unexpected side effects should be minimized.

Whenever practical, functions should avoid modifying unrelated application state.

---

## Self-Contained Logic

A function should be understandable without requiring knowledge of unrelated implementation details.

Dependencies should remain explicit.

Business logic should remain easy to locate and review.

---

**End of Part 1** 


---

# Part 2 — Implementation Standards

---

# 8. Component Standards

## Objective

Components are responsible for presenting information and handling user interaction.

Business logic should remain outside presentation components whenever practical.

Components should remain predictable, reusable, and easy to understand.

---

## Component Design Principles

Every component should have one primary responsibility.

Large components should be decomposed into smaller reusable components.

Presentation should remain independent from business logic.

Components should communicate through explicit properties rather than hidden dependencies.

---

## Component Organization

Every component should:

- Have a clear purpose.
- Remain easy to understand.
- Minimize internal complexity.
- Be reusable whenever practical.

Feature-specific logic should not be placed inside generic reusable components.

---

## Component Composition

Prefer composition over duplication.

Complex interfaces should be assembled from multiple focused components rather than implemented inside one large component.

---

# 9. TypeScript Standards

## Objective

TypeScript should improve reliability, maintainability, and developer confidence.

Type safety is considered mandatory throughout the project.

---

## General Rules

Always prefer explicit types when they improve readability.

Avoid weakening the type system.

Prefer well-defined interfaces and type aliases for shared data structures.

Maintain consistent typing across related modules.

---

## Type Safety

Avoid bypassing TypeScript safety mechanisms.

Type assertions should only be used when absolutely necessary and properly justified.

Unsafe patterns should be treated as technical debt.

---

## Shared Types

Shared business models should have one authoritative definition.

Duplicate type definitions should be avoided.

Changes to shared types should remain backward compatible whenever practical.

---

# 10. React Standards

## Objective

React components should remain predictable, declarative, and easy to maintain.

---

## Component Structure

Each component should:

- Perform one responsibility.
- Keep rendering logic clear.
- Avoid unnecessary nesting.
- Remain readable.

---

## Hooks

Hooks should only be called according to React's Rules of Hooks.

Custom hooks should encapsulate reusable behavior rather than presentation.

Hooks should improve readability rather than increase abstraction.

---

## Rendering

Rendering should remain simple.

Avoid deeply nested conditional rendering whenever practical.

Prefer small components over large conditional blocks.

---

## Side Effects

Side effects should remain isolated.

Effects should execute only when required.

Unnecessary effects should be avoided.

---

# 11. State Management Rules

## Objective

State should remain minimal, predictable, and easy to reason about.

---

## Principles

Store only information that must persist.

Derived values should be calculated instead of stored whenever practical.

Avoid duplicated state.

Avoid conflicting sources of truth.

---

## Local State

Use local state for component-specific behavior.

Do not promote local state unnecessarily.

---

## Shared State

Shared state should represent information required across multiple parts of the application.

Ownership should remain explicit.

---

## State Updates

State updates should remain predictable.

Avoid hidden mutations.

Avoid unnecessary cascading updates.

---

# 12. Error Handling Standards

## Objective

Errors should be handled consistently throughout the project.

Unexpected failures should never be silently ignored.

---

## Principles

Handle expected failures gracefully.

Provide meaningful feedback.

Avoid exposing internal implementation details.

Separate user-facing communication from developer diagnostics.

---

## Recovery

Whenever practical:

- Recover safely.
- Preserve user progress.
- Prevent application crashes.

Critical failures should be reported clearly.

---

# 13. Logging Standards

## Objective

Logging exists to support debugging, monitoring, and troubleshooting.

Logs should provide useful engineering information without introducing unnecessary noise.

---

## Logging Principles

Every log should have a purpose.

Avoid excessive logging.

Avoid duplicate logging.

Avoid leaving temporary debugging statements inside production code.

---

## Log Categories

Logs should clearly distinguish between:

- Informational events
- Warnings
- Errors
- Debug information

The appropriate logging level should be used consistently.

---

## Sensitive Information

Logs should never expose:

- Passwords
- Secrets
- Authentication tokens
- Personal information
- Sensitive business data

Security always takes priority over debugging convenience.

---

# 14. Commenting Standards

## Objective

Comments should explain intent rather than restate implementation.

Good code minimizes the need for comments.

---

## Principles

Prefer self-explanatory code.

Comments should describe:

- Why something exists.
- Why a decision was made.
- Important assumptions.
- Architectural reasoning.

Avoid comments that merely repeat what the code already expresses.

---

## TODO Comments

Temporary TODO items should remain specific.

Every TODO should communicate the remaining work clearly.

Permanent TODO comments should not accumulate within the codebase.

---

## Documentation Comments

Public modules, reusable utilities, and shared APIs should include documentation where it improves understanding.

Documentation should remain synchronized with implementation.

---

**End of Part 2**   


---

# Part 3 — Code Quality Governance

---

# 15. Code Review Standards

## Objective

Code review exists to improve software quality, maintainability, and long-term engineering consistency.

Every meaningful code change should be reviewed before it becomes part of the project.

Code review is a quality assurance activity rather than a personal evaluation.

---

## Review Principles

Reviews should focus on improving the software rather than criticizing the developer.

Feedback should remain objective, constructive, and technically justified.

Engineering decisions should always be supported by reasoning.

---

## Review Checklist

Before approving any implementation, reviewers should verify:

### Correctness

- Does the implementation solve the intended problem?
- Does it satisfy the approved requirements?

---

### Readability

- Is the code easy to understand?
- Are names meaningful?
- Is the implementation self-explanatory?

---

### Maintainability

- Can future engineers modify the implementation safely?
- Has unnecessary complexity been avoided?

---

### Consistency

- Does the implementation follow project coding standards?
- Does it match existing project patterns?

---

### Reusability

- Has duplicate logic been avoided?
- Can common functionality be shared?

---

### Safety

- Are edge cases considered?
- Are failures handled appropriately?

---

### Documentation

- Has relevant documentation been updated?
- Are important engineering decisions documented?

---

A review should only be approved when every applicable checkpoint has been satisfied.

---

# 16. Refactoring Standards

## Objective

Refactoring improves the internal quality of software without changing its observable behavior.

It is a continuous engineering activity rather than a one-time task.

---

## Principles

Refactoring should improve:

- Readability
- Simplicity
- Maintainability
- Reusability
- Testability

Behavior should remain unchanged.

---

## When Refactoring Is Appropriate

Consider refactoring when:

- Functions become difficult to understand.
- Duplicate logic appears.
- Responsibilities become mixed.
- Modules become excessively large.
- Dependencies become difficult to manage.

---

## Refactoring Rules

Refactoring should be performed in small, reviewable steps.

Large architectural refactoring should follow the Engineering Workflow defined in **02-engineering-workflow.md**.

Refactoring should never introduce unnecessary risk immediately before production release.

---

# 17. Technical Debt Management

## Objective

Technical debt should be identified, documented, and managed rather than ignored.

Not all technical debt is harmful, but unmanaged technical debt reduces engineering velocity over time.

---

## Principles

Technical debt should be:

- Visible
- Measurable
- Prioritized
- Reviewed

Temporary engineering compromises should always be documented.

---

## Acceptable Technical Debt

Temporary technical debt may be accepted when:

- Delivery deadlines require it.
- A better solution is already planned.
- The impact is clearly understood.
- The debt has been documented.

---

## Unacceptable Technical Debt

The following should never be accepted:

- Hidden architectural shortcuts
- Unsafe implementations
- Silent failures
- Repeated duplication
- Unreviewed work

---

# 18. Coding Compliance

Every contributor is responsible for following these coding standards.

This includes:

- Human Developers
- AI Coding Assistants
- Future Contributors
- Project Maintainers

Compliance with these standards is mandatory.

Intentional deviations require explicit approval from the Project Owner.

Repeated violations should be treated as engineering defects and corrected during normal development.

---

# 19. Guiding Statement

> Good code is not measured by how quickly it is written, but by how confidently it can be understood, tested, extended, and maintained years later.

The coding standards defined in this document establish the expected level of engineering quality for every contribution made to the NEXUS Academy project.

---

**Version:** 1.0.0

**Status:** Active

**Last Updated:** YYYY-MM-DD 