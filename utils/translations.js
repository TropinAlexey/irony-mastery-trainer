// Translations and Language Cloud Data
const IronyTranslations = {
    // Floating cloud phrases "Art of Irony" in different languages
    cloudPhrases: [
        { text: "Искусство иронии", lang: "ru", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Art of Irony", lang: "en", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Мистецтво іронії", lang: "uk", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Arte de la ironía", lang: "es", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "L'art de l'ironie", lang: "fr", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Die Kunst der Ironie", lang: "de", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Arte dell'ironia", lang: "it", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "アイロニーの芸術", lang: "ja", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "讽刺艺术", lang: "zh", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "아이러니의 예술", lang: "ko", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "فن المفارقة", lang: "ar", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Kala ya dhihaka", lang: "sw", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "A arte da ironia", lang: "pt", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Ironie sanatı", lang: "tr", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "हास्य कला", lang: "hi", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Sztuka ironii", lang: "pl", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Umění ironie", lang: "cs", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Ars ironiae", lang: "la", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Ironia művészete", lang: "hu", x: Math.random() * 100, y: Math.random() * 100 },
        { text: "Iroonin taite", lang: "fi", x: Math.random() * 100, y: Math.random() * 100 }
    ],

    // Interface translations
    interface: {
        ru: {
            title: "🎭 Irony Mastery Trainer",
            subtitle: "Развивайте остроумие, иронию и элегантное общение",
            chooseLanguage: "🌍 Выберите язык",
            chooseProvider: "🤖 Выберите AI провайдера",
            apiKey: "🔑 API ключ",
            apiKeyPlaceholder: "Введите ваш API ключ",
            apiKeyNote: "Ключ сохраняется только в вашем браузере и не передается третьим лицам",
            save: "💾 Сохранить",
            chooseLevel: "📊 Выберите уровень сложности",
            beginner: "Начинающий",
            intermediate: "Средний", 
            advanced: "Продвинутый",
            beginnerDesc: "Основы иронии и юмора",
            intermediateDesc: "Развитие остроумия",
            advancedDesc: "Мастерство элегантной иронии",
            trainingSession: "💬 Тренировочная сессия",
            newSession: "🔄 Новая сессия",
            saveProgress: "💾 Сохранить прогресс",
            inputPlaceholder: "Введите ваш ответ...",
            send: "📤 Отправить",
            analysis: "📈 Анализ сессии",
            export: "📄 Экспорт результатов",
            schedule: "📅 Запланировать следующую сессию",
            restart: "🔄 Начать заново"
        },
        en: {
            title: "🎭 Irony Mastery Trainer", 
            subtitle: "Develop wit, irony and elegant communication",
            chooseLanguage: "🌍 Choose Language",
            chooseProvider: "🤖 Choose AI Provider",
            apiKey: "🔑 API Key",
            apiKeyPlaceholder: "Enter your API key",
            apiKeyNote: "Key is stored only in your browser and not shared with third parties",
            save: "💾 Save",
            chooseLevel: "📊 Choose Difficulty Level",
            beginner: "Beginner",
            intermediate: "Intermediate",
            advanced: "Advanced", 
            beginnerDesc: "Basics of irony and humor",
            intermediateDesc: "Developing wit",
            advancedDesc: "Mastery of elegant irony",
            trainingSession: "💬 Training Session",
            newSession: "🔄 New Session",
            saveProgress: "💾 Save Progress",
            inputPlaceholder: "Enter your response...",
            send: "📤 Send",
            analysis: "📈 Session Analysis",
            export: "📄 Export Results",
            schedule: "📅 Schedule Next Session",
            restart: "🔄 Start Over"
        },
        uk: {
            title: "🎭 Irony Mastery Trainer",
            subtitle: "Розвивайте дотепність, іронію та елегантне спілкування", 
            chooseLanguage: "🌍 Оберіть мову",
            chooseProvider: "🤖 Оберіть AI провайдера",
            apiKey: "🔑 API ключ",
            apiKeyPlaceholder: "Введіть ваш API ключ",
            apiKeyNote: "Ключ зберігається тільки у вашому браузері і не передається третім особам",
            save: "💾 Зберегти",
            chooseLevel: "📊 Оберіть рівень складності",
            beginner: "Початківець",
            intermediate: "Середній",
            advanced: "Просунутий",
            beginnerDesc: "Основи іронії та гумору",
            intermediateDesc: "Розвиток дотепності", 
            advancedDesc: "Майстерність елегантної іронії",
            trainingSession: "💬 Тренувальна сесія",
            newSession: "🔄 Нова сесія",
            saveProgress: "💾 Зберегти прогрес",
            inputPlaceholder: "Введіть вашу відповідь...",
            send: "📤 Відправити",
            analysis: "📈 Аналіз сесії",
            export: "📄 Експорт результатів",
            schedule: "📅 Запланувати наступну сесію",
            restart: "🔄 Почати спочатку"
        }
    },

    // Get translation by key and language
    get(lang, key) {
        const translations = this.interface[lang] || this.interface.en;
        return translations[key] || this.interface.en[key] || key;
    },

    // Detect language from user input
    detectLanguage(text) {
        // Simple language detection based on character patterns
        if (/[а-яё]/i.test(text) && /[і]/i.test(text)) return 'uk';
        if (/[а-яё]/i.test(text)) return 'ru';
        if (/[一-龯]/i.test(text)) return 'zh';
        if (/[ひらがなカタカナ]/i.test(text)) return 'ja';
        if (/[가-힣]/i.test(text)) return 'ko';
        if (/[ء-ي]/i.test(text)) return 'ar';
        if (/[à-ÿ]/i.test(text) && /\b(le|la|de|du)\b/i.test(text)) return 'fr';
        if (/[à-ÿ]/i.test(text) && /\b(el|la|de|del)\b/i.test(text)) return 'es';
        if (/[ä-ÿ]/i.test(text) && /\b(der|die|das|und)\b/i.test(text)) return 'de';
        if (/\b(the|and|or|but|with)\b/i.test(text)) return 'en';
        
        return 'auto'; // Let AI determine the language
    },

    // Get all supported interface languages
    getSupportedLanguages() {
        return Object.keys(this.interface);
    },

    // Add random movement to cloud phrases for animation
    updateCloudPositions() {
        this.cloudPhrases.forEach(phrase => {
            phrase.x += (Math.random() - 0.5) * 0.5;
            phrase.y += (Math.random() - 0.5) * 0.5;
            
            // Keep within bounds
            if (phrase.x < 0) phrase.x = 100;
            if (phrase.x > 100) phrase.x = 0;
            if (phrase.y < 0) phrase.y = 100;
            if (phrase.y > 100) phrase.y = 0;
        });
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IronyTranslations;
} else {
    window.IronyTranslations = IronyTranslations;
}