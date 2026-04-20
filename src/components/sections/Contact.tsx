
import { opportunities } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { AnimatedTitle } from "../layout/AnimatedTitle";
import { AnimatedWrapper } from "../layout/AnimatedWrapper";

export function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <AnimatedTitle className="text-3xl sm:text-4xl font-bold font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent mb-12 text-center">
          <div className="flex items-center justify-center gap-3">
            <Mail className="w-8 h-8 text-primary" />
            Contact & Opportunities
          </div>
        </AnimatedTitle>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <AnimatedWrapper animation="fly-in-from-left">
              <div className="bg-card p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold font-headline mb-4">Get in Touch</h3>
                <p className="text-muted-foreground mb-6">Have a question or a proposal? We'd love to hear from you.</p>
                <form action="#" className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="Your Name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." rows={5} />
                  </div>
                  <div className="text-right">
                    <Button type="submit">Send Message</Button>
                  </div>
                </form>
              </div>
            </AnimatedWrapper>

            <AnimatedWrapper animation="fly-in-from-right" delay={200}>
              <div className="space-y-8">
                <div className="bg-card/50 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold font-headline mb-4">Join Our Team</h3>
                  <div
                    className="text-muted-foreground text-justify space-y-4"
                    dangerouslySetInnerHTML={{ __html: opportunities.positions }}
                  />
                </div>
              </div>
            </AnimatedWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
