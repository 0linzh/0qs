// 表情包功能 - 独立版本
// 注意：此文件需要在DOM加载完成后执行

// 全局变量
let emojiState = 'default';
let emojiUpdateInterval = null;
let autoRestoreTimer = null;
let missedStateStartTime = null;
let isLocked = false; // 锁定状态，true表示锁定，不进行随机移动
let speechBubbleInterval = null; // 对话气泡定时器
const AUTO_RESTORE_TIME = 5000; // 5秒后自动恢复
const MISSED_STATE_DURATION = 3 * 60 * 1000; // 3分钟失落状态持续时间

// 对话内容配置 - 林遥月的对话
const speechContents = {
    default: [
        '告诉你个秘密哦,不要告诉别人哦~',
        '我真的超级喜欢你~(*//▽//*)',
        '今天也要加油哦~(●\'◡\'●)',
        '你好呀~我是林遥月~(=・ω・=)',
        '天气真好呢~(*^▽^*)',
        '要保持好心情哦(๑•̀ㅂ•́)و✧',
        '有什么我能帮你的吗？╰(*°▽°*)╯' 
    ],
    thinking: [
        '让我想想...(´･ω･`)',
        '这个问题有点难呢~(・∀・)',
        '容我思考一下~(=・ω・=)',
        '嗯...(｀・ω・´)',
        '我得好好想想~(｡･ω･｡)' 
    ],
    concerned: [
        '你看起来有点紧张~(=・ω・=)',
        '没关系，慢慢来~(´･ω･`)',
        '深呼吸，放松一下~(◡ ω ◡)',
        '别担心，一切都会好的~(๑´ㅂ`๑)',
        '需要休息一下吗？(=^･^=)' 
    ],
    urgent: [
        '时间有点紧张了哦~(ﾉﾟ▽ﾟ)ﾉ',
        '快一点，不然来不及啦~(゜ロ゜)',
        '加油，马上就完成了~(๑•̀ㅂ•́)و✧',
        '时间不等人哦~(・∀・)',
        '要加快速度啦~(ﾟДﾟ≡ﾟдﾟ)!?' 
    ],
    'very-urgent': [
        '哎呀，快没时间了！(゜ロ゜)',
        '紧急情况！快行动！(ﾟДﾟ≡ﾟдﾟ)!?',
        '快快快！(ﾉﾟ▽ﾟ)ﾉ',
        '要来不及了！( ´△｀)',
        '情况紧急！(｀Д´*)' 
    ],
    'extremely-urgent': [
        '太过分了！(╬◣д◢)',
        '我真的生气了！(｀Д´*)',
    ],
    'little-anger': [
        '还有任务没完成啦，我要生气喽~哼~(｀Д´*)',
        '你又偷懒了！(｀Д´*)',
        '再这样我真的要生气了！(｀Д´*)',
        '别让我等太久哦~(｀Д´*)',
        '要认真完成任务呀~(｀Д´*)' 
    ],
    doing: [
        '正在努力中~( ´･･)ﾉ(._.`)',
        '加油，马上就完成了~(๑•̀ㅂ•́)و✧',
        '专注ing~(◕ω◕)',
        '我在认真工作呢~(●\'◡\'●)',
        '进度不错哦~(๑´ㅂ`๑)' 
    ],
    completed: [
        '任务完成！(*^▽^*)',
        '太棒了！你做到了！(ﾉ≧∀≦)ﾉ',
        '恭喜完成！(๑´ㅂ`๑)',
        '做得真好！(●\'◡\'●)',
        '庆祝一下！(≧∇≦)ﾉ' 
    ],
    missed: [
        '任务错过了...(；ω；)',
        '有点小失落呢~(´･_･`)',
        '没关系，下次加油~(๑•̀ㅂ•́)و✧',
        '别难过，继续努力~(=^･^=)',
        '失败是成功之母~(◡ ω ◡)' 
    ]
};

// 添加对话气泡的CSS样式
function addSpeechBubbleStyles() {
    if (document.getElementById('emoji-speech-styles')) return; // 避免重复添加
    
    const style = document.createElement('style');
    style.id = 'emoji-speech-styles';
    style.textContent = `
        .emoji-speech-bubble {
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            background-color: white;
            border: 2px solid #333;
            border-radius: 20px;
            padding: 15px 20px;
            font-size: 15px;
            color: #333;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            min-width: 120px;
            max-width: 220px;
            min-height: 50px;
            max-height: 100px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        }
        
        .emoji-speech-bubble::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 10px 10px 0;
            border-style: solid;
            border-color: white transparent transparent transparent;
        }
        
        .emoji-speech-bubble::before {
            content: '';
            position: absolute;
            bottom: -12px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 12px 12px 0;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
            z-index: -1;
        }
        
        .emoji-container {
            position: relative; /* 确保对话气泡定位正确 */
        }
        
        .speech-content {
            word-wrap: break-word;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
        }
    `;
    
    document.head.appendChild(style);
}

