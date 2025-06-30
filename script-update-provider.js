    selectProvider(providerType) {
        // Update selected state
        document.querySelectorAll('.provider-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.provider === providerType);
        });

        // Provider instructions
        const instructions = {
            openai: {
                title: '🚀 OpenAI API',
                steps: [
                    '1. Перейдите на <a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com/api-keys</a>',
                    '2. Войдите в аккаунт или зарегистрируйтесь',
                    '3. Нажмите "Create new secret key"',
                    '4. Скопируйте ключ (начинается с sk-...)',
                    '⚠️ <strong>Важно:</strong> Нужно пополнить баланс ($5-10) для использования API'
                ],
                placeholder: 'sk-...'
            },
            anthropic: {
                title: '🧠 Anthropic Claude API',
                steps: [
                    '1. Перейдите на <a href="https://console.anthropic.com/" target="_blank">console.anthropic.com</a>',
                    '2. Создайте аккаунт или войдите',
                    '3. В разделе "API Keys" нажмите "Create Key"',
                    '4. Скопируйте ключ (начинается с sk-ant-...)',
                    '🎁 <strong>Бонус:</strong> $5 бесплатно при регистрации!'
                ],
                placeholder: 'sk-ant-...'
            },
            google: {
                title: '🌟 Google Gemini API',
                steps: [
                    '1. Перейдите на <a href="https://aistudio.google.com/app/apikey" target="_blank">aistudio.google.com/app/apikey</a>',
                    '2. Войдите через Google аккаунт',
                    '3. Нажмите "Create API Key"',
                    '4. Скопируйте ключ',
                    '✅ <strong>Плюс:</strong> Щедрый бесплатный лимит!'
                ],
                placeholder: 'AI...'
            },
            ollama: {
                title: '🏠 Ollama (Локальные модели)',
                steps: [
                    '1. Скачайте с <a href="https://ollama.ai/" target="_blank">ollama.ai</a>',
                    '2. Установите и запустите: <code>ollama serve</code>',
                    '3. Скачайте модель: <code>ollama pull llama3.2</code>',
                    '4. API ключ не нужен - все работает локально!',
                    '🔒 <strong>Приватность:</strong> Данные не покидают ваш компьютер'
                ],
                placeholder: 'Не требуется'
            }
        };

        const instruction = instructions[providerType];
        
        // Show API key section for non-local providers
        if (providerType === 'ollama') {
            // Show instructions but skip API key input
            this.showProviderInstructions(instruction);
            this.initializeProvider(providerType, 'local');
            document.getElementById('api-section').style.display = 'none';
            document.getElementById('level-section').style.display = 'block';
        } else {
            // Show instructions and API key input
            this.showProviderInstructions(instruction);
            document.getElementById('api-section').style.display = 'block';
            
            // Update API key placeholder
            const apiInput = document.getElementById('api-key');
            apiInput.placeholder = instruction.placeholder;
        }

        this.selectedProviderType = providerType;
        localStorage.setItem('irony-trainer-provider', providerType);
    }

    showProviderInstructions(instruction) {
        // Find or create instructions container
        let instructionsContainer = document.getElementById('provider-instructions');
        if (!instructionsContainer) {
            instructionsContainer = document.createElement('div');
            instructionsContainer.id = 'provider-instructions';
            instructionsContainer.className = 'provider-instructions';
            
            // Insert after provider selection
            const providerSection = document.getElementById('provider-section');
            providerSection.appendChild(instructionsContainer);
        }

        instructionsContainer.innerHTML = `
            <div class="instruction-card">
                <h3>${instruction.title}</h3>
                <div class="instruction-steps">
                    ${instruction.steps.map(step => `<p>${step}</p>`).join('')}
                </div>
            </div>
        `;

        instructionsContainer.style.display = 'block';
    }