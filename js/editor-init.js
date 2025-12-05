// 数学公式编辑器初始化
const mathInput = document.getElementById('math-input');
const mathPreview = document.getElementById('math-preview');
const latexOutput = document.getElementById('latex-output');

// 当DOM加载完成后初始化编辑器
document.addEventListener('DOMContentLoaded', function() {
    // 如果页面是数学编辑器页面，初始化编辑器
    if (document.getElementById('math-editor-page').classList.contains('active')) {
        initializeMathEditor();
    }
});

// 初始化数学编辑器
function initializeMathEditor() {
    // 为输入框添加事件监听器
    if (mathInput) {
        mathInput.addEventListener('input', handleInput);
        mathInput.addEventListener('keyup', handleInput);
        mathInput.addEventListener('paste', handleInput);
    }
    
    // 为LaTeX代码框添加事件监听器
    if (latexOutput) {
        latexOutput.addEventListener('input', handleLatexInput);
        latexOutput.addEventListener('keyup', handleLatexInput);
        latexOutput.addEventListener('paste', handleLatexInput);
    }
}

// 处理输入事件
function handleInput() {
    let input = mathInput.value;
    // 自动转换常见表达式
    input = convertExpressions(input);
    // 更新预览
    renderMath(input);
    // 更新LaTeX输出（避免递归调用）
    if (latexOutput.value !== input) {
        latexOutput.value = input;
    }
}

// 处理LaTeX代码输入事件
function handleLatexInput() {
    let latex = latexOutput.value;
    // 更新预览
    renderMath(latex);
    // 更新输入区域（避免递归调用）
    if (mathInput.value !== latex) {
        mathInput.value = latex;
    }
}

// 辅助函数：查找匹配的括号对
function findMatchingParenthesis(str, startIndex) {
    let count = 1;
    for (let i = startIndex + 1; i < str.length; i++) {
        if (str[i] === '(') count++;
        if (str[i] === ')') count--;
        if (count === 0) return i;
    }
    return -1;
}

// 辅助函数：处理括号表达式，将匹配的括号对作为整体标记
function processParentheses(input) {
    // 使用占位符标记括号对
    const placeholders = [];
    let result = '';
    let i = 0;
    
    while (i < input.length) {
        if (input[i] === '(') {
            const endIndex = findMatchingParenthesis(input, i);
            if (endIndex !== -1) {
                const content = input.substring(i + 1, endIndex);
                const placeholder = `__PAREN${placeholders.length}__`;
                placeholders.push(content);
                result += placeholder;
                i = endIndex + 1;
            } else {
                result += input[i];
                i++;
            }
        } else {
            result += input[i];
            i++;
        }
    }
    
    return { result, placeholders };
}

