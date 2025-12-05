// 表情包功能 - 独立版本
// 注意：此文件需要在DOM加载完成后执行

// 全局变量
let emojiState = 'default';
let emojiUpdateInterval = null;
let autoRestoreTimer = null;
let missedStateStartTime = null;
const AUTO_RESTORE_TIME = 5000; // 5秒后自动恢复
const MISSED_STATE_DURATION = 3 * 60 * 1000; // 3分钟失落状态持续时间

// 初始化表情包功能
function initEmojiSystem() {
    // 检查DOM中是否已存在表情包容器
    let emojiContainer = document.getElementById('emoji-container');
    
    // 如果不存在，创建表情包容器
    if (!emojiContainer) {
        emojiContainer = createEmojiContainer();
        document.body.appendChild(emojiContainer);
    }
    
    // 初始化事件监听器
    initEmojiEventListeners();
    
    // 启动表情状态更新
    startEmojiUpdate();
    
    // 初始化表情
    updateEmoji('default');
}

// 创建表情包容器
function createEmojiContainer() {
    const container = document.createElement('div');
    container.className = 'emoji-container';
    container.id = 'emoji-container';
    container.draggable = true;
    
    // 添加表情图片
    const emojiImg = document.createElement('img');
    emojiImg.id = 'status-emoji';
    emojiImg.src = 'images/开心.png';
    emojiImg.alt = '状态表情';
    container.appendChild(emojiImg);
    
    // 添加表情切换按钮
    const controls = document.createElement('div');
    controls.className = 'emoji-controls';
    controls.id = 'emoji-controls';
    
    // 表情按钮配置
    const emojiButtons = [
        { emoji: 'default', symbol: '😊' },
        { emoji: 'thinking', symbol: '😅' },
        { emoji: 'concerned', symbol: '🤨' },
        { emoji: 'urgent', symbol: '🙄' },
        { emoji: 'very-urgent', symbol: '😖' },
        { emoji: 'extremely-urgent', symbol: '😡' },
        { emoji: 'little-anger', symbol: '😤' },
        { emoji: 'doing', symbol: '😎' },
        { emoji: 'completed', symbol: '🥳' },
        { emoji: 'missed', symbol: '😫' }
    ];
    
    // 创建表情按钮
    emojiButtons.forEach(btnConfig => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.dataset.emoji = btnConfig.emoji;
        btn.textContent = btnConfig.symbol;
        controls.appendChild(btn);
    });
    
    container.appendChild(controls);
    
    return container;
}

// 初始化事件监听器
function initEmojiEventListeners() {
    initEmojiDrag();
    initEmojiButtons();
}

// 初始化表情拖拽功能
function initEmojiDrag() {
    const emojiContainer = document.getElementById('emoji-container');
    const statusEmoji = document.getElementById('status-emoji');
    let isDragging = false;
    let offsetX, offsetY;
    let originalSrc = '';
    let currentX = 0;
    let currentY = 0;
    
    // 确保容器使用固定定位，并初始化为1390px, 40px位置
    emojiContainer.style.position = 'fixed';
    emojiContainer.style.left = '0px';
    emojiContainer.style.top = '0px';
    emojiContainer.style.transform = 'translate(1390px, 40px)';
    
    // 设置初始位置变量
    currentX = 1390;
    currentY = 40;
    
    // 开始拖拽
    emojiContainer.addEventListener('mousedown', (e) => {
        // 只在点击图片区域时触发拖拽
        if (e.target.id === 'status-emoji') {
            e.preventDefault();
            e.stopPropagation();
            
            isDragging = true;
            
            // 标记当前正在拖拽，用于禁用鼠标特效
            document.body.classList.add('emoji-dragging');
            
            const rect = emojiContainer.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            emojiContainer.classList.add('dragging');
            
            // 拖拽时临时替换为被拎起图片
            originalSrc = statusEmoji.src;
            statusEmoji.src = 'images/被拎起.png';
        }
    });
    
    // 鼠标移动事件处理 - 直接更新位置，使用transform
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // 计算新位置
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        // 确保不拖出屏幕
        const maxScreenX = window.innerWidth - emojiContainer.offsetWidth;
        const maxScreenY = window.innerHeight - emojiContainer.offsetHeight;
        newX = Math.max(0, Math.min(newX, maxScreenX));
        newY = Math.max(0, Math.min(newY, maxScreenY));
        
        // 更新当前位置
        currentX = newX;
        currentY = newY;
        
        // 使用transform更新位置，GPU加速，性能更好
        emojiContainer.style.transform = `translate(${newX}px, ${newY}px)`;
    });
    
    // 结束拖拽
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        
        // 移除拖拽标记，恢复鼠标特效
        document.body.classList.remove('emoji-dragging');
        
        emojiContainer.classList.remove('dragging');
        statusEmoji.src = originalSrc;
    });
}

