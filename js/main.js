// ===== 全局变量和初始化数据 =====
let tasks = [];
let customTools = {};
let timetableData = null;
let currentWeek = 0;

// 安全地初始化全局变量
try {
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
} catch (error) {
    console.warn('localStorage getItem tasks 失败:', error);
    tasks = [];
}

try {
    const storedCustomTools = localStorage.getItem('customTools');
    customTools = storedCustomTools ? JSON.parse(storedCustomTools) : {};
} catch (error) {
    console.warn('localStorage getItem customTools 失败:', error);
    customTools = {};
}

try {
    const storedTimetableData = localStorage.getItem('timetableData');
    timetableData = storedTimetableData ? JSON.parse(storedTimetableData) : null;
} catch (error) {
    console.warn('localStorage getItem timetableData 失败:', error);
    timetableData = null;
}

try {
    const storedCurrentWeek = localStorage.getItem('currentWeek');
    currentWeek = storedCurrentWeek ? parseInt(storedCurrentWeek) : 0;
} catch (error) {
    console.warn('localStorage getItem currentWeek 失败:', error);
    currentWeek = 0;
}
let currentWeekDates = getWeekDates(currentWeek);

// 当前查看的任务详情
let currentTaskDetail = null;
// 当前显示的月份（首页日历）
let currentHomeMonth = new Date().getMonth();
let currentHomeYear = new Date().getFullYear();
// 当前显示的月份（添加任务弹窗）
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// 学习计时器相关变量
let timerInterval;
let timerSeconds = 0;
let timerRunning = false;
let timerSessions = [];

try {
    const storedTimerSessions = localStorage.getItem('timerSessions');
    timerSessions = storedTimerSessions ? JSON.parse(storedTimerSessions) : [];
} catch (error) {
    console.warn('localStorage getItem timerSessions 失败:', error);
    timerSessions = [];
}

// 飘雪主题相关变量
let snowInterval;
let snowflakes = [];

// 音乐播放器相关变量
let audioPlayer = null;
let isMusicPlaying = false;

// 预定义工具数据
const predefinedTools = {
    'ai-tools': [
        { name: '豆包', url: 'https://www.doubao.com/chat/?from_login=1', icon: '🤖' },
        { name: 'DeepSeek', url: 'https://chat.deepseek.com/a/chat/s/c56c8e1d-2d4f-48ec-85eb-8ece5a65e008', icon: '🧠' },
        { name: '北航AI', url: 'https://chat.buaa.edu.cn/#/micro-app/ai-robot', icon: '✈️' },
        { name: 'V0', url: 'https://v0.dev/', icon: '⚡' }
    ],
    'math-analysis': [
        { name: '数学分析教程', url: 'https://www.bilibili.com/video/BV1zQ4y1B7VP/?spm_id_from=333.1007.top_right_bar_window_history.content.click', icon: '📚' },
        { name: '数学分析习题', url: 'https://math.fudan.edu.cn/anal/34391/list.htm/', icon: '📖' },
        { name: 'MIT数分课程', url: 'https://ocw.mit.edu/courses/mathematics/', icon: '🎓' },
        { name: '数分公式手册', url: 'https://www.math24.net/', icon: '📋' },
        { name: '在线计算工具', url: 'https://www.wolframalpha.com/', icon: '🧮' }
    ],
    'linear-algebra': [
        { name: '高等代数教程', url: 'https://www.bilibili.com/video/BV1aW411Q7x1', icon: '📚' },
        { name: '线性代数习题', url: 'https://www.shuxuele.com/algebra/index.html', icon: '📖' },
        { name: '3Blue1Brown', url: 'https://www.3blue1brown.com/topics/linear-algebra', icon: '🎥' },
        { name: 'Khan Academy', url: 'https://www.khanacademy.org/math/linear-algebra', icon: '🏫' },
        { name: '矩阵计算器', url: 'https://matrixcalc.org/', icon: '🔢' }
    ],
    'programming': [
        { name: 'LeetCode', url: 'https://leetcode.com/', icon: '💻' },
        { name: 'GitHub', url: 'https://github.com/', icon: '🐙' },
        { name: 'Stack Overflow', url: 'https://stackoverflow.com/', icon: '🔍' },
        { name: '菜鸟教程', url: 'https://www.runoob.com/', icon: '📖' },
        { name: '(html学习)W3Schools', url: 'https://www.w3schools.com/', icon: '🌐' },
        { name: 'Codecademy', url: 'https://www.codecademy.com/', icon: '🎯' }
    ],
    'media-tools': [
        { name: '音频编辑', url: 'https://www.audacityteam.org/', icon: '🎵' },
        { name: '视频剪辑', url: 'https://www.shotcut.org/', icon: '🎬' },
        { name: '在线转换', url: 'https://convertio.co/zh/', icon: '🔄' },
        { name: 'Canva', url: 'https://www.canva.com/', icon: '🎨' },
        { name: 'Remove.bg', url: 'https://www.remove.bg/', icon: '🖼️' },
        { name: '在线录屏', url: 'https://www.online-voice-recorder.com/', icon: '🎤' }
    ],
    'other-tools': [
        { name: '在线翻译', url: 'https://fanyi.baidu.com/', icon: '🌐' },
        { name: 'PDF工具', url: 'https://smallpdf.com/cn', icon: '📄' },
        { name: 'ProcessOn', url: 'https://www.processon.com/', icon: '📊' },
        { name: '石墨文档', url: 'https://shimo.im/', icon: '📝' }
    ],
    'english-learning': [
        { name: 'U校园AI版', url: 'https://ucloud.unipus.cn/home', icon: '🏫' },
        { name: '讯飞英语学习', url: 'https://www.fifedu.com/iplat/html/home/home.html?v=5.4.1', icon: '🔊' }
    ]
};

// 名言警句
const quotes = [
    '"此刻打盹，你将做梦；而此刻学习，你将圆梦。" — 哈佛图书馆训言',
    '"我荒废的今日，正是昨日殒身之人祈求的明日。" — 哈佛图书馆训言',
    '"！！！原！神！启！动！！！"',
    '"觉得为时已晚的时候，恰恰是最早的时候。" — 哈佛图书馆训言',
    '"勿将今日之事拖到明日。" — 哈佛图书馆训言',
    '"哈基米南北绿豆"',
    '"学习时的苦痛是暂时的，未学到的痛苦是终生的。" — 哈佛图书馆训言',
    '"学习这件事，不是缺乏时间，而是缺乏努力。" — 哈佛图书馆训言',
    '"只有比别人更早、更勤奋地努力，才能尝到成功的滋味。" — 哈佛图书馆训言',
    '"谁也不能随随便便成功，它来自彻底的自我管理和毅力。" — 哈佛图书馆训言',
    '"德才兼备，知行合一"-北航校训',
    '"自强不息，厚德载物"-清华校训',
    '"博学而笃志，切问而近思"',
    '"学而不思则罔，思而不学则殆"',
    '"千里之行，始于足下"',
    '"不要失去信心，只要坚持不懈，就终会有成果的"-钱学森',
    '"业精于勤，荒于嬉；行成于思，毁于随"-韩愈',
    '"学而时习之，不亦说乎" — 孔子',
    '"温故而知新，可以为师矣" — 孔子',
    '"三人行，必有我师焉。择其善者而从之，其不善者而改之" — 孔子',
    '"学不可以已" — 荀子',
    '"青，取之于蓝，而青于蓝；冰，水为之，而寒于水" — 荀子',
    '"人有知学，则有力矣" — 王充',
    '"少而好学，如日出之阳；壮而好学，如日中之光；老而好学，如炳烛之明" — 刘向',
    '"非学无以广才，非志无以成学" — 诸葛亮',
    '"积财千万，不如薄技在身" — 颜之推',
    '"书山有路勤为径，学海无涯苦作舟" — 韩愈',
    '"读书之法，在循序而渐进，熟读而精思" — 朱熹',
    '"君子之学，死而后已" — 顾炎武',
    '"己所不欲，勿施于人" — 孔子',
    '"君子坦荡荡，小人长戚戚" — 孔子',
    '"上善若水，水善利万物而不争" — 老子',
    '"知人者智，自知者明" — 老子',
    '"富贵不能淫，贫贱不能移，威武不能屈" — 孟子',
    '"穷则独善其身，达则兼济天下" — 孟子',
    '"吾生也有涯，而知也无涯" — 庄子',
    '"不登高山，不知天之高也；不临深溪，不知地之厚也" — 荀子',
    '"路漫漫其修远兮，吾将上下而求索" — 屈原',
    '"人固有一死，或重于泰山，或轻于鸿毛" — 司马迁',
    '"非淡泊无以明志，非宁静无以致远" — 诸葛亮',
    '"先天下之忧而忧，后天下之乐而乐" — 范仲淹',
    '"出淤泥而不染，濯清涟而不妖" — 周敦颐',
    '"锲而舍之，朽木不折；锲而不舍，金石可镂" — 荀子',
    '"玉不琢，不成器；人不学，不知道" — 《礼记》',
    '"精诚所至，金石为开" — 《后汉书》',
    '"老骥伏枥，志在千里；烈士暮年，壮心不已" — 曹操',
    '"仰观宇宙之大，俯察品类之盛" — 王羲之',
    '"勤学如春起之苗，不见其增，日有所长" — 陶渊明',
    '"天生我材必有用，千金散尽还复来" — 李白',
    '"会当凌绝顶，一览众山小" — 杜甫',
    '"沉舟侧畔千帆过，病树前头万木春" — 刘禹锡',
    '"野火烧不尽，春风吹又生" — 白居易',
    '"逝者如斯夫，不舍昼夜" — 孔子',
    '"人生天地之间，若白驹之过隙，忽然而已" — 庄子',
    '"少壮不努力，老大徒伤悲" — 《汉乐府》',
    '"盛年不重来，一日难再晨。及时当勉励，岁月不待人" — 陶渊明',
    '"劝君莫惜金缕衣，劝君惜取少年时" — 杜秋娘',
    '"知之非艰，行之惟艰" — 《尚书》',
    '"敏而好学，不耻下问" — 孔子',
    '"合抱之木，生于毫末；九层之台，起于累土；千里之行，始于足下" — 老子',
    '"不闻不若闻之，闻之不若见之，见之不若知之，知之不若行之" — 荀子',
    '"纸上得来终觉浅，绝知此事要躬行" — 陆游',
    '"知行合一" — 王阳明',
    '"行可兼知，而知不可兼行" — 王夫之',
    '"学而不思则罔，思而不学则殆" — 孔子',
    '"天行健，君子以自强不息；地势坤，君子以厚德载物" — 《周易》',
    '"知彼知己，百战不殆" — 《孙子兵法》',
    '"世异则事异，事异则备变" — 韩非子',
    '"正其义不谋其利，明其道不计其功" — 董仲舒',
    '"操千曲而后晓声，观千剑而后识器" — 刘勰',
    '"古之立大事者，不惟有超世之才，亦必有坚忍不拔之志" — 苏轼',
    '"长太息以掩涕兮，哀民生之多艰" — 屈原',
    '"举世皆浊我独清，众人皆醉我独醒" — 屈原',
    '"仰观宇宙之大，俯察品类之盛" — 王羲之',
    '"勤学如春起之苗，不见其增，日有所长" — 陶渊明',
    '"天生我材必有用，千金散尽还复来" — 李白',
    '"会当凌绝顶，一览众山小" — 杜甫'
];

// 修改任务数据结构，添加完成状态
tasks = tasks.map(task => {
    if (task.completed === undefined) {
        task.completed = false;
    }
    return task;
});
try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
} catch (error) {
    console.warn('localStorage setItem tasks 失败:', error);
}

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initAllFeatures();
});