// 初始化表情包功能
function initEmojiSystem() {
    console.log('初始化表情包系统');
    // 添加对话气泡样式
    addSpeechBubbleStyles();
    
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
    
    // 直接在initEmojiSystem中启动随机游走，无需包装函数
    console.log('直接在initEmojiSystem中启动随机游走');
    startRandomWalk();
    
    // 启动对话气泡系统
    startSpeechBubbleSystem();
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
        { emoji: 'missed', symbol: '😫' },
        { emoji: 'lock', symbol: '🔒' } // 添加锁定按钮
    ];
    
    // 创建表情按钮
    emojiButtons.forEach(btnConfig => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.dataset.emoji = btnConfig.emoji;
        btn.textContent = btnConfig.symbol;
        // 为锁定按钮添加特殊处理
        if (btnConfig.emoji === 'lock') {
            btn.id = 'lock-btn';
            btn.title = '锁定/解锁随机移动';
            // 设置初始状态
            btn.textContent = isLocked ? '🔒' : '🔓';
        }
        controls.appendChild(btn);
    });
    
    // 添加对话气泡
    const speechBubble = document.createElement('div');
    speechBubble.className = 'emoji-speech-bubble';
    speechBubble.id = 'emoji-speech-bubble';
    speechBubble.style.display = 'none';
    speechBubble.innerHTML = '<div class="speech-content"></div>';
    container.appendChild(speechBubble);
    
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
            
            // 处理锁定按钮
            if (emojiType === 'lock') {
                // 切换锁定状态
                isLocked = !isLocked;
                // 更新按钮显示
                btn.textContent = isLocked ? '🔒' : '🔓';
                // 显示锁定状态提示
                alert(isLocked ? '林遥月会乖乖呆在这的(●\'◡\'●)' : '林遥月不会走远的，会一直陪着你的 ( ´･･)ﾉ(._.`)');
                return;
            }
            
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

// 显示对话气泡
function showSpeechBubble(content) {
    const speechBubble = document.getElementById('emoji-speech-bubble');
    if (!speechBubble) return;
    
    const contentElement = speechBubble.querySelector('.speech-content');
    if (contentElement) {
        contentElement.textContent = content;
    }
    
    speechBubble.style.display = 'block';
    
    // 随机位置调整，增加自然感
    const randomOffset = Math.random() * 20 - 10;
    speechBubble.style.transform = `translate(calc(-50% + ${randomOffset}px), -40px)`;
    
    // 设置定时器，2秒后自动隐藏
    setTimeout(() => {
        hideSpeechBubble();
    }, 2000);
}

// 隐藏对话气泡
function hideSpeechBubble() {
    const speechBubble = document.getElementById('emoji-speech-bubble');
    if (speechBubble) {
        speechBubble.style.display = 'none';
    }
}

// 根据表情状态获取随机对话内容
function getRandomSpeechContent(state) {
    // 将状态转换为匹配speechContents的键名
    const normalizedState = state.replace(/_/g, '-');
    const contents = speechContents[normalizedState] || speechContents.default;
    const randomIndex = Math.floor(Math.random() * contents.length);
    return contents[randomIndex];
}

// 启动对话气泡系统
function startSpeechBubbleSystem() {
    // 每5-10秒随机显示一次对话气泡
    speechBubbleInterval = setInterval(() => {
        // 50%概率显示对话气泡
        if (Math.random() > 0.5) {
            // 获取当前表情状态
            const content = getRandomSpeechContent(emojiState);
            showSpeechBubble(content);
        }
    }, 5000 + Math.random() * 5000); // 5-10秒随机间隔
}

// 停止对话气泡系统
function stopSpeechBubbleSystem() {
    if (speechBubbleInterval) {
        clearInterval(speechBubbleInterval);
        speechBubbleInterval = null;
    }
    hideSpeechBubble();
}

// 窗口关闭时清理资源
window.addEventListener('beforeunload', () => {
    stopEmojiUpdate();
    stopRandomWalk();
    stopSpeechBubbleSystem();
    if (autoRestoreTimer) {
        clearTimeout(autoRestoreTimer);
    }
});

// 随机行走相关变量
let randomWalkInterval = null;
let isWalking = false;

// 暴露拖拽状态检查函数
window.isEmojiDragging = () => {
    return document.body.classList.contains('emoji-dragging');
};

// 暴露位置获取和设置函数
window.getEmojiContainer = () => {
    return document.getElementById('emoji-container');
};

window.getStatusEmoji = () => {
    return document.getElementById('status-emoji');
};

window.getEmojiPosition = () => {
    const container = window.getEmojiContainer();
    if (!container) return { x: 1390, y: 40 };
    
    // 从transform属性中提取位置
    const transform = container.style.transform;
    const match = transform.match(/translate\((\d+)px, (\d+)px\)/);
    if (match) {
        return {
            x: parseInt(match[1]),
            y: parseInt(match[2])
        };
    }
    return { x: 1390, y: 40 };
};

window.setEmojiPosition = (x, y) => {
    const container = window.getEmojiContainer();
    if (!container) return;
    
    // 设置新位置
    container.style.transform = `translate(${x}px, ${y}px)`;
};

