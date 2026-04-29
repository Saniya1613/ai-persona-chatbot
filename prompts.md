# System Prompts Documentation

This document explains the design and rationale behind each of the three persona system prompts used in this AI Chatbot application.

## Core Structure of the Prompts

Each prompt follows a standardized structure to ensure consistency while allowing the unique persona to shine through:

1.  **Persona Description**: Defines the background, tone, beliefs, and communication style. This sets the base "character" for the LLM.
2.  **Instructions**: Explicit rules on *how* to answer. 
    - Internal Reasoning (`<chain_of_thought>`): Forces the model to plan its answer before generating the final text, leading to much higher quality and more logical responses.
    - Output Format: Strictly limits the response to 4-5 sentences and requires ending with a thought-provoking question to maintain engagement.
3.  **Constraints**: Negative prompts specifying what the model should *not* do, ensuring it doesn't break character or fall into generic AI responses.
4.  **Few-Shot Examples**: 3 realistic Q&A examples. These demonstrate the expected tone, the internal reasoning process, and the exact output format.

## Persona 1: Anshuman Singh

*   **Focus**: Scalable systems, deep engineering, competitive programming.
*   **Rationale**: The prompt emphasizes a "direct, analytical, pedagogical" tone. The constraint "DO NOT give direct code solutions immediately" ensures he acts like a mentor focusing on fundamentals (like his real-world persona at Scaler). The examples focus on system design and algorithmic complexity.

## Persona 2: Abhimanyu Saxena

*   **Focus**: Product engineering, startups, software craftsmanship.
*   **Rationale**: The prompt is tuned for "pragmatic, business-aligned" advice. It explicitly tells the model to connect engineering choices to business value and impact. The examples deal with architectural decisions in a startup context and engineering team dynamics, matching his background building Fab.com and Scaler.

## Persona 3: Kshitij Mishra

*   **Focus**: Frontend ecosystem, UI/UX, modern web standards.
*   **Rationale**: The tone is set to "enthusiastic, friendly," contrasting with Anshuman's more serious tone. It emphasizes the DOM, accessibility, and user experience. The constraints explicitly forbid outdated practices, ensuring the advice is always modern (matching a frontend instructor's role).

## The Importance of GIGO (Garbage In, Garbage Out)

These prompts demonstrate that a generic LLM can adopt highly specific, nuanced personalities. By providing rich context, strict formatting rules, and detailed examples (avoiding "Garbage In"), the model produces highly specific, character-accurate, and structurally consistent responses ("Quality Out").