// 初始化表情切换按钮
function initEmojiButtons() {
    const emojiBtns = document.querySelectorAll('.emoji-btn');
    
    emojiBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const emojiType = btn.dataset.emoji;
            
            // 手动切换表情
            updateEmoji(emojiType);
            
            // 清除之前的自动恢复定时器
            if (autoRestoreTimer) {
                clearTimeout(autoRestoreTimer);
            }
            
            // 设置新的自动恢复定时器
            autoRestoreTimer = setTimeout(() => {
                // 恢复为根据任务状态的表情
                updateEmojiState();
            }, AUTO_RESTORE_TIME);
        });
    });
}

// 更新表情
function updateEmoji(state) {
    // 根据状态选择对应的图片
    let imageSrc = 'images/开心.png'; // 默认图片
    
    switch (state) {
        case 'default':
        case 'calm':
            imageSrc = 'images/开心.png';
            missedStateStartTime = null; // 重置失落状态时间
            break;
        case 'thinking':
            imageSrc = 'images/思考.png';
            missedStateStartTime = null; // 重置失落状态时间
            break;
        case 'concerned':
            imageSrc = 'images/比较紧张.png';
            missedStateStartTime = null; // 重置失落状态时间
            break;
        case 'urgent':
            imageSrc = 'images/紧张.png';
            missedStateStartTime = null; // 重置失落状态时间
            break;
        case 'very-urgent':
            imageSrc = 'images/不安.png';
            missedStateStartTime = null; // 重置失落状态时间
            break;
        case 'extremely-urgent':
            imageSrc = 'images/任务十分紧急的愤怒.png';
            missedStateStartTime = null; // 重置失落状态时间
            break;
        case 'little-anger':
            imageSrc = 'images/稍微生气.png';
            missedStateStartTime = null; // 重置失落状态时间
            break;
        case 'completed':
            imageSrc = 'images/任务完成后的兴奋.png';
            missedStateStartTime = null; // 重置失落状态时间
            break;
        case 'missed':
            imageSrc = 'images/错过任务后的失落.png';
            // 记录失落状态开始时间
            if (!missedStateStartTime) {
                missedStateStartTime = Date.now();
            }
            break;
        case 'doing':
            imageSrc = 'images/做题中.png';
            missedStateStartTime = null; // 重置失落状态时间
            break;
    }
    
    // 更新图片
    const emojiElement = document.getElementById('status-emoji');
    if (emojiElement) {
        emojiElement.src = imageSrc;
        emojiState = state;
    }
}

