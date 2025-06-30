                    <div style="display: flex; gap: 1rem; flex-direction: column;">
                        <a href="${googleUrl}" target="_blank" style="background: var(--accent-primary); color: white; padding: 0.75rem 1rem; text-decoration: none; border-radius: 8px; text-align: center;">📅 Google Calendar</a>
                        <a href="${outlookUrl}" target="_blank" style="background: var(--accent-secondary); color: white; padding: 0.75rem 1rem; text-decoration: none; border-radius: 8px; text-align: center;">📅 Outlook Calendar</a>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer;">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(calendarDialog);
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
        document.getElementById('level-section').style.display = 'block';
        
        // Reset selections
        document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
        this.currentLevel = null;
        
        // Clear chat
        document.getElementById('chat-messages').innerHTML = '';
        document.getElementById('user-input').value = '';
    }
}

// Initialize the trainer when page loads
document.addEventListener('DOMContentLoaded', () => {
    new IronyTrainer();
});