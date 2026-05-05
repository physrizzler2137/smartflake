import { mission } from "@/lib/data";
import { Quote, Target } from "lucide-react";
import { AnimatedTitle } from "../layout/AnimatedTitle";
import { AnimatedWrapper } from "../layout/AnimatedWrapper";

export function Mission() {
  return (
    <section id="mission" className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <AnimatedTitle className="text-3xl sm:text-4xl font-bold font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent">
                    <div className="flex items-center justify-center gap-3">
                        <Target className="w-8 h-8 text-primary" />
                        Mission
                    </div>
                </AnimatedTitle>
            </div>
          <AnimatedWrapper delay={200}>
            <p
              className="text-lg text-foreground/80 leading-relaxed text-center"
              dangerouslySetInnerHTML={{ __html: mission.intro }}
            />
          </AnimatedWrapper>

          <div className="mt-24 space-y-8">
            {mission.quotes.map((quote, index) => (
              <AnimatedWrapper key={index} delay={400 + index * 200}>
                <blockquote className="p-6 border-l-4 border-primary bg-card/50 rounded-r-lg">
                  <Quote className="w-8 h-8 text-primary/50 mb-4" />
                  <p className="text-xl italic text-foreground text-balance">
                    "{quote.text}"
                  </p>
                  <footer className="mt-4 text-right text-muted-foreground">
                    — {quote.author}
                  </footer>
                </blockquote>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