// 表情包行走动画
function startEmojiWalkAnimation(direction, distance, duration) {
    if (window.isEmojiDragging() || isLocked) return;
    
    const emojiContainer = window.getEmojiContainer();
    const statusEmoji = window.getStatusEmoji();
    if (!emojiContainer || !statusEmoji) return;
    
    isWalking = true;
    const originalSrc = statusEmoji.src;
    const frameCount = 6;
    const frameDuration = duration / (frameCount * 2); // 往返动画
    let currentFrame = 1;
    let startTime = Date.now();
    
    // 设置初始位置
    const startPosition = window.getEmojiPosition();
    const endX = direction === 'left' ? startPosition.x - distance : startPosition.x + distance;
    const endY = startPosition.y;
    
    // 边界检测，确保不走出屏幕
    const maxScreenX = window.innerWidth - emojiContainer.offsetWidth;
    const finalEndX = Math.max(0, Math.min(endX, maxScreenX));
    const actualDistance = finalEndX - startPosition.x;
    
    // 先移除所有transform相关样式，避免冲突
    statusEmoji.style.transform = 'none';
    // 暂停浮动动画，避免冲突
    statusEmoji.style.animationPlayState = 'paused';
    
    // 添加翻转动画，无论是向左还是向右
    // 先设置初始翻转状态
    emojiContainer.style.transition = 'transform 0.05s ease';
    
    if (direction === 'right') {
        // 向右走：先正常，然后翻转
        emojiContainer.style.transform = `translate(${startPosition.x}px, ${startPosition.y}px) scaleX(-1)`;
        // 延迟一下再翻转，产生动画效果
    } else {
        // 向左走：先翻转，然后正常
        emojiContainer.style.transform = `translate(${startPosition.x}px, ${startPosition.y}px) scaleX(-1)`;
        // 延迟一下再恢复，产生动画效果
        setTimeout(() => {
            emojiContainer.style.transform = `translate(${startPosition.x}px, ${startPosition.y}px) scaleX(1)`;
        }, 30);
    }
    
    // 动画函数
    function animateWalk() {
        // 检查是否正在拖拽
        if (window.isEmojiDragging() || !isWalking) {
            // 停止动画，恢复原始状态
            statusEmoji.src = originalSrc;
            statusEmoji.style.transform = 'none';
            statusEmoji.style.animationPlayState = 'running';
            emojiContainer.style.transition = 'none';
            emojiContainer.style.transform = `translate(${startPosition.x}px, ${startPosition.y}px)`;
            isWalking = false;
            return;
        }
        
        const elapsed = Date.now() - startTime;
        
        // 更新位置
        const progress = Math.min(elapsed / duration, 1);
        let newX = startPosition.x + actualDistance * progress;
        // 确保位置在屏幕范围内
        const finalX = Math.max(0, Math.min(newX, maxScreenX));
        
        // 更新翻转动画后的位置
        if (direction === 'right') {
            emojiContainer.style.transform = `translate(${finalX}px, ${endY}px) scaleX(-1)`;
        } else {
            emojiContainer.style.transform = `translate(${finalX}px, ${endY}px) scaleX(1)`;
        }
        
        // 更新帧
        const frameProgress = Math.min(elapsed / frameDuration, frameCount * 2 - 1);
        currentFrame = Math.floor(frameProgress) % frameCount + 1;
        
        // 加载当前帧
        statusEmoji.src = `images/left${currentFrame}.png`;
        
        // 继续动画
        if (progress < 1) {
            requestAnimationFrame(animateWalk);
        } else {
            // 动画结束，恢复原始状态
            statusEmoji.src = originalSrc;
            statusEmoji.style.transform = 'none';
            statusEmoji.style.animationPlayState = 'running';
            emojiContainer.style.transition = 'none';
            emojiContainer.style.transform = `translate(${finalX}px, ${endY}px)`;
            isWalking = false;
        }
    }
    
    // 开始动画
    requestAnimationFrame(animateWalk);
}

// 随机游走函数
function startRandomWalk() {
    // 每3分钟触发一次，概率50%
    randomWalkInterval = setInterval(() => {
        console.log('检查是否触发行走...');
        // 检查是否锁定
        if (isLocked) {
            console.log('表情包已锁定，跳过随机行走');
            return;
        }
        
        // 检查是否正在拖拽或行走
        if (window.isEmojiDragging() || isWalking) {
            console.log('拖拽或行走中，跳过随机行走');
            return;
        }
        
        // 70%概率触发
        if (Math.random() > 1) {
            console.log('随机概率未触发行走');
            return;
        }
        
        console.log('触发随机行走');
        // 随机方向
        const direction = Math.random() > 0.5 ? 'left' : 'right';
        
        // 固定移动距离80px，持续时间1秒
        startEmojiWalkAnimation(direction, 85, 1200);
    }, 10 * 1000); // 10秒（测试用，方便查看效果）
}

// 停止随机游走
function stopRandomWalk() {
    if (randomWalkInterval) {
        clearInterval(randomWalkInterval);
        randomWalkInterval = null;
    }
    isWalking = false;
}

