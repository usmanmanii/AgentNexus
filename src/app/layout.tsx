import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Skills Directory — Discover AI Agent Skills",
  description:
    "The open agent skills directory. Discover, install, and manage reusable AI agent skills for Claude Code, OpenAI Codex, and Gemini CLI. All data loads dynamically from GitHub.",
  keywords: [
    "agent skills",
    "claude code",
    "openai codex",
    "gemini cli",
    "ai skills",
    "skill.md",
    "agents.md",
    "mcp",
    "agentic ai",
  ],
  openGraph: {
    title: "Agent Skills Directory",
    description:
      "Discover, install, and manage reusable AI agent skills. Dynamic data from GitHub.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
