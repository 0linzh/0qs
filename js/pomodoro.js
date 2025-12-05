// 番茄工作法实现
class PomodoroTimer {
    constructor() {
        // 默认设置
        this.settings = {
            workDuration: 25 * 60,      // 25分钟
            breakDuration: 5 * 60,      // 5分钟
            longBreakDuration: 15 * 60, // 15分钟
            longBreakInterval: 4,       // 每4个番茄后长休息
            dailyGoal: 8,               // 每日目标8个番茄
            autoTaskComplete: false     // 完成任务时自动累计番茄钟
        };
        
        // 状态变量
        this.currentTime = this.settings.workDuration;
        this.isRunning = false;
        this.isWorkPhase = true;
        this.pomodoroCount = 0;
        this.interval = null;
        this.currentTaskId = null; // 当前选中的任务ID
        
        // 从本地存储加载数据
        this.loadData();
        this.initEvents();
        this.updateDisplay();
    }
    
    initEvents() {
        // 标签页切换
        document.querySelectorAll('.timer-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
        
        // 番茄控制按钮
        document.getElementById('start-pomodoro').addEventListener('click', () => this.start());
        document.getElementById('pause-pomodoro').addEventListener('click', () => this.pause());
        document.getElementById('reset-pomodoro').addEventListener('click', () => this.reset());
        document.getElementById('skip-pomodoro').addEventListener('click', () => this.skip());
        
        // 设置按钮
        document.getElementById('pomodoro-settings-btn').addEventListener('click', () => this.toggleSettings());
        document.getElementById('save-pomodoro-settings').addEventListener('click', () => this.saveSettings());
        document.getElementById('cancel-pomodoro-settings').addEventListener('click', () => this.toggleSettings());
        
        // 庆祝效果关闭按钮
        document.getElementById('close-celebration').addEventListener('click', () => {
            document.getElementById('goal-celebration').classList.remove('active');
        });
        
        // 任务管理相关事件
        if (document.getElementById('pomodoro-task-select')) {
            document.getElementById('pomodoro-task-select').addEventListener('change', (e) => {
                this.selectTask(e.target.value);
            });
        }
        
        // 完成任务按钮事件
        if (document.getElementById('complete-task-btn')) {
            document.getElementById('complete-task-btn').addEventListener('click', () => {
                this.completeCurrentTask();
            });
        }
        
        // 设置面板中的自动任务完成选项
        const autoTaskCheckbox = document.getElementById('pomodoro-auto-task');
        if (autoTaskCheckbox) {
            autoTaskCheckbox.addEventListener('change', (e) => {
                this.settings.autoTaskComplete = e.target.checked;
                this.saveSettings();
            });
        }
        
        // 任务刷新按钮事件
        if (document.getElementById('refresh-tasks-btn')) {
            document.getElementById('refresh-tasks-btn').addEventListener('click', () => {
                this.loadTasks();
            });
        }
        
        if (document.getElementById('pomodoro-refresh-tasks')) {
            document.getElementById('pomodoro-refresh-tasks').addEventListener('click', () => {
                this.updateTaskDropdown();
            });
        }
    }
    
    switchTab(tabName) {
        // 更新激活的标签页
        document.querySelectorAll('.timer-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });
        
        // 显示对应的内容
        document.querySelectorAll('.timer-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-timer`);
        });
        
        // 如果切换到番茄钟且正在运行，更新显示
        if (tabName === 'pomodoro' && this.isRunning) {
            this.updateDisplay();
        }
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.interval = setInterval(() => {
            this.tick();
        }, 1000);
        
        this.updateButtonStates();
        this.showNotification('番茄钟开始！专注工作' + (this.settings.workDuration / 60) + '分钟。');
    }
    
    pause() {
        this.isRunning = false;
        clearInterval(this.interval);
        this.updateButtonStates();
        this.showNotification('番茄钟已暂停');
    }
    
    reset() {
        this.pause();
        this.currentTime = this.isWorkPhase ? this.settings.workDuration : 
                          (this.pomodoroCount % this.settings.longBreakInterval === 0 ? 
                           this.settings.longBreakDuration : this.settings.breakDuration);
        this.updateDisplay();
    }
    
    skip() {
        this.pause();
        this.completePhase();
    }
    
    tick() {
        this.currentTime--;
        
        if (this.currentTime <= 0) {
            this.completePhase();
            return;
        }
        
        this.updateDisplay();
        
        // 最后60秒提醒
        if (this.currentTime === 60) {
            this.showTimeAlert();
        }
    }
    
    completePhase() {
        this.pause();
        
        if (this.isWorkPhase) {
            // 记录番茄钟到学习记录
            this.recordPomodoroToStudyHistory();
            
            this.pomodoroCount++;
            this.saveData();
            
            // 自动任务完成功能
            if (this.settings.autoTaskComplete && this.currentTaskId) {
                // 传递参数避免循环调用
                this.completeCurrentTask(false);
            }
            
            this.showNotification(`恭喜！完成第 ${this.pomodoroCount} 个番茄钟。休息一下吧！`);
            
            // 检查是否完成目标
            if (this.pomodoroCount === this.settings.dailyGoal) {
                this.showGoalCelebration();
            }
            
            // 每N个番茄钟后长休息
            if (this.pomodoroCount % this.settings.longBreakInterval === 0) {
                this.currentTime = this.settings.longBreakDuration;
                this.showNotification(`完成${this.settings.longBreakInterval}个番茄钟！享受${this.settings.longBreakDuration / 60}分钟的长休息吧！`);
            } else {
                this.currentTime = this.settings.breakDuration;
            }
            
            // 切换到休息阶段
            this.isWorkPhase = false;
        } else {
            this.showNotification('休息结束！准备开始下一个番茄钟。');
            this.currentTime = this.settings.workDuration;
            
            // 切换到专注阶段
            this.isWorkPhase = true;
        }
        
        this.updateDisplay();
        this.updateButtonStates();
        
        // 播放提示音
        this.playNotificationSound();
    }
    
    // 记录番茄钟到学习记录
    recordPomodoroToStudyHistory() {
        // 获取现有的学习记录
        let timerSessions = [];
        try {
            const storedSessions = localStorage.getItem('timerSessions');
            timerSessions = storedSessions ? JSON.parse(storedSessions) : [];
        } catch (error) {
            console.warn('localStorage getItem timerSessions 失败:', error);
            timerSessions = [];
        }
        
        // 创建新的番茄记录
        const now = new Date();
        const pomodoroRecord = {
            duration: this.settings.workDuration,
            timestamp: now.toLocaleString(),
            display: `${Math.floor(this.settings.workDuration / 60).toString().padStart(2, '0')}:00:00`,
            type: 'pomodoro',
            pomodoroCount: this.pomodoroCount + 1
        };
        
        // 添加到学习记录
        timerSessions.push(pomodoroRecord);
        
        // 保存到本地存储
        try {
            localStorage.setItem('timerSessions', JSON.stringify(timerSessions));
        } catch (error) {
            console.warn('localStorage setItem timerSessions 失败:', error);
        }
        
        // 更新学习记录显示
        if (typeof updateTimerHistory === 'function') {
            updateTimerHistory();
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 更新时间显示
        document.getElementById('pomodoro-display').textContent = timeString;
        
        // 更新阶段显示
        const phaseElement = document.getElementById('pomodoro-phase');
        if (phaseElement) {
            phaseElement.textContent = this.isWorkPhase ? '专注时间' : '休息时间';
            phaseElement.style.color = this.isWorkPhase ? '#e74c3c' : '#2ecc71';
        }
        
        // 更新进度条
        const totalTime = this.isWorkPhase ? this.settings.workDuration : 
                         (this.pomodoroCount % this.settings.longBreakInterval === 0 ? 
                          this.settings.longBreakDuration : this.settings.breakDuration);
        const progress = ((totalTime - this.currentTime) / totalTime) * 100;
        document.getElementById('pomodoro-progress-bar').style.width = `${progress}%`;
        document.getElementById('pomodoro-progress-bar').style.background = this.isWorkPhase ? '#e74c3c' : '#2ecc71';
        
        // 更新番茄计数和目标进度
        document.getElementById('today-pomodoros').textContent = this.pomodoroCount;
        document.getElementById('today-goal').textContent = this.settings.dailyGoal;
        
        // 计算目标进度百分比
        const goalProgress = this.settings.dailyGoal > 0 ? 
            Math.min(100, Math.round((this.pomodoroCount / this.settings.dailyGoal) * 100)) : 0;
        document.getElementById('goal-progress').textContent = `${goalProgress}%`;
        
        // 更新页面标题（当番茄钟运行时）
        if (this.isRunning) {
            const phasePrefix = this.isWorkPhase ? '🍅' : '☕';
            document.title = `${timeString} - ${phasePrefix} ${this.isWorkPhase ? '专注中' : '休息中'} - 凌之寒的工具箱`;
        } else if (document.title.includes('🍅') || document.title.includes('☕')) {
            document.title = '凌之寒的工具箱';
        }
    }
    
    updateButtonStates() {
        const startBtn = document.getElementById('start-pomodoro');
        const pauseBtn = document.getElementById('pause-pomodoro');
        
        if (startBtn && pauseBtn) {
            if (this.isRunning) {
                startBtn.disabled = true;
                pauseBtn.disabled = false;
            } else {
                startBtn.disabled = false;
                pauseBtn.disabled = true;
            }
        }
    }
    
    toggleSettings() {
        const settingsPanel = document.getElementById('pomodoro-settings-panel');
        settingsPanel.classList.toggle('active');
        
        // 如果打开设置面板，填充当前设置
        if (settingsPanel.classList.contains('active')) {
            document.getElementById('work-duration').value = this.settings.workDuration / 60;
            document.getElementById('break-duration').value = this.settings.breakDuration / 60;
            document.getElementById('long-break-duration').value = this.settings.longBreakDuration / 60;
            document.getElementById('long-break-interval').value = this.settings.longBreakInterval;
            document.getElementById('daily-goal').value = this.settings.dailyGoal;
            
            // 设置自动任务完成复选框
            if (document.getElementById('pomodoro-auto-task')) {
                document.getElementById('pomodoro-auto-task').checked = this.settings.autoTaskComplete;
            }
        }
    }
    
    saveSettings() {
        // 获取设置值
        const workDuration = parseInt(document.getElementById('work-duration').value) * 60;
        const breakDuration = parseInt(document.getElementById('break-duration').value) * 60;
        const longBreakDuration = parseInt(document.getElementById('long-break-duration').value) * 60;
        const longBreakInterval = parseInt(document.getElementById('long-break-interval').value);
        const dailyGoal = parseInt(document.getElementById('daily-goal').value);
        
        // 验证设置
        if (workDuration < 60 || breakDuration < 60 || longBreakDuration < 60 || 
            longBreakInterval < 1 || dailyGoal < 1) {
            alert('请确保所有设置都是有效的正数！');
            return;
        }
        
        // 保存设置
        this.settings = {
            workDuration,
            breakDuration,
            longBreakDuration,
            longBreakInterval,
            dailyGoal,
            autoTaskComplete: document.getElementById('pomodoro-auto-task')?.checked || false
        };
        
        // 如果当前没有运行，更新显示
        if (!this.isRunning) {
            this.currentTime = this.isWorkPhase ? this.settings.workDuration : 
                              (this.pomodoroCount % this.settings.longBreakInterval === 0 ? 
                               this.settings.longBreakDuration : this.settings.breakDuration);
            this.updateDisplay();
        }
        
        // 保存到本地存储
        try {
            localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('localStorage setItem pomodoroSettings 失败:', error);
        }
        
        // 关闭设置面板
        this.toggleSettings();
        
        this.showNotification('设置已保存！');
    }
    
    showGoalCelebration() {
        // 显示目标完成庆祝效果
        const celebration = document.getElementById('goal-celebration');
        celebration.classList.add('active');
        
        // 播放庆祝音效
        this.playCelebrationSound();
        
        // 显示特别通知
        this.showNotification(`🎉 太棒了！你已经完成了今日的 ${this.settings.dailyGoal} 个番茄目标！`);
    }
    
    showNotification(message) {
        // 使用浏览器的通知API
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('番茄工作法', {
                body: message,
                icon: '/images/favicon.ico'
            });
        }
        
        // 同时在页面显示提示
        this.showToast(message);
    }
    
    showToast(message) {
        // 创建简单的toast提示
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => toast.style.opacity = '1', 100);
        
        // 3秒后消失
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    showTimeAlert() {
        // 最后60秒的特殊提醒
        if (this.isWorkPhase) {
            this.showNotification('最后1分钟！准备休息');
        } else {
            this.showNotification('休息即将结束，准备继续工作');
        }
    }
    
    playNotificationSound() {
        // 简单的提示音
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (e) {
            console.log('音频播放失败:', e);
        }
    }
    
    playCelebrationSound() {
        // 庆祝音效
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 播放多个频率的音符来创建庆祝音效
            const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                }, index * 100);
            });
        } catch (e) {
            console.log('庆祝音效播放失败:', e);
        }
    }
    
    saveData() {
        const today = new Date().toDateString();
        const data = {
            pomodoroCount: this.pomodoroCount,
            lastUpdate: today,
            settings: this.settings,
            currentTaskId: this.currentTaskId,
            isWorkPhase: this.isWorkPhase,
            currentTime: this.currentTime,
            isRunning: this.isRunning
        };
        try {
            localStorage.setItem('pomodoroData', JSON.stringify(data));
        } catch (error) {
            console.warn('localStorage setItem pomodoroData 失败:', error);
        }
    }
    
    // 选择任务
    selectTask(taskId) {
        if (!taskId) {
            this.currentTask = null;
            this.currentTaskId = null;
            this.hideTaskDisplay();
            if (this.settings) {  // 添加安全检查
                this.settings.selectedTask = null;
            }
            this.saveSettings();
            this.saveData();
            return;
        }
        
        // 获取所有任务
        let tasks = [];
        try {
            const storedTasks = localStorage.getItem('tasks');
            tasks = storedTasks ? JSON.parse(storedTasks) : [];
        } catch (error) {
            console.warn('localStorage getItem tasks 失败:', error);
            tasks = [];
        }
        const task = tasks.find(t => t.id == taskId);
        
        if (task) {
            this.currentTask = task;
            this.currentTaskId = taskId;
            this.settings.selectedTask = taskId;
            this.showTaskDisplay(task);
            this.saveSettings();
            this.saveData();
            this.showNotification(`已选择任务: ${task.name}`);
        }
    }
    
    // 显示任务信息
    showTaskDisplay(task) {
        const taskDisplay = document.getElementById('current-task-display');
        const taskName = document.getElementById('current-task-name');
        const taskDetails = document.getElementById('current-task-details');
        const taskTime = document.getElementById('current-task-time');
        
        if (taskDisplay && taskName && taskDetails && taskTime) {
            taskName.textContent = task.name;
            taskDetails.textContent = task.details || '无任务详情';
            
            let timeText = '';
            if (task.startTime && task.endTime) {
                timeText = `${task.startTime} - ${task.endTime}`;
            } else if (task.startTime) {
                timeText = `开始: ${task.startTime}`;
            } else {
                timeText = '时间未设置';
            }
            
            if (task.location) {
                timeText += ` | ${task.location}`;
            }
            
            taskTime.textContent = timeText;
            taskDisplay.style.display = 'block';
        }
    }
    
    // 隐藏任务信息
    hideTaskDisplay() {
        const taskDisplay = document.getElementById('current-task-display');
        if (taskDisplay) {
            taskDisplay.style.display = 'none';
        }
    }
    
    completeCurrentTask(autoIncrement = true) {
        if (!this.currentTaskId) {
            this.showNotification('请先选择任务');
            return;
        }
        
        // 获取所有任务
        let tasks = [];
        try {
            const storedTasks = localStorage.getItem('tasks');
            tasks = storedTasks ? JSON.parse(storedTasks) : [];
        } catch (error) {
            console.warn('localStorage getItem tasks 失败:', error);
            tasks = [];
        }
        const taskIndex = tasks.findIndex(t => t.id == this.currentTaskId);
        
        if (taskIndex !== -1) {
            // 标记任务为完成
            tasks[taskIndex].completed = true;
            const taskName = tasks[taskIndex].name;
            
            // 保存更新后的任务列表
            try {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            } catch (error) {
                console.warn('localStorage setItem tasks 失败:', error);
            }
            
            // 更新全局tasks变量
            window.tasks = tasks;
            
            // 更新任务详情弹窗中的状态显示（如果弹窗是打开的）
            if (typeof currentTaskDetail !== 'undefined' && currentTaskDetail && currentTaskDetail.id == this.currentTaskId) {
                currentTaskDetail.completed = true;
                const completedCheckbox = document.getElementById('toggle-task-completed');
                const completedStatus = document.getElementById('task-completed-status');
                if (completedCheckbox && completedStatus) {
                    completedCheckbox.checked = true;
                    completedStatus.textContent = '已完成';
                    completedStatus.style.color = '#2ecc71';
                }
            }
            
            // 显示完成通知
            this.showNotification(`✅ 任务 "${taskName}" 已完成！`);
            
            // 如果开启了自动番茄钟功能且允许自动累计，累计番茄钟
            if (autoIncrement && this.settings.autoTaskComplete) {
                this.completeTaskAutoPomodoro();
            }
            
            // 更新界面
            this.currentTask = null;
            this.currentTaskId = null;
            this.settings.selectedTask = null;
            this.hideTaskDisplay();
            this.loadTasks(); // 重新加载任务列表
            
            // 更新其他相关显示
            if (typeof generateHomeCalendar === 'function') {
                generateHomeCalendar();
            }
            if (typeof displayUpcomingTasks === 'function') {
                displayUpcomingTasks();
            }
            if (typeof generateTimetable === 'function') {
                generateTimetable();
            }
        }
    }
    
    // 完成任务时自动累计番茄钟
    completeTaskAutoPomodoro() {
        // 增加番茄计数
        this.pomodoroCount++;
        this.saveData();
        
        // 更新显示
        this.updateDisplay();
        
        // 显示通知
        this.showNotification(`🎉 自动累计第 ${this.pomodoroCount} 个番茄钟！`);
        
        // 检查是否完成目标
        if (this.pomodoroCount === this.settings.dailyGoal) {
            this.showGoalCelebration();
        }
        
        // 无论计时器是否运行，都检查当前阶段
        if (this.isWorkPhase) {
            // 如果当前是专注阶段，切换到休息阶段
            if (this.isRunning) {
                // 如果计时器正在运行，暂停并切换阶段
                this.pause();
            }
            this.switchToBreakPhase();
        } else {
            // 如果当前已经是休息阶段，重置休息时间
            if (this.isRunning) {
                // 如果计时器正在运行，暂停
                this.pause();
            }
            if (this.pomodoroCount % this.settings.longBreakInterval === 0) {
                this.currentTime = this.settings.longBreakDuration;
            } else {
                this.currentTime = this.settings.breakDuration;
            }
            this.updateDisplay();
            this.updateButtonStates();
        }
    }
    
    // 切换到休息阶段（不打断当前计时）
    switchToBreakPhase() {
        this.isWorkPhase = false;
        
        // 每N个番茄钟后长休息
        if (this.pomodoroCount % this.settings.longBreakInterval === 0) {
            this.currentTime = this.settings.longBreakDuration;
        } else {
            this.currentTime = this.settings.breakDuration;
        }
        
        this.updateDisplay();
        this.updateButtonStates();
    }
    
    // 格式化日期显示
    formatDisplayDate(dateString) {
        const date = new Date(dateString);
        const today = new Date().toDateString();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toDateString();
        
        if (date.toDateString() === today) {
            return '今天';
        } else if (date.toDateString() === tomorrowStr) {
            return '明天';
        } else {
            return `${date.getMonth() + 1}月${date.getDate()}日`;
        }
    }
    
    // 加载任务列表
    loadTasks() {
        const taskSelect = document.getElementById('pomodoro-task-select');
        const quickTaskSelection = document.getElementById('quick-task-selection');
        
        if (!taskSelect) return;
        
        // 清空现有选项
        taskSelect.innerHTML = '<option value="">-- 选择任务 --</option>';
        if (quickTaskSelection) {
            quickTaskSelection.innerHTML = '';
        }
        
        // 获取未完成的任务，按日期排序
        const today = new Date().toISOString().split('T')[0];
        let tasks = [];
        try {
            const storedTasks = localStorage.getItem('tasks');
            tasks = storedTasks ? JSON.parse(storedTasks) : [];
        } catch (error) {
            console.warn('localStorage getItem tasks 失败:', error);
            tasks = [];
        }
        const incompleteTasks = tasks
            .filter(task => !task.completed && task.date >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (incompleteTasks.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '暂无未完成任务';
            taskSelect.appendChild(option);
            
            if (quickTaskSelection) {
                quickTaskSelection.innerHTML = '<p style="color: #666; font-size: 14px;">暂无未完成任务</p>';
            }
            return;
        }
        
        // 分组显示任务（按日期）
        const tasksByDate = {};
        incompleteTasks.forEach(task => {
            if (!tasksByDate[task.date]) {
                tasksByDate[task.date] = [];
            }
            tasksByDate[task.date].push(task);
        });
        
        // 填充任务选择框
        Object.keys(tasksByDate).sort().forEach(date => {
            const dateTasks = tasksByDate[date];
            const dateHeader = document.createElement('option');
            dateHeader.disabled = true;
            dateHeader.textContent = `--- ${this.formatDisplayDate(date)} ---`;
            taskSelect.appendChild(dateHeader);
            
            dateTasks.forEach(task => {
                const option = document.createElement('option');
                option.value = task.id;
                option.textContent = `${task.name} ${task.startTime ? `(${task.startTime})` : ''}`;
                taskSelect.appendChild(option);
            });
        });
        
        // 填充快速任务选择（设置面板中）
        if (quickTaskSelection) {
            // 只显示最近3天的任务
            const recentTasks = incompleteTasks.slice(0, 5);
            recentTasks.forEach(task => {
                const taskButton = document.createElement('button');
                taskButton.type = 'button';
                taskButton.className = 'quick-task-btn';
                taskButton.textContent = `${task.name} (${this.formatDisplayDate(task.date)})`;
                taskButton.addEventListener('click', () => {
                    this.currentTaskId = task.id;
                    taskSelect.value = task.id;
                    this.saveData();
                    this.showNotification(`已选择任务: ${task.name}`);
                });
                quickTaskSelection.appendChild(taskButton);
            });
        }
        
        // 如果之前有选中的任务，恢复选中状态
        if (this.settings.selectedTask) {
            const existingTask = incompleteTasks.find(task => task.id == this.settings.selectedTask);
            if (existingTask) {
                taskSelect.value = this.settings.selectedTask;
                this.selectTask(this.settings.selectedTask);
            }
        }
    }
    
    loadData() {
        // 加载设置
        let savedSettings = null;
        try {
            savedSettings = localStorage.getItem('pomodoroSettings');
        } catch (error) {
            console.warn('localStorage getItem pomodoroSettings 失败:', error);
        }
        if (savedSettings) {
            try {
                this.settings = JSON.parse(savedSettings);
            } catch (error) {
                console.warn('JSON.parse pomodoroSettings 失败:', error);
            }
        }
        
        // 加载番茄计数和当前任务
        let data = {};
        try {
            const storedData = localStorage.getItem('pomodoroData');
            data = storedData ? JSON.parse(storedData) : {};
        } catch (error) {
            console.warn('localStorage getItem pomodoroData 失败:', error);
            data = {};
        }
        const today = new Date().toDateString();
        
        // 如果是同一天，加载所有状态；否则重置
        if (data.lastUpdate === today) {
            this.pomodoroCount = data.pomodoroCount || 0;
            this.currentTaskId = data.currentTaskId || null;
            this.isWorkPhase = data.isWorkPhase !== undefined ? data.isWorkPhase : true;
            this.currentTime = data.currentTime || this.settings.workDuration;
            this.isRunning = data.isRunning || false;
        } else {
            this.pomodoroCount = 0;
            this.currentTaskId = null;
            this.isWorkPhase = true;
            this.currentTime = this.settings.workDuration;
            this.isRunning = false;
        }
        
        // 更新任务下拉列表
        this.loadTasks();
    }
}

// 番茄工作法实例通过initNewFeatures初始化