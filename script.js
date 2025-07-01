            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>📅 Запланировать тренировку</h2>
                <p>Выберите календарь для добавления напоминания:</p>
                <div style="display: flex; gap: 1rem; flex-direction: column;">
                    <a href="${googleUrl}" target="_blank" style="background: var(--accent-primary); color: white; padding: 0.75rem 1rem; text-decoration: none; border-radius: 8px; text-align: center;">📅 Google Calendar</a>
                    <a href="${outlookUrl}" target="_blank" style="background: var(--accent-secondary); color: white; padding: 0.75rem 1rem; text-decoration: none; border-radius: 8px; text-align: center;">📅 Outlook Calendar</a>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer;">Отмена</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(calendarDialog);
    }

    generateGoogleCalendarUrl(event) {
        const startTime = event.start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const endTime = new Date(event.start.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}`;
    }

    generateOutlookCalendarUrl(event) {
        const startTime = event.start.toISOString();
        const endTime = new Date(event.start.getTime() + 60 * 60 * 1000).toISOString();
        
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${startTime}&enddt=${endTime}&body=${encodeURIComponent(event.description)}`;
    }

    startNewSession() {
        // Reset all data
        this.currentDay = 1;
        this.sessionData = {
            messages: [],
            exercises: [],
            responses: [],
            startTime: null,
            endTime: null
        };
        
        // Show initial sections
        document.getElementById('analysis-section').style.display = 'none';
        document.getElementById('language-section').style.display = 'block';
        document.getElementById('level-section').style.display = 'none';
        document.getElementById('chat-section').style.display = 'none';
        
        // Reset selections
        document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
        this.currentLevel = null;
        
        // Clear chat
        document.getElementById('chat-messages').innerHTML = '';
        document.getElementById('user-input').value = '';
        
        // Show language prompt again
        this.showLanguagePrompt();
    }

    saveProgress() {
        const progressData = {
            interfaceLanguage: this.currentLanguage,
            communicationLanguage: this.communicationLanguage,
            level: this.currentLevel,
            sessionData: this.sessionData,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('irony-trainer-progress', JSON.stringify(progressData));
        this.showNotification('Прогресс сохранен', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? 'var(--accent-success)' : type === 'error' ? 'var(--accent-secondary)' : 'var(--accent-primary)'};
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Modal functions
function showAbout() {
    document.getElementById('about-modal').style.display = 'flex';
}

function hideAbout() {
    document.getElementById('about-modal').style.display = 'none';
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.trainer = new IronyTrainer();
});

// Add necessary CSS animations
const style = document.createElement('style');
style.textContent = `
    .floating-cloud {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    }

    .cloud-phrase {
        position: absolute;
        color: rgba(255, 255, 255, 0.1);
        font-size: 1.2rem;
        font-weight: 300;
        animation: float 10s infinite linear;
        user-select: none;
    }

    @keyframes float {
        0% { transform: translateY(100vh) rotate(0deg); }
        100% { transform: translateY(-100px) rotate(360deg); }
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);