// 辅助函数：恢复占位符为原始括号内容
function restorePlaceholders(input, placeholders) {
    let result = input;
    // 先处理可能被破坏的占位符格式
    // 修复可能被下标转换破坏的占位符
    result = result.replace(/_\{_PAREN/g, '__PAREN');
    // 修复可能被上标转换破坏的占位符
    result = result.replace(/\^\{_PAREN/g, '__PAREN');
    // 恢复正常占位符
    for (let i = 0; i < placeholders.length; i++) {
        const placeholder = `__PAREN${i}__`;
        result = result.split(placeholder).join(`(${placeholders[i]})`);
    }
    return result;
}

// 自动转换常见表达式
function convertExpressions(input) {
    let output = input;
    
    // 1. 转换infty为无穷大符号：infty -> \infty
    // 只转换纯文本的infty，不转换已经是LaTeX格式的\infty
    output = output.replace(/(?<!\\)\binfty\b/g, '\\infty');
    
    // 2. 转换lim为极限符号：lim -> \lim
    output = output.replace(/\blim\b/g, '\\lim');
    
    // 3. 转换lim x->x0为极限趋近：lim x->x0 -> \lim_{x \to x0}
    output = output.replace(/\blim\s+([a-zA-Z0-9]+)(?:->|\\to)([a-zA-Z0-9]+|infty)\b/g, '\\lim_{$1 \\to $2}');
    
    // 4. 转换->为推出箭头：-> -> \rightarrow（添加空格）
    // 仅在非LaTeX命令内部转换箭头
    output = output.replace(/(?<!\\)->/g, ' \\to ');
    
    // 4. 改进矩阵处理：使用贪婪匹配和正确的行分隔符
    output = output.replace(/\\begin\{([a-zA-Z]+)\}(.*?)\\end\{\1\}/gs, (match, env, content) => {
        // 只处理矩阵环境
        if (['matrix', 'bmatrix', 'pmatrix', 'vmatrix', 'Vmatrix'].includes(env)) {
            // 将行分隔符转换为双反斜杠
            const processedContent = content.replace(/\//g, '\\\\');
            return `\\begin{${env}}${processedContent}\\end{${env}}`;
        }
        return match;
    });
    
    // 5. 先转换函数名：sin -> \sin, cos -> \cos等
    // 这一步将函数名转换为LaTeX格式，但保持函数调用的结构
    // 确保不会转换已经是LaTeX格式的命令
    output = output.replace(/(?<!\\)\b(sin|cos|tan|cot|sec|csc|log|ln)\b/g, '\\$1');
    
    // 6. 处理函数调用与变量的空格：sin x -> \sin(x)
    // 将函数名后紧跟的变量转换为带括号的参数形式
    output = output.replace(/(\\sin|\\cos|\\tan|\\cot|\\sec|\\csc|\\log|\\ln|\\lim)\\s+([a-zA-Z0-9]+(?:\\([^)]+\\))?)/g, '$1($2)');
    
    // 7. 处理带底数的对数函数：log_a(x) -> \log_{a}(x)
    output = output.replace(/(\\log)_([a-zA-Z0-9]+)\\(([^)]+)\\)/g, '\\log_{$2}($3)');
    
    // 8. 支持另一种对数表示法：log(a,b) -> \log_{a}(b)
    output = output.replace(/log\\(([^,]+),([^)]+)\\)/g, '\\log_{$1}($2)');
    
    // 9. 处理幂运算和上标：合并幂运算和上标转换，避免冲突
    // 支持 a^b -> a^{b}
    output = output.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, '$1^{$2}');
    // 支持 (a) ^ b -> (a)^{b}
    output = output.replace(/\)\^([a-zA-Z0-9]+)/g, ')^{$1}');
    // 支持 a^(b) -> a^{b}
    output = output.replace(/([a-zA-Z0-9]+)\^\\(([^)]+)\\)/g, '$1^{$2}');
    // 支持 (a) ^ (b) -> (a)^{b}
    output = output.replace(/\)\^\\(([^)]+)\\)/g, ')^{$1}');
    // 支持所有其他上标情况（包括带括号的情况）
    output = output.replace(/([^\^])\^((?:\([^)]+\)|[a-zA-Z0-9]+))/g, '$1^{$2}');
    
    // 11. 转换分数：只处理简单的分数形式，严格限制匹配条件
    // 先检查是否已经包含\frac，避免重复处理
    if (!output.includes('\\frac')) {
        // 只处理纯数字或变量的简单分数，避免错误匹配等式或复杂表达式
        // 匹配：数字/数字、变量/变量、(数字)/数字、数字/(变量)等简单形式
        output = output.replace(/\b([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)\b/g, '\\frac{$1}{$2}');
        output = output.replace(/\b\(([a-zA-Z0-9]+)\)\/([a-zA-Z0-9]+)\b/g, '\\frac{$1}{$2}');
        output = output.replace(/\b([a-zA-Z0-9]+)\/\(([a-zA-Z0-9]+)\)\b/g, '\\frac{$1}{$2}');
        output = output.replace(/\b\(([a-zA-Z0-9]+)\)\/\(([a-zA-Z0-9]+)\)\b/g, '\\frac{$1}{$2}');
    }
    
    // 11. 转换下标：a_b -> a_{b}（包括带括号的情况）
    output = output.replace(/([^_])_((?:\([^)]+\)|[a-zA-Z][a-zA-Z0-9]*))/g, '$1_{$2}');
    
    // 12. 转换平方根：sqrt(a) -> \sqrt{a}
    output = output.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
    
    // 13. 转换积分：int(a,b) -> \int_{a}^{b}
    output = output.replace(/int\(([^,]+),([^)]+)\)/g, '\\int_{$1}^{$2}');
    
    // 14. 转换求和：sum(a,b) -> \sum_{a}^{b}
    output = output.replace(/sum\(([^,]+),([^)]+)\)/g, '\\sum_{$1}^{$2}');
    
    return output;
}

