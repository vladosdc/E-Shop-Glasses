"use client"
import { useEffect, useState } from "react";

const GoogleTranslate = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        setIsMounted(true);

        // При загрузке страницы проверяем куки Гугла, чтобы наш селект показывал правильный язык
        const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
        if (match && match[1]) {
            const lang = match[1].split('/')[2];
            if (lang) setCurrentLang(lang);
        }

        if (!document.getElementById("google-translate-script")) {
            const hiddenDiv = document.createElement("div");
            hiddenDiv.id = "hidden_google_translate";
            hiddenDiv.style.display = "none";
            document.body.appendChild(hiddenDiv);

            (window as any).googleTranslateElementInit = () => {
                new (window as any).google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        // Убрали 'en' отсюда, Гуглу он тут не нужен
                        includedLanguages: 'ru,uk,de,fr,es,it,pl', 
                        autoDisplay: false,
                    },
                    'hidden_google_translate'
                );
            };

            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }

        const observer = new MutationObserver(() => {
            const isTranslated = document.documentElement.classList.contains('translated-ltr') || document.documentElement.classList.contains('translated-rtl');
            if (!isTranslated && currentLang !== 'en') {
                setCurrentLang('en');
            }
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        const handleSync = (e: any) => setCurrentLang(e.detail);
        window.addEventListener('syncLang', handleSync);

        return () => {
            observer.disconnect();
            window.removeEventListener('syncLang', handleSync);
        };
    }, [currentLang]);

    if (!isMounted) return null;

    const changeLanguage = (lang: string) => {
        setCurrentLang(lang);
        window.dispatchEvent(new CustomEvent('syncLang', { detail: lang }));
        
        // ==========================================
        // АБСОЛЮТНЫЙ СБРОС: Возврат на English
        // ==========================================
        if (lang === 'en') {
            // Удаляем все куки Гугла (чтобы он забыл, что мы переводили сайт)
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
            
            // Быстро перезагружаем страницу (вычищает все баги DOM и возвращает шапку на место)
            window.location.reload();
            return;
        }

        // Если выбран другой язык — командуем скрытому селекту Гугла перевести
        const googleSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (googleSelect) {
            googleSelect.value = lang; 
            googleSelect.dispatchEvent(new Event("change"));
        }
    };

    return (
        <select 
            value={currentLang}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor: '#f8f9fa',
                outline: 'none',
                color: '#000',
                marginRight: '15px',
                fontFamily: 'inherit'
            }}
        >
            <option value="en">English</option>
            <option value="ru">Русский</option>
            <option value="uk">Українська</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="it">Italiano</option>
            <option value="pl">Polski</option>
        </select>
    );
};

export default GoogleTranslate;