// 更新表情状态 - 适配终极版本任务系统
function updateEmojiState() {
    // 检查任务系统是否可用
    if (typeof tasks === 'undefined' || !Array.isArray(tasks)) {
        updateEmoji('default');
        return;
    }
    
    // 检查当前是否处于失落状态且已持续超过1分钟
    if (emojiState === 'missed' && missedStateStartTime) {
        const elapsedTime = Date.now() - missedStateStartTime;
        if (elapsedTime > 60 * 1000) { // 1分钟后恢复
            // 重置失落状态，继续下一个任务
            missedStateStartTime = null;
            // 递归调用，寻找下一个任务
            updateEmojiState();
            return;
        }
        // 仍处于失落状态，保持不变
        return;
    }
    
    // 1. 筛选出用户添加的、未完成的任务
    const userTasks = tasks.filter(task => !task.isSystemAdded && !task.completed);
    
    if (userTasks.length === 0) {
        // 没有用户添加的未完成任务，检查是否有已完成任务
        const completedUserTasks = tasks.filter(task => !task.isSystemAdded && task.completed);
        if (completedUserTasks.length > 0) {
            updateEmoji('completed');
        } else {
            updateEmoji('default');
        }
        return;
    }
    
    // 2. 找到距离现在时间最近的任务
    const now = new Date();
    let closestTask = null;
    let minTimeDiff = Infinity;
    
    userTasks.forEach(task => {
        const taskDateTime = new Date(task.date + ' ' + (task.startTime || '00:00'));
        const timeDiff = Math.abs(taskDateTime - now);
        
        if (timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            closestTask = task;
        }
    });
    
    if (!closestTask) {
        updateEmoji('default');
        return;
    }
    
    // 3. 计算任务距离现在的时间t（分钟）
    const taskStartTime = new Date(closestTask.date + ' ' + (closestTask.startTime || '00:00'));
    const timeDiff = taskStartTime - now;
    const t = timeDiff / (1000 * 60); // 转换为分钟
    
    // 4. 检查任务状态
    const isCompleted = closestTask.completed;
    const isRunning = closestTask.isrunning || false;
    
    if (isCompleted) {
        updateEmoji('completed');
    } else if (isRunning) {
        updateEmoji('doing');
    } else {
        // 未完成且未进行
        if (t > 35) {
            updateEmoji('default');
        } else if (t > 25 && t <= 35) {
            updateEmoji('thinking');
        } else if (t > 15 && t <= 25) {
            updateEmoji('concerned');
        } else if (t > 5 && t <= 15) {
            updateEmoji('urgent');
        } else if (t > 0 && t <= 5) {
            updateEmoji('very-urgent');
        } else if (t >= -1 && t <= 0) {
            updateEmoji('extremely-urgent');
        } else if (t < -1) {
            // 任务已开始超过1分钟
            if (closestTask.endTime) {
                const taskEndTime = new Date(closestTask.date + ' ' + closestTask.endTime);
                const t2 = (taskEndTime - now) / (1000 * 60); // 距离结束时间的分钟数
                
                if (t2 > 0) {
                    // 任务已开始但未结束
                    updateEmoji('little-anger');
                } else {
                    // 任务已结束且未完成
                    updateEmoji('missed');
                }
            } else {
                // 没有结束时间，默认为little-anger
                updateEmoji('little-anger');
            }
        }
    }
}

// 启动表情状态更新
function startEmojiUpdate() {
    // 每5秒更新一次表情状态，确保任务状态变化能及时反映
    if (!emojiUpdateInterval) {
        emojiUpdateInterval = setInterval(updateEmojiState, 5000);
    }
}

// 停止表情状态更新
function stopEmojiUpdate() {
    if (emojiUpdateInterval) {
        clearInterval(emojiUpdateInterval);
        emojiUpdateInterval = null;
    }
}

// 适配终极版本的任务系统 - 预留接口
// 终极版本可以通过调用此函数来更新表情状态
function updateEmojiByTaskStatus(taskStatus) {
    updateEmoji(taskStatus);
}

// DOM加载完成后初始化表情包功能
document.addEventListener('DOMContentLoaded', initEmojiSystem);

// 窗口关闭时清理资源
window.addEventListener('beforeunload', () => {
    stopEmojiUpdate();
    if (autoRestoreTimer) {
        clearTimeout(autoRestoreTimer);
    }
});