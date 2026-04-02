# **Engineering the Agentic Web: A Technical Analysis of Smithery.ai, the Model Context Protocol, and the Blueprint for skill.sh**

The evolution of generative artificial intelligence has moved beyond the "chat" paradigm into a more sophisticated era of autonomous action, where Large Language Models (LLMs) function not merely as conversationalists but as orchestrators of complex software ecosystems.1 At the heart of this transition is the Model Context Protocol (MCP), a standardized open-source communication framework that solves the historical "NxM" integration problem.2 Previously, connecting ![][image1] models to ![][image2] data sources required custom, brittle code for every unique pair. MCP provides a universal adapter, similar to the standardization of USB-C for hardware, allowing any AI host to communicate with any data source or tool through a single, model-agnostic interface.3 Smithery.ai has emerged as a central pillar in this infrastructure, acting as the primary marketplace and management layer for MCP servers.5 However, as the ecosystem matures, the demand for more token-efficient discovery, interactive examples, and cross-platform architectural clarity has necessitated a next-generation approach, exemplified by the proposed skill.sh platform.

## **The Smithery.ai Infrastructure: Features, Mechanism, and Market Utility**

Smithery.ai functions as the comprehensive "App Store" for AI agents, providing the essential connective tissue between agentic logic and real-world application interfaces.5 Its value proposition is divided into a marketplace for discovery and a managed service layer for secure, simplified integration.5

### **The MCP Server Registry and Discoverability**

The core of the platform is a vast, searchable registry of pre-built MCP servers that enable agents to interact with databases, web search engines, social media platforms, and development tools without requiring manual API development.5 This marketplace organizes tools by use case, ensuring that developers can find functional integrations for specific domains.

| Category | Popular Integrations and Tools | Use Case |
| :---- | :---- | :---- |
| Social Media | Instagram, Twitter (X), LinkedIn, Reddit, Facebook. | Content automation, sentiment analysis, and community management. |
| Productivity | Google Workspace (Sheets, Drive, Calendar, Meet), Microsoft 365, Slack, Discord. | Automated meeting scheduling, document retrieval, and team communication. |
| Development | GitHub, Supabase, Neon (PostgreSQL), PostHog, Vercel, Docker. | Repository management, database querying, and CI/CD monitoring. |
| Automation & Search | Linkup (Web Search), Apify (Scraping), Canva, Airtable, Playwright. | Real-time research, visual design automation, and browser-based testing. |

5

The registry facilitates rapid scaling by providing standardized metadata for each server, including descriptions of its available tools and resources.6 For example, the Exa server allows for deep research on the live web, while Context7 provides real-time documentation for major SDKs, directly addressing the knowledge cutoff issues inherent in static LLMs.6

### **Smithery Connect: The Managed Service Layer**

Smithery Connect addresses the operational complexity of deploying agents at scale by providing a managed infrastructure layer.5 This service simplifies the "NxM" integration by acting as a centralized gateway for remote MCP servers.

The most significant technical contribution of Smithery Connect is the elimination of OAuth configuration hurdles.5 Traditional API integration requires developers to manage Client IDs, Secrets, and Redirect URIs for every service they connect to.5 Smithery Connect handles these authentication handshakes automatically, storing credentials in a secure, encrypted, write-only environment.5 This "stateless" integration means that the connection lifecycle is managed by Smithery, allowing the developer's agent to remain lightweight and focused on core logic rather than authentication maintenance.5

Furthermore, the Unified API Gateway provides a single interface to access thousands of tools through a shared API key.5 This eliminates the need for managing dozens of individual remote server connections, which can be prone to latency issues and configuration drift.5 By providing automatic token refreshes, Smithery ensures that the agent's access to external data remains uninterrupted.5

### **Developer Tooling and the @smithery/cli**

The Smithery CLI is a Node-based command-line interface designed to bridge the gap between local development and cloud deployment.13 It serves as a unified manager for installing and testing MCP servers.

