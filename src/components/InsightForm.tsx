import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const InsightForm = () => {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [concern, setConcern] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ageRanges = ["18-20", "21-23", "24-25"];

  const handleSubmit = () => {
    if (!selectedAge || !concern.trim()) {
      toast.error("Please select your age range and share your concern");
      return;
    }

    // In a real implementation, this would send to a backend
    console.log("Insight submitted:", { ageRange: selectedAge, concern });
    setIsSubmitted(true);
    toast.success("Thank you for contributing to collective understanding");
  };

  if (isSubmitted) {
    return (
      <section className="py-24 px-6 md:px-12 lg:px-24 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-sm tracking-widest text-muted-foreground mb-4">
            INSIGHT RECORDED
          </p>
          <h2 className="font-serif text-3xl mb-6">
            Your perspective matters
          </h2>
          <p className="text-muted-foreground">
            Anonymous insights like yours help reveal patterns that shape policy discussions 
            and educational initiatives for future generations.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="max-w-2xl mx-auto">
        <p className="font-mono text-sm tracking-widest text-muted-foreground mb-4">
          GENERATIONAL INSIGHT
        </p>
        
        <h2 className="font-serif text-3xl md:text-4xl mb-6">
          Share your perspective
        </h2>
        
        <p className="text-muted-foreground mb-8">
          Anonymous contributions from young adults (18-25) help illuminate emerging 
          financial concerns and shape understanding of generational challenges.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              Your age range
            </label>
            <div className="flex flex-wrap gap-3">
              {ageRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedAge(range)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    selectedAge === range
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border bg-card hover:bg-accent"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              What financial behavior worries you most about your generation?
            </label>
            <Textarea
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              placeholder="Share your observation..."
              className="min-h-[120px] resize-none bg-card border-border"
            />
          </div>

          <Button onClick={handleSubmit} className="px-8">
            Submit Anonymously
          </Button>

          <p className="text-xs text-muted-foreground">
            No personal data is collected. Your insight contributes only to aggregate understanding.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InsightForm;
