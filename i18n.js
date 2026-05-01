/* i18n.js - Locale-driven translations */

const LANGUAGE_REGIONS = [
	{
		region: 'Europe',
		options: [
			{ code: 'de', label: 'Deutsch', flag: 'DE', dir: 'ltr' },
			{ code: 'en', label: 'English', flag: 'GB', dir: 'ltr' },
			{ code: 'fr', label: 'Français', flag: 'FR', dir: 'ltr' },
			{ code: 'es', label: 'Español', flag: 'ES', dir: 'ltr' },
			{ code: 'it', label: 'Italiano', flag: 'IT', dir: 'ltr' },
			{ code: 'pt', label: 'Português', flag: 'PT', dir: 'ltr' },
			{ code: 'nl', label: 'Nederlands', flag: 'NL', dir: 'ltr' },
			{ code: 'pl', label: 'Polski', flag: 'PL', dir: 'ltr' },
			{ code: 'cs', label: 'Čeština', flag: 'CZ', dir: 'ltr' },
			{ code: 'sk', label: 'Slovenčina', flag: 'SK', dir: 'ltr' },
			{ code: 'sl', label: 'Slovenščina', flag: 'SI', dir: 'ltr' },
			{ code: 'hr', label: 'Hrvatski', flag: 'HR', dir: 'ltr' },
			{ code: 'sr', label: 'Српски', flag: 'RS', dir: 'ltr' },
			{ code: 'mk', label: 'Македонски', flag: 'MK', dir: 'ltr' },
			{ code: 'ro', label: 'Română', flag: 'RO', dir: 'ltr' },
			{ code: 'bg', label: 'Български', flag: 'BG', dir: 'ltr' },
			{ code: 'hu', label: 'Magyar', flag: 'HU', dir: 'ltr' },
			{ code: 'fi', label: 'Suomi', flag: 'FI', dir: 'ltr' },
			{ code: 'no', label: 'Norsk', flag: 'NO', dir: 'ltr' },
			{ code: 'da', label: 'Dansk', flag: 'DK', dir: 'ltr' },
			{ code: 'et', label: 'Eesti', flag: 'EE', dir: 'ltr' },
			{ code: 'lv', label: 'Latviešu', flag: 'LV', dir: 'ltr' },
			{ code: 'lt', label: 'Lietuvių', flag: 'LT', dir: 'ltr' },
			{ code: 'mt', label: 'Malti', flag: 'MT', dir: 'ltr' },
			{ code: 'el', label: 'Ελληνικά', flag: 'GR', dir: 'ltr' },
			{ code: 'uk', label: 'Українська', flag: 'UA', dir: 'ltr' },
			{ code: 'ru', label: 'Русский', flag: 'RU', dir: 'ltr' },
			{ code: 'be', label: 'Беларуская', flag: 'BY', dir: 'ltr' },
			{ code: 'bs', label: 'Bosanski', flag: 'BA', dir: 'ltr' },
			{ code: 'ca', label: 'Català', flag: 'CA', dir: 'ltr' },
			{ code: 'eu', label: 'Euskara', flag: 'EU', dir: 'ltr' },
			{ code: 'gl', label: 'Galego', flag: 'GL', dir: 'ltr' },
			{ code: 'sq', label: 'Shqip', flag: 'AL', dir: 'ltr' },
			{ code: 'ab', label: 'Аҧсшәа', flag: 'AB', dir: 'ltr' },
			{ code: 'os', label: 'Ирон æвзаг', flag: 'OS', dir: 'ltr' },
		],
	},
	{
		region: 'West Asia',
		options: [
			{ code: 'ar', label: 'العربية', flag: 'SA', dir: 'rtl' },
			{ code: 'ar-PS', label: 'العربية (فلسطين)', flag: 'PS', dir: 'rtl' },
			{ code: 'fa', label: 'فارسی', flag: 'IR', dir: 'rtl' },
			{ code: 'he', label: 'עברית', flag: 'IL', dir: 'rtl' },
			{ code: 'ku', label: 'Kurdî', flag: 'KU', dir: 'ltr' },
			{ code: 'ps', label: 'پښتو', flag: 'AF', dir: 'rtl' },
			{ code: 'tr', label: 'Türkçe', flag: 'TR', dir: 'ltr' },
			{ code: 'hy', label: 'Հայերեն', flag: 'AM', dir: 'ltr' },
			{ code: 'ka', label: 'ქართული', flag: 'GE', dir: 'ltr' },
			{ code: 'az', label: 'Azərbaycan dili', flag: 'AZ', dir: 'ltr' },
			{ code: 'kk', label: 'Қазақ тілі', flag: 'KZ', dir: 'ltr' },
			{ code: 'ky', label: 'Кыргызча', flag: 'KG', dir: 'ltr' },
			{ code: 'tg', label: 'Тоҷикӣ', flag: 'TJ', dir: 'ltr' },
			{ code: 'tk', label: 'Türkmençe', flag: 'TM', dir: 'ltr' },
			{ code: 'uz', label: "O'zbek", flag: 'UZ', dir: 'ltr' },
		],
	},
	{
		region: 'South Asia',
		options: [
			{ code: 'hi', label: 'हिन्दी', flag: 'IN', dir: 'ltr' },
			{ code: 'bn', label: 'বাংলা', flag: 'BD', dir: 'ltr' },
			{ code: 'ta', label: 'தமிழ்', flag: 'IN', dir: 'ltr' },
			{ code: 'te', label: 'తెలుగు', flag: 'IN', dir: 'ltr' },
			{ code: 'mr', label: 'मराठी', flag: 'IN', dir: 'ltr' },
			{ code: 'gu', label: 'ગુજરાતી', flag: 'IN', dir: 'ltr' },
			{ code: 'ne', label: 'नेपाली', flag: 'NP', dir: 'ltr' },
			{ code: 'si', label: 'සිංහල', flag: 'LK', dir: 'ltr' },
			{ code: 'ur', label: 'اُردُو', flag: 'PK', dir: 'rtl' },
		],
	},
	{
		region: 'East Asia',
		options: [
			{ code: 'zh', label: '中文', flag: 'CN', dir: 'ltr' },
			{ code: 'zh-TW', label: '中文繁體', flag: 'TW', dir: 'ltr' },
			{ code: 'ja', label: '日本語', flag: 'JP', dir: 'ltr' },
			{ code: 'ko', label: '한국어', flag: 'KR', dir: 'ltr' },
		],
	},
	{
		region: 'Southeast Asia',
		options: [
			{ code: 'vi', label: 'Tiếng Việt', flag: 'VN', dir: 'ltr' },
			{ code: 'th', label: 'ไทย', flag: 'TH', dir: 'ltr' },
			{ code: 'id', label: 'Bahasa Indonesia', flag: 'ID', dir: 'ltr' },
			{ code: 'ms', label: 'Bahasa Melayu', flag: 'MY', dir: 'ltr' },
			{ code: 'tl', label: 'Filipino', flag: 'PH', dir: 'ltr' },
		],
	},
	{
		region: 'Africa',
		options: [
			{ code: 'sw', label: 'Kiswahili', flag: 'KE', dir: 'ltr' },
			{ code: 'am', label: 'አማርኛ', flag: 'ET', dir: 'ltr' },
			{ code: 'ha', label: 'Hausa', flag: 'NG', dir: 'ltr' },
			{ code: 'yo', label: 'Yorùbá', flag: 'NG', dir: 'ltr' },
			{ code: 'ig', label: 'Igbo', flag: 'NG', dir: 'ltr' },
			{ code: 'zu', label: 'isiZulu', flag: 'ZA', dir: 'ltr' },
			{ code: 'af', label: 'Afrikaans', flag: 'ZA', dir: 'ltr' },
			{ code: 'so', label: 'Soomaali', flag: 'SO', dir: 'ltr' },
			{ code: 'om', label: 'Oromoo', flag: 'ET', dir: 'ltr' },
			{ code: 'rw', label: 'Kinyarwanda', flag: 'RW', dir: 'ltr' },
		],
	},
	{
		region: 'Americas',
		options: [
			{ code: 'ht', label: 'Kreyòl Ayisyen', flag: 'HT', dir: 'ltr' },
			{ code: 'es-MX', label: 'Español (México)', flag: 'MX', dir: 'ltr' },
			{ code: 'es-AR', label: 'Español (Argentina)', flag: 'AR', dir: 'ltr' },
			{ code: 'es-UY', label: 'Español (Uruguay)', flag: 'UY', dir: 'ltr' },
			{ code: 'es-US', label: 'Español (EE.UU.)', flag: 'US', dir: 'ltr' },
			{ code: 'qu', label: 'Runa Simi', flag: 'PE', dir: 'ltr' },
			{ code: 'gn', label: "Avañe'ẽ", flag: 'PY', dir: 'ltr' },
		],
	},
];

