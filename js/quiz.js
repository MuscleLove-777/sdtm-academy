/* ============================================
   SDTM Academy - Quiz Engine
   ============================================ */

const Quiz = {
    currentQuiz: null,
    currentModuleId: null,
    answers: {},
    submitted: false,

    /**
     * Start a quiz for a given module
     */
    start(moduleId, questions) {
        this.currentModuleId = moduleId;
        this.currentQuiz = questions;
        this.answers = {};
        this.submitted = false;
        this.render();
    },

    /**
     * Render the quiz
     */
    render() {
        const container = document.getElementById('quizView');
        if (!this.currentQuiz || this.currentQuiz.length === 0) {
            container.innerHTML = '<p>このモジュールにはクイズがありません。</p>';
            return;
        }

        const totalQ = this.currentQuiz.length;
        const answeredQ = Object.keys(this.answers).length;

        let html = `
            <div class="quiz-container fade-in">
                <div class="quiz-header">
                    <h2>理解度チェック</h2>
                    <div class="quiz-progress">
                        <span>${answeredQ} / ${totalQ} 問回答済み</span>
                        <div class="quiz-progress-bar">
                            <div class="quiz-progress-fill" style="width:${(answeredQ/totalQ)*100}%"></div>
                        </div>
                    </div>
                </div>
        `;

        this.currentQuiz.forEach((q, idx) => {
            html += this.renderQuestion(q, idx);
        });

        html += `
                <div class="quiz-actions">
                    ${!this.submitted ? `
                        <button class="btn btn-primary btn-lg" onclick="Quiz.submit()">
                            採点する
                        </button>
                    ` : `
                        <button class="btn btn-success btn-lg" onclick="Quiz.finish()">
                            結果を確認して次へ
                        </button>
                    `}
                    <button class="btn btn-outline" onclick="App.showModule(${this.currentModuleId})">
                        学習に戻る
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Restore selections
        if (!this.submitted) {
            Object.entries(this.answers).forEach(([qId, val]) => {
                const q = this.currentQuiz.find(q => q.id === qId);
                if (q && q.type === 'fill') {
                    const input = document.querySelector(`input[data-qid="${qId}"]`);
                    if (input) input.value = val;
                }
            });
        }
    },

    /**
     * Render a single question
     */
    renderQuestion(q, idx) {
        const isAnswered = this.answers[q.id] !== undefined;
        let html = `
            <div class="quiz-question" id="quiz-q-${q.id}">
                <div class="quiz-question-num">問題 ${idx + 1}</div>
                <div class="quiz-question-text">${q.question}</div>
        `;

        if (q.type === 'choice') {
            html += '<div class="quiz-options">';
            const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
            q.options.forEach((opt, optIdx) => {
                let optClass = 'quiz-option';
                if (this.submitted) {
                    if (optIdx === q.answer) {
                        optClass += ' correct';
                    } else if (this.answers[q.id] === optIdx && optIdx !== q.answer) {
                        optClass += ' incorrect';
                    }
                } else if (this.answers[q.id] === optIdx) {
                    optClass += ' selected';
                }

                html += `
                    <div class="${optClass}" onclick="${this.submitted ? '' : `Quiz.selectOption('${q.id}', ${optIdx})`}">
                        <div class="quiz-option-marker">${labels[optIdx]}</div>
                        <div>${opt}</div>
                    </div>
                `;
            });
            html += '</div>';
        } else if (q.type === 'fill') {
            html += `
                <div class="quiz-fill-blank">
                    <input type="text" data-qid="${q.id}"
                           placeholder="回答を入力..."
                           ${this.submitted ? 'disabled' : ''}
                           onchange="Quiz.fillAnswer('${q.id}', this.value)"
                           ${this.submitted && this.answers[q.id] !== undefined ? `value="${this.answers[q.id]}"` : ''}>
                    ${this.submitted ? `<div style="margin-top:8px;font-size:0.9rem;">
                        正解: <strong style="color:var(--success)">${q.answer}</strong>
                    </div>` : ''}
                </div>
            `;
        }

        // Explanation (shown after submit)
        html += `
                <div class="quiz-explanation ${this.submitted ? 'show' : ''}">
                    <strong>解説:</strong> ${q.explanation || ''}
                </div>
            </div>
        `;

        return html;
    },

    /**
     * Select an option for a choice question
     */
    selectOption(qId, optIdx) {
        if (this.submitted) return;
        this.answers[qId] = optIdx;
        this.render();
    },

    /**
     * Fill in an answer for a fill-blank question
     */
    fillAnswer(qId, value) {
        if (this.submitted) return;
        this.answers[qId] = value.trim();
    },

    /**
     * Submit the quiz for grading
     */
    submit() {
        // Collect fill-blank answers from inputs
        this.currentQuiz.forEach(q => {
            if (q.type === 'fill') {
                const input = document.querySelector(`input[data-qid="${q.id}"]`);
                if (input && input.value.trim()) {
                    this.answers[q.id] = input.value.trim();
                }
            }
        });

        const unanswered = this.currentQuiz.filter(q => this.answers[q.id] === undefined);
        if (unanswered.length > 0) {
            if (!confirm(`未回答の問題が ${unanswered.length} 問あります。このまま採点しますか？`)) {
                return;
            }
        }

        this.submitted = true;
        const result = this.calculateScore();
        this.render();
        this.showResult(result);
    },

    /**
     * Calculate the quiz score
     */
    calculateScore() {
        let correct = 0;
        const total = this.currentQuiz.length;

        this.currentQuiz.forEach(q => {
            if (q.type === 'choice') {
                if (this.answers[q.id] === q.answer) {
                    correct++;
                }
            } else if (q.type === 'fill') {
                const userAnswer = (this.answers[q.id] || '').toUpperCase().trim();
                const correctAnswer = q.answer.toUpperCase().trim();
                if (userAnswer === correctAnswer) {
                    correct++;
                }
            }
        });

        return {
            correct,
            total,
            percentage: Math.round((correct / total) * 100),
            passed: (correct / total) >= 0.8
        };
    },

    /**
     * Show the result modal
     */
    showResult(result) {
        const modal = document.getElementById('modalContent');
        const overlay = document.getElementById('modalOverlay');

        modal.innerHTML = `
            <h2>${result.passed ? '🎉 合格！' : '📝 もう少し！'}</h2>
            <div class="score-circle ${result.passed ? 'pass' : 'fail'}">
                ${result.percentage}%
            </div>
            <p>
                ${result.total}問中 <strong>${result.correct}問</strong> 正解
                ${result.passed
                    ? '<br>素晴らしい！このモジュールをマスターしました。'
                    : '<br>合格ラインは80%です。解説を確認して再挑戦しましょう。'}
            </p>
            <div class="modal-actions">
                ${result.passed ? `
                    <button class="btn btn-success" onclick="Quiz.completeAndNext()">次のモジュールへ</button>
                ` : `
                    <button class="btn btn-primary" onclick="Quiz.retry()">再挑戦する</button>
                `}
                <button class="btn btn-outline" onclick="Quiz.closeModal()">解説を確認</button>
            </div>
        `;

        overlay.style.display = 'flex';

        // Save result
        if (result.passed) {
            App.completeModule(this.currentModuleId);
        }
        App.saveQuizResult(this.currentModuleId, result);
    },

    /**
     * Close the modal
     */
    closeModal() {
        document.getElementById('modalOverlay').style.display = 'none';
    },

    /**
     * Retry the quiz
     */
    retry() {
        this.closeModal();
        this.answers = {};
        this.submitted = false;
        this.render();
        document.getElementById('quizView').scrollTop = 0;
    },

    /**
     * Complete module and go to next
     */
    completeAndNext() {
        this.closeModal();
        App.goToNextModule(this.currentModuleId);
    },

    /**
     * Finish reviewing and go to next
     */
    finish() {
        const result = this.calculateScore();
        if (result.passed) {
            App.goToNextModule(this.currentModuleId);
        } else {
            this.showResult(result);
        }
    }
};