// 渲染数学公式
function renderMath(expression) {
    if (!expression) {
        mathPreview.innerHTML = '<p style="color: #999; text-align: center; margin-top: 20px;">在此处预览数学公式</p>';
        return;
    }
    try {
        // 使用KaTeX渲染公式
        katex.render(expression, mathPreview, {
            throwOnError: false,
            displayMode: true,
            output: 'html',
            trust: true
        });
    } catch (error) {
        mathPreview.innerHTML = '<p style="color: #ff4d4f; text-align: center; margin-top: 20px;">公式渲染错误: ' + error.message + '</p>';
    }
}

// 插入符号
function insertSymbol(symbol) {
    const startPos = mathInput.selectionStart;
    const endPos = mathInput.selectionEnd;
    const textBefore = mathInput.value.substring(0, startPos);
    const textAfter = mathInput.value.substring(endPos);
    
    // 插入符号
    mathInput.value = textBefore + symbol + textAfter;
    
    // 将光标移动到插入符号后
    mathInput.focus();
    mathInput.setSelectionRange(startPos + symbol.length, startPos + symbol.length);
    
    // 更新预览
    handleInput();
}

// 插入矩阵
function insertMatrix() {
    // 创建输入对话框
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    
    dialog.innerHTML = `
        <h3 style="margin-top: 0;">创建矩阵</h3>
        <div style="margin-bottom: 15px;">
            <label for="matrix-rows">行数：</label>
            <input type="number" id="matrix-rows" min="1" max="10" value="2" style="width: 60px; padding: 5px;">
        </div>
        <div style="margin-bottom: 15px;">
            <label for="matrix-cols">列数：</label>
            <input type="number" id="matrix-cols" min="1" max="10" value="2" style="width: 60px; padding: 5px;">
        </div>
        <div style="text-align: right;">
            <button id="matrix-cancel" style="margin-right: 10px; padding: 8px 15px;">取消</button>
            <button id="matrix-confirm" style="padding: 8px 15px; background: #1890ff; color: white; border: none; border-radius: 4px;">确认</button>
        </div>
    `;
    
    // 添加遮罩层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    
    // 确认按钮事件
    document.getElementById('matrix-confirm').addEventListener('click', function() {
        const rows = parseInt(document.getElementById('matrix-rows').value);
        const cols = parseInt(document.getElementById('matrix-cols').value);
        
        if (rows && cols && rows > 0 && cols > 0) {
            let matrix = '\\begin{bmatrix}';
            
            // 生成矩阵元素占位符
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    matrix += 'a_{' + (i+1) + (j+1) + '}';
                    if (j < cols - 1) matrix += ' & ';
                }
                if (i < rows - 1) matrix += ' \\\\ ';
            }
            
            matrix += '\\end{bmatrix}';
            insertSymbol(matrix);
        } else {
            alert('请输入有效的行列数！');
        }
        
        // 移除对话框
        document.body.removeChild(dialog);
        document.body.removeChild(overlay);
    });
    
    // 取消按钮事件
    document.getElementById('matrix-cancel').addEventListener('click', function() {
        document.body.removeChild(dialog);
        document.body.removeChild(overlay);
    });
}

