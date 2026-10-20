# CineMatch

Product Requirements Document | Version 0.1 | October 20, 2026

**Build a working website prototype that helps a solo viewer choose a movie without endless browsing.** CineMatch gathers a few preferences, recommends one movie available through the viewer's selected streaming services, and provides a link to watch. The prototype will help refine the experience before a public launch and eventual app.

## Problem and audience

The primary user is a solo viewer who wants to watch a movie but feels tired or overwhelmed by streaming catalogs. The product should reduce the effort of choosing and make a recommendation feel relevant enough to act on.

## Product approach

Use quick questions as the main path, with optional text for extra detail. Present one movie at a time with a short explanation of why it fits. If the viewer rejects it, ask one quick follow-up and use that answer alongside their existing preferences to recommend another movie.

## Core user journey

- **Sign in and set up:** Create an account and select streaming services. Save preferences and recommendation history to the account.
- **Describe tonight:** Answer a few quick questions, such as mood and available time. Add optional text for more specific requests.
- **Receive one pick:** See a movie, basic details such as runtime and synopsis, a concise reason for the match, and where to watch it.
- **Choose the next step:** Follow the streaming link, or reject the pick and answer one quick follow-up before receiving another recommendation.

## Platform direction

Start with a website that works well on desktop and mobile browsers. A dedicated app is a future phase, informed by what the website prototype teaches us. App platforms and timing remain undecided.

---

# Prototype scope

What the first version needs to establish

## First version requirements

- **Accounts:** Users can sign up, sign in, and return to saved preferences and recommendation history.
- **Preference input:** Quick questions and optional text capture the viewer's immediate needs without requiring a long conversation.
- **Recommendations:** Show one movie at a time with a short rationale and enough information to support a decision.
- **Streaming availability:** Recommend a movie available on a selected service in the viewer's region and provide a link to that service. If no suitable title is found, explain this and offer to adjust preferences.
- **Rejection flow:** Ask one relevant follow-up after a rejection, retain existing answers, and show a different movie.
- **History:** Make previous recommendations accessible from the user's account.

## Later possibilities

Couples and group matching, voice conversations, automatic playback, casting and device control, and a dedicated mobile app can be considered after the core website experience has been tested. They are outside the initial prototype scope.

## Validation and success

**Immediate goal:** Build a working prototype and refine it before a public launch. Test whether solo viewers can complete the flow, understand why a movie was chosen, use the streaming link, and request a better match without starting over.

**Initial target to test:** Help viewers choose a movie they want within two minutes of starting the recommendation flow. Track time to choice, first-pick acceptance, number of rejected picks, and brief feedback on recommendation fit. Treat streaming-link clicks as a handoff signal; they do not prove playback or viewing completion.

## Decisions to resolve during prototyping

Choose the initial country or region, supported streaming services, movie and availability data source, and recommendation approach. Refine the exact questions and decide whether previously recommended or watched movies should be excluded by default. These choices should support the simple core flow.

---

*Basis: CineMatch Final.docx product charter and the product owner's confirmed choices for the early website prototype. Broader charter concepts are treated as future possibilities unless included above.*