| Command Group | Command | Description |
| :---- | :---- | :---- |
| MCP Management | smithery mcp search \[term\] | Finds servers in the global Smithery registry. |
| Connectivity | smithery mcp add \[url/name\] | Installs a server to the local or cloud environment. |
| Authentication | smithery auth login | Authenticates the local CLI with the Smithery platform. |
| Tool Interaction | smithery tool list \[conn\] | Lists all tools available on a connected server. |
| Remote Debugging | smithery mcp publish \[url\] | Deploys a local server to the Smithery gateway. |

13

A key feature for developers is the integration of local-to-cloud tunneling technology.5 Using an embedded ngrok-like system, developers can test MCP servers hosted on their local machines against the Smithery cloud playground.5 This bypasses complex networking setups and firewall configurations, enabling rapid iteration cycles.5

### **Testing, Observability, and spec Compliance**

The Smithery MCP Playground provides an interactive environment where developers can observe exactly how various LLMs interact with specific tools.5 This is critical for assessing model steering—ensuring the LLM correctly interprets tool descriptions and provides the necessary parameters in the correct format.5

The platform offers detailed logging of tool calls, allowing developers to diagnose issues where an agent might be "looping" or failing to handle specific error responses.5 Smithery also handles "Spec Compliance" automatically.7 The Smithery Gateway ensures that all metadata enrichment, caching, and protocol handshakes follow the latest MCP specifications, which reduces the maintenance burden on individual server creators.7

## **The "Skill" Ecosystem: Specialized Capabilities for Agents**

Beyond raw MCP servers, Smithery emphasizes "Skills"—specialized, high-level capabilities that bundle together tools, prompts, and best-practice instructions.14 While an MCP server might expose a generic database query tool, a "skill" might provide the logic for "Automated Financial Scenario Planning" using that database.19

### **Definition and Utility of Skills**

Skills are essentially "portable behaviors" that can be added to agents like Claude Desktop, Cursor, or custom-built assistants.14 They provide the agent with domain-specific knowledge and workflows that are not inherent in the base model.21

| Popular Smithery Skill | Use Case | Mechanism |
| :---- | :---- | :---- |
| frontend-design | Building UI components. | Generates creative, non-generic React/Tailwind code. |
| pdf | Document manipulation. | OCR, merging, splitting, and text extraction from PDFs. |
| pptx | Slide deck generation. | Converts natural language specs into professional slides. |
| financial-models | Investment analysis. | DCF analysis, Monte Carlo simulations, and scenario testing. |
| excalidraw | System architecture. | Generates diagrams from natural language descriptions. |

19

### **Skill Installation and Reputation Management**

Installing a skill is typically performed via the CLI using a command such as npx skills add \[namespace/skill\] \--agent \[target\].13 This command fetches the skill's manifest and integrates it into the agent's configuration.13

Smithery incorporates a community-driven reputation system to help developers identify high-quality skills.13 The CLI supports upvote and downvote commands, and users can submit detailed reviews using the smithery skill review add command.13 This feedback loop is essential because agentic tools are non-deterministic; a tool that works for one model might fail for another due to differences in instruction following or context window size.12

## **Architectural Deep Dive: Claude, Gemini, and CodeX Pro Patterns**

To build a superior platform like skill.sh, one must understand the distinct architectural patterns used by major AI assistants to handle tool calling and context integration.

### **Anthropic Claude: Advanced Context Engineering**

Claude utilizes the Model Context Protocol as a first-class citizen, but its "Pro" usage involves sophisticated techniques to manage context pollution.24

One of the primary challenges in agentic workflows is "Context Pollution," where intermediate tool results (like a 10MB log file) consume the entire context window, pushing out important task instructions.25 Anthropic solves this through **Programmatic Tool Calling (PTC)**.25 Instead of Claude requesting one tool at a time and receiving each result in its chat history, Claude writes a Python script that orchestrates multiple tools.25 This script runs in a sandboxed execution environment (like E2B or Northflank), and only the final, summarized result is returned to the model's context.25 This can reduce token consumption by nearly 40% on complex research tasks.25

Claude also employs a **Tool Search Tool** for agents with massive tool libraries.25 Rather than loading 100+ tool definitions upfront, Claude uses a high-level search tool to discover and load only the relevant schemas for the current turn.25 This "latent discovery" pattern is a crucial benchmark for any registry.26