// 插入行列式
function insertDeterminant() {
    // 创建输入对话框
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    
    dialog.innerHTML = `
        <h3 style="margin-top: 0;">创建行列式</h3>
        <div style="margin-bottom: 15px;">
            <label for="det-size">行列式大小：</label>
            <input type="number" id="det-size" min="1" max="10" value="2" style="width: 60px; padding: 5px;">
        </div>
        <div style="text-align: right;">
            <button id="det-cancel" style="margin-right: 10px; padding: 8px 15px;">取消</button>
            <button id="det-confirm" style="padding: 8px 15px; background: #1890ff; color: white; border: none; border-radius: 4px;">确认</button>
        </div>
    `;
    
    // 添加遮罩层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    
    // 确认按钮事件
    document.getElementById('det-confirm').addEventListener('click', function() {
        const size = parseInt(document.getElementById('det-size').value);
        
        if (size && size > 0) {
            let det = '\\begin{vmatrix}';
            
            // 生成行列式元素占位符
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    det += 'a_{' + (i+1) + (j+1) + '}';
                    if (j < size - 1) det += ' & ';
                }
                if (i < size - 1) det += ' \\\\ ';
            }
            
            det += '\\end{vmatrix}';
            insertSymbol(det);
        } else {
            alert('请输入有效的行列式大小！');
        }
        
        // 移除对话框
        document.body.removeChild(dialog);
        document.body.removeChild(overlay);
    });
    
    // 取消按钮事件
    document.getElementById('det-cancel').addEventListener('click', function() {
        document.body.removeChild(dialog);
        document.body.removeChild(overlay);
    });
}

// 复制LaTeX代码
function copyLatex() {
    latexOutput.select();
    latexOutput.setSelectionRange(0, 99999); // 移动设备兼容
    
    try {
        document.execCommand('copy');
        alert('LaTeX代码已复制到剪贴板！');
    } catch (err) {
        alert('复制失败，请手动复制！');
    }
}