function initAllFeatures() {
    // 初始化导航
    initNavigation();
    
    // 初始化任务相关功能
    initTasks();
    
    // 初始化工具页面
    initTools();
    
    // 初始化弹窗
    initModals();
    
    // 生成系统任务（早中晚饭）
    generateSystemTasks();
    
    // 生成首页日历
    generateHomeCalendar();
    
    // 显示即将开始的任务
    displayUpcomingTasks();
    
    // 初始化鼠标特效
    initMouseEffects();
    
    // 检查头像图片
    checkAvatarImage();
    
    // 初始化首页日历导航
    initHomeCalendarNav();
    
    // 初始化新功能
    initNewFeatures();
    
    // 初始化footer名言
    initFooterQuotes();
    
    // 初始化使用说明弹窗
    initUsageGuide();
    
    // 初始化"不要点"菜单项
    initDontClick();
    
    // 初始化课表功能
    initTimetable();
    
    // 设置内存管理
    initMemoryManagement();
    
    // 启动系统任务检查定时器（每小时检查一次）
    setInterval(() => {
        deleteExpiredSystemTasks();
        generateSystemTasks();
        refreshAllTaskDisplays();
    }, 3600000);
}

// ===== 导航功能 =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
            }
        });
    });
}

function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.tools-page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示首页或指定页面
    if (pageId === 'home') {
        document.getElementById('home-page').style.display = 'flex';
    } else {
        document.getElementById('home-page').style.display = 'none';
        document.getElementById(`${pageId}-page`).classList.add('active');
        
        // 如果是课表页面，确保课表数据是最新的
        if (pageId === 'timetable') {
            setTimeout(() => {
                if (timetableData) {
                    generateTimetable();
                    updateTimetableStats();
                }
            }, 100);
        }
    }
}

// ===== 任务管理功能 =====
function initTasks() {
    document.getElementById('add-task-btn').addEventListener('click', function() {
        document.getElementById('add-task-modal').classList.add('active');
        generateMonthCalendar();
    });
    
    document.getElementById('save-task-btn').addEventListener('click', saveTask);
    document.getElementById('delete-task-btn').addEventListener('click', deleteTask);
}

// 修改显示即将开始的任务函数 - 扩展为4天范围
function displayUpcomingTasks() {
    const upcomingTasksContainer = document.getElementById('upcoming-tasks');
    upcomingTasksContainer.innerHTML = '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 修复日期比较：只比较日期部分，不比较时间部分
    const fourDaysLater = new Date(today);
    fourDaysLater.setDate(today.getDate() + 4); // 改为4天
    
    const upcomingTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0); // 修复日期比较：只比较日期部分，不比较时间部分
        return taskDate >= today && taskDate <= fourDaysLater;
    }).sort((a, b) => {
        // 优化排序：按日期和时间排序，确保任务按实际发生顺序显示
        const dateA = new Date(a.date + ' ' + (a.startTime || '00:00'));
        const dateB = new Date(b.date + ' ' + (b.startTime || '00:00'));
        return dateA - dateB;
    });
    
    if (upcomingTasks.length === 0) {
        upcomingTasksContainer.innerHTML = '<li class="task-item">暂无即将开始的任务</li>';
        return;
    }
    
    upcomingTasks.forEach(task => {
        const taskItem = document.createElement('li');
        
        // 设置任务样式，区分系统任务和人工任务
        let taskClass = 'task-item';
        
        // 系统任务样式
        if (task.isSystemAdded) {
            taskClass += ' system-added';
        }
        
        // 完成状态样式
        if (task.completed) {
            taskClass += ' completed';
        }
        
        // 紧急任务样式（仅人工任务）
        if (!task.isSystemAdded) {
            const taskDateTime = new Date(task.date + ' ' + (task.startTime || '00:00'));
            const timeDiff = taskDateTime - new Date();
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            const isUrgent = hoursDiff < 24 && hoursDiff > 0 && !task.completed;
            
            if (isUrgent) {
                taskClass += ' urgent';
            }
        }
        
        taskItem.className = taskClass;
        
        // 任务标题前缀
        const taskPrefix = task.completed ? '✅' : (task.isSystemAdded ? '🍽️' : '📝');
        
        // 紧急标签（仅人工任务）
        const urgentTag = !task.isSystemAdded && taskClass.includes('urgent') ? '<span class="urgent-tag">急</span>' : '';
        
        // 系统任务标记
        const systemTag = task.isSystemAdded ? '<span class="system-tag">系统任务</span>' : '';
        
        taskItem.innerHTML = `
            <div class="task-title">
                ${taskPrefix} ${task.name}
                ${urgentTag}
                ${systemTag}
            </div>
            <div class="task-details">${formatDisplayDate(task.date)} ${task.startTime || ''}</div>
            ${!task.isSystemAdded ? '<button class="task-delete">×</button>' : ''}
        `;
        
        // 任务点击事件
        taskItem.addEventListener('click', function() {
            if (task.isSystemAdded) {
                // 系统任务点击显示食物推荐弹窗
                console.log('System task clicked, calling showFoodRecommendationModal');
                console.log('showFoodRecommendationModal available:', typeof showFoodRecommendationModal !== 'undefined');
                if (typeof window.showFoodRecommendationModal !== 'undefined') {
                    window.showFoodRecommendationModal(task);
                } else if (typeof showFoodRecommendationModal !== 'undefined') {
                    showFoodRecommendationModal(task);
                } else {
                    console.error('showFoodRecommendationModal function not found');
                    alert('食物推荐功能尚未加载，请刷新页面重试');
                }
            } else {
                // 人工任务点击显示详情
                showTaskDetail(task);
            }
        });
        
        // 删除按钮事件（仅人工任务）
        if (!task.isSystemAdded) {
            const deleteBtn = taskItem.querySelector('.task-delete');
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                if (confirm('确定要删除这个任务吗？')) {
                    tasks = tasks.filter(t => t.id !== task.id);
                    try {
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                    } catch (error) {
                        console.warn('localStorage setItem tasks 失败:', error);
                    }
                    displayUpcomingTasks();
                    generateHomeCalendar();
                    
                    // 刷新番茄工作法的任务列表
                    if (pomodoroTimer && typeof pomodoroTimer.loadTasks === 'function') {
                        setTimeout(() => {
                            pomodoroTimer.loadTasks();
                        }, 100);
                    }
                }
            });
        }
        
        upcomingTasksContainer.appendChild(taskItem);
    });
}

function saveTask() {
    const selectedDateElement = document.querySelector('.calendar-date.selected');
    if (!selectedDateElement) {
        alert('请选择日期');
        return;
    }
    
    const selectedDate = selectedDateElement.getAttribute('data-date');
    const name = document.getElementById('task-name').value;
    const details = document.getElementById('task-details').value;
    const startTime = document.getElementById('task-start').value;
    const endTime = document.getElementById('task-end').value;
    const location = document.getElementById('task-location').value;
    const completed = document.getElementById('task-completed')?.checked || false;
    
    if (!name) {
        alert('请输入任务名称');
        return;
    }
    
    const task = {
        id: Date.now(),
        date: selectedDate,
        name,
        details,
        startTime,
        endTime,
        location,
        completed,
        isSystemAdded: false // 人工添加的任务，isSystemAdded默认为false
    };
    
    tasks.push(task);
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.warn('localStorage setItem tasks 失败:', error);
    }
    
    // 关闭弹窗
    document.getElementById('add-task-modal').classList.remove('active');
    
    // 重置表单
    document.getElementById('task-name').value = '';
    document.getElementById('task-details').value = '';
    document.getElementById('task-start').value = '';
    document.getElementById('task-end').value = '';
    document.getElementById('task-location').value = '';
    if (document.getElementById('task-completed')) {
        document.getElementById('task-completed').checked = false;
    }
    
    // 调用统一刷新机制
    refreshAllTaskDisplays();
}

function deleteTask() {
    if (!currentTaskDetail) return;
    
    if (confirm('确定要删除这个任务吗？')) {
        tasks = tasks.filter(task => task.id !== currentTaskDetail.id);
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.warn('localStorage setItem tasks 失败:', error);
        }
        
        // 关闭弹窗
        document.getElementById('task-detail-modal').classList.remove('active');
        
        // 调用统一刷新机制
        refreshAllTaskDisplays();
    }
}

function toggleTaskCompleted(taskId, completed) {
    // 查找任务
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        // 防止系统任务切换完成状态
        if (tasks[taskIndex].isSystemAdded) {
            return;
        }
        
        tasks[taskIndex].completed = completed;
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.warn('localStorage setItem tasks 失败:', error);
        }
        
        // 只在任务详情弹窗打开时更新DOM
        const taskDetailModal = document.getElementById('task-detail-modal');
        if (taskDetailModal && taskDetailModal.classList.contains('active')) {
            const completedStatus = document.getElementById('task-completed-status');
            if (completedStatus) {
                completedStatus.textContent = completed ? '已完成' : '未完成';
                completedStatus.style.color = completed ? '#2ecc71' : '#e74c3c';
            }
        }
        
        // 调用统一刷新机制
        refreshAllTaskDisplays();
    }
}

// 统一刷新所有任务显示的函数
function refreshAllTaskDisplays() {
    // 更新主页日历
    generateHomeCalendar();
    
    // 更新即将到期任务列表
    displayUpcomingTasks();
    
    // 如果当前显示的是课表页面，刷新课表中的任务显示
    const timetablePage = document.getElementById('timetable-page');
    if (timetablePage && timetablePage.classList.contains('active')) {
        generateTimetable();
    }
    
    // 刷新番茄工作法的任务列表
    if (typeof pomodoroTimer !== 'undefined' && typeof pomodoroTimer.loadTasks === 'function') {
        pomodoroTimer.loadTasks();
    }
    
    // 更新表情状态，确保任务完成后表情能及时更新
    if (typeof updateEmojiState === 'function') {
        updateEmojiState();
    }
}

// ===== 系统任务功能 =====
// 生成系统任务（早中晚饭）
function generateSystemTasks() {
    // 删除当天之前的所有系统任务
    deleteExpiredSystemTasks();
    
    const today = new Date();
    const todayStr = formatDate(today);
    
    // 检查今天是否已经生成了系统任务
    const hasSystemTasksToday = tasks.some(task => 
        task.date === todayStr && task.isSystemAdded
    );
    
    if (hasSystemTasksToday) {
        return; // 今天已经生成了系统任务，不需要再生成
    }
    
    // 系统任务配置
    const systemTasksConfig = [
        { name: '吃早餐', time: '08:00', type: 'diet', description: '建议早餐时间' },
        { name: '吃午餐', time: '12:00', type: 'diet', description: '建议午餐时间' },
        { name: '吃晚餐', time: '18:00', type: 'diet', description: '建议晚餐时间' }
    ];
    
    // 生成今天的系统任务
    systemTasksConfig.forEach(config => {
        const newTask = {
            id: Date.now() + Math.random() * 1000,
            date: todayStr,
            name: config.name,
            details: config.description,
            startTime: config.time,
            endTime: config.time,
            location: '',
            completed: false,
            isSystemAdded: true,
            type: config.type
        };
        
        tasks.push(newTask);
    });
    
    // 保存任务到localStorage
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.warn('localStorage setItem tasks 失败:', error);
    }
}

// 删除过期的系统任务
function deleteExpiredSystemTasks() {
    const now = new Date();
    
    // 过滤掉过期的系统任务
    tasks = tasks.filter(task => {
        if (!task.isSystemAdded) {
            return true; // 保留非系统任务
        }
        
        // 检查系统任务是否过期
        return !isSystemTaskExpired(task);
    });
    
    // 保存任务到localStorage
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.warn('localStorage setItem tasks 失败:', error);
    }
}

// 检查系统任务是否过期
function isSystemTaskExpired(task) {
    const now = new Date();
    const taskDateTime = new Date(`${task.date}T${task.startTime || '00:00'}`);
    
    // 系统任务过期时间：超过开始时间即过期
    return now > taskDateTime;
}

// 检查系统任务是否是今天的
function isTodaySystemTask(task) {
    const today = new Date();
    const taskDate = new Date(task.date);
    return task.isSystemAdded && 
           taskDate.getDate() === today.getDate() &&
           taskDate.getMonth() === today.getMonth() &&
           taskDate.getFullYear() === today.getFullYear();
}

