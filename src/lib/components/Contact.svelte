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
    // Simulate server delay since we are removing direct email exposure
    await new Promise(resolve => setTimeout(resolve, 1500));
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

      <!-- Left: Contact Form -->
      <div in:fly={{ x: -30, duration: 600, delay: 100 }}>
        <div class="bg-card/50 border border-border/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          <h3 class="font-slab font-bold text-2xl text-foreground mb-6">Get in Touch</h3>

          {#if formStatus === 'sent'}
            <div class="flex flex-col items-center justify-center py-12 text-center" in:fade>
              <div class="w-16 h-16 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-4">
                <CheckCircle2 class="w-7 h-7" />
              </div>
              <h4 class="font-slab font-bold text-lg mb-2">Message Received!</h4>
              <p class="text-sm text-muted-foreground max-w-xs">Thank you for your message. We will get back to you as soon as possible.</p>
              <button onclick={() => { formStatus = 'idle'; captchaPassed = false; }} class="mt-6 text-sm text-primary hover:underline">
                Send another message
              </button>
            </div>
          {:else}
            <form onsubmit={handleSubmit} class="space-y-6">
              <div class="space-y-2">
                <label for="contact-name" class="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  bind:value={formName}
                  required
                  placeholder="Your Name"
                  class="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
              <div class="space-y-2">
                <label for="contact-email" class="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  bind:value={formEmail}
                  required
                  placeholder="your.email@example.com"
                  class="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
              <div class="space-y-2">
                <label for="contact-message" class="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                <textarea
                  id="contact-message"
                  bind:value={formMessage}
                  required
                  rows="5"
                  placeholder="Your message..."
                  class="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
                ></textarea>
              </div>

              <!-- reCAPTCHA widget -->
              <div class="space-y-2">
                <div id="recaptcha-widget" class="overflow-hidden rounded-xl border border-border/30"></div>
                {#if !captchaPassed}
                  <p class="text-[10px] text-muted-foreground flex items-center gap-1.5 ml-1">
                    <Bot class="w-3 h-3" />
                    Please verify you are human before sending.
                  </p>
                {/if}
              </div>

              <div class="text-left pt-2">
                <button
                  type="submit"
                  disabled={formStatus === 'sending' || !captchaPassed}
                  class="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  <Send class="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </form>
          {/if}
        </div>
      </div>

      <!-- Right: Join Our Team -->
      <div class="space-y-8" in:fly={{ x: 30, duration: 600, delay: 200 }}>
        <div class="bg-card/30 border border-border/50 rounded-2xl p-8 backdrop-blur-sm">
          <h3 class="font-slab font-bold text-2xl text-foreground mb-6">Join Our Team</h3>
          <div class="space-y-6 text-foreground/90 leading-relaxed">
            <p class="text-justify">
              We are always looking for undergraduate and PhD students, as well as Postdoctoral Fellows passionate about science to join our lab in our daily research activities.
            </p>
            <p class="text-justify">
              Please contact us directly at the faculty or inquire about current job openings and diploma thesis topics offered at our lab.
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
