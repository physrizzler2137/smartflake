import { browser } from '$app/environment';

class UIState {
	theme = $state(browser ? localStorage.getItem('smartlab-theme') || 'dark' : 'dark');
	bodyFont = $state(browser ? localStorage.getItem('smartlab-body-font') || 'font-inter' : 'font-inter');
	headlineFont = $state(browser ? localStorage.getItem('smartlab-headline-font') || 'font-roboto-slab' : 'font-roboto-slab');
	
	showFontSwitcher = $state(false);
	showThemeSwitcher = $state(false);

	toggleFontSwitcher() {
		this.showFontSwitcher = !this.showFontSwitcher;
		if (this.showFontSwitcher) this.showThemeSwitcher = false;
	}

	toggleThemeSwitcher() {
		this.showThemeSwitcher = !this.showThemeSwitcher;
		if (this.showThemeSwitcher) this.showFontSwitcher = false;
	}

	// Alias methods for convenience
	toggleFont() { this.toggleFontSwitcher(); }
	toggleTheme() { this.toggleThemeSwitcher(); }

	save() {
		if (browser) {
			localStorage.setItem('smartlab-theme', this.theme);
			localStorage.setItem('smartlab-body-font', this.bodyFont);
			localStorage.setItem('smartlab-headline-font', this.headlineFont);
		}
	}
}

export const uiState = new UIState();