function showTaskDetail(task) {
    // 防止系统任务显示详情
    if (task.isSystemAdded) {
        return;
    }
    
    currentTaskDetail = task;
    
    // 获取当天所有任务（仅人工任务）
    const sameDayTasks = tasks.filter(t => t.date === task.date && !t.isSystemAdded).sort((a, b) => {
        // 按开始时间排序，如果没有开始时间则按任务名称
        if (a.startTime && b.startTime) {
            return a.startTime.localeCompare(b.startTime);
        }
        return a.name.localeCompare(b.name);
    });
    
    // 找到当前任务在当天任务列表中的位置
    const currentIndex = sameDayTasks.findIndex(t => t.id === task.id);
    const totalTasks = sameDayTasks.length;
    
    document.getElementById('detail-task-name').textContent = task.name;
    document.getElementById('detail-task-details').textContent = task.details || '无详情';
    document.getElementById('detail-task-time').textContent = `${task.startTime || '未设置'} - ${task.endTime || '未设置'}`;
    document.getElementById('detail-task-location').textContent = task.location || '未设置';
    
    // 设置完成状态
    const completedCheckbox = document.getElementById('toggle-task-completed');
    const completedStatus = document.getElementById('task-completed-status');
    
    if (completedCheckbox && completedStatus) {
        completedCheckbox.checked = task.completed || false;
        completedStatus.textContent = task.completed ? '已完成' : '未完成';
        completedStatus.style.color = task.completed ? '#2ecc71' : '#e74c3c';
        
        // 添加完成状态切换事件
        completedCheckbox.onchange = function() {
            toggleTaskCompleted(task.id, this.checked);
        };
    }
    
    // 添加任务位置指示器
    const positionIndicator = document.createElement('div');
    positionIndicator.className = 'task-position-indicator';
    positionIndicator.innerHTML = `任务 ${currentIndex + 1}/${totalTasks}`;
    positionIndicator.style.cssText = 'text-align: center; margin: 10px 0; font-weight: bold; color: #3498db;';
    
    // 查找或创建任务位置指示器容器
    let positionContainer = document.querySelector('.task-position-container');
    if (!positionContainer) {
        positionContainer = document.createElement('div');
        positionContainer.className = 'task-position-container';
        document.querySelector('.task-details-content').prepend(positionContainer);
    }
    positionContainer.innerHTML = '';
    positionContainer.appendChild(positionIndicator);
    
    // 添加同一天任务切换按钮
    const sameDayNav = document.createElement('div');
    sameDayNav.className = 'same-day-navigation';
    sameDayNav.style.cssText = 'display: flex; justify-content: space-between; margin: 10px 0;';
    
    if (totalTasks > 1) {
        const prevTaskBtn = document.createElement('button');
        prevTaskBtn.className = 'nav-btn';
        prevTaskBtn.textContent = '← 上一个任务';
        prevTaskBtn.disabled = currentIndex === 0;
        prevTaskBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                showTaskDetail(sameDayTasks[currentIndex - 1]);
            }
        });
        
        const nextTaskBtn = document.createElement('button');
        nextTaskBtn.className = 'nav-btn';
        nextTaskBtn.textContent = '下一个任务 →';
        nextTaskBtn.disabled = currentIndex === totalTasks - 1;
        nextTaskBtn.addEventListener('click', function() {
            if (currentIndex < totalTasks - 1) {
                showTaskDetail(sameDayTasks[currentIndex + 1]);
            }
        });
        
        sameDayNav.appendChild(prevTaskBtn);
        sameDayNav.appendChild(nextTaskBtn);
        positionContainer.appendChild(sameDayNav);
    }
    
    document.getElementById('task-detail-modal').classList.add('active');
}

// ===== 日历功能 =====
function initHomeCalendarNav() {
    document.getElementById('home-prev-month-btn').addEventListener('click', function() {
        currentHomeMonth--;
        if (currentHomeMonth < 0) {
            currentHomeMonth = 11;
            currentHomeYear--;
        }
        generateHomeCalendar();
    });
    
    document.getElementById('home-next-month-btn').addEventListener('click', function() {
        currentHomeMonth++;
        if (currentHomeMonth > 11) {
            currentHomeMonth = 0;
            currentHomeYear++;
        }
        generateHomeCalendar();
    });
}

function generateHomeCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // 更新月份显示
    document.getElementById('home-calendar-month').textContent = `${currentHomeYear}年${currentHomeMonth + 1}月`;
    
    // 添加星期标题
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });
    
    const firstDay = new Date(currentHomeYear, currentHomeMonth, 1);
    const lastDay = new Date(currentHomeYear, currentHomeMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const today = new Date();
    
    // 添加上个月的日期
    const prevMonthLastDay = new Date(currentHomeYear, currentHomeMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = prevMonthLastDay - i;
        calendar.appendChild(dayElement);
    }
    
    // 添加当前月的日期
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dateStr = formatDate(new Date(currentHomeYear, currentHomeMonth, i));
        
        // 标记今天
        if (currentHomeYear === today.getFullYear() && 
            currentHomeMonth === today.getMonth() && 
            i === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // 统计当天任务完成情况（仅统计人工任务）
        const dayTasks = tasks.filter(task => task.date === dateStr && !task.isSystemAdded);
        const completedTasks = dayTasks.filter(task => task.completed).length;
        const totalTasks = dayTasks.length;
        
        // 标记有任务的日子
        if (totalTasks > 0) {
            dayElement.classList.add('has-task');
            
            if (completedTasks === totalTasks) {
                // 所有任务都已完成
                dayElement.classList.add('all-completed');
            } else if (completedTasks > 0) {
                // 部分任务已完成
                dayElement.classList.add('partial-completed');
            } else {
                // 没有任务完成
                dayElement.classList.add('no-completed');
            }
        }
        
        // 添加日期数字
        dayElement.textContent = i;
        
        dayElement.addEventListener('click', function() {
            showTasksForDate(dateStr);
        });
        
        calendar.appendChild(dayElement);
    }
    
    // 添加下个月的日期
    const totalCells = 42; // 6行 * 7列
    const remainingCells = totalCells - (startingDay + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = i;
        calendar.appendChild(dayElement);
    }
}

function generateMonthCalendar() {
    const monthCalendar = document.getElementById('month-calendar');
    monthCalendar.innerHTML = '';
    
    // 创建日历导航
    const calendarNav = document.createElement('div');
    calendarNav.className = 'calendar-navigation';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'calendar-nav-btn';
    prevBtn.innerHTML = '←';
    prevBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateMonthCalendar();
    });
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'calendar-nav-btn';
    nextBtn.innerHTML = '→';
    nextBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateMonthCalendar();
    });
    
    const monthDisplay = document.createElement('div');
    monthDisplay.className = 'calendar-month';
    monthDisplay.textContent = `${currentYear}年${currentMonth + 1}月`;
    
    calendarNav.appendChild(prevBtn);
    calendarNav.appendChild(monthDisplay);
    calendarNav.appendChild(nextBtn);
    
    monthCalendar.appendChild(calendarNav);
    
    // 创建星期标题
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekdaysRow = document.createElement('div');
    weekdaysRow.className = 'month-calendar-grid';
    
    weekdays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-weekday';
        dayElement.textContent = day;
        weekdaysRow.appendChild(dayElement);
    });
    
    monthCalendar.appendChild(weekdaysRow);
    
    // 创建日期网格
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const datesGrid = document.createElement('div');
    datesGrid.className = 'month-calendar-grid';
    
    // 添加上个月的日期
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date other-month';
        dateElement.textContent = prevMonthLastDay - i;
        datesGrid.appendChild(dateElement);
    }
    
    // 添加当前月的日期
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date';
        dateElement.textContent = i;
        dateElement.setAttribute('data-date', formatDate(new Date(currentYear, currentMonth, i)));
        
        // 标记今天
        if (currentYear === today.getFullYear() && currentMonth === today.getMonth() && i === today.getDate()) {
            dateElement.classList.add('today');
        }
        
        dateElement.addEventListener('click', function() {
            // 移除之前选中的日期
            document.querySelectorAll('.calendar-date.selected').forEach(el => {
                el.classList.remove('selected');
            });
            
            // 选中当前日期
            this.classList.add('selected');
        });
        
        datesGrid.appendChild(dateElement);
    }
    
    // 添加下个月的日期
    const totalCells = 42; // 6行 * 7列
    const remainingCells = totalCells - (startingDay + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date other-month';
        dateElement.textContent = i;
        datesGrid.appendChild(dateElement);
    }
    
    monthCalendar.appendChild(datesGrid);
}

function showTasksForDate(date) {
    const dateTasks = tasks.filter(task => task.date === date);
    
    if (dateTasks.length === 0) {
        alert('这一天没有任务');
        return;
    }
    
    // 显示第一个任务详情
    showTaskDetail(dateTasks[0]);
}

// ===== 工具管理功能 =====
function initTools() {
    // 为每个工具分类创建网格
    for (const category in predefinedTools) {
        createToolGrid(category, predefinedTools[category]);
    }
    
    // 添加自定义工具
    for (const category in customTools) {
        if (predefinedTools[category]) {
            predefinedTools[category].push(...customTools[category]);
        } else {
            predefinedTools[category] = customTools[category];
        }
        createToolGrid(category, predefinedTools[category]);
    }
    
    // 保存工具按钮事件
    document.getElementById('save-tool-btn').addEventListener('click', saveCustomTool);
    
    // 数据管理功能
    document.getElementById('export-data-btn').addEventListener('click', exportToolsData);
    document.getElementById('import-data-btn').addEventListener('click', function() {
        document.getElementById('import-file-input').click();
    });
    document.getElementById('import-file-input').addEventListener('change', importToolsData);
    document.getElementById('clear-data-btn').addEventListener('click', clearAllData);
    document.getElementById('view-data-btn').addEventListener('click', viewToolsData);
    document.getElementById('close-preview-btn').addEventListener('click', function() {
        document.getElementById('data-preview').style.display = 'none';
    });
}

