(() => {
    const root = document.documentElement;
    const languageButton = document.getElementById('language-toggle');
    const themeButton = document.getElementById('theme-toggle');
    const readPreference = key => {
        try { return localStorage.getItem(key); } catch { return null; }
    };
    const savePreference = (key, value) => {
        try { localStorage.setItem(key, value); } catch { /* Settings still work without storage. */ }
    };

    function updateThemeButton() {
        const dark = root.dataset.theme === 'dark';
        const label = window.siteLanguage === 'en'
            ? (dark ? 'Switch to light mode' : 'Switch to dark mode')
            : (dark ? '切换到白天模式' : '切换到黑暗模式');
        themeButton.innerHTML = `<span aria-hidden="true">${dark ? '☀' : '☾'}</span>`;
        themeButton.setAttribute('aria-label', label);
        themeButton.title = label;
        themeButton.setAttribute('aria-pressed', String(dark));
    }

    function setLanguage(language) {
        window.siteLanguage = language;
        root.lang = language === 'en' ? 'en' : 'zh-CN';
        document.querySelectorAll('[data-en]').forEach(element => {
            if (!element.hasAttribute('data-zh')) element.dataset.zh = element.innerHTML;
            element.innerHTML = language === 'en' ? element.dataset.en : element.dataset.zh;
        });
        document.querySelector('.avatar').alt = language === 'en'
            ? 'kltt-l’s Threepeater avatar' : '快乐堂堂的三重豌豆射手头像';
        document.getElementById('sidebar-nav').setAttribute('aria-label', language === 'en' ? 'Main navigation' : '主导航');
        document.querySelector('.toggle-btn').setAttribute('aria-label', language === 'en' ? 'Close contents' : '收起笔记目录');
        document.querySelector('.expand-btn').setAttribute('aria-label', language === 'en' ? 'Open contents' : '展开笔记目录');
        languageButton.textContent = language === 'en' ? '中文' : 'EN';
        languageButton.setAttribute('aria-label', language === 'en' ? '切换到中文' : 'Switch to English');
        languageButton.title = languageButton.getAttribute('aria-label');
        updateThemeButton();
        window.dispatchEvent(new Event('site-language-change'));
    }

    languageButton.addEventListener('click', () => {
        const language = window.siteLanguage === 'en' ? 'zh' : 'en';
        savePreference('homepage-language', language);
        setLanguage(language);
    });
    themeButton.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        savePreference('homepage-theme', root.dataset.theme);
        updateThemeButton();
    });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!readPreference('homepage-theme')) {
            root.dataset.theme = event.matches ? 'dark' : 'light';
            updateThemeButton();
        }
    });
    setLanguage(readPreference('homepage-language') === 'zh' ? 'zh' : 'en');
})();
