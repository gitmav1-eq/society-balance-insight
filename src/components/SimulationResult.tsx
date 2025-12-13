interface SimulationResultProps {
  content: string;
}

const SimulationResult = ({ content }: SimulationResultProps) => {
  // Parse the markdown content into sections
  const sections = content.split(/^## /gm).filter(Boolean);

  return (
    <div className="space-y-12">
      {sections.map((section, index) => {
        const lines = section.split("\n");
        const title = lines[0]?.trim();
        const body = lines.slice(1).join("\n").trim();

        return (
          <div key={index} className="space-y-4">
            <h3 className="font-serif text-2xl text-foreground">
              {title}
            </h3>
            <div className="prose prose-neutral max-w-none">
              {body.split("\n\n").map((paragraph, pIndex) => {
                // Handle bold text markers
                if (paragraph.startsWith("**") && paragraph.includes(":**")) {
                  const match = paragraph.match(/\*\*(.+?):\*\*\s*(.*)/s);
                  if (match) {
                    return (
                      <div key={pIndex} className="mb-4">
                        <p className="font-semibold text-foreground mb-2">{match[1]}:</p>
                        <p className="text-muted-foreground leading-relaxed">{match[2]}</p>
                      </div>
                    );
                  }
                }
                
                // Handle bullet points
                if (paragraph.includes("\n- ")) {
                  const parts = paragraph.split("\n");
                  return (
                    <div key={pIndex} className="mb-4">
                      {parts.map((part, partIndex) => {
                        if (part.startsWith("- ")) {
                          return (
                            <p key={partIndex} className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-border mb-2">
                              {part.substring(2)}
                            </p>
                          );
                        }
                        return (
                          <p key={partIndex} className="text-muted-foreground leading-relaxed mb-2">
                            {part}
                          </p>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <p key={pIndex} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SimulationResult;