function createToolGrid(category, tools) {
    const gridId = `${category}-grid`;
    const gridElement = document.getElementById(gridId);
    
    if (!gridElement) return;
    
    gridElement.innerHTML = '';
    
    tools.forEach(tool => {
        const toolElement = document.createElement('a');
        toolElement.className = 'tool-item';
        toolElement.href = tool.url;
        toolElement.target = '_blank';
        toolElement.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-name">${tool.name}</div>
            <button class="tool-delete">×</button>
        `;
        
        // 为自定义工具添加删除功能
        const isCustom = customTools[category] && customTools[category].some(t => 
            t.name === tool.name && t.url === tool.url
        );
        
        if (isCustom) {
            const deleteBtn = toolElement.querySelector('.tool-delete');
            deleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (confirm(`确定要删除工具 "${tool.name}" 吗？`)) {
                    // 从customTools中删除
                    customTools[category] = customTools[category].filter(t => 
                        !(t.name === tool.name && t.url === tool.url)
                    );
                    
                    // 从predefinedTools中删除
                    predefinedTools[category] = predefinedTools[category].filter(t => 
                        !(t.name === tool.name && t.url === tool.url)
                    );
                    
                    // 更新localStorage
                    try {
                        localStorage.setItem('customTools', JSON.stringify(customTools));
                    } catch (error) {
                        console.warn('localStorage setItem customTools 失败:', error);
                    }
                    
                    // 重新创建工具网格
                    createToolGrid(category, predefinedTools[category]);
                }
            });
        } else {
            // 预定义工具不显示删除按钮
            toolElement.querySelector('.tool-delete').style.display = 'none';
        }
        
        gridElement.appendChild(toolElement);
    });
    
    // 添加"添加工具"按钮
    if (category !== 'add-tool') {
        const addToolElement = document.createElement('div');
        addToolElement.className = 'tool-item add-tool';
        addToolElement.innerHTML = `
            <div class="tool-icon">+</div>
            <div class="tool-name">添加工具</div>
        `;
        addToolElement.addEventListener('click', function() {
            showPage('add-tool');
        });
        gridElement.appendChild(addToolElement);
    }
}

function saveCustomTool() {
    const name = document.getElementById('tool-name').value;
    const url = document.getElementById('tool-url').value;
    const category = document.getElementById('tool-category').value;
    
    if (!name || !url) {
        alert('请填写工具名称和链接');
        return;
    }
    
    if (!customTools[category]) {
        customTools[category] = [];
    }
    
    const newTool = {
        name,
        url,
        icon: '🔧'
    };
    
    customTools[category].push(newTool);
    try {
        localStorage.setItem('customTools', JSON.stringify(customTools));
    } catch (error) {
        console.warn('localStorage setItem customTools 失败:', error);
    }
    
    // 更新工具网格
    if (predefinedTools[category]) {
        predefinedTools[category].push(newTool);
    } else {
        predefinedTools[category] = [newTool];
    }
    
    createToolGrid(category, predefinedTools[category]);
    
    // 重置表单
    document.getElementById('tool-name').value = '';
    document.getElementById('tool-url').value = '';
    
    alert('工具添加成功！');
}

// ===== 数据管理功能 =====
function exportToolsData() {
    try {
        // 构建导出数据对象
        const exportData = {
            customTools: customTools || {},
            tasks: tasks || [],
            timetableData: timetableData || null,
            countdownData: {
                date: localStorage.getItem('countdownDate') || '2026-01-15',
                title: localStorage.getItem('countdownTitle') || '期末考试'
            },
            timerSessions: timerSessions || [],
            pomodoroData: JSON.parse(localStorage.getItem('pomodoroData') || '{}'),
            pomodoroSettings: JSON.parse(localStorage.getItem('pomodoroSettings') || '{}'),
            exportTime: new Date().toISOString(),
            version: '1.2'
        };
        
        // 转换为JSON字符串
        const dataStr = JSON.stringify(exportData, null, 2);
        
        // 创建下载
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my_toolbox_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`数据导出成功！共导出 ${exportData.tasks.length} 个任务。`);
    } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败，请检查控制台错误信息');
    }
}

function importToolsData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // 导入自定义工具数据
            if (importedData.customTools) {
                for (const category in importedData.customTools) {
                    if (!customTools[category]) {
                        customTools[category] = [];
                    }
                    // 避免重复添加
                    importedData.customTools[category].forEach(newTool => {
                        const exists = customTools[category].some(tool => 
                            tool.name === newTool.name && tool.url === newTool.url
                        );
                        if (!exists) {
                            customTools[category].push(newTool);
                        }
                    });
                }
                try {
                    localStorage.setItem('customTools', JSON.stringify(customTools));
                } catch (error) {
                    console.warn('localStorage setItem customTools 失败:', error);
                }
            }
            
            // 导入任务数据
            if (importedData.tasks) {
                tasks = importedData.tasks;
                try {
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                } catch (error) {
                    console.warn('localStorage setItem tasks 失败:', error);
                }
                
                // 更新任务显示
                generateHomeCalendar();
                displayUpcomingTasks();
            }
            
            // 导入课表数据
            if (importedData.timetableData) {
                timetableData = importedData.timetableData;
                try {
                    localStorage.setItem('timetableData', JSON.stringify(timetableData));
                } catch (error) {
                    console.warn('localStorage setItem timetableData 失败:', error);
                }
                
                // 更新课表显示
                if (document.getElementById('timetable-page').classList.contains('active')) {
                    generateTimetable();
                    updateTimetableStats();
                }
            }
            
            // 导入倒计时数据
            if (importedData.countdownData) {
                if (importedData.countdownData.date) {
                    try {
                        localStorage.setItem('countdownDate', importedData.countdownData.date);
                    } catch (error) {
                        console.warn('localStorage setItem countdownDate 失败:', error);
                    }
                }
                if (importedData.countdownData.title) {
                    try {
                        localStorage.setItem('countdownTitle', importedData.countdownData.title);
                    } catch (error) {
                        console.warn('localStorage setItem countdownTitle 失败:', error);
                    }
                }
                updateCountdown();
            }
            
            // 导入计时器数据
            if (importedData.timerSessions) {
                timerSessions = importedData.timerSessions;
                try {
                    localStorage.setItem('timerSessions', JSON.stringify(timerSessions));
                } catch (error) {
                    console.warn('localStorage setItem timerSessions 失败:', error);
                }
                updateTimerHistory();
            }
            
            // 导入番茄计时器数据
            if (importedData.pomodoroData) {
                try {
                    localStorage.setItem('pomodoroData', JSON.stringify(importedData.pomodoroData));
                } catch (error) {
                    console.warn('localStorage setItem pomodoroData 失败:', error);
                }
            }
            
            if (importedData.pomodoroSettings) {
                try {
                    localStorage.setItem('pomodoroSettings', JSON.stringify(importedData.pomodoroSettings));
                } catch (error) {
                    console.warn('localStorage setItem pomodoroSettings 失败:', error);
                }
                // 重新加载番茄工作法设置和任务列表
                if (pomodoroTimer) {
                    pomodoroTimer.loadData();
                    setTimeout(() => {
                        pomodoroTimer.loadTasks();
                    }, 500);
                }
            }
            
            // 更新工具显示
            for (const category in customTools) {
                if (predefinedTools[category]) {
                    createToolGrid(category, predefinedTools[category].concat(customTools[category] || []));
                }
            }
            
            alert('所有数据导入成功！');
            event.target.value = ''; // 重置文件输入
        } catch (error) {
            alert('导入失败：文件格式不正确');
        }
    };
    reader.readAsText(file);
}

function clearAllData() {
    if (confirm('确定要清空所有数据吗？包括自定义工具、任务、课表等所有数据！此操作不可撤销！')) {
        customTools = {};
        tasks = [];
        timetableData = null;
        timerSessions = [];
        try {
            localStorage.removeItem('countdownDate');
        } catch (error) {
            console.warn('localStorage removeItem countdownDate 失败:', error);
        }
        try {
            localStorage.removeItem('countdownTitle');
        } catch (error) {
            console.warn('localStorage removeItem countdownTitle 失败:', error);
        }
        
        try {
            localStorage.setItem('customTools', JSON.stringify(customTools));
        } catch (error) {
            console.warn('localStorage setItem customTools 失败:', error);
        }
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.warn('localStorage setItem tasks 失败:', error);
        }
        try {
            localStorage.setItem('timerSessions', JSON.stringify(timerSessions));
        } catch (error) {
            console.warn('localStorage setItem timerSessions 失败:', error);
        }
        try {
            localStorage.removeItem('timetableData');
        } catch (error) {
            console.warn('localStorage removeItem timetableData 失败:', error);
        }
        
        // 重新初始化所有工具页面（只显示预定义工具）
        for (const category in predefinedTools) {
            createToolGrid(category, predefinedTools[category]);
        }
        
        // 更新任务显示
        generateHomeCalendar();
        displayUpcomingTasks();
        
        // 更新课表显示
        if (document.getElementById('timetable-page').classList.contains('active')) {
            showEmptyTimetable();
            updateTimetableStats();
        }
        
        // 重置倒计时
        updateCountdown();
        
        // 重置计时器
        resetTimer();
        
        alert('所有数据已清空');
    }
}

function viewToolsData() {
    let countdownDate, countdownTitle;
    try {
        countdownDate = localStorage.getItem('countdownDate');
    } catch (error) {
        console.warn('localStorage getItem countdownDate 失败:', error);
        countdownDate = null;
    }
    try {
        countdownTitle = localStorage.getItem('countdownTitle');
    } catch (error) {
        console.warn('localStorage getItem countdownTitle 失败:', error);
        countdownTitle = null;
    }
    
    const allData = {
        customTools: customTools,
        tasks: tasks,
        timetableData: timetableData,
        timerSessions: timerSessions,
        countdownData: {
            date: countdownDate,
            title: countdownTitle
        }
    };
    
    const dataContent = document.getElementById('data-content');
    // 确保内容容器样式正确设置，防止页面被拉长
    dataContent.style.cssText = 'background: #f8f9fa; padding: 10px; border-radius: 5px; max-height: 400px; overflow-y: auto; font-size: 12px; border: 1px solid #ddd; box-sizing: border-box; word-wrap: break-word; white-space: pre-wrap;';
    
    // 转换数据并设置内容
    dataContent.textContent = JSON.stringify(allData, null, 2);
    
    // 确保预览容器也有适当的样式，防止页面被拉长
    const dataPreview = document.getElementById('data-preview');
    dataPreview.style.display = 'block';
    dataPreview.style.maxHeight = '500px';
    dataPreview.style.overflow = 'hidden';
    dataPreview.style.boxSizing = 'border-box';
}

// ===== 弹窗功能 =====
function initModals() {
    // 关闭按钮事件
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // 点击模态框外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // 返回按钮事件
    const backBtn = document.getElementById('back-btn');
    const taskDetailModal = document.getElementById('task-detail-modal');
    if (backBtn && taskDetailModal) {
        backBtn.addEventListener('click', function() {
            taskDetailModal.classList.remove('active');
        });
    }
    
    // 前一天/后一天导航
    const prevDayBtn = document.getElementById('prev-day-btn');
    const nextDayBtn = document.getElementById('next-day-btn');
    if (prevDayBtn) {
        prevDayBtn.addEventListener('click', navigateToPrevDay);
    }
    if (nextDayBtn) {
        nextDayBtn.addEventListener('click', navigateToNextDay);
    }
    
    // 倒计时日期编辑
    initDateEditor();
}

function navigateToPrevDay() {
    if (!currentTaskDetail) return;
    
    const currentDate = new Date(currentTaskDetail.date);
    currentDate.setDate(currentDate.getDate() - 1);
    const prevDate = formatDate(currentDate);
    
    const prevDateTasks = tasks.filter(task => task.date === prevDate);
    
    if (prevDateTasks.length > 0) {
        // 显示前一天的任务（显示第一个任务）
        showTaskDetail(prevDateTasks[0]);
    } else {
        alert('前一天没有任务');
    }
}

function navigateToNextDay() {
    if (!currentTaskDetail) return;
    
    const currentDate = new Date(currentTaskDetail.date);
    currentDate.setDate(currentDate.getDate() + 1);
    const nextDate = formatDate(currentDate);
    
    const nextDateTasks = tasks.filter(task => task.date === nextDate);
    
    if (nextDateTasks.length > 0) {
        // 显示后一天的任务（显示第一个任务）
        showTaskDetail(nextDateTasks[0]);
    } else {
        alert('后一天没有任务');
    }
}

// ===== 倒计时功能 =====
function initDateEditor() {
    const editDateBtn = document.getElementById('edit-date-btn');
    const editDateModal = document.getElementById('edit-date-modal');
    const saveDateBtn = document.getElementById('save-date-btn');
    
    // 检查元素是否存在
    if (!editDateBtn || !editDateModal || !saveDateBtn) {
        console.warn('initDateEditor: 必需的DOM元素不存在');
        return;
    }
    
    const closeEditDateBtn = editDateModal.querySelector('.close-btn');
    if (!closeEditDateBtn) {
        console.warn('initDateEditor: closeEditDateBtn元素不存在');
        return;
    }
    
    // 从localStorage加载保存的日期，如果没有则使用默认值
    let savedDate, savedTitle;
    try {
        savedDate = localStorage.getItem('countdownDate');
    } catch (error) {
        console.warn('localStorage getItem countdownDate 失败:', error);
        savedDate = null;
    }
    try {
        savedTitle = localStorage.getItem('countdownTitle');
    } catch (error) {
        console.warn('localStorage getItem countdownTitle 失败:', error);
        savedTitle = null;
    }
    
    if (savedDate) {
        document.getElementById('countdown-date').value = savedDate;
    } else {
        // 设置默认日期为2026-01-15
        document.getElementById('countdown-date').value = '2026-01-15';
    }
    
    if (savedTitle) {
        document.getElementById('countdown-title').value = savedTitle;
    } else {
        document.getElementById('countdown-title').value = '期末考试';
    }
    
    // 打开编辑弹窗
    editDateBtn.addEventListener('click', function() {
        editDateModal.classList.add('active');
    });
    
    // 关闭编辑弹窗
    closeEditDateBtn.addEventListener('click', function() {
        editDateModal.classList.remove('active');
    });
    
    // 点击弹窗外部关闭
    editDateModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    // 保存日期
    saveDateBtn.addEventListener('click', function() {
        const newDate = document.getElementById('countdown-date').value;
        const newTitle = document.getElementById('countdown-title').value;
        
        if (!newDate) {
            alert('请选择日期');
            return;
        }
        
        if (!newTitle) {
            alert('请输入事件标题');
            return;
        }
        
        // 保存到localStorage
        try {
            localStorage.setItem('countdownDate', newDate);
        } catch (error) {
            console.warn('localStorage setItem countdownDate 失败:', error);
        }
        try {
            localStorage.setItem('countdownTitle', newTitle);
        } catch (error) {
            console.warn('localStorage setItem countdownTitle 失败:', error);
        }
        
        // 更新页面显示
        updateCountdownDisplay(newDate, newTitle);
        
        // 关闭弹窗
        editDateModal.classList.remove('active');
        
        alert('日期修改成功！');
    });
}

function updateCountdown() {
    // 从localStorage读取日期，如果没有则使用默认值
    let savedDate, savedTitle;
    try {
        savedDate = localStorage.getItem('countdownDate');
    } catch (error) {
        console.warn('localStorage getItem countdownDate 失败:', error);
        savedDate = null;
    }
    try {
        savedTitle = localStorage.getItem('countdownTitle');
    } catch (error) {
        console.warn('localStorage getItem countdownTitle 失败:', error);
        savedTitle = null;
    }
    
    savedDate = savedDate || '2026-01-15';
    savedTitle = savedTitle || '期末考试';
    
    // 检查countdown-target元素是否存在
    const countdownTarget = document.getElementById('countdown-target');
    if (!countdownTarget) {
        console.warn('updateCountdown: countdown-target元素不存在');
        return;
    }
    
    // 如果页面显示的内容与保存的不一致，更新显示
    const currentDisplay = countdownTarget.textContent;
    const expectedDisplay = `${savedTitle}：${formatChineseDate(savedDate)}`;
    
    if (currentDisplay !== expectedDisplay) {
        updateCountdownDisplay(savedDate, savedTitle);
    }
    
    const targetDate = new Date(savedDate).getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    // 获取倒计时显示元素
    const countdownDays = document.getElementById('countdown-days');
    const countdownHours = document.getElementById('countdown-hours');
    const countdownMinutes = document.getElementById('countdown-minutes');
    const countdownSeconds = document.getElementById('countdown-seconds');
    
    // 检查所有倒计时元素是否存在
    if (!countdownDays || !countdownHours || !countdownMinutes || !countdownSeconds) {
        console.warn('updateCountdown: 倒计时显示元素不存在');
        return;
    }
    
    if (distance < 0) {
        countdownDays.textContent = '0';
        countdownHours.textContent = '0';
        countdownMinutes.textContent = '0';
        countdownSeconds.textContent = '0';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    countdownDays.textContent = days;
    countdownHours.textContent = hours;
    countdownMinutes.textContent = minutes;
    countdownSeconds.textContent = seconds;
}

function updateCountdownDisplay(dateStr, title) {
    const countdownTarget = document.getElementById('countdown-target');
    if (!countdownTarget) {
        console.warn('updateCountdownDisplay: countdown-target元素不存在');
        return;
    }
    
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    countdownTarget.textContent = `${title}：${year}年${month}月${day}日`;
    
    // 立即更新倒计时
    updateCountdown();
}

// ===== 学习计时器功能 =====
function startTimer() {
    if (timerRunning) return;
    
    timerRunning = true;
    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    if (timerRunning) {
        pauseTimer();
    }
    
    if (timerSeconds > 0) {
        // 保存本次学习记录
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        
        timerSessions.push({
            duration: timerSeconds,
            timestamp: new Date().toLocaleString(),
            display: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        });
        
        try {
            localStorage.setItem('timerSessions', JSON.stringify(timerSessions));
        } catch (error) {
            console.warn('localStorage setItem timerSessions 失败:', error);
        }
        updateTimerHistory();
    }
    
    timerSeconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) {
        console.warn('updateTimerDisplay: timer-display元素不存在');
        return;
    }
    
    timerDisplay.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimerHistory() {
    const sessionsList = document.getElementById('timer-sessions');
    if (!sessionsList) {
        console.warn('updateTimerHistory: timer-sessions元素不存在');
        return;
    }
    
    sessionsList.innerHTML = '';
    
    timerSessions.slice().reverse().forEach(session => {
        const li = document.createElement('li');
        li.textContent = `${session.timestamp} - ${session.display}`;
        sessionsList.appendChild(li);
    });
}

// ===== 主题切换功能 =====
function initThemeSwitcher() {
    const themeSelect = document.getElementById('theme-select');
    if (!themeSelect) {
        console.warn('initThemeSwitcher: theme-select元素不存在');
        return;
    }
    
    let savedTheme;
    try {
        savedTheme = localStorage.getItem('selectedTheme');
    } catch (error) {
        console.warn('localStorage getItem selectedTheme 失败:', error);
        savedTheme = null;
    }
    savedTheme = savedTheme || 'light';
    
   // 设置保存的主题，并添加初始过渡效果
    themeSelect.value = savedTheme;
    document.body.style.transition = 'background 0.6s ease, color 0.4s ease';
    document.body.className = `${savedTheme}-theme`;
    
    // 如果保存的主题是飘雪主题，初始化飘雪特效
    if (savedTheme === 'snow') {
        // 延迟初始化，确保页面加载完成
        setTimeout(initSnowTheme, 100);
    }

    
    themeSelect.addEventListener('change', function() {
    const selectedTheme = this.value;
    
     // 添加过渡效果 - 增强版
    document.body.style.transition = 'background 0.6s ease, color 0.4s ease, opacity 0.4s ease';
    
    // 为所有主要组件添加过渡效果
    const components = document.querySelectorAll('.header, .tools-page, .tasks-section, .avatar-section, .countdown-section, .timer-section, .quotes-section, .sidebar, .footer, .timetable-controls, .timetable-container, .timetable-stats, .assignment-section, .task-detail-modal');
    components.forEach(component => {
        component.style.transition = 'background 0.6s ease, color 0.4s ease, box-shadow 0.6s ease, border 0.6s ease';
    });
    
    // 为标题元素添加过渡效果
    const titles = document.querySelectorAll('h1, h2, h3, .page-title');
    titles.forEach(title => {
        title.style.transition = 'color 0.4s ease, text-shadow 0.6s ease';
    });
    
    // 停止当前可能正在运行的特效
    if (selectedTheme !== 'snow') {
        stopAllEffects();
    }

    
    document.body.className = `${selectedTheme}-theme`;
    try {
        localStorage.setItem('selectedTheme', selectedTheme);
    } catch (error) {
        console.warn('localStorage setItem selectedTheme 失败:', error);
    }
    
    // 如果选择了飘雪主题，初始化飘雪特效
    if (selectedTheme === 'snow') {
        // 延迟初始化，确保主题切换完成
        setTimeout(initSnowTheme, 300);
    }
    
    // 如果选择了海洋蓝主题，初始化海洋背景
    if (selectedTheme === 'blue') {
        // 立即初始化海洋背景，不需要延迟
        if (typeof initOceanBackground === 'function') {
            initOceanBackground();
        }
    } else {
        // 如果不是海洋蓝主题，确保海洋动画停止
        if (typeof window.oceanModule !== 'undefined' && typeof window.oceanModule.stopOceanAnimation === 'function') {
            window.oceanModule.stopOceanAnimation();
        }
        // 隐藏海洋背景容器
        const container = document.getElementById('ocean-background');
        if (container) {
            container.style.display = 'none';
        }
    }

    // 触发主题改变事件
    const themeChangedEvent = new CustomEvent('themeChanged', { detail: { theme: selectedTheme } });
    document.dispatchEvent(themeChangedEvent);

    // 为渐变主题添加特殊处理
    if (selectedTheme === 'gradient') {
        // 确保渐变动画正确应用
        const gradientKeyframes = document.createElement('style');
        gradientKeyframes.textContent = `
            @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(gradientKeyframes);
        setTimeout(() => document.head.removeChild(gradientKeyframes), 1000);
    }
    
    // 为所有按钮添加过渡效果
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.transition = 'background 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease';
    });
    
    // 为输入框添加过渡效果
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.style.transition = 'background 0.3s ease, color 0.3s ease, border 0.3s ease, box-shadow 0.3s ease';
    });   
    // 移除过渡效果
    setTimeout(() => {
        document.body.style.transition = '';
    }, 500);
});
}