// 保存为图片
function saveAsImage() {
    try {
        // 使用html2canvas库将预览区域转换为图片
        html2canvas(mathPreview, {
            backgroundColor: '#ffffff',
            scale: 2, // 提高分辨率
            useCORS: true
        }).then(canvas => {
            // 创建下载链接
            const link = document.createElement('a');
            link.download = 'math-formula.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    } catch (error) {
        alert('保存图片失败：' + error.message);
    }
}

// 清空编辑器
function clearEditor() {
    mathInput.value = '';
    mathPreview.innerHTML = '<p style="color: #999; text-align: center; margin-top: 20px;">在此处预览数学公式</p>';
    latexOutput.value = '';
    mathInput.focus();
}

// ===== kityformula编辑器功能 =====
// 全局变量
let kfEditor = null;
let currentEditor = 'basic';

// 初始化kityformula编辑器
function initKityformulaEditor() {
    try {
        if (typeof kf !== 'undefined' && kf.Editor) {
            const KFEditor = kf.Editor;
            const editorContainer = document.getElementById('kfEditorContainer');
            
            // 确保编辑器容器可见
            editorContainer.style.display = 'block';
            editorContainer.style.visibility = 'visible';
            editorContainer.style.opacity = '1';
            
            kfEditor = new KFEditor(editorContainer);
            kfEditor.execCommand('render', '\\placeholder');
            
            // 调用c.start(editor)，注册必要的服务
            if (typeof c !== 'undefined' && c.start) {
                c.start(kfEditor);
            }
            
            // 替换c.js中的updateInput函数，确保同时更新我们的LaTeX输出框
            if (typeof window !== 'undefined') {
                // 保存原始的updateInput函数
                const originalUpdateInput = window.updateInput;
                
                // 创建新的updateInput函数
                window.updateInput = function(result) {
                    // 调用原始函数
                    if (originalUpdateInput) {
                        originalUpdateInput(result);
                    }
                    
                    // 同时更新我们的LaTeX输出框
                    const latexOutput = document.getElementById('kity-latex-output');
                    if (latexOutput) {
                        latexOutput.value = result.str;
                    }
                };
            }
            
            // 修复删除键和退格键的问题
            if (typeof document !== 'undefined') {
                // 找到隐藏的输入框
                const hiddenInput = document.getElementById('hiddenInput');
                if (hiddenInput) {
                    // 添加keydown事件监听器处理删除键和退格键
                    hiddenInput.addEventListener('keydown', function(e) {
                        // 处理删除键和退格键
                        switch (e.keyCode) {
                            // backspace
                            case 8:
                            // delete
                            case 46:
                                // 阻止默认行为，由kityformula编辑器处理
                                e.preventDefault();
                                
                                // 尝试获取当前光标信息
                                try {
                                    const cursorInfo = kfEditor.requestService("syntax.get.record.cursor");
                                    
                                    // 如果有选中内容，删除选中内容
                                    if (cursorInfo.startOffset !== cursorInfo.endOffset) {
                                        kfEditor.requestService("syntax.delete.selection");
                                    } else {
                                        // 根据按键类型删除字符
                                        if (e.keyCode === 8) {
                                            // 退格键，删除光标前的字符
                                            kfEditor.requestService("syntax.cursor.move.left");
                                            kfEditor.requestService("syntax.delete.char");
                                        } else {
                                            // 删除键，删除光标后的字符
                                            kfEditor.requestService("syntax.delete.char");
                                        }
                                    }
                                    
                                    // 更新编辑器状态
                                    const update = function() {
                                        const cursorInfo = kfEditor.requestService("syntax.get.record.cursor");
                                        const group = kfEditor.requestService("syntax.get.group.content", cursorInfo.groupId);
                                        kfEditor.requestService("render.select.group.content", group);
                                        const result = kfEditor.requestService("syntax.get.latex.info");
                                        window.updateInput(result);
                                        return result;
                                    };
                                    
                                    update();
                                } catch (error) {
                                    console.error('处理删除操作失败:', error);
                                }
                                break;
                        }
                    }, false);
                }
            }
            
            // 添加一个新的事件监听器来处理删除键和退格键，修复删除功能问题
            const hiddenInput = document.getElementById('hiddenInput');
            if (hiddenInput) {
                // 添加一个新的keydown事件监听器，使用capture模式确保它先执行
                hiddenInput.addEventListener('keydown', function(e) {
                    // 只处理删除键和退格键
                    if (e.keyCode === 8 || e.keyCode === 46) {
                        // 阻止默认行为
                        e.preventDefault();
                        
                        // 直接修改隐藏输入框的内容
                        const startPos = hiddenInput.selectionStart;
                        const endPos = hiddenInput.selectionEnd;
                        let value = hiddenInput.value;
                        
                        // 如果有选中内容，删除选中内容
                        if (startPos !== endPos) {
                            value = value.substring(0, startPos) + value.substring(endPos);
                            hiddenInput.value = value;
                            hiddenInput.selectionStart = startPos;
                            hiddenInput.selectionEnd = startPos;
                        } else {
                            // 根据按键类型删除字符
                            if (e.keyCode === 8) {
                                // 退格键，删除光标前的字符
                                if (startPos > 0) {
                                    value = value.substring(0, startPos - 1) + value.substring(startPos);
                                    hiddenInput.value = value;
                                    hiddenInput.selectionStart = startPos - 1;
                                    hiddenInput.selectionEnd = startPos - 1;
                                }
                            } else {
                                // 删除键，删除光标后的字符
                                if (startPos < value.length) {
                                    value = value.substring(0, startPos) + value.substring(startPos + 1);
                                    hiddenInput.value = value;
                                    hiddenInput.selectionStart = startPos;
                                    hiddenInput.selectionEnd = startPos;
                                }
                            }
                        }
                        
                        // 触发input事件，让kityformula编辑器重新渲染
                        const inputEvent = new Event('input', { bubbles: true });
                        hiddenInput.dispatchEvent(inputEvent);
                        
                        // 更新LaTeX输出框
                        const latexOutput = document.getElementById('kity-latex-output');
                        if (latexOutput) {
                            latexOutput.value = hiddenInput.value;
                        }
                    }
                }, true); // 使用capture模式
            }
            
            console.log('kityformula编辑器初始化成功');
        } else {
            console.error('kityformula库未加载或未正确初始化');
            setTimeout(initKityformulaEditor, 1000); // 1秒后重试
        }
    } catch (error) {
        console.error('kityformula编辑器初始化失败:', error);
        setTimeout(initKityformulaEditor, 1000); // 1秒后重试
    }
}

// 切换编辑器
function toggleEditor() {
    const basicEditor = document.getElementById('basic-editor');
    const kityEditor = document.getElementById('kityformula-editor');
    const toggle = document.getElementById('editorToggle');
    const editorType = document.getElementById('editorType');
    
    if (toggle.checked) {
        // 切换到kityformula编辑器
        basicEditor.style.display = 'none';
        kityEditor.style.display = 'block';
        editorType.textContent = '当前: KityFormula编辑器';
        currentEditor = 'kityformula';
        
        // 初始化kityformula编辑器（如果尚未初始化）
        if (!kfEditor) {
            initKityformulaEditor();
        } else {
            // 重新渲染一个有效的占位符，防止之前的损坏代码导致错误
            try {
                kfEditor.execCommand('render', '\\placeholder');
            } catch (error) {
                console.error('重新渲染占位符失败:', error);
                // 如果重新渲染失败，尝试重新初始化编辑器
                initKityformulaEditor();
            }
        }
    } else {
        // 切换到基础编辑器
        basicEditor.style.display = 'block';
        kityEditor.style.display = 'none';
        editorType.textContent = '当前: 基础编辑器';
        currentEditor = 'basic';
    }
}

// 复制kityformula编辑器的LaTeX代码
function copyKityLatex() {
    const output = document.getElementById('kity-latex-output');
    output.select();
    document.execCommand('copy');
    alert('LaTeX代码已复制到剪贴板！');
}

// 保存kityformula编辑器的图片
function saveKityAsImage() {
    alert('保存图片功能开发中...');
}

// 清空kityformula编辑器
function clearKityEditor() {
    if (kfEditor) {
        kfEditor.execCommand('render', '\\placeholder');
        document.getElementById('kity-latex-output').value = '';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化kityformula编辑器
    initKityformulaEditor();
});

// ===== 白噪声功能 =====
// 白噪声功能相关变量
let whiteNoiseAudioInstances = {};

// 白噪声音频文件列表
const whiteNoiseFiles = [
    { name: '冥想风铃-水', path: 'White noise/冥想风铃-水.mp3' },
    { name: '冬天冰冻的树枝', path: 'White noise/冬天冰冻的树枝.mp3' },
    { name: '大树下的雨声', path: 'White noise/大树下的雨声.mp3' },
    { name: '山谷黎明', path: 'White noise/山谷黎明.mp3' },
    { name: '山间溪流', path: 'White noise/山间溪流.mp3' },
    { name: '山顶的狂风', path: 'White noise/山顶的狂风.mp3' },
    { name: '春天的雨声', path: 'White noise/春天的雨声.mp3' },
    { name: '木炭燃烧 火星四溅', path: 'White noise/木炭燃烧 火星四溅.mp3' },
    { name: '森林树下暴雨', path: 'White noise/森林树下暴雨.mp3' },
    { name: '湖水拍打岸边', path: 'White noise/湖水拍打岸边.mp3' },
    { name: '白噪音：池塘小雨', path: 'White noise/白噪音：池塘小雨.mp3' },
    { name: '白噪音：荷叶上的小雨', path: 'White noise/白噪音：荷叶上的小雨.mp3' },
    { name: '芭蕉叶下的小雨', path: 'White noise/芭蕉叶下的小雨.mp3' },
    { name: '车在雨中行驶', path: 'White noise/车在雨中行驶.mp3' },
    { name: '车窗外的暴雨', path: 'White noise/车窗外的暴雨.mp3' },
    { name: '阴天的枫叶', path: 'White noise/阴天的枫叶.mp3' },
    { name: '院子树下的雨声', path: 'White noise/院子树下的雨声.mp3' },
    { name: '雨天树林小雨', path: 'White noise/雨天树林小雨.mp3' }
];

// 根据音频名称获取对应图标
function getNoiseIcon(name) {
    if (name.includes('雨') || name.includes('小雨') || name.includes('暴雨')) {
        return '🌧️';
    } else if (name.includes('风')) {
        return '💨';
    } else if (name.includes('水') || name.includes('溪流') || name.includes('湖') || name.includes('池塘')) {
        return '💧';
    } else if (name.includes('雪') || name.includes('冰冻')) {
        return '❄️';
    } else if (name.includes('燃烧')) {
        return '🔥';
    } else if (name.includes('森林') || name.includes('树') || name.includes('山谷') || name.includes('山间') || name.includes('院子') || name.includes('枫叶')) {
        return '🌳';
    } else if (name.includes('冥想') || name.includes('风铃')) {
        return '🎐';
    } else {
        return '🎵';
    }
}

// 初始化白噪声页面
function initWhiteNoisePage() {
    const noiseList = document.getElementById('white-noise-list');
    if (!noiseList) return;
    
    // 清空列表
    noiseList.innerHTML = '';
    
    // 创建音频项
    whiteNoiseFiles.forEach(file => {
        const noiseItem = document.createElement('div');
        noiseItem.className = 'white-noise-item';
        noiseItem.dataset.file = file.path;
        
        const icon = document.createElement('span');
        icon.className = 'noise-icon';
        icon.textContent = getNoiseIcon(file.name);
        
        const fileName = document.createElement('span');
        fileName.className = 'noise-name';
        fileName.textContent = file.name;
        
        const audioControl = document.createElement('span');
        audioControl.className = 'audio-control';
        audioControl.textContent = '▶️';
        
        noiseItem.appendChild(icon);
        noiseItem.appendChild(fileName);
        noiseItem.appendChild(audioControl);
        
        // 添加点击事件
        noiseItem.addEventListener('click', function() {
            toggleNoisePlayback(file.path, this);
        });
        
        noiseList.appendChild(noiseItem);
    });
    
    // 添加停止所有按钮的事件监听
    const stopAllBtn = document.getElementById('stop-all-noise');
    if (stopAllBtn) {
        stopAllBtn.addEventListener('click', stopAllWhiteNoise);
    }
}

// 切换白噪声播放状态
function toggleNoisePlayback(filePath, element) {
    // 检查是否已有该音频的实例
    if (whiteNoiseAudioInstances[filePath]) {
        const audio = whiteNoiseAudioInstances[filePath];
        if (audio.paused) {
            audio.play();
            element.classList.add('playing');
            element.querySelector('.audio-control').textContent = '⏸️';
        } else {
            audio.pause();
            element.classList.remove('playing');
            element.querySelector('.audio-control').textContent = '▶️';
        }
    } else {
        // 创建新的音频实例
        const audio = new Audio(filePath);
        audio.loop = true; // 循环播放
        audio.play();
        whiteNoiseAudioInstances[filePath] = audio;
        element.classList.add('playing');
        element.querySelector('.audio-control').textContent = '⏸️';
        
        // 音频加载失败处理
        audio.addEventListener('error', function() {
            console.error('音频加载失败:', filePath);
            alert('音频加载失败: ' + filePath);
            delete whiteNoiseAudioInstances[filePath];
            element.classList.remove('playing');
            element.querySelector('.audio-control').textContent = '▶️';
        });
    }
}

// 停止所有白噪声
function stopAllWhiteNoise() {
    Object.values(whiteNoiseAudioInstances).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    
    // 重置UI
    document.querySelectorAll('.white-noise-item.playing').forEach(item => {
        item.classList.remove('playing');
        item.querySelector('.audio-control').textContent = '▶️';
    });
}

// 重写showPage函数，确保页面加载时初始化相应功能
const originalShowPage = window.showPage;
window.showPage = function(pageId) {
    originalShowPage(pageId);
    if (pageId === 'math-editor') {
        initializeMathEditor();
    } else if (pageId === 'white-noise') {
        // 延迟初始化，确保页面完全加载
        setTimeout(initWhiteNoisePage, 100);
    }
};

// 为侧边栏的白噪声链接添加事件监听
const whiteNoiseLink = document.querySelector('li[data-page="white-noise"]');
if (whiteNoiseLink) {
    whiteNoiseLink.addEventListener('click', function() {
        // 页面切换由showPage函数处理，这里只是为了确保初始化
        setTimeout(() => {
            if (document.getElementById('white-noise-page')?.classList.contains('active')) {
                initWhiteNoisePage();
            }
        }, 100);
    });
}

// 添加html2canvas库的引用（本地版本）
const html2canvasScript = document.createElement('script');
html2canvasScript.src = 'js/html2canvas.min.js';
document.head.appendChild(html2canvasScript);
	