### **Google Gemini: The Agent Development Kit (ADK)**

Google's Gemini models interact with MCP through the Agent Development Kit (ADK) and specialized "Gemini API Skills".22 Gemini is highly sensitive to schema strictness; if a tool's parameters are not explicitly typed with Enums or structured objects, the model may hallucinate invalid arguments.28

The Gemini ecosystem relies on the settings.json file for configuration, where developers can approve or exclude specific tools using the coreTools and excludeTools arrays.29 For advanced developers, the Gemini CLI supports three transport types: STDIO for local subprocesses, SSE for remote events, and Streamable HTTP for high-efficiency data transfers.30 A unique feature of Gemini is its ability to automatically expand environment variables within the MCP configuration, allowing for secure referencing of API keys without hardcoding them in configuration files.30

### **OpenAI and the Codex Ecosystem**

OpenAI's "Codex" represents a dedicated agentic framework that exists alongside the standard ChatGPT interface.31 Codex is optimized for "pairing" or "delegating" tasks.31 In "delegation mode," Codex runs in the background in an isolated cloud sandbox, editing files and running tests autonomously.31

Codex uses a "Plugin" architecture to package reusable workflows.31 These plugins can combine MCP server configurations, skills, and app integrations into a single unit, making them easy to share across enterprise teams.31 Interestingly, while GPT-4o is a general-purpose powerhouse, OpenAI recommends the o-series (o1, o3-mini) for complex multi-step reasoning, as their internal chain-of-thought processing allows them to navigate ambiguous tasks and "find needles in haystacks" with significantly higher reliability than standard models.32

## **Identifying Gaps in the Current Smithery.ai Experience**

While Smithery.ai is the current market leader, technical analysis and community feedback reveal several significant "satisfied but suboptimal" requirements.

### **The "Token Tax" of Verbose Schemas**

Current MCP implementations often suffer from "Schema Bloat".12 Many servers wrap existing REST APIs, exposing dozens of endpoints as tools.12 If an agent loads a GitHub server (35 tools) and a Slack server (11 tools), it can consume over 45,000 tokens just on tool definitions before any work begins.25 Smithery does not currently provide a way to "compress" or "summarize" these schemas for token-constrained models.26

### **The Need for Intent-Based Tooling**

A recurring failure mode in agentic development is "Multi-Step Hell," where an agent must call three or four different tools (e.g., list\_files, read\_file, search\_string) to perform a single logical action.12 Experts advocate for "Intent Tools" that encapsulate these multi-step workflows.12 Smithery's registry is dominated by atomic, low-level tools, forcing the AI to expend reasoning tokens on basic orchestration.12

### **Interactive Documentation and Dry-Runs**

One of the biggest frustrations for developers is the lack of "functional examples".34 To understand a tool, a developer must currently install it and waste live API tokens to see how the model responds.16 There is a clear gap for a platform that offers "Zero-Token Simulations"—dry-run environments where developers can see a tool's inputs and outputs using mock data before committing to a live session.23

### **Governance and Observability**

In enterprise environments, "governance isn't optional".38 Organizations need to know which agents are accessing which tools and what data is being exfiltrated.39 While Smithery offers basic logging, it lacks advanced privilege boundaries, risk classification, and "circuit breakers" for runaway agentic loops.38

## **The skill.sh Blueprint: A Next-Generation Agentic Registry**

The proposed skill.sh website aims to solve these deficiencies by prioritizing developer efficiency, architectural clarity, and token optimization. The following detailed feature list outlines the requirements for this superior platform.

### **Feature 1: The "Example-First" Skill Registry**

Unlike traditional directories, skill.sh will treat examples as first-class citizens. Each skill page will include a "Functional Sandbox."

* **Interactive Dry-Runs:** A built-in simulator that uses the MCP Inspector proxy architecture to let users "call" a tool with mock inputs.15 It will display the raw JSON request and the formatted markdown response without requiring an LLM or an API key.40  
* **Prompt-to-Action Previews:** A side-by-side view showing a sample user prompt and the corresponding tool call the AI generated.16 This helps developers see if their tool descriptions are clear enough for model steering.26  
* **Token Consumption Metrics:** Every tool will display its "Context Cost"—exactly how many tokens its schema consumes for common models like GPT-4o and Claude 3.5 Sonnet.26

