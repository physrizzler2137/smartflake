<script lang="ts">
  import { Mail, Send, CheckCircle2, Bot } from 'lucide-svelte';
  import { fly, fade } from 'svelte/transition';

  // reCAPTCHA v2 setup — add your site key here
  // Get a free key at: https://www.google.com/recaptcha/admin
  const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // test key

  let formName = $state('');
  let formEmail = $state('');
  let formMessage = $state('');
  let formStatus = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');
  let captchaPassed = $state(false);

  // Load reCAPTCHA script once
  let recaptchaLoaded = $state(false);
  let widgetId = $state<number | null>(null);

  function loadRecaptcha() {
    if (typeof window === 'undefined' || recaptchaLoaded) return;
    recaptchaLoaded = true;

    // Define callback before loading script
    (window as any).onRecaptchaLoad = () => {
      const container = document.getElementById('recaptcha-widget');
      if (container && (window as any).grecaptcha) {
        widgetId = (window as any).grecaptcha.render('recaptcha-widget', {
          sitekey: RECAPTCHA_SITE_KEY,
          theme: 'dark',
          callback: () => { captchaPassed = true; },
          'expired-callback': () => { captchaPassed = false; }
        });
      }
    };

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  // Load when section is visible
  import { onMount } from 'svelte';
  onMount(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { loadRecaptcha(); obs.disconnect(); }
    }, { threshold: 0.1 });
    const el = document.getElementById('contact');
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!captchaPassed) {
      alert('Please complete the CAPTCHA verification first.');
      return;
    }
    formStatus = 'sending';
    const subject = encodeURIComponent(`[SMaRT-Lab Website] Message from ${formName}`);
    const body = encodeURIComponent(`From: ${formName} <${formEmail}>\n\n${formMessage}`);
    window.open(`mailto:p.bartkowski@mchtr.pw.edu.pl?subject=${subject}&body=${body}`, '_blank');
    formStatus = 'sent';
  }
</script>

<section id="contact" class="py-20 sm:py-32 bg-card/20 overflow-hidden">
  <div class="container mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold font-slab bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent flex items-center justify-center gap-3">
        <Mail class="w-8 h-8 text-primary" />
        Contact Us
      </h2>
    </div>

    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">

      <!-- Left: Email + Opportunities -->
      <div class="space-y-8" in:fly={{ x: -30, duration: 600, delay: 100 }}>

        <!-- Email card -->
        <div class="bg-card/50 border border-border/50 rounded-2xl p-6">
          <h3 class="font-slab font-bold text-xl text-foreground mb-4">Get in Touch</h3>
          <a
            href="mailto:p.bartkowski@mchtr.pw.edu.pl"
            class="flex items-center gap-4 group hover:text-primary transition-colors"
          >
            <div class="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Mail class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-0.5">Email</p>
              <p class="font-medium text-foreground group-hover:text-primary transition-colors">p.bartkowski@mchtr.pw.edu.pl</p>
            </div>
          </a>
        </div>

        <!-- Diploma / opportunities card -->
        <div class="bg-card/50 border border-border/50 rounded-2xl p-6 space-y-4">
          <h3 class="font-slab font-bold text-xl text-foreground">Join Our Team</h3>
          <p class="text-sm text-foreground/80 leading-relaxed">
            We are always looking for undergraduate and PhD students, as well as Postdoctoral Fellows passionate about science to join our lab in our daily research activities.
          </p>
          <p class="text-sm text-foreground/80 leading-relaxed">
            Please contact us directly at the faculty or simply drop us an email with your interests, ideas, possibly a CV to inquire about current job openings and diploma thesis topics offered at our lab.
          </p>
          <div class="pt-1">
            <a
              href="mailto:p.bartkowski@mchtr.pw.edu.pl?subject=Diploma%20Thesis%20Inquiry"
              class="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 transition-colors"
            >
              <Send class="w-3.5 h-3.5" />
              Inquire about thesis topics
            </a>
          </div>
        </div>
      </div>

      <!-- Right: Contact Form -->
      <div in:fly={{ x: 30, duration: 600, delay: 200 }}>
        <div class="bg-card/50 border border-border/50 rounded-2xl p-6">
          <h3 class="font-slab font-bold text-xl text-foreground mb-6">Send a Message</h3>

          {#if formStatus === 'sent'}
            <div class="flex flex-col items-center justify-center py-12 text-center" in:fade>
              <div class="w-16 h-16 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-4">
                <CheckCircle2 class="w-7 h-7" />
              </div>
              <h4 class="font-slab font-bold text-lg mb-2">Message Prepared!</h4>
              <p class="text-sm text-muted-foreground max-w-xs">Your email client has opened with the message pre-filled. Please send it from there.</p>
              <button onclick={() => { formStatus = 'idle'; captchaPassed = false; }} class="mt-6 text-sm text-primary hover:underline">
                Send another message
              </button>
            </div>
          {:else}
            <form onsubmit={handleSubmit} class="space-y-5">
              <div class="space-y-1.5">
                <label for="contact-name" class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  bind:value={formName}
                  required
                  placeholder="Prof. Jane Smith"
                  class="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
              <div class="space-y-1.5">
                <label for="contact-email" class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  bind:value={formEmail}
                  required
                  placeholder="jane@university.edu"
                  class="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
              <div class="space-y-1.5">
                <label for="contact-message" class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea
                  id="contact-message"
                  bind:value={formMessage}
                  required
                  rows="4"
                  placeholder="I'm interested in a collaboration on..."
                  class="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
                ></textarea>
              </div>

              <!-- reCAPTCHA widget -->
              <div class="space-y-1.5">
                <div id="recaptcha-widget" class="overflow-hidden rounded-xl"></div>
                {#if !captchaPassed}
                  <p class="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Bot class="w-3.5 h-3.5" />
                    Please verify you are human before sending.
                  </p>
                {/if}
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending' || !captchaPassed}
                class="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                <Send class="w-4 h-4" />
                Send Message
              </button>
              <p class="text-xs text-muted-foreground text-center">
                Opens your email client with the message pre-filled.
              </p>
            </form>
          {/if}
        </div>
      </div>

    </div>
  </div>
</section>