const LANGUAGES = LANGUAGE_REGIONS.flatMap(group => group.options);
const LOCALE_PATH = 'locales';
const AVAILABLE_LOCALES = new Set(LANGUAGES.map(lang => lang.code));

const localeCache = Object.create(null);
let currentLang = 'en';
window.currentLang = currentLang;
const AUTO_TRANSLATION_CACHE_KEY = 'lyceon_auto_translation_cache_v1';
const AUTO_TRANSLATION_PREFILL_KEY = 'lyceon_auto_translation_prefill_done_v1';
const autoTranslationCache = (() => {
	try {
		const raw = localStorage.getItem(AUTO_TRANSLATION_CACHE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
})();

function persistAutoTranslationCache() {
	try {
		localStorage.setItem(AUTO_TRANSLATION_CACHE_KEY, JSON.stringify(autoTranslationCache));
	} catch {
		// Ignore storage write failures.
	}
}

function getTranslateTarget(code) {
	if (!code) return 'en';
	if (code === 'zh-TW') return 'zh-TW';
	return code.split('-')[0];
}

async function translateText(text, targetCode) {
	const clean = (text || '').trim();
	if (!clean) return clean;
	const target = getTranslateTarget(targetCode);
	if (target === 'en') return clean;

	autoTranslationCache[target] = autoTranslationCache[target] || {};
	if (autoTranslationCache[target][clean]) return autoTranslationCache[target][clean];

	try {
		const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(clean)}`;
		const response = await fetch(url);
		if (!response.ok) throw new Error('Auto translation failed');
		const data = await response.json();
		const translated = Array.isArray(data?.[0])
			? data[0].map(part => Array.isArray(part) ? (part[0] || '') : '').join('').trim()
			: '';
		const finalText = translated || clean;
		autoTranslationCache[target][clean] = finalText;
		persistAutoTranslationCache();
		return finalText;
	} catch {
		return clean;
	}
}

async function fillMissingLocaleKeys(code) {
	if (code === 'en') return;
	const english = localeCache.en || {};
	const target = localeCache[code] || {};

	const missingKeys = Object.keys(english).filter(key => !target[key] || target[key] === key);
	if (!missingKeys.length) return;

	await Promise.all(missingKeys.map(async (key) => {
		target[key] = await translateText(english[key], code);
	}));

	localeCache[code] = target;
}

async function prefillAllMissingLocaleKeysInBackground() {
	try {
		if (localStorage.getItem(AUTO_TRANSLATION_PREFILL_KEY) === '1') return;
		await loadLocale('en');
		for (const lang of LANGUAGES) {
			const code = normalizeLanguageCode(lang.code);
			if (code === 'en') continue;
			await loadLocale(code);
			await fillMissingLocaleKeys(code);
		}
		localStorage.setItem(AUTO_TRANSLATION_PREFILL_KEY, '1');
	} catch {
		// Ignore background prefill failures.
	}
}

function normalizeLanguageCode(code) {
	if (!code || typeof code !== 'string') return 'en';
	if (AVAILABLE_LOCALES.has(code)) return code;

	const base = code.split('-')[0];
	if (AVAILABLE_LOCALES.has(base)) return base;

	return 'en';
}

async function loadLocale(code) {
	const normalized = normalizeLanguageCode(code);
	if (localeCache[normalized]) return localeCache[normalized];

	try {
		const response = await fetch(`${LOCALE_PATH}/${normalized}.json`);
		if (!response.ok) throw new Error(`Locale not found: ${normalized}`);
		const data = await response.json();
		localeCache[normalized] = data;
		return data;
	} catch {
		if (normalized !== 'en') return loadLocale('en');
		localeCache.en = {};
		return localeCache.en;
	}
}

function t(key) {
	const current = localeCache[currentLang] || {};
	const fallback = localeCache.en || {};
	return current[key] || fallback[key] || key;
}

async function setLanguage(code) {
	const normalized = normalizeLanguageCode(code);
	const lang = LANGUAGES.find(item => item.code === normalized);
	if (!lang) return;

	await Promise.all([
		loadLocale('en'),
		normalized === 'en' ? Promise.resolve({}) : loadLocale(normalized),
	]);

	await fillMissingLocaleKeys(normalized);

	currentLang = normalized;
	window.currentLang = normalized;
	document.documentElement.lang = normalized;
	document.documentElement.dir = lang.dir || 'ltr';

	document.querySelectorAll('[data-i18n]').forEach(el => {
		const key = el.getAttribute('data-i18n');
		const value = t(key);

		if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
			el.placeholder = value;
		} else {
			el.textContent = value;
		}
	});

	const flagEl = document.getElementById('langFlag');
	const labelEl = document.getElementById('langLabel');
	// flagEl is an SVG globe — don't overwrite it with emoji
	if (labelEl) labelEl.textContent = lang.code.toUpperCase();

localStorage.setItem('lyceon_language', normalized);

        if (typeof window.onLanguageChanged === 'function') {
                window.onLanguageChanged(normalized);
        }

        void prefillAllMissingLocaleKeysInBackground();
}

window.translateText = translateText;

/* ── Language Picker UI ─────────────────────────────────────────── */
function buildLangPickerList(filter) {
        const list = document.getElementById('langPickerList');
        if (!list) return;
        const q = (filter || '').toLowerCase();
        let html = '';
        LANGUAGE_REGIONS.forEach(group => {
                const items = group.options.filter(o =>
                        !q || o.label.toLowerCase().includes(q) || o.code.toLowerCase().includes(q)
                );
                if (!items.length) return;
                html += `<div class="lang-picker-region">${group.region}</div>`;
                items.forEach(o => {
                        const active = o.code === currentLang ? ' active' : '';
                        const flagCode = (o.flag || o.code).toUpperCase().slice(0,2);
                        html += `<div class="lang-picker-item${active}" onclick="pickLanguage('${o.code}')">
                                <span class="lp-flag" style="font-size:11px;font-weight:700;background:var(--accent-glow);color:var(--accent);border-radius:4px;padding:1px 4px;min-width:22px;text-align:center">${flagCode}</span>
                                <span class="lp-label">${o.label}</span>
                                <span class="lp-code">${o.code.toUpperCase()}</span>
                        </div>`;
                });
        });
        list.innerHTML = html;
}

function getFlagEmoji(countryCode) {
        if (!countryCode || countryCode.length < 2) return '🌐';
        try {
                return String.fromCodePoint(
                        ...[...countryCode.toUpperCase().slice(0,2)].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
                );
        } catch { return '🌐'; }
}

window.toggleLangPicker = function() {
        const dd = document.getElementById('langPickerDropdown');
        if (!dd) return;
        const isHidden = dd.classList.contains('hidden');
        dd.classList.toggle('hidden');
        if (isHidden) {
                buildLangPickerList('');
                const inp = document.getElementById('langPickerSearch');
                if (inp) { inp.value = ''; inp.focus(); }
        }
};

window.filterLangPicker = function(val) {
        buildLangPickerList(val);
};

window.pickLanguage = async function(code) {
        await setLanguage(code);
        const dd = document.getElementById('langPickerDropdown');
        if (dd) dd.classList.add('hidden');
};

/* Close picker when clicking outside */
document.addEventListener('click', function(e) {
        const btn = document.getElementById('langPickerBtn');
        const dd = document.getElementById('langPickerDropdown');
        if (!dd || dd.classList.contains('hidden')) return;
        if (!dd.contains(e.target) && e.target !== btn && !btn?.contains(e.target)) {
                dd.classList.add('hidden');
        }
});

/* Init language from localStorage on DOMContentLoaded */
window.addEventListener('DOMContentLoaded', async () => {
        const saved = localStorage.getItem('lyceon_language');
        const browserLang = (navigator.language || 'en').split('-')[0];
        const lang = saved || browserLang || 'en';
        await setLanguage(normalizeLanguageCode(lang));
});