### **Feature 2: Intent-Based Tool Orchestration**

Skill.sh will prioritize "composite skills" over raw API wrappers. It will offer a library of "Intent Tools" that reduce round-trips to the model.12

* **Atomic vs. Composite Views:** Users can toggle between seeing the raw endpoints and the "Optimized Workflow" version of a server.12  
* **Next-Step Guidance:** Each tool response will include "semantic breadcrumbs"—metadata that suggests the next logical tool call to the agent, reducing its need to "search" for what to do next.12  
* **Schema Compression Engine:** An automated service that takes verbose Swagger/OpenAPI docs and generates "Brief" MCP schemas, stripping out redundant descriptions and keeping only the essential semantic identifiers.26

### **Feature 3: The "Pro" Architectural Learning Center**

To help developers use models "like a pro," skill.sh will host deep-dive documentation on agentic structures.

* **Model-Specific Implementation Guides:** Detailed walkthroughs for configuring settings.json for Gemini, config.toml for Codex, and .claude.md for Claude Code.26  
* **Universal Configuration Generator:** A tool where users select their IDE (Cursor, VS Code, Windsurf) and their target models, and skill.sh generates a perfectly formatted configuration file with all necessary MCP servers.37  
* **Open-Source Repository Deep Dives:** Curated documentation for repositories like nanobot (lightweight assistant) and AutoGPT (autonomous agent), with simplified "quick-start" guides and visual architecture diagrams.43

### **Feature 4: Enhanced Installation and Management**

Skill.sh will simplify the operational side of MCP with better CLI and cloud integration.

* **Multi-Platform Setup Wizards:** Guided onboarding that detects the user's environment (Node, Python, Go) and provides specific installation commands to avoid common dependency conflicts.44  
* **Verified Maintainer Badges:** A trust system based on DNS verification and GitHub history, flagging servers from reputable organizations like Microsoft, Anthropic, or HashiCorp.9  
* **Governance Allow-Lists:** A feature for team leads to create "Approved Tool Hubs" that their developers can sync with one command, ensuring compliance across the organization.38

## **Technical Comparison of MCP Hosting Strategies**

Developers must choose between local and remote execution depending on their performance and security requirements. Skill.sh will help users navigate these trade-offs.

| Factor | Local (STDIO) | Managed Cloud (SSE/HTTP) | Private VPS (Glama-style) |
| :---- | :---- | :---- | :---- |
| **Latency** | Extremely Low (\<50ms) | Moderate (100-300ms) | Moderate (Network dependent) |
| **Security** | Host Access Risk | Managed Sandboxing | Full Isolation |
| **State** | Persistent to File System | Ephemeral/Stateless | Persistent to Volume |
| **Complexity** | Manual setup/deps | Zero-config | High (Server management) |
| **Cost** | Free (Local compute) | Usage-based / Credits | Fixed subscription |

3

## **Optimizing Skill Documentation for Model Discovery**

The effectiveness of an agent is directly proportional to the clarity of its skill documentation.48 Skill.sh will enforce the SKILL.md standard to ensure high "hit rates" (the probability the AI chooses the correct tool).

### **The anatomy of a High-Performance Skill**

A "Pro" skill description should avoid vague terms like "helper" or "utils".49 Instead, it should use third-person, imperative language.48

* **Negative Constraints:** Explicitly tell the model when *not* to use a skill (e.g., "Do not use this skill for PDFs, only for.docx files").21  
* **Worked Examples:** Include 1-3 concrete examples of successful tool calls within the documentation. These examples serve as "few-shot" prompts that ground the model's behavior.25  
* **Failure Recovery Instructions:** Provide the model with specific instructions on what to do if an API returns a 404 or a 401 error, preventing the agent from crashing or guessing.28

## **Synthesis of Agentic Design Principles**

The shift toward an agentic web requires a new set of design principles for developers. By analyzing the successes and failures of the Smithery.ai era, several core tenets for skill.sh have emerged.

