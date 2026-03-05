/* ============================================
   SDTM Academy - Interactive Exercises Engine
   ============================================ */

const Exercises = {

    /**
     * Create a drag-and-drop mapping exercise
     * @param {string} containerId - DOM element ID to render into
     * @param {Object} config - { title, sourceLabel, targetLabel, items: [{source, target}] }
     */
    createMappingExercise(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const shuffledItems = [...config.items].sort(() => Math.random() - 0.5);
        const state = { mappings: {}, dragItem: null };

        const render = () => {
            let html = `
                <div style="margin-bottom:16px;">
                    <h3>${config.title}</h3>
                    <p style="color:var(--text-secondary);font-size:0.9rem;">
                        左側の項目を右側の対応する項目にドラッグ＆ドロップしてください。
                    </p>
                </div>
                <div class="exercise-mapping">
                    <div class="mapping-source">
                        <h4>${config.sourceLabel || 'Raw/CRFデータ'}</h4>
            `;

            shuffledItems.forEach((item, idx) => {
                const isMapped = Object.values(state.mappings).includes(idx);
                html += `
                    <div class="drag-item ${isMapped ? 'dragging' : ''}"
                         draggable="${!isMapped}"
                         ondragstart="Exercises._onDragStart(event, ${idx})"
                         id="drag-${containerId}-${idx}">
                        ${item.source}
                    </div>
                `;
            });

            html += `
                    </div>
                    <div class="mapping-target">
                        <h4>${config.targetLabel || 'SDTM変数'}</h4>
            `;

            config.items.forEach((item, idx) => {
                const mappedSourceIdx = state.mappings[idx];
                const isFilled = mappedSourceIdx !== undefined;
                const isCorrect = isFilled && shuffledItems[mappedSourceIdx].target === item.target;

                html += `
                    <div class="drop-zone ${isFilled ? 'filled' : ''}"
                         ondragover="Exercises._onDragOver(event)"
                         ondragleave="Exercises._onDragLeave(event)"
                         ondrop="Exercises._onDrop(event, '${containerId}', ${idx})"
                         id="drop-${containerId}-${idx}">
                        <span class="drop-zone-label">${item.target}</span>
                        ${isFilled ? `
                            <span class="drop-zone-value" style="color:${state.submitted ? (isCorrect ? 'var(--success)' : 'var(--danger)') : 'var(--text)'}">
                                ${state.submitted ? (isCorrect ? '✓ ' : '✗ ') : ''}${shuffledItems[mappedSourceIdx].source}
                            </span>
                        ` : '<span style="color:var(--text-secondary);font-size:0.82rem;">ここにドロップ</span>'}
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
                <div style="margin-top:16px;display:flex;gap:12px;">
                    <button class="btn btn-primary" onclick="Exercises._checkMapping('${containerId}')">
                        答え合わせ
                    </button>
                    <button class="btn btn-outline" onclick="Exercises._resetMapping('${containerId}')">
                        リセット
                    </button>
                </div>
                <div id="${containerId}-result" style="margin-top:12px;"></div>
            `;

            container.innerHTML = html;
        };

        // Store state and config on the container
        container._exerciseState = state;
        container._exerciseConfig = config;
        container._shuffledItems = shuffledItems;
        container._render = render;

        render();
    },

    // Drag & Drop handlers
    _onDragStart(event, idx) {
        event.dataTransfer.setData('text/plain', idx.toString());
        event.dataTransfer.effectAllowed = 'move';
    },

    _onDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        event.currentTarget.classList.add('drag-over');
    },

    _onDragLeave(event) {
        event.currentTarget.classList.remove('drag-over');
    },

    _onDrop(event, containerId, targetIdx) {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');

        const sourceIdx = parseInt(event.dataTransfer.getData('text/plain'));
        const container = document.getElementById(containerId);
        const state = container._exerciseState;

        // Remove previous mapping if source was already mapped
        Object.keys(state.mappings).forEach(key => {
            if (state.mappings[key] === sourceIdx) {
                delete state.mappings[key];
            }
        });

        state.mappings[targetIdx] = sourceIdx;
        container._render();
    },

    _checkMapping(containerId) {
        const container = document.getElementById(containerId);
        const state = container._exerciseState;
        const config = container._exerciseConfig;
        const shuffled = container._shuffledItems;

        state.submitted = true;
        container._render();

        let correct = 0;
        config.items.forEach((item, idx) => {
            const mappedIdx = state.mappings[idx];
            if (mappedIdx !== undefined && shuffled[mappedIdx].target === item.target) {
                correct++;
            }
        });

        const total = config.items.length;
        const resultDiv = document.getElementById(`${containerId}-result`);
        resultDiv.innerHTML = `
            <div class="info-box ${correct === total ? 'success' : 'warning'}">
                <div class="info-box-title">${correct === total ? '🎉 全問正解！' : '結果'}</div>
                ${total}問中 ${correct}問正解 (${Math.round(correct/total*100)}%)
                ${correct < total ? '<br>赤い項目を確認して、正しいマッピングを覚えましょう。' : ''}
            </div>
        `;
    },

    _resetMapping(containerId) {
        const container = document.getElementById(containerId);
        const state = container._exerciseState;
        state.mappings = {};
        state.submitted = false;
        container._render();
        const resultDiv = document.getElementById(`${containerId}-result`);
        if (resultDiv) resultDiv.innerHTML = '';
    },

    /**
     * Create a code fill-in-the-blank exercise
     * @param {string} containerId
     * @param {Object} config - { title, language, codeTemplate, blanks: [{id, answer, hint}] }
     */
    createCodeFillExercise(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let codeHtml = config.codeTemplate;
        config.blanks.forEach(blank => {
            codeHtml = codeHtml.replace(
                `__${blank.id}__`,
                `<input type="text" class="code-fill-input" data-blank-id="${blank.id}"
                        placeholder="${blank.hint || '???'}"
                        style="width:${Math.max(blank.answer.length * 10, 80)}px;
                               font-family:Consolas,monospace;font-size:0.88rem;
                               padding:2px 6px;border:2px solid var(--accent);border-radius:4px;
                               background:var(--bg-card);color:var(--text);">`
            );
        });

        container.innerHTML = `
            <div style="margin-bottom:12px;">
                <h3>${config.title}</h3>
                <p style="color:var(--text-secondary);font-size:0.9rem;">
                    空欄に適切なコードを入力してください。
                </p>
            </div>
            <div class="code-block">
                <div class="code-block-header">
                    <span class="code-lang">${config.language}</span>
                </div>
                <pre style="padding:16px;margin:0;background:#1e1e1e;color:#d4d4d4;overflow-x:auto;line-height:1.8;">${codeHtml}</pre>
            </div>
            <div style="margin-top:12px;display:flex;gap:12px;">
                <button class="btn btn-primary" onclick="Exercises._checkCodeFill('${containerId}')">
                    答え合わせ
                </button>
                <button class="btn btn-outline" onclick="Exercises._showCodeAnswers('${containerId}')">
                    答えを見る
                </button>
            </div>
            <div id="${containerId}-result" style="margin-top:12px;"></div>
        `;

        container._blanksConfig = config.blanks;
    },

    _checkCodeFill(containerId) {
        const container = document.getElementById(containerId);
        const blanks = container._blanksConfig;
        let correct = 0;

        blanks.forEach(blank => {
            const input = container.querySelector(`input[data-blank-id="${blank.id}"]`);
            if (input) {
                const userVal = input.value.trim().toUpperCase();
                const correctVal = blank.answer.toUpperCase();
                if (userVal === correctVal) {
                    correct++;
                    input.style.borderColor = 'var(--success)';
                    input.style.background = 'var(--success-light)';
                } else {
                    input.style.borderColor = 'var(--danger)';
                    input.style.background = 'var(--danger-light)';
                }
            }
        });

        const resultDiv = document.getElementById(`${containerId}-result`);
        resultDiv.innerHTML = `
            <div class="info-box ${correct === blanks.length ? 'success' : 'warning'}">
                <div class="info-box-title">${correct === blanks.length ? '🎉 全問正解！' : '結果'}</div>
                ${blanks.length}箇所中 ${correct}箇所正解
            </div>
        `;
    },

    _showCodeAnswers(containerId) {
        const container = document.getElementById(containerId);
        const blanks = container._blanksConfig;

        blanks.forEach(blank => {
            const input = container.querySelector(`input[data-blank-id="${blank.id}"]`);
            if (input) {
                input.value = blank.answer;
                input.style.borderColor = 'var(--success)';
                input.style.background = 'var(--success-light)';
            }
        });
    },

    /**
     * Create a variable classification exercise
     * @param {string} containerId
     * @param {Object} config - { title, variables: [{name, correctRole}], roles: ["Identifier","Topic",...] }
     */
    createClassificationExercise(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const state = { selections: {}, submitted: false };

        const render = () => {
            let html = `
                <div style="margin-bottom:16px;">
                    <h3>${config.title}</h3>
                    <p style="color:var(--text-secondary);font-size:0.9rem;">
                        各変数の正しいロールを選択してください。
                    </p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>変数名</th>
                            <th>ロール</th>
                            ${state.submitted ? '<th>結果</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
            `;

            config.variables.forEach(v => {
                const isCorrect = state.submitted && state.selections[v.name] === v.correctRole;
                const isWrong = state.submitted && state.selections[v.name] !== v.correctRole;
                html += `
                    <tr>
                        <td><code>${v.name}</code></td>
                        <td>
                            <select onchange="Exercises._classifySelect('${containerId}','${v.name}',this.value)"
                                    ${state.submitted ? 'disabled' : ''}
                                    style="padding:6px 10px;border:2px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--danger)' : 'var(--border)'};border-radius:6px;background:var(--bg-card);color:var(--text);font-size:0.9rem;">
                                <option value="">選択...</option>
                                ${config.roles.map(r => `
                                    <option value="${r}" ${state.selections[v.name] === r ? 'selected' : ''}>${r}</option>
                                `).join('')}
                            </select>
                        </td>
                        ${state.submitted ? `
                            <td style="color:${isCorrect ? 'var(--success)' : 'var(--danger)'}">
                                ${isCorrect ? '✓ 正解' : `✗ 正解: ${v.correctRole}`}
                            </td>
                        ` : ''}
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
                <div style="margin-top:12px;display:flex;gap:12px;">
                    ${!state.submitted ? `
                        <button class="btn btn-primary" onclick="Exercises._checkClassification('${containerId}')">答え合わせ</button>
                    ` : `
                        <button class="btn btn-outline" onclick="Exercises._resetClassification('${containerId}')">もう一度</button>
                    `}
                </div>
            `;

            container.innerHTML = html;
        };

        container._classState = state;
        container._classConfig = config;
        container._render = render;
        render();
    },

    _classifySelect(containerId, varName, role) {
        const container = document.getElementById(containerId);
        container._classState.selections[varName] = role;
    },

    _checkClassification(containerId) {
        const container = document.getElementById(containerId);
        container._classState.submitted = true;
        container._render();
    },

    _resetClassification(containerId) {
        const container = document.getElementById(containerId);
        container._classState.selections = {};
        container._classState.submitted = false;
        container._render();
    }
};
