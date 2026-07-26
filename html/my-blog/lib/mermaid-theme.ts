const darkThemeTokens = {
  mainBkg: "--mermaid-main-background",
  primaryColor: "--mermaid-primary-color",
  primaryTextColor: "--mermaid-primary-text",
  primaryBorderColor: "--mermaid-primary-border",
  secondaryColor: "--mermaid-secondary-color",
  secondaryTextColor: "--mermaid-secondary-text",
  secondaryBorderColor: "--mermaid-secondary-border",
  tertiaryColor: "--mermaid-tertiary-color",
  tertiaryTextColor: "--mermaid-tertiary-text",
  tertiaryBorderColor: "--mermaid-tertiary-border",
  textColor: "--mermaid-text",
  lineColor: "--mermaid-line",
  edgeLabelBackground: "--mermaid-edge-label-background",
  nodeBorder: "--mermaid-node-border",
  clusterBkg: "--mermaid-cluster-background",
  clusterBorder: "--mermaid-cluster-border",
  titleColor: "--mermaid-title",
  actorBkg: "--mermaid-actor-background",
  actorTextColor: "--mermaid-actor-text",
  actorLineColor: "--mermaid-actor-line",
  signalColor: "--mermaid-signal",
  signalTextColor: "--mermaid-signal-text",
  labelBoxBkgColor: "--mermaid-label-background",
  labelBoxBorderColor: "--mermaid-label-border",
  labelTextColor: "--mermaid-label-text",
  loopTextColor: "--mermaid-loop-text",
  activationBkgColor: "--mermaid-activation-background",
  activationBorderColor: "--mermaid-activation-border",
  noteBkgColor: "--mermaid-note-background",
  noteTextColor: "--mermaid-note-text",
  noteBorderColor: "--mermaid-note-border",
  classText: "--mermaid-class-text",
  sectionBkgColor: "--mermaid-section-background",
  altSectionBkgColor: "--mermaid-alt-section-background",
  sectionBkgColor2: "--mermaid-section-background-alt",
  taskBorderColor: "--mermaid-task-border",
  taskTextColor: "--mermaid-task-text",
  taskTextDarkColor: "--mermaid-task-text-dark",
  taskTextLightColor: "--mermaid-task-text-light",
  activeTaskBkgColor: "--mermaid-active-task-background",
  activeTaskBorderColor: "--mermaid-active-task-border",
  doneTaskBkgColor: "--mermaid-done-task-background",
  doneTaskBorderColor: "--mermaid-done-task-border",
  critBkgColor: "--mermaid-critical-background",
  critBorderColor: "--mermaid-critical-border",
  todayLineColor: "--mermaid-today-line",
  gridColor: "--mermaid-grid",
} as const;

export function getMermaidThemeVariables(isDark: boolean) {
  const styles = getComputedStyle(document.documentElement);
  const readToken = (name: string) => styles.getPropertyValue(name).trim();
  const accent = readToken("--accent-color");
  const variables: Record<string, string> = {
    background: readToken("--mermaid-background"),
    actorBorder: accent,
    taskBkgColor: accent,
  };

  if (isDark) {
    for (const [key, token] of Object.entries(darkThemeTokens)) {
      variables[key] = readToken(token);
    }
  }

  return variables;
}