// ===== 全局搜索功能 =====
function initGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    // 确保搜索结果框存在，如果不存在则创建
    let searchResults = document.getElementById('search-results');
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchResults.id = 'search-results';
        document.body.appendChild(searchResults);
    }
    
    // 更新搜索结果框位置的函数
    function updateSearchResultsPosition() {
        const rect = searchInput.getBoundingClientRect();
        searchResults.style.left = `${rect.left}px`;
        searchResults.style.top = `${rect.bottom}px`;
        searchResults.style.width = `${rect.width}px`;
    }
    

    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.style.display = 'none';
            return;
        }
        
        // 搜索所有工具
        const allTools = [];
        
        // 收集预定义工具
        for (const category in predefinedTools) {
            predefinedTools[category].forEach(tool => {
                allTools.push({
                    ...tool,
                    category: getCategoryName(category)
                });
            });
        }
        
        // 收集自定义工具
        for (const category in customTools) {
            customTools[category].forEach(tool => {
                allTools.push({
                    ...tool,
                    category: getCategoryName(category)
                });
            });
        }
        
        // 过滤匹配的工具
        const matchedTools = allTools.filter(tool => 
            tool.name.toLowerCase().includes(query) || 
            tool.category.toLowerCase().includes(query)
        );
        
        // 显示结果
        if (matchedTools.length > 0) {
            // 更新搜索结果框位置
            updateSearchResultsPosition();
            searchResults.innerHTML = '';
            matchedTools.forEach(tool => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <strong>${tool.name}</strong>
                    <span style="float: right; color: #666; font-size: 12px;">${tool.category}</span>
                `;
                resultItem.addEventListener('click', function() {
                    window.open(tool.url, '_blank');
                    searchResults.style.display = 'none';
                    searchInput.value = '';
                });
                searchResults.appendChild(resultItem);
            });
            searchResults.style.display = 'block';
        } else {
            // 更新搜索结果框位置
            updateSearchResultsPosition();
            searchResults.innerHTML = '<div class="search-result-item">未找到匹配的工具</div>';
            searchResults.style.display = 'block';
        }
    });
    
    // 点击页面其他区域隐藏搜索结果
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
    
    // 窗口滚动时更新搜索结果框位置
    window.addEventListener('scroll', function() {
        if (searchResults.style.display === 'block') {
            updateSearchResultsPosition();
        }
    });
    
    // 窗口调整大小时更新搜索结果框位置
    window.addEventListener('resize', function() {
        if (searchResults.style.display === 'block') {
            updateSearchResultsPosition();
        }
    });
}

function getCategoryName(categoryKey) {
    const categoryMap = {
        'ai-tools': 'AI工具',
        'math-analysis': '数分学习',
        'linear-algebra': '高代学习',
        'programming': '程设学习',
        'media-tools': '音频视频工具',
        'english-learning': '英语学习',
        'other-tools': '其他工具'
    };
    
    return categoryMap[categoryKey] || categoryKey;
}

// ===== 飘雪主题功能 =====
function initSnowTheme() {
    const snowContainer = document.getElementById('snow-container');
    if (!snowContainer) return;
    
    // 清除现有的雪花
    snowContainer.innerHTML = '';
    snowflakes = [];
    
    // 创建雪花
    createSnowflakes();
    
    // 设置雪花飘落动画
    snowInterval = setInterval(() => {
        updateSnowflakes();
    }, 50);
}

function createSnowflakes() {
    const snowContainer = document.getElementById('snow-container');
    const snowflakeCount = 80; // 雪花数量
    
    // 雪花符号数组 - 使用不同的雪花符号增加多样性
    const snowflakeSymbols = ['❄', '❅', '❆', '•', '*'];
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        // 随机选择雪花符号
        const symbol = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
        snowflake.innerHTML = symbol;
        
        // 随机属性
        const size = Math.random() * 1.2 + 0.8; // 大小
        const left = Math.random() * 100; // 水平位置
        const opacity = Math.random() * 0.7 + 0.3; // 透明度
        const animationDuration = Math.random() * 15 + 10; // 下落时间
        const animationDelay = Math.random() * 5; // 延迟开始
        
        // 随机雪花颜色 - 浅蓝色系
        const blueShades = ['#4fc3f7', '#29b6f6', '#03a9f4', '#81d4fa', '#b3e5fc', '#e1f5fe'];
        const snowColor = blueShades[Math.floor(Math.random() * blueShades.length)];
        
        // 应用样式
        snowflake.style.fontSize = `${size}em`;
        snowflake.style.left = `${left}%`;
        snowflake.style.opacity = opacity;
        snowflake.style.color = snowColor;
        snowflake.style.animation = `fall ${animationDuration}s linear ${animationDelay}s infinite`;
        
        snowContainer.appendChild(snowflake);
    }
}

function updateSnowflakes() {
    const viewportHeight = window.innerHeight;
    
    snowflakes.forEach(snowflake => {
        const element = snowflake.element;
        // 获取当前位置
        const currentTop = parseFloat(element.style.top) || -10;
        
        // 如果雪花已经飘出屏幕，重置到顶部
        if (currentTop > viewportHeight) {
            element.style.top = '-10px';
            element.style.left = `${Math.random() * 100}%`; // 修复：缺少反引号
            // 重新随机颜色
            const blueShades = ['#4fc3f7', '#29b6f6', '#03a9f4', '#81d4fa', '#b3e5fc'];
            element.style.color = blueShades[Math.floor(Math.random() * blueShades.length)];
        } else {
            // 根据速度更新位置
            const newTop = currentTop + (10 / snowflake.speed) * 3;
            element.style.top = `${newTop}px`;
        }
    });
}

function stopSnowTheme() {
    if (snowInterval) {
        clearInterval(snowInterval);
        snowInterval = null;
    }
    
    const snowContainer = document.getElementById('snow-container');
    if (snowContainer) {
        snowContainer.innerHTML = '';
    }
    
    snowflakes = [];
}

// 停止所有特效的全局清理函数
function stopAllEffects() {
    // 停止飘雪特效
    stopSnowTheme();
    
    // 停止海洋背景动画
    if (window.oceanModule && window.oceanModule.stopOceanAnimation) {
        window.oceanModule.stopOceanAnimation();
    }
    
    // 清理鼠标特效
    const mouseEffects = document.getElementById('mouse-effects');
    if (mouseEffects) {
        mouseEffects.innerHTML = '';
    }
    
    // 停止音乐播放
    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
    }
    
    // 清理所有定时器
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // 清理其他可能存在的特效容器
    const effectContainers = document.querySelectorAll('.effect-container, .particle-container');
    effectContainers.forEach(container => {
        container.innerHTML = '';
    });
}

// ===== 课表功能 =====
function initTimetable() {
    // 生成周次选择器
    generateWeekSelector();
    
    // 生成课表头部（带日期）
    generateTimetableHeader(currentWeekDates);
    
    // 添加快捷周次切换
    addWeekNavigation();
    
    // 如果已有课表数据，生成课表
    if (timetableData) {
        generateTimetable();
        updateTimetableStats();
    } else {
        showEmptyTimetable();
    }
    
    // 绑定事件
    document.getElementById('import-timetable-btn').addEventListener('click', importTimetableData);
    document.getElementById('clear-timetable-btn').addEventListener('click', clearTimetableData);
    document.getElementById('current-week').addEventListener('change', function() {
        currentWeek = parseInt(this.value);
        currentWeekDates = getWeekDates(currentWeek);
        try {
            localStorage.setItem('currentWeek', currentWeek);
        } catch (error) {
            console.warn('localStorage setItem currentWeek 失败:', error);
        }
        
        // 更新头部日期显示和课表
        generateTimetableHeader(currentWeekDates);
        generateTimetable();
        updateTimetableStats();
    });
}

function getWeekDates(weekOffset = 0) {
    const today = new Date();
    const currentDay = today.getDay(); // 0是周日，1是周一...
    
    // 计算本周一的日期
    const monday = new Date(today);
    const dayOffset = currentDay === 0 ? -6 : 1 - currentDay; // 如果是周日，则上周一；否则本周一
    monday.setDate(today.getDate() + dayOffset + (weekOffset * 7));
    
    // 生成一周的日期
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD格式
    }
    
    return weekDates;
}

function getWeekDisplayName(weekOffset) {
    const weekNames = {
        '-2': '两周前',
        '-1': '上周',
        '0': '本周',
        '1': '下周',
        '2': '两周后'
    };
    
    if (weekNames[weekOffset] !== undefined) {
        return weekNames[weekOffset];
    } else if (weekOffset > 2) {
        return `${weekOffset}周后`;
    } else {
        return `${Math.abs(weekOffset)}周前`;
    }
}

function generateWeekSelector() {
    const weekSelect = document.getElementById('current-week');
    if (!weekSelect) {
        console.warn('generateWeekSelector: current-week元素不存在');
        return;
    }
    
    weekSelect.innerHTML = '';
    
    // 扩大周次范围：从-10到10，共21周
    for (let i = -10; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = getWeekDisplayName(i);
        if (i === currentWeek) {
            option.selected = true;
        }
        weekSelect.appendChild(option);
    }
    
    // 添加滚动功能提示
    weekSelect.title = "可滚动选择更多周次";
}

function generateTimetableHeader(dates) {
    const timetableHeader = document.querySelector('.timetable-header');
    if (!timetableHeader) {
        console.warn('generateTimetableHeader: .timetable-header元素不存在');
        return;
    }
    
    // 清空现有头部
    timetableHeader.innerHTML = '<div class="time-header">时间/节次</div>';
    
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    days.forEach((day, index) => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        
        if (dates && dates[index]) {
            const dateObj = new Date(dates[index]);
            const month = dateObj.getMonth() + 1;
            const dayOfMonth = dateObj.getDate();
            dayHeader.innerHTML = `
                <div>${day}</div>
                <div class="header-date">${month}.${dayOfMonth}</div>
            `;
        } else {
            dayHeader.textContent = day;
        }
        
        timetableHeader.appendChild(dayHeader);
    });
}

function addWeekNavigation() {
    const timetableControls = document.querySelector('.timetable-controls');
    if (!timetableControls) {
        console.warn('addWeekNavigation: .timetable-controls元素不存在');
        return;
    }
    
    // 检查是否已经存在导航按钮
    if (document.getElementById('prev-week-btn')) return;
    
    const weekNav = document.createElement('div');
    weekNav.className = 'control-group';
    weekNav.innerHTML = `
        <button class="submit-btn" id="prev-week-btn">← 上一周</button>
        <button class="submit-btn" id="next-week-btn">下一周 →</button>
    `;
    
    timetableControls.appendChild(weekNav);
    
    // 绑定事件
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');
    
    if (!prevWeekBtn || !nextWeekBtn) {
        console.warn('addWeekNavigation: 导航按钮元素不存在');
        return;
    }
    
    prevWeekBtn.addEventListener('click', function() {
        currentWeek--;
        currentWeekDates = getWeekDates(currentWeek);
        try {
            localStorage.setItem('currentWeek', currentWeek);
        } catch (error) {
            console.warn('localStorage setItem currentWeek 失败:', error);
        }
        
        // 更新周次选择器的显示
        updateWeekSelector();
        
        generateTimetableHeader(currentWeekDates);
        generateTimetable();
        updateTimetableStats();
    });
    
    nextWeekBtn.addEventListener('click', function() {
        currentWeek++;
        currentWeekDates = getWeekDates(currentWeek);
        try {
            localStorage.setItem('currentWeek', currentWeek);
        } catch (error) {
            console.warn('localStorage setItem currentWeek 失败:', error);
        }
        
        // 更新周次选择器的显示
        updateWeekSelector();
        
        generateTimetableHeader(currentWeekDates);
        generateTimetable();
        updateTimetableStats();
    });
}

function generateTimetable() {
    const grid = document.getElementById('timetable-grid');
    if (!grid) {
        console.warn('generateTimetable: timetable-grid元素不存在');
        return;
    }
    
    grid.innerHTML = '';
    
    if (!timetableData || !timetableData.section_times) {
        showEmptyTimetable();
        return;
    }
    
    // 确保 currentWeekDates 已初始化
    if (!currentWeekDates) {
        currentWeekDates = getWeekDates(currentWeek);
    }
    
    // 创建时间槽
    timetableData.section_times.forEach((section, index) => {
        const row = document.createElement('div');
        row.className = 'timetable-row';
        
        // 时间槽单元格
        const timeCell = document.createElement('div');
        timeCell.className = 'time-slot';
        timeCell.innerHTML = `
            <div>第${section.section}节</div>
            <div>${section.time_range}</div>
        `;
        row.appendChild(timeCell);
        
        // 每天的课程单元格
        for (let dayIndex = 1; dayIndex <= 7; dayIndex++) {
            const cell = document.createElement('div');
            cell.className = 'course-cell';
            cell.setAttribute('data-day', dayIndex);
            cell.setAttribute('data-section', section.section);
            
            // 设置日期数据属性
            if (currentWeekDates && currentWeekDates[dayIndex - 1]) {
                cell.setAttribute('data-date', currentWeekDates[dayIndex - 1]);
            }
            
            // 查找该时间段的所有课程
            const courses = (timetableData.courses || []).filter(course => 
                course.day_index === dayIndex && course.section === section.section
            );
            
            // 查找该时间段的任务
            const tasksInSlot = getTasksForTimeSlot(dayIndex, section.time_range, currentWeekDates);
            
            // 创建容器用于课程和任务
            const contentContainer = document.createElement('div');
            contentContainer.className = 'cell-content';
            
            // 显示课程
            courses.forEach(course => {
                const courseElement = createCourseElement(course);
                contentContainer.appendChild(courseElement);
            });
            
            // 显示任务（与课程共存）
            tasksInSlot.forEach(task => {
                const taskElement = createTaskElement(task);
                contentContainer.appendChild(taskElement);
            });
            
            // 如果没有内容，显示空状态
            if (courses.length === 0 && tasksInSlot.length === 0) {
                const emptyElement = document.createElement('div');
                emptyElement.className = 'empty-slot';
                emptyElement.innerHTML = '&nbsp;';
                contentContainer.appendChild(emptyElement);
            }
            
            cell.appendChild(contentContainer);
            row.appendChild(cell);
        }
        
        grid.appendChild(row);
    });
}

function getTasksForTimeSlot(dayIndex, sectionTimeRange, weekDates) {
    if (!weekDates || !weekDates[dayIndex - 1]) return [];
    
    const targetDate = weekDates[dayIndex - 1]; // dayIndex从1开始，数组从0开始
    
    // 解析课表时间段
    const [rangeStart, rangeEnd] = sectionTimeRange.split('-');
    
    return tasks.filter(task => {
        // 检查日期是否匹配
        if (task.date !== targetDate) return false;
        
        // 如果任务有开始时间，检查是否在当前时间段内或有交集
        if (task.startTime) {
            // 情况1：任务开始时间在当前时间段内
            if (isTimeInRange(task.startTime, rangeStart, rangeEnd)) {
                return true;
            }
            
            // 情况2：任务有结束时间，检查时间段是否有交集
            if (task.endTime) {
                return hasTimeOverlap(
                    task.startTime, task.endTime,
                    rangeStart, rangeEnd
                );
            }
        }
        
        return false;
    });
}

function hasTimeOverlap(start1, end1, start2, end2) {
    const start1Minutes = convertTimeToMinutes(start1);
    const end1Minutes = convertTimeToMinutes(end1);
    const start2Minutes = convertTimeToMinutes(start2);
    const end2Minutes = convertTimeToMinutes(end2);
    
    // 检查时间段是否有重叠
    return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
}

function isTimeInRange(time, rangeStart, rangeEnd) {
    const timeMinutes = convertTimeToMinutes(time);
    const startMinutes = convertTimeToMinutes(rangeStart);
    const endMinutes = convertTimeToMinutes(rangeEnd);
    return timeMinutes >= startMinutes && timeMinutes < endMinutes;
}

function convertTimeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
}

function createCourseElement(course) {
    const courseElement = document.createElement('div');
    courseElement.className = 'course-item';
    courseElement.innerHTML = `
        <div class="course-name">${course.name}</div>
        <div class="course-details">
            <div class="course-teacher">${course.teacher}</div>
            <div class="course-location">${course.location}</div>
        </div>
    `;
    courseElement.addEventListener('click', function() {
        showCourseDetail(course);
    });
    return courseElement;
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-in-timetable';
    
    // 根据任务类型添加不同的类
    if (task.isSystemAdded) {
        taskElement.classList.add('system-added');
    }
    
    // 根据完成状态添加不同的类
    if (task.completed) {
        taskElement.classList.add('task-completed');
    }
    
    // 系统任务显示不同的图标和样式
    const taskIcon = task.isSystemAdded ? '🍽️' : (task.completed ? '✅' : '📝');
    let html = `<div class="task-name">${taskIcon} ${task.name}</div>`;
    
    // 系统任务添加系统标签
    if (task.isSystemAdded) {
        html += `<div class="system-tag">系统任务</div>`;
    }
    
    if (task.location) {
        html += `<div class="task-location">${task.location}</div>`;
    }
    
    // 添加时间信息
    if (task.startTime || task.endTime) {
        html += `<div class="task-time-info">${task.startTime || '?'}-${task.endTime || '?'}</div>`;
    }
    
    taskElement.innerHTML = html;
    
    // 系统任务点击显示食物推荐弹窗
    if (task.isSystemAdded) {
        taskElement.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('System task clicked in timetable, calling showFoodRecommendationModal');
            if (typeof window.showFoodRecommendationModal !== 'undefined') {
                window.showFoodRecommendationModal(task);
            } else if (typeof showFoodRecommendationModal !== 'undefined') {
                showFoodRecommendationModal(task);
            } else {
                console.error('showFoodRecommendationModal function not found');
                alert('食物推荐功能尚未加载，请刷新页面重试');
            }
        });
    } else {
        // 普通任务点击显示详情
        taskElement.addEventListener('click', function(e) {
            e.stopPropagation();
            showTaskDetail(task);
        });
    }
    
    return taskElement;
}

function showEmptyTimetable() {
    const grid = document.getElementById('timetable-grid');
    if (!grid) return;
    
    grid.innerHTML = `
        <div class="empty-timetable">
            <i>📅</i>
            <h3>暂无课表数据</h3>
            <p>请点击"导入课表数据"按钮导入您的课表</p>
            <button class="submit-btn" id="import-empty-timetable-btn" style="margin-top: 15px;">
                立即导入
            </button>
        </div>
    `;
    
    document.getElementById('import-empty-timetable-btn').addEventListener('click', importTimetableData);
}

function updateTimetableStats() {
    if (!timetableData) {
        document.getElementById('total-courses').textContent = '0';
        document.getElementById('weekly-hours').textContent = '0';
        document.getElementById('busy-day').textContent = '无';
        return;
    }
    
    const courses = timetableData.courses || [];
    const totalCourses = courses.length;
    document.getElementById('total-courses').textContent = totalCourses;
    
    // 计算周课时（假设每节课45分钟）
    const weeklyHours = (totalCourses * 45) / 60;
    document.getElementById('weekly-hours').textContent = weeklyHours.toFixed(1);
    
    // 计算最忙日
    const dayCount = {};
    courses.forEach(course => {
        dayCount[course.day] = (dayCount[course.day] || 0) + 1;
    });
    
    let busiestDay = '无';
    let maxCount = 0;
    Object.keys(dayCount).forEach(day => {
        if (dayCount[day] > maxCount) {
            maxCount = dayCount[day];
            busiestDay = day;
        }
    });
    
    document.getElementById('busy-day').textContent = busiestDay;
    
    // 更新周次显示
    updateWeekDisplay();
}

function updateWeekSelector() {
    const weekSelect = document.getElementById('current-week');
    if (weekSelect) {
        weekSelect.value = currentWeek;
    }
}

function updateWeekDisplay() {
    const weekSelect = document.getElementById('current-week');
    if (weekSelect) {
        // 确保选择器显示正确的周次
        weekSelect.value = currentWeek;
    }
    
    // 可以在统计区域添加周次信息显示
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid && !document.getElementById('week-display')) {
        const weekDisplay = document.createElement('div');
        weekDisplay.className = 'stat-item';
        weekDisplay.id = 'week-display';
        weekDisplay.innerHTML = `
            <span class="stat-number">${getWeekDisplayName(currentWeek)}</span>
            <span class="stat-label">当前周次</span>
        `;
        statsGrid.appendChild(weekDisplay);
    } else if (document.getElementById('week-display')) {
        document.getElementById('week-display').querySelector('.stat-number').textContent = 
            getWeekDisplayName(currentWeek);
    }
}

function showCourseDetail(course) {
    alert(`课程详情：
    课程名称：${course.name}
    授课教师：${course.teacher}
    ${course.assistant ? `助教：${course.assistant}` : ''}
    上课地点：${course.location}
    上课时间：${course.day} 第${course.section}节 (${course.time_range})`);
}

function importTimetableData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // 验证数据格式
                if (data.courses && data.section_times) {
                    timetableData = data;
                    try {
                        localStorage.setItem('timetableData', JSON.stringify(timetableData));
                    } catch (error) {
                        console.warn('localStorage setItem timetableData 失败:', error);
                    }
                    
                    generateTimetable();
                    updateTimetableStats();
                    
                    alert('课表数据导入成功！');
                } else {
                    alert('导入失败：文件格式不正确，请确保是有效的课表JSON文件');
                }
            } catch (error) {
                alert('导入失败：文件格式不正确');
            }
        };
        
        reader.readAsText(file);
    };
    
    fileInput.click();
}

function clearTimetableData() {
    if (confirm('确定要清空课表数据吗？此操作不可撤销！')) {
        timetableData = null;
        try {
            localStorage.removeItem('timetableData');
        } catch (error) {
            console.warn('localStorage removeItem timetableData 失败:', error);
        }
        showEmptyTimetable();
        updateTimetableStats();
        alert('课表数据已清空');
    }
}

// ===== 音乐播放器功能 =====
let currentTrackIndex = -1;
let playlist = [];
let isShuffle = false;
let previousTrackIndex = -1;

function initMusicPlayer() {
    const musicFileInput = document.getElementById('music-file');
    const musicToggleBtn = document.getElementById('music-toggle');
    const musicTitle = document.getElementById('music-title');
    const musicArtist = document.getElementById('music-artist');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const playlistToggle = document.getElementById('playlist-toggle');
    const clearPlaylistBtn = document.getElementById('clear-playlist');
    const playlistContent = document.getElementById('playlist-content');
    const musicPlayer = document.querySelector('.music-player');
    audioPlayer = document.getElementById('audio-player');
    const avatarImage = document.querySelector('.avatar-image');
    const avatarPlaceholder = document.getElementById('avatar-placeholder');
    
    // 点击音乐按钮触发播放/暂停
    musicToggleBtn.addEventListener('click', toggleMusic);
    
    // 点击文件选择按钮
    musicToggleBtn.addEventListener('click', function(e) {
        if (!audioPlayer.src && playlist.length === 0) {
            // 如果还没有选择音乐，触发文件选择
            musicFileInput.click();
        }
    });
    
    // 文件选择处理
    musicFileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            addToPlaylist(files);
            if (playlist.length === files.length) {
                // 如果是第一次添加音乐，自动播放第一首
                playTrack(0);
            }
        }
    });
    
    // 上一首按钮
    prevBtn.addEventListener('click', playPrevious);
    
    // 下一首按钮
    nextBtn.addEventListener('click', playNext);
    
    // 随机播放按钮
    shuffleBtn.addEventListener('click', toggleShuffle);
    
    // 播放列表开关
    playlistToggle.addEventListener('click', function() {
        musicPlayer.classList.toggle('playlist-open');
    });
    
    // 清空播放列表
    clearPlaylistBtn.addEventListener('click', clearPlaylist);
    
    // 更新进度条和时间
    audioPlayer.addEventListener('timeupdate', function() {
        if (audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = progress + '%';
            
            // 更新时间显示
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        }
    });
    
    // 音乐加载完成
    audioPlayer.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    });
    
    // 点击进度条跳转
    progressBar.parentElement.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    });
    
    // 音乐结束处理
    audioPlayer.addEventListener('ended', function() {
        // 先暂停播放器
        audioPlayer.pause();
        // 等待更长时间让浏览器完成资源加载，然后再播放下一首
        setTimeout(() => {
            playNext();
        }, 100);
    });
    
    // 错误处理 - 忽略Blob URL中断错误和进度条操作错误，只处理实际播放错误
    audioPlayer.addEventListener('error', function() {
        // 确保错误对象存在
        if (!audioPlayer.error) {
            return;
        }
        
        // 检查是否是可忽略的错误类型
        const isAbortError = audioPlayer.error.code === audioPlayer.error.ABORT_ERR;
        const isBlobUrl = audioPlayer.src.startsWith('blob:');
        const isNetworkError = audioPlayer.error.code === audioPlayer.error.NETWORK_ERR;
        
        // 忽略切换曲目或操作进度条时的Blob URL中断错误
        if ((isAbortError && isBlobUrl) || (isNetworkError && isBlobUrl)) {
            return;
        }
        
        // 处理其他实际的播放错误
        console.error('音频加载错误:', audioPlayer.error);
        musicTitle.textContent = '播放错误';
        musicArtist.textContent = '';
        musicToggleBtn.textContent = '▶️';
        musicToggleBtn.classList.remove('playing');
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        totalTimeEl.textContent = '0:00';
        stopRotation();
        isMusicPlaying = false;
        
        // 确保音频播放器状态正确，但不调用load()避免额外错误
        audioPlayer.pause();
    });
    
    // 拖拽上传
    musicPlayer.addEventListener('dragover', function(e) {
        e.preventDefault();
        musicPlayer.style.borderColor = '#3498db';
    });
    
    musicPlayer.addEventListener('dragleave', function() {
        musicPlayer.style.borderColor = '';
    });
    
    musicPlayer.addEventListener('drop', function(e) {
        e.preventDefault();
        musicPlayer.style.borderColor = '';
        
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('audio/') || file.name.toLowerCase().endsWith('.wma')
        );
        
        if (files.length > 0) {
            addToPlaylist(files);
            if (playlist.length === files.length) {
                playTrack(0);
            }
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // 空格键播放/暂停
        if (e.code === 'Space' && !e.target.closest('input, textarea, button')) {
            e.preventDefault();
            toggleMusic();
        }
        // 左箭头上一首
        if (e.code === 'ArrowLeft') {
            playPrevious();
        }
        // 右箭头下一首
        if (e.code === 'ArrowRight') {
            playNext();
        }
    });
    
    // 添加到播放列表
    function addToPlaylist(files) {
        files.forEach(file => {
            const track = {
                name: file.name.replace(/\.[^/.]+$/, ""), // 移除文件扩展名
                artist: extractArtist(file.name),
                url: URL.createObjectURL(file),
                file: file
            };
            playlist.push(track);
        });
        updatePlaylistDisplay();
    }
    
    // 从文件名提取艺术家
    function extractArtist(filename) {
        // 简单的艺术家提取逻辑，实际应用中可能需要更复杂的解析
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
        const parts = nameWithoutExt.split(' - ');
        return parts.length > 1 ? parts[0] : '';
    }
    
    // 更新播放列表显示
    function updatePlaylistDisplay() {
        if (playlist.length === 0) {
            playlistContent.innerHTML = '<div class="playlist-empty">播放列表为空</div>';
            return;
        }
        
        playlistContent.innerHTML = playlist.map((track, index) => `
            <div class="playlist-item ${index === currentTrackIndex ? 'active playing' : ''}" data-index="${index}">
                <div class="playlist-item-info">
                    <span class="playlist-item-title">${track.name}</span>
                    <span class="playlist-item-artist">${track.artist}</span>
                </div>
                <button class="playlist-item-delete" data-index="${index}" title="删除">🗑️</button>
            </div>
        `).join('');
        
        // 添加播放列表项点击事件
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.classList.contains('playlist-item-delete')) {
                    const index = parseInt(this.dataset.index);
                    playTrack(index);
                }
            });
        });
        
        // 添加删除按钮事件
        document.querySelectorAll('.playlist-item-delete').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.dataset.index);
                removeTrack(index);
            });
        });
    }
    
    // 播放指定曲目
    function playTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        
        currentTrackIndex = index;
        const track = playlist[index];
        
        // 检查文件扩展名，如果是WMA格式，显示提示
        if (track.file.name.toLowerCase().endsWith('.wma')) {
            alert('注意：WMA格式可能不被您的浏览器原生支持，建议使用MP3等更通用的音频格式。');
        }
        
        // 更新UI
        musicTitle.textContent = track.name;
        musicArtist.textContent = track.artist;
        musicToggleBtn.textContent = '⏸️';
        musicToggleBtn.classList.add('playing');
        
        // 直接设置src并播放，不进行额外的暂停或延迟
        try {
            // 先停止当前可能的播放活动
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            
            // 设置新的音频源
            audioPlayer.src = track.url;
            
            // 播放音频
            audioPlayer.play().then(() => {
                isMusicPlaying = true;
                startRotation();
                updatePlaylistDisplay();
            }).catch(error => {
                // 忽略由于用户交互导致的中断错误
                if (error.name !== 'AbortError') {
                    console.error('播放失败:', error);
                    let errorMsg = '音乐播放失败';
                    if (track.file.name.toLowerCase().endsWith('.wma')) {
                        errorMsg += '。WMA格式可能不被您的浏览器支持，建议使用MP3等更通用的音频格式。';
                    } else {
                        errorMsg += '，请尝试选择其他文件。';
                    }
                    alert(errorMsg);
                    musicTitle.textContent = '播放错误';
                    musicArtist.textContent = '';
                    musicToggleBtn.textContent = '▶️';
                    musicToggleBtn.classList.remove('playing');
                    progressBar.style.width = '0%';
                    currentTimeEl.textContent = '0:00';
                    totalTimeEl.textContent = '0:00';
                    stopRotation();
                }
                isMusicPlaying = false;
            });
        } catch (error) {
            console.error('播放过程中发生错误:', error);
            isMusicPlaying = false;
        }
    }
    
    // 切换音乐播放状态
    function toggleMusic() {
        if (playlist.length === 0) return;
        
        if (isMusicPlaying) {
            audioPlayer.pause();
            musicToggleBtn.textContent = '▶️';
            musicToggleBtn.classList.remove('playing');
            stopRotation();
        } else {
            if (!audioPlayer.src) {
                // 如果还没有加载音乐，播放第一首
                playTrack(0);
                return;
            }
            
            audioPlayer.play().then(() => {
                musicToggleBtn.textContent = '⏸️';
                musicToggleBtn.classList.add('playing');
                startRotation();
            }).catch(error => {
                console.error('播放失败:', error);
                alert('音乐播放失败，请尝试选择其他文件');
            });
        }
        isMusicPlaying = !isMusicPlaying;
    }
    
    // 播放上一首
    function playPrevious() {
        if (playlist.length === 0) return;
        
        if (isShuffle) {
            // 随机播放模式下，避免重复播放
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentTrackIndex && playlist.length > 1);
            playTrack(newIndex);
        } else {
            // 顺序播放模式
            const newIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            playTrack(newIndex);
        }
    }
    
    // 播放下一首
    function playNext() {
        if (playlist.length === 0) return;
        
        if (isShuffle) {
            // 随机播放模式下，避免重复播放
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentTrackIndex && playlist.length > 1);
            playTrack(newIndex);
        } else {
            // 顺序播放模式
            const newIndex = (currentTrackIndex + 1) % playlist.length;
            playTrack(newIndex);
        }
    }
    
    // 切换随机播放
    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleBtn.style.opacity = isShuffle ? 1 : 0.6;
    }
    
    // 清除播放列表
    function clearPlaylist() {
        if (playlist.length === 0) return;
        
        // 保存当前播放状态
        const wasPlaying = isMusicPlaying;
        
        playlist = [];
        currentTrackIndex = -1;
        
        // 重置音频播放器
        audioPlayer.pause();
        
        // 重置UI
        musicTitle.textContent = '未选择音乐';
        musicArtist.textContent = '';
        musicToggleBtn.textContent = '▶️';
        musicToggleBtn.classList.remove('playing');
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        totalTimeEl.textContent = '0:00';
        
        stopRotation();
        isMusicPlaying = false;
        updatePlaylistDisplay();
        
        // 关闭播放列表
        musicPlayer.classList.remove('playlist-open');
    }
    
    // 移除指定曲目
    function removeTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        
        // 保存当前是否播放状态
        const wasPlayingCurrentTrack = (index === currentTrackIndex);
        
        playlist.splice(index, 1);
        
        // 更新当前播放索引
        if (index === currentTrackIndex) {
            if (playlist.length === 0) {
                // 列表为空，重置播放器
                audioPlayer.pause();
                
                musicTitle.textContent = '未选择音乐';
                musicArtist.textContent = '';
                musicToggleBtn.textContent = '▶️';
                musicToggleBtn.classList.remove('playing');
                progressBar.style.width = '0%';
                currentTimeEl.textContent = '0:00';
                totalTimeEl.textContent = '0:00';
                
                stopRotation();
                isMusicPlaying = false;
                currentTrackIndex = -1;
            } else {
                // 播放下一首
                const newIndex = Math.min(index, playlist.length - 1);
                playTrack(newIndex);
            }
        } else if (index < currentTrackIndex) {
            // 如果移除的曲目在当前曲目之前，更新索引
            currentTrackIndex--;
        }
        
        updatePlaylistDisplay();
    }
    
    // 格式化时间
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // 开始旋转
    function startRotation() {
        if (avatarImage.style.display !== 'none') {
            avatarImage.classList.add('rotating');
        } else {
            avatarPlaceholder.classList.add('rotating');
        }
    }
    
    // 停止旋转
    function stopRotation() {
        avatarImage.classList.remove('rotating');
        avatarPlaceholder.classList.remove('rotating');
    }
}

// ===== 其他功能 =====
function initMouseEffects() {
    let lastStarTime = 0;
    const STAR_INTERVAL = 2000; // 每2秒最多生成一个星星
    const effectsContainer = document.getElementById('mouse-effects');
    
    // 点击爱心效果
    document.addEventListener('click', function(e) {
        createHeart(e.clientX, e.clientY);
    });
    
    // 跟随鼠标的小星星
    document.addEventListener('mousemove', function(e) {
        const now = Date.now();
        if (now - lastStarTime > STAR_INTERVAL && Math.random() > 0.98) { // 随机生成小星星
            createStar(e.clientX, e.clientY);
            lastStarTime = now;
        }
    });
    
    // 按钮悬停波纹效果
    document.querySelectorAll('button, .tool-item, .nav-links li, .calendar-day, .task-item').forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            createRipple(this, e);
        });
    });
}

function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    // 随机颜色
    const colors = ['#e74c3c', '#3498db', '#9b59b6', '#2ecc71', '#f1c40f'];
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    document.getElementById('mouse-effects').appendChild(heart);
    
    // 动画结束后移除元素
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

function createStar(x, y) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    
    // 随机大小和颜色
    const size = Math.random() * 4 + 2;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    
    const colors = ['#3498db', '#9b59b6', '#2ecc71', '#f1c40f', '#e74c3c'];
    star.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    document.getElementById('mouse-effects').appendChild(star);
    
    // 动画结束后移除元素
    setTimeout(() => {
        star.remove();
    }, 1200);
}

function createRipple(element, e) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // 动画结束后移除元素
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function checkAvatarImage() {
    const avatarImg = document.querySelector('.avatar-image');
    const avatarPlaceholder = document.getElementById('avatar-placeholder');
    
    if (avatarImg) {
        // 检查图片是否成功加载
        avatarImg.onload = function() {
            // 图片加载成功，显示图片，隐藏占位符
            avatarImg.style.display = 'block';
            if (avatarPlaceholder) {
                avatarPlaceholder.style.display = 'none';
            }
        };
        
        avatarImg.onerror = function() {
            // 图片加载失败，显示占位符，隐藏图片
            avatarImg.style.display = 'none';
            if (avatarPlaceholder) {
                avatarPlaceholder.style.display = 'flex';
            }
        };
        
        // 手动触发检查（如果图片已经缓存）
        if (avatarImg.complete) {
            if (avatarImg.naturalHeight !== 0) {
                avatarImg.onload();
            } else {
                avatarImg.onerror();
            }
        }
    }
}

function initFooterQuotes() {
    const quotesFooter = document.getElementById('quotes-footer');
    quotesFooter.innerHTML = '';
    
    quotes.forEach((quote, index) => {
        const quoteElement = document.createElement('div');
        quoteElement.className = `quote-footer ${index === 0 ? 'active' : ''}`;
        quoteElement.textContent = quote;
        quotesFooter.appendChild(quoteElement);
    });
    
    // 设置自动轮播
    setInterval(nextFooterQuote, 5000);
}

function nextFooterQuote() {
    const quotes = document.querySelectorAll('.quote-footer');
    let currentIndex = -1;
    
    // 找到当前活动的quote
    quotes.forEach((quote, index) => {
        if (quote.classList.contains('active')) {
            quote.classList.remove('active');
            currentIndex = index;
        }
    });
    
    // 计算下一个index
    const nextIndex = (currentIndex + 1) % quotes.length;
    quotes[nextIndex].classList.add('active');
}

function initUsageGuide() {
    const usageGuide = document.getElementById('usage-guide');
    const usageModal = document.getElementById('usage-modal');
    
    usageGuide.addEventListener('click', function() {
        usageModal.classList.add('active');
        
        // 3秒后自动关闭
        setTimeout(() => {
            usageModal.classList.remove('active');
        }, 3000);
    });
    
    // 点击弹窗外部也可以关闭
    usageModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
}

function initDontClick() {
    const dontClick = document.getElementById('dont-click');
    
    dontClick.addEventListener('click', function() {
        window.open('https://www.bilibili.com/video/BV1UT42167xb/?spm_id_from=333.337.search-card.all.click&vd_source=14de693efd052a0c18716c0f64adabf8', '_blank');
    });
}

function initMemoryManagement() {
    // 内存管理 - 页面卸载和隐藏时优化性能
    window.addEventListener('beforeunload', function() {
        stopSnowTheme();
        if (audioPlayer) {
            audioPlayer.pause();
        }
    });
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面隐藏时暂停所有雪花动画以节省资源
            const snowflakes = document.querySelectorAll('.snowflake');
            snowflakes.forEach(snowflake => {
                snowflake.style.animationPlayState = 'paused';
            });
        } else {
            // 页面重新显示时恢复雪花动画
            const snowflakes = document.querySelectorAll('.snowflake');
            snowflakes.forEach(snowflake => {
                snowflake.style.animationPlayState = 'running';
            });
        }
    });
}

function initNewFeatures() {
    // 初始化倒计时
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // 初始化计时器事件
    document.getElementById('start-timer').addEventListener('click', startTimer);
    document.getElementById('pause-timer').addEventListener('click', pauseTimer);
    document.getElementById('reset-timer').addEventListener('click', resetTimer);
    
    // 初始化主题切换
    initThemeSwitcher();
    
    // 初始化全局搜索
    initGlobalSearch();
    
    // 初始化音乐播放器
    initMusicPlayer();
    
    // 初始化计时器历史记录
    updateTimerHistory();
    
    // 初始化番茄工作法
    window.pomodoroTimer = new PomodoroTimer();
    
    // 请求通知权限
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // 确保页面加载时显示正确的标签页
    window.pomodoroTimer.switchTab('study');
}

// ===== 工具函数 =====
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const today = new Date();
    
    if (formatDate(date) === formatDate(today)) {
        return '今天';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (formatDate(date) === formatDate(tomorrow)) {
        return '明天';
    }
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    
    if (formatDate(date) === formatDate(dayAfterTomorrow)) {
        return '后天';
    }
    
    return `${month}月${day}日`;
}

function formatChineseDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// 窗口大小调整时的优化
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (document.body.classList.contains('snow-theme')) {
            stopSnowTheme();
            setTimeout(initSnowTheme, 100);
        }
    }, 250);
});
    