First, **Context is a Shared Language.** MCP isn't just about sharing data; it's about sharing *understanding*.2 A registry must facilitate the exchange of metadata that gives raw data meaning.2 Second, **Efficiency is the New Currency.** In the world of LLMs, tokens are money. A platform that can perform a task with 63% fewer tokens is fundamentally superior to a "naive" directory.22 Third, **Security must be Built-in, not Bolted-on.** As agents gain the power to "do things," the potential for tool poisoning and data exfiltration becomes a systemic risk.1

Skill.sh will address these by implementing a "Curation over Quantity" approach, similar to the Glama model, where automated scans and manual reviews ensure that every skill is production-ready.46 By integrating deep architectural learning with interactive, token-efficient tooling, skill.sh will move the industry from the "App Store" phase to a mature "Agentic Runtime" phase.

## **Strategic Outlook and Recommendations**

For developers building the next generation of AI assistants, the move from Smithery-style registries to advanced platforms like skill.sh is inevitable. The primary recommendation is to **Focus on the Host Layer.** You do not need to wait for protocol changes to fix token bloat; your agent can and should filter, search, and prioritize tools before they reach the model.26

Furthermore, **Embrace Code Execution.** By letting the LLM express orchestration logic in code (Python/TypeScript) rather than through natural language tool calls, you gain more precise control and massive context savings.25 Finally, **Document for the Model, not the Human.** The primary "user" of an MCP server is an AI. Descriptions must be semantically dense and follow the "principle of least surprise"—if a human can't figure out how to use your tool from the description, the AI won't either.40

The emergence of Smithery.ai provided the foundational marketplace for the agentic web. Skill.sh represents the next logical step: a platform that treats the AI agent as a professional peer, providing it with the precise, efficient, and secure context it needs to perform complex work across the digital world.1

#### **Works cited**

