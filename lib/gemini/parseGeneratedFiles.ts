export function parseGeneratedFiles(raw: string): Record<string, string> {
  const files: Record<string, string> = {};

  const fencedRegex = /```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = fencedRegex.exec(raw)) !== null) {
    const block = match[1] ?? "";
    const lines = block.split("\n");
    const firstLine = (lines[0] || "").trim();

    const pathMatch = firstLine.match(/^(?:\/\/|#|--|;)?\s*filepath\s*:\s*(.+)$/i);
    if (!pathMatch?.[1]) continue;

    const path = pathMatch[1].trim();
    const content = lines.slice(1).join("\n").replace(/\s+$/, "");
    if (path && content) files[path] = content;
  }

  if (Object.keys(files).length > 0) {
    return files;
  }

  const legacySections = raw.split("### FILE:");
  for (const section of legacySections) {
    if (!section.trim()) continue;
    const lines = section.trim().split("\n");
    const path = lines[0].trim();
    const content = lines.slice(1).join("\n").trim();
    if (path && content) files[path] = content;
  }

  return files;
}