1. The Model Context Protocol's impact on 2025 | Thoughtworks United States, accessed April 2, 2026, [https://www.thoughtworks.com/en-us/insights/blog/generative-ai/model-context-protocol-mcp-impact-2025](https://www.thoughtworks.com/en-us/insights/blog/generative-ai/model-context-protocol-mcp-impact-2025)  
2. 7 Things to Know About MCP (Model Context Protocol) in 2025 \- AdSkate, accessed April 2, 2026, [https://www.adskate.com/blogs/mcp-model-context-protocol-2025-guide](https://www.adskate.com/blogs/mcp-model-context-protocol-2025-guide)  
3. What Is the Model Context Protocol (MCP) and How It Works \- Descope, accessed April 2, 2026, [https://www.descope.com/learn/post/mcp](https://www.descope.com/learn/post/mcp)  
4. What is the Model Context Protocol (MCP)? \- Model Context Protocol, accessed April 2, 2026, [https://modelcontextprotocol.io/docs/getting-started/intro](https://modelcontextprotocol.io/docs/getting-started/intro)  
5. Overview \- Smithery Documentation, accessed April 2, 2026, [https://smithery.ai/docs/use](https://smithery.ai/docs/use)  
6. Introduction \- Smithery Documentation, accessed April 2, 2026, [https://smithery.ai/docs](https://smithery.ai/docs)  
7. Overview \- Smithery Documentation, accessed April 2, 2026, [https://smithery.ai/docs/build](https://smithery.ai/docs/build)  
8. Awesome MCP Servers \- A curated list of Model Context Protocol servers \- GitHub, accessed April 2, 2026, [https://github.com/appcypher/awesome-mcp-servers](https://github.com/appcypher/awesome-mcp-servers)  
9. The MCP Registry \- Model Context Protocol, accessed April 2, 2026, [https://modelcontextprotocol.io/registry/about](https://modelcontextprotocol.io/registry/about)  
10. MCP use cases \- Speakeasy, accessed April 2, 2026, [https://www.speakeasy.com/mcp/using-mcp/use-cases](https://www.speakeasy.com/mcp/using-mcp/use-cases)  
11. Has anyone used Smithery Ai : r/ClaudeAI \- Reddit, accessed April 2, 2026, [https://www.reddit.com/r/ClaudeAI/comments/1n7pjs7/has\_anyone\_used\_smithery\_ai/](https://www.reddit.com/r/ClaudeAI/comments/1n7pjs7/has_anyone_used_smithery_ai/)  
12. When MCP Fails \- Shav Vimalendiran, accessed April 2, 2026, [https://shav.dev/blog/when-mcp-fails](https://shav.dev/blog/when-mcp-fails)  
13. smithery-ai/cli: Install, manage and develop MCP servers ... \- GitHub, accessed April 2, 2026, [https://github.com/smithery-ai/cli](https://github.com/smithery-ai/cli)  
14. smithery-ai-cli \- Skill, accessed April 2, 2026, [https://smithery.ai/skills/smithery-ai/cli](https://smithery.ai/skills/smithery-ai/cli)  
15. modelcontextprotocol/inspector: Visual testing tool for MCP servers \- GitHub, accessed April 2, 2026, [https://github.com/modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector)  
16. Build Your AI Agent with Tool Calling | by Tahir \- Medium, accessed April 2, 2026, [https://medium.com/@tahirbalarabe2/build-your-ai-agent-with-tool-calling-5111eab61521](https://medium.com/@tahirbalarabe2/build-your-ai-agent-with-tool-calling-5111eab61521)  
17. Specification \- Model Context Protocol, accessed April 2, 2026, [https://modelcontextprotocol.io/specification/2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)  
18. The complete guide to Agent Skills, accessed April 2, 2026, [https://www.youtube.com/watch?v=fabAI1OKKww](https://www.youtube.com/watch?v=fabAI1OKKww)  
19. Skills | Smithery, accessed April 2, 2026, [https://smithery.ai/skills](https://smithery.ai/skills)  
20. Anthropic Academy: Claude API Development Guide, accessed April 2, 2026, [https://www.anthropic.com/learn/build-with-claude](https://www.anthropic.com/learn/build-with-claude)  
21. Skills | Smithery, accessed April 2, 2026, [https://smithery.ai/skills?ns=JNLei](https://smithery.ai/skills?ns=JNLei)  
22. Improve coding agents' performance with Gemini API Docs MCP ..., accessed April 2, 2026, [https://blog.google/innovation-and-ai/technology/developers-tools/gemini-api-docsmcp-agent-skills/](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-api-docsmcp-agent-skills/)  
23. Open Source and Free AI Agent Evaluation Tools \- DataTalks.Club, accessed April 2, 2026, [https://datatalks.club/blog/open-source-free-ai-agent-evaluation-tools.html](https://datatalks.club/blog/open-source-free-ai-agent-evaluation-tools.html)  
24. Code execution with MCP: building more efficient AI agents \- Anthropic, accessed April 2, 2026, [https://www.anthropic.com/engineering/code-execution-with-mcp](https://www.anthropic.com/engineering/code-execution-with-mcp)  
25. Introducing advanced tool use on the Claude Developer Platform \- Anthropic, accessed April 2, 2026, [https://www.anthropic.com/engineering/advanced-tool-use](https://www.anthropic.com/engineering/advanced-tool-use)  
26. MCP Tool Schema Bloat: The Hidden Token Tax (and How to Fix It) | Layered System, accessed April 2, 2026, [https://layered.dev/mcp-tool-schema-bloat-the-hidden-token-tax-and-how-to-fix-it/](https://layered.dev/mcp-tool-schema-bloat-the-hidden-token-tax-and-how-to-fix-it/)  
27. Top 7 AI agent runtime tools and platforms in 2026 | Blog \- Northflank, accessed April 2, 2026, [https://northflank.com/blog/top-ai-agent-runtime-tools](https://northflank.com/blog/top-ai-agent-runtime-tools)  
28. A look at Gemini Function Calling architecture and connecting it to an MCP Tool Router, accessed April 2, 2026, [https://www.reddit.com/r/agentdevelopmentkit/comments/1pyo7lv/a\_look\_at\_gemini\_function\_calling\_architecture/](https://www.reddit.com/r/agentdevelopmentkit/comments/1pyo7lv/a_look_at_gemini_function_calling_architecture/)  
29. Use the Gemini Code Assist agent mode \- Google for Developers, accessed April 2, 2026, [https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer)  
30. MCP servers with the Gemini CLI, accessed April 2, 2026, [https://geminicli.com/docs/tools/mcp-server/](https://geminicli.com/docs/tools/mcp-server/)  
31. Using Codex with your ChatGPT plan | OpenAI Help Center, accessed April 2, 2026, [https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)  
32. Reasoning best practices | OpenAI API, accessed April 2, 2026, [https://developers.openai.com/api/docs/guides/reasoning-best-practices](https://developers.openai.com/api/docs/guides/reasoning-best-practices)  
33. Stop Calling Tools, Start Writing Code (Mode), accessed April 2, 2026, [https://www.jlowin.dev/blog/fastmcp-3-1-code-mode](https://www.jlowin.dev/blog/fastmcp-3-1-code-mode)  
34. AI is writing our Competitor Comparison pages for us and it's getting them wrong. \- Reddit, accessed April 2, 2026, [https://www.reddit.com/r/buildinpublic/comments/1rrt2iv/ai\_is\_writing\_our\_competitor\_comparison\_pages\_for/](https://www.reddit.com/r/buildinpublic/comments/1rrt2iv/ai_is_writing_our_competitor_comparison_pages_for/)  
35. Explain actual real life use cases where mcp servers actually help you \- Reddit, accessed April 2, 2026, [https://www.reddit.com/r/cursor/comments/1j3nnbz/explain\_actual\_real\_life\_use\_cases\_where\_mcp/](https://www.reddit.com/r/cursor/comments/1j3nnbz/explain_actual_real_life_use_cases_where_mcp/)  
36. Testing AI Agent Tool Calls & Function Calling – Scenario \- LangWatch, accessed April 2, 2026, [https://langwatch.ai/scenario/testing-guides/tool-calling](https://langwatch.ai/scenario/testing-guides/tool-calling)  
37. Build agents and prompts in AI Toolkit \- Visual Studio Code, accessed April 2, 2026, [https://code.visualstudio.com/docs/intelligentapps/agentbuilder](https://code.visualstudio.com/docs/intelligentapps/agentbuilder)  
38. How to find, install, and manage MCP servers with the GitHub MCP Registry, accessed April 2, 2026, [https://github.blog/ai-and-ml/generative-ai/how-to-find-install-and-manage-mcp-servers-with-the-github-mcp-registry/](https://github.blog/ai-and-ml/generative-ai/how-to-find-install-and-manage-mcp-servers-with-the-github-mcp-registry/)  
39. How to build an enterprise-grade MCP registry \- InfoWorld, accessed April 2, 2026, [https://www.infoworld.com/article/4145014/how-to-build-an-enterprise-grade-mcp-registry.html](https://www.infoworld.com/article/4145014/how-to-build-an-enterprise-grade-mcp-registry.html)  
40. Function calling | OpenAI API, accessed April 2, 2026, [https://developers.openai.com/api/docs/guides/function-calling](https://developers.openai.com/api/docs/guides/function-calling)  
41. copilot-cli-for-beginners/06-mcp-servers/README.md at main \- GitHub, accessed April 2, 2026, [https://github.com/github/copilot-cli-for-beginners/blob/main/06-mcp-servers/README.md](https://github.com/github/copilot-cli-for-beginners/blob/main/06-mcp-servers/README.md)  
42. How to build great tools for AI agents: A field guide \- Composio, accessed April 2, 2026, [https://composio.dev/blog/how-to-build-tools-for-ai-agents-a-field-guide](https://composio.dev/blog/how-to-build-tools-for-ai-agents-a-field-guide)  
43. Top 10 Open Source AI Agents You Can Run Locally (2026) | Fast.io, accessed April 2, 2026, [https://fast.io/resources/top-10-open-source-ai-agents/](https://fast.io/resources/top-10-open-source-ai-agents/)  
44. HKUDS/nanobot: " nanobot: The Ultra-Lightweight OpenClaw" \- GitHub, accessed April 2, 2026, [https://github.com/HKUDS/nanobot](https://github.com/HKUDS/nanobot)  
45. Configure MCP in an AI application \- Google Cloud Documentation, accessed April 2, 2026, [https://docs.cloud.google.com/mcp/configure-mcp-ai-application](https://docs.cloud.google.com/mcp/configure-mcp-ai-application)  
46. Best MCP Server Directories for Developers \- Descope, accessed April 2, 2026, [https://www.descope.com/blog/post/mcp-directories](https://www.descope.com/blog/post/mcp-directories)  
47. Any good alternatives to smithery.ai ? : r/mcp \- Reddit, accessed April 2, 2026, [https://www.reddit.com/r/mcp/comments/1jqc7ig/any\_good\_alternatives\_to\_smitheryai/](https://www.reddit.com/r/mcp/comments/1jqc7ig/any_good_alternatives_to_smitheryai/)  
48. How to build a good skill: best practices from creation to iteration \- Documentation \- TRAE, accessed April 2, 2026, [https://docs.trae.ai/ide/best-practice-for-how-to-write-a-good-skill](https://docs.trae.ai/ide/best-practice-for-how-to-write-a-good-skill)  
49. Skill authoring best practices \- Claude API Docs, accessed April 2, 2026, [https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)  
50. Shell \+ Skills \+ Compaction: Tips for long-running agents that do real work, accessed April 2, 2026, [https://developers.openai.com/blog/skills-shell-tips](https://developers.openai.com/blog/skills-shell-tips)  
51. Best Glama Alternatives to consider for MCP servers in 2026 \- Composio, accessed April 2, 2026, [https://composio.dev/content/glama-alternatives](https://composio.dev/content/glama-alternatives)  
52. A Deep Dive Into MCP and the Future of AI Tooling | Andreessen Horowitz, accessed April 2, 2026, [https://a16z.com/a-deep-dive-into-mcp-and-the-future-of-ai-tooling/](https://a16z.com/a-deep-dive-into-mcp-and-the-future-of-ai-tooling/)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAYCAYAAAD3Va0xAAABF0lEQVR4Xu2TvUoDQRRGr1qZSkTSpBQMIjZ5AAvjA0jE0jYJ1jZ2go1VQLCxsgkk8SUELRQUkQTSBEJIo502kkLUnHFm2J27m8J+Dxx25n7D/C0jkvFftnGIr/iGzTD+4xFHOBA7thGkijZ+4A+uqmwBT/AWC2GUpItH+CvpK57hvi5qiniNS/iJ75gLRojcYV7VEtTw0LUvxe6qGsWyiM+x/kxauO7am2InMkf1lPEi1p/Ji+rfiJ1sy/VPcS+K0/H3E6cidiJfN/ezEsXp1CW6H4/53WP8wjV8CuN0Orihi3Asdlf3eK6yBHPYd1+NOcpE7GS7KktwgD2c14HjCr9xWQeeHbHvyqxoNE/DvDlNCR90MSMDpvMbNCf6RtASAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAABUElEQVR4Xu2TvSuGURjGr3yG0ccgi0Rm/gFhY5LeySQfm11iIBlMwkKSQQaTycoiyiDMIhRWJUW4bvc5zrmf5ynv8m7Pr351zn2dj/ec57xATqnppjf0yXli4xQDCGMf6K6NLTv0jn7QikTmqaOH9Jse0DIbp7mgy9AJrYnMs0RnoGMmE1mKJnpMR6ET+mz8SxedpavQMR02TjNM52kvdMKYjVEOvbtqekUfbZyN7C4LyrFl0UUbY4r20Eb6hX8+juec1kA/0Cfdi7IWuuLaciLZdDzE2TRA79MjL+A06m/Setdegy7aHuJsZPeFqH9En117iI6ECNco8j7XaX/U34b+mmbo2/XIC5F6Ufd5SWuj/hx0sjzytqhecPWJqJbJIL2nVVFNjiuTp6OasOXqnYn6H/J/l7t5o+/0FXq3Pjujla6/QW8Rxr7QfZfl5JSKH+4dR2Zfvsd0AAAAAElFTkSuQmCC>