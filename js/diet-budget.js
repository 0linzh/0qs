// ===== 全局变量和初始化数据 =====
let budgetData = {
    monthlyBudget: 0,
    currentSpent: 0,
    remainingBudget: 0,
    dailyLimit: 0
};
let expenses = [];

// 食物数据库
const foodDatabase = {
    breakfast: [
        { name: "豆浆", price: 1, nutrition: { protein: 4, carbs: 1, fat: 2, vitamins: "B" } },
        { name: "小油条", price: 0.3, nutrition: { protein: 3, carbs: 50, fat: 15, vitamins: null } },
        { name: "炒面", price: 2, nutrition: { protein: 6, carbs: 45, fat: 8, vitamins: null } },
        { name: "包子", price: 1.5, nutrition: { protein: 5, carbs: 30, fat: 5, vitamins: "A" } },
        { name: "鸡蛋", price: 1, nutrition: { protein: 6, carbs: 0, fat: 5, vitamins: "D" } },
        { name: "烤肠", price: 2, nutrition: { protein: 7, carbs: 9, fat: 11, vitamins: "B" } },
        { name: "大油条", price: 1, nutrition: { protein: 7, carbs: 55, fat: 23, vitamins: "B" } },
        { name: "鸡蛋夹饼", price: 1.5, nutrition: { protein: 18, carbs: 48, fat: 22, vitamins: "A, B" } },
        { name: "豆沙包", price: 1, nutrition: { protein: 7, carbs: 38, fat: 6, vitamins: "B" } },
        { name: "馒头", price: 0.2, nutrition: { protein: 4, carbs: 28, fat: 1, vitamins: "B" } },
        { name: "鸡蛋炒饭", price: 6, nutrition: { protein: 22, carbs: 110, fat: 25, vitamins: "A, B" } }
    ],
    mainMeals: [
        { name: "二两米饭", price: 1, nutrition: { protein: 3, carbs: 30, fat: 0, vitamins: null } },
        { name: "鸡排", price: 7, nutrition: { protein: 25, carbs: 10, fat: 12, vitamins: "B" } },
        { name: "锅包肉", price: 7, nutrition: { protein: 20, carbs: 15, fat: 18, vitamins: null } },
        { name: "炒茄子", price: 3, nutrition: { protein: 2, carbs: 8, fat: 5, vitamins: "A,C" } },
        { name: "炒包菜", price: 3, nutrition: { protein: 2, carbs: 6, fat: 3, vitamins: "C,K" } },
        { name: "红烧肉", price: 8, nutrition: { protein: 20, carbs: 5, fat: 25, vitamins: null } },
        { name: "鱼香肉丝", price: 6, nutrition: { protein: 15, carbs: 20, fat: 10, vitamins: null } },
        { name: "西红柿炒鸡蛋", price: 5, nutrition: { protein: 10, carbs: 15, fat: 8, vitamins: "A,C" } },
        // 面条类
        { name: "清汤小面", price: 8, nutrition: { protein: 2, carbs: 65, fat: 8, vitamins: "B" } },
        { name: "麻辣小面", price: 8, nutrition: { protein: 2, carbs: 65, fat: 12, vitamins: "B" } },
        { name: "豌豆小面", price: 9, nutrition: { protein: 5, carbs: 70, fat: 10, vitamins: "B" } },
        { name: "老坛酸菜面", price: 10, nutrition: { protein: 4, carbs: 68, fat: 11, vitamins: "B, C" } },
        { name: "榨菜小面", price: 10, nutrition: { protein: 4, carbs: 66, fat: 9, vitamins: "B" } },
        { name: "特色炸酱面", price: 12, nutrition: { protein: 5, carbs: 75, fat: 18, vitamins: "B" } },
        { name: "香菇烧鸡面", price: 13, nutrition: { protein: 21, carbs: 70, fat: 15, vitamins: "A, B" } },
        { name: "特色豌杂面", price: 14, nutrition: { protein: 5, carbs: 72, fat: 20, vitamins: "B" } },
        { name: "红烧牛肉面", price: 15, nutrition: { protein: 21, carbs: 70, fat: 22, vitamins: "B" } },
        { name: "干拌麻辣小面", price: 9, nutrition: { protein: 5, carbs: 65, fat: 10, vitamins: "B" } },
        { name: "重庆热干面", price: 12, nutrition: { protein: 5, carbs: 80, fat: 15, vitamins: "B" } },
        { name: "干拌牛肉面", price: 15, nutrition: { protein: 15, carbs: 68, fat: 25, vitamins: "B" } },
        // 炒饭类
        { name: "火腿鸡蛋炒饭", price: 12, nutrition: { protein: 25, carbs: 120, fat: 30, vitamins: "A, B" } },
        { name: "老干妈五花肉炒饭", price: 14, nutrition: { protein: 22, carbs: 115, fat: 35, vitamins: "B" } },
        // 汤类
        { name: "紫菜蛋花汤", price: 3, nutrition: { protein: 6, carbs: 3, fat: 1, vitamins: "A, C" } },
        // 其他
        { name: "桂花糯米汤圆", price: 6, nutrition: { protein: 8, carbs: 50, fat: 10, vitamins: "B" } },
        // 米村拌饭系列
        { name: "米村鸡肉拌饭", price: 13, nutrition: { protein: 25, carbs: 70, fat: 12, vitamins: "A, B" } },
        { name: "米村黑椒猪肉拌饭", price: 14, nutrition: { protein: 28, carbs: 70, fat: 15, vitamins: "B" } },
        { name: "米村牛肉拌饭", price: 17, nutrition: { protein: 32, carbs: 70, fat: 18, vitamins: "B" } }
    ],
    drinks: [
        { name: "矿泉水", price: 1.5, nutrition: { protein: 0, carbs: 0, fat: 0, vitamins: null } },
        { name: "牛奶", price: 3, nutrition: { protein: 8, carbs: 12, fat: 5, vitamins: "D,B12" } },
        { name: "可乐", price: 3, nutrition: { protein: 0, carbs: 10, fat: 0, vitamins: null } },
        { name: "果汁", price: 4, nutrition: { protein: 1, carbs: 15, fat: 0, vitamins: "C" } }
    ]
};

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据
    initBudgetData();
    
    // 初始化UI
    initBudgetUI();
    
    // 初始化事件监听器
    initBudgetEventListeners();
    
    // 渲染消费记录
    renderExpenses();
    
    // 生成饮食推荐
    generateFoodRecommendations();
});

// 页面可见性变化时重新初始化
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 页面从后台切换到前台时，重新初始化
        initBudgetData();
        initBudgetUI();
        initBudgetEventListeners();
        renderExpenses();
        generateFoodRecommendations();
    }
});

// 延迟初始化，确保DOM完全加载
setTimeout(function() {
    initBudgetData();
    initBudgetUI();
    initBudgetEventListeners();
    renderExpenses();
    generateFoodRecommendations();
}, 1000);

// ===== 预算功能 =====
// 初始化预算数据
function initBudgetData() {
    // 从localStorage加载预算数据
    const savedBudget = localStorage.getItem('budgetData');
    if (savedBudget) {
        budgetData = JSON.parse(savedBudget);
    }
    
    // 从localStorage加载消费记录
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        // 计算本月已消费金额
        updateCurrentSpent();
    }
}

// 初始化预算UI
function initBudgetUI() {
    // 设置预算表单值
    document.getElementById('monthly-budget').value = budgetData.monthlyBudget;
    document.getElementById('current-spent').value = budgetData.currentSpent;
    updateBudgetCalculations();
    updateBudgetDisplay();
    
    // 设置当前日期
    const today = new Date();
    document.getElementById('expense-date').value = today.toISOString().split('T')[0];
}

// 初始化事件监听器
function initBudgetEventListeners() {
    // 月预算输入变化
    const monthlyBudgetInput = document.getElementById('monthly-budget');
    if (monthlyBudgetInput) {
        monthlyBudgetInput.addEventListener('input', updateBudgetCalculations);
    }
    
    // 本月已消费输入变化
    const currentSpentInput = document.getElementById('current-spent');
    if (currentSpentInput) {
        currentSpentInput.addEventListener('input', updateBudgetCalculations);
    }
    
    // 保存预算按钮
    const saveBudgetBtn = document.getElementById('save-budget-btn');
    if (saveBudgetBtn) {
        saveBudgetBtn.addEventListener('click', saveBudget);
    }
    
    // 添加消费按钮
    const addExpenseBtn = document.getElementById('add-expense-btn');
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', function() {
            showExpenseModal();
        });
    }
    
    // 保存消费按钮
    const saveExpenseBtn = document.getElementById('save-expense-btn');
    if (saveExpenseBtn) {
        saveExpenseBtn.addEventListener('click', saveExpense);
    }
    
    // 模态框关闭按钮
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            hideModal(this.closest('.modal').id);
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
}

// 更新预算计算
function updateBudgetCalculations() {
    // 检查元素是否存在
    const monthlyBudgetInput = document.getElementById('monthly-budget');
    const currentSpentInput = document.getElementById('current-spent');
    const remainingBudgetInput = document.getElementById('remaining-budget');
    const dailyLimitInput = document.getElementById('daily-limit');
    
    if (!monthlyBudgetInput || !currentSpentInput || !remainingBudgetInput || !dailyLimitInput) {
        return;
    }
    
    const monthlyBudget = parseFloat(monthlyBudgetInput.value) || 0;
    const currentSpent = parseFloat(currentSpentInput.value) || 0;
    
    // 计算剩余预算
    const remainingBudget = monthlyBudget - currentSpent;
    
    // 计算日均限额（按剩余天数计算）
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - now.getDate() + 1; // 算上今天
    const dailyLimit = remainingDays > 0 ? remainingBudget / remainingDays : 0;
    
    // 更新表单显示
    remainingBudgetInput.value = remainingBudget.toFixed(2);
    dailyLimitInput.value = dailyLimit.toFixed(2);
}

// 保存预算
function saveBudget() {
    // 获取表单值
    const monthlyBudgetInput = document.getElementById('monthly-budget');
    const currentSpentInput = document.getElementById('current-spent');
    
    if (!monthlyBudgetInput || !currentSpentInput) {
        console.error('预算表单元素不存在');
        return;
    }
    
    const monthlyBudget = parseFloat(monthlyBudgetInput.value) || 0;
    const currentSpent = parseFloat(currentSpentInput.value) || 0;
    const remainingBudget = monthlyBudget - currentSpent;
    
    // 计算日均限额（按剩余天数计算）
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - now.getDate() + 1; // 算上今天
    const dailyLimit = remainingDays > 0 ? remainingBudget / remainingDays : 0;
    
    // 更新预算数据
    budgetData = {
        monthlyBudget,
        currentSpent,
        remainingBudget,
        dailyLimit
    };
    
    // 保存到localStorage
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
    
    // 更新显示
    updateBudgetDisplay();
    
    // 显示保存成功提示
    alert('预算设置已保存！');
    
    // 更新饮食推荐
    generateFoodRecommendations();
}

// 更新预算显示
function updateBudgetDisplay() {
    // 更新表单值
    const remainingBudgetInput = document.getElementById('remaining-budget');
    const dailyLimitInput = document.getElementById('daily-limit');
    
    if (remainingBudgetInput) {
        remainingBudgetInput.value = budgetData.remainingBudget.toFixed(2);
    }
    
    if (dailyLimitInput) {
        dailyLimitInput.value = budgetData.dailyLimit.toFixed(2);
    }
    
    // 更新显示卡片
    const displayMonthlyBudget = document.getElementById('display-monthly-budget');
    const displayCurrentSpent = document.getElementById('display-current-spent');
    const displayRemainingBudget = document.getElementById('display-remaining-budget');
    const displayDailyLimit = document.getElementById('display-daily-limit');
    
    if (displayMonthlyBudget) {
        displayMonthlyBudget.textContent = budgetData.monthlyBudget;
    }
    
    if (displayCurrentSpent) {
        displayCurrentSpent.textContent = budgetData.currentSpent.toFixed(2);
    }
    
    if (displayRemainingBudget) {
        displayRemainingBudget.textContent = budgetData.remainingBudget.toFixed(2);
    }
    
    if (displayDailyLimit) {
        displayDailyLimit.textContent = budgetData.dailyLimit.toFixed(2);
    }
}

// 更新本月已消费金额
function updateCurrentSpent() {
    // 计算本月已消费金额
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthSpent = expenses.reduce((total, expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
            return total + parseFloat(expense.amount);
        }
        return total;
    }, 0);
    
    // 更新预算数据
    budgetData.currentSpent = monthSpent;
    budgetData.remainingBudget = budgetData.monthlyBudget - monthSpent;
    
    // 计算日均限额（按剩余天数计算）
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - now.getDate() + 1; // 算上今天
    budgetData.dailyLimit = remainingDays > 0 ? budgetData.remainingBudget / remainingDays : 0;
    
    // 保存到localStorage
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
    
    // 更新UI
    document.getElementById('current-spent').value = monthSpent;
    updateBudgetDisplay();
}

// ===== 消费记录功能 =====
// 保存消费记录
function saveExpense() {
    // 获取表单值
    const date = document.getElementById('expense-date').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const description = document.getElementById('expense-description').value;
    
    // 验证表单
    if (!date || !amount || amount <= 0) {
        alert('请填写有效的消费信息');
        return;
    }
    
    // 创建新消费记录
    const newExpense = {
        id: Date.now(),
        date,
        amount,
        category,
        description,
        timestamp: Date.now()
    };
    
    // 添加到消费记录列表
    expenses.push(newExpense);
    
    // 保存到localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // 更新本月已消费金额
    updateCurrentSpent();
    
    // 渲染消费记录
    renderExpenses();
    
    // 关闭模态框
    hideModal('add-expense-modal');
    
    // 清空表单
    document.querySelector('.expense-form').reset();
    
    // 设置当前日期
    const today = new Date();
    document.getElementById('expense-date').value = today.toISOString().split('T')[0];
    
    // 更新饮食推荐
    generateFoodRecommendations();
}

// 渲染消费记录
function renderExpenses() {
    const expenseList = document.getElementById('expense-list');
    
    // 清空列表
    expenseList.innerHTML = '';
    
    // 如果没有消费记录
    if (expenses.length === 0) {
        expenseList.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">暂无消费记录</div>';
        return;
    }
    
    // 按时间倒序排序
    const sortedExpenses = [...expenses].sort((a, b) => b.timestamp - a.timestamp);
    
    // 渲染消费记录
    sortedExpenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.className = 'task-item manual';
        
        const categoryNames = {
            food: '饮食',
            transport: '交通',
            shopping: '购物',
            entertainment: '娱乐',
            other: '其他'
        };
        
        expenseItem.innerHTML = `
            <div class="task-info">
                <div class="task-title">${categoryNames[expense.category]} - ${expense.description || '无描述'}</div>
                <div class="task-meta">
                    <span class="task-time">${expense.date}</span>
                    <span class="task-location">¥${expense.amount.toFixed(2)}</span>
                </div>
            </div>
            <button class="task-delete" onclick="deleteExpense(${expense.id})">×</button>
        `;
        
        expenseList.appendChild(expenseItem);
    });
}

// 删除消费记录
function deleteExpense(id) {
    if (confirm('确定要删除这条消费记录吗？')) {
        expenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateCurrentSpent();
        renderExpenses();
        
        // 更新饮食推荐
        generateFoodRecommendations();
    }
}

// ===== 饮食推荐功能 =====
// 生成饮食推荐
function generateFoodRecommendations() {
    const foodList = document.getElementById('food-list');
    
    // 检查foodList元素是否存在
    if (!foodList) {
        return; // 如果元素不存在，直接返回，不执行后续操作
    }
    
    // 清空列表
    foodList.innerHTML = '';
    
    // 获取日均消费限额
    const dailyLimit = budgetData.dailyLimit || 30;
    const budgetPerMeal = dailyLimit / 3;
    
    // 生成早餐推荐
    const breakfastCombinations = generateMealRecommendation('早餐', budgetPerMeal);
    const breakfast = selectRandomRecommendation(breakfastCombinations);
    
    // 生成午餐推荐
    const lunchCombinations = generateMealRecommendation('午餐', budgetPerMeal);
    const lunch = selectRandomRecommendation(lunchCombinations);
    
    // 生成晚餐推荐，排除午餐的食物，确保晚饭和午饭不完全一样
    const dinnerCombinations = generateMealRecommendation('晚餐', budgetPerMeal, lunch);
    const dinner = selectRandomRecommendation(dinnerCombinations.length > 0 ? dinnerCombinations : generateMealRecommendation('晚餐', budgetPerMeal));
    
    // 存储推荐结果，供系统任务使用
    const today = new Date();
    const storedRecommendations = {
        breakfast: breakfast,
        lunch: lunch,
        dinner: dinner,
        date: today.toDateString(), // 存储当前日期，用于判断是否需要更新
        timestamp: Date.now()
    };
    localStorage.setItem('storedFoodRecommendations', JSON.stringify(storedRecommendations));
    
    // 整合所有推荐
    const allRecommendations = [...breakfast, ...lunch, ...dinner];
    
    // 创建餐别标题
    function createMealSection(title, recommendations) {
        const section = document.createElement('div');
        section.className = 'meal-section';
        
        let sectionHTML = `<h4>${title}</h4>`;
        
        recommendations.forEach(meal => {
            let nutritionText = '';
            if (meal.nutrition) {
                nutritionText = `蛋白质: ${meal.nutrition.protein}g | 碳水: ${meal.nutrition.carbs}g | 脂肪: ${meal.nutrition.fat}g`;
                if (meal.nutrition.vitamins) {
                    nutritionText += ` | 维生素: ${meal.nutrition.vitamins}`;
                }
            }
            
            sectionHTML += `
                <div class="food-item">
                    <h5>${meal.name}</h5>
                    <div class="food-nutrition">${nutritionText}</div>
                    <div class="food-price">¥${meal.price.toFixed(1)}</div>
                </div>
            `;
        });
        
        section.innerHTML = sectionHTML;
        return section;
    }
    
    // 渲染三餐推荐
    foodList.appendChild(createMealSection('早餐', breakfast));
    foodList.appendChild(createMealSection('午餐', lunch));
    foodList.appendChild(createMealSection('晚餐', dinner));
    
    // 计算总营养量
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    const vitamins = new Set();
    
    allRecommendations.forEach(meal => {
        if (meal.nutrition) {
            totalProtein += meal.nutrition.protein || 0;
            totalCarbs += meal.nutrition.carbs || 0;
            totalFat += meal.nutrition.fat || 0;
            if (meal.nutrition.vitamins) {
                meal.nutrition.vitamins.split(',').forEach(vitamin => {
                    vitamins.add(vitamin.trim());
                });
            }
        }
    });
    
    // 成年人每日营养参考值
    const dailyReference = {
        protein: 50,   // 蛋白质(g)
        carbs: 300,    // 碳水化合物(g)
        fat: 65,       // 脂肪(g)
        vitamins: ['A', 'B', 'C', 'D', 'E', 'K'] // 主要维生素
    };
    
    // 添加营养总量提示
    const nutritionSummary = document.createElement('div');
    nutritionSummary.className = 'nutrition-summary';
    nutritionSummary.innerHTML = `
        <div>
            <h4 style="margin-bottom: 10px; color: #2c3e50; text-align: center;">今日营养摄入预估</h4>
            <div style="display: flex; flex-wrap: wrap; justify-content: space-around; gap: 10px;">
                <div>
                    <strong>蛋白质:</strong> ${totalProtein.toFixed(1)}g / ${dailyReference.protein}g
                    <div style="width: 100px; background: #e0e0e0; height: 6px; border-radius: 3px; margin-top: 5px;">
                        <div style="width: ${Math.min(100, (totalProtein / dailyReference.protein) * 100)}%; background: #3498db; height: 6px; border-radius: 3px;"></div>
                    </div>
                </div>
                <div>
                    <strong>碳水化合物:</strong> ${totalCarbs.toFixed(1)}g / ${dailyReference.carbs}g
                    <div style="width: 100px; background: #e0e0e0; height: 6px; border-radius: 3px; margin-top: 5px;">
                        <div style="width: ${Math.min(100, (totalCarbs / dailyReference.carbs) * 100)}%; background: #2ecc71; height: 6px; border-radius: 3px;"></div>
                    </div>
                </div>
                <div>
                    <strong>脂肪:</strong> ${totalFat.toFixed(1)}g / ${dailyReference.fat}g
                    <div style="width: 100px; background: #e0e0e0; height: 6px; border-radius: 3px; margin-top: 5px;">
                        <div style="width: ${Math.min(100, (totalFat / dailyReference.fat) * 100)}%; background: #e67e22; height: 6px; border-radius: 3px;"></div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 10px; text-align: center; color: #7f8c8d; font-size: 14px;">
                <strong>维生素:</strong> ${Array.from(vitamins).join(', ')} (共${vitamins.size}/${dailyReference.vitamins.length}种主要维生素)
            </div>
        </div>
    `;
    foodList.appendChild(nutritionSummary);
}

// 计算食物组合的营养评分
function calculateNutritionScore(foods) {
    // 计算总营养值
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    const vitamins = new Set();
    
    foods.forEach(food => {
        if (food.nutrition) {
            totalProtein += food.nutrition.protein || 0;
            totalCarbs += food.nutrition.carbs || 0;
            totalFat += food.nutrition.fat || 0;
            if (food.nutrition.vitamins) {
                food.nutrition.vitamins.split(',').forEach(vitamin => {
                    vitamins.add(vitamin.trim());
                });
            }
        }
    });
    
    // 计算营养均衡性评分
    // 理想比例：蛋白质:碳水:脂肪 ≈ 1:4:1.5
    const idealProtein = 20; // 理想蛋白质摄入量(g)
    const idealCarbs = 80;   // 理想碳水化合物摄入量(g)
    const idealFat = 30;     // 理想脂肪摄入量(g)
    
    // 计算各营养成分的得分（越接近理想值得分越高）
    const proteinScore = Math.max(0, 100 - Math.abs(totalProtein - idealProtein) * 2);
    const carbsScore = Math.max(0, 100 - Math.abs(totalCarbs - idealCarbs) * 1);
    const fatScore = Math.max(0, 100 - Math.abs(totalFat - idealFat) * 1.5);
    
    // 维生素多样性得分
    const vitaminScore = vitamins.size * 10;
    
    // 食物多样性得分
    const foodVarietyScore = foods.length * 20;
    
    // 综合得分
    const totalScore = (proteinScore + carbsScore + fatScore + vitaminScore + foodVarietyScore) / 5;
    
    return Math.round(totalScore);
}

// 生成单一餐食的所有符合条件的推荐组合
function generateMealRecommendation(mealType, budget, excludeMeals = []) {
    const allPossibleCombinations = [];
    
    // 辅助函数：检查组合是否包含排除的餐食
    function shouldExclude(combo) {
        return excludeMeals.some(excludeMeal => 
            combo.some(meal => meal.name === excludeMeal.name)
        );
    }
    
    // 根据餐型生成推荐
    if (mealType.includes('早餐')) {
        // 早餐推荐：从breakfast类别中选
        // 遍历所有可能的早餐组合，确保不重复
        for (let i = 0; i < foodDatabase.breakfast.length; i++) {
            for (let j = i + 1; j < foodDatabase.breakfast.length; j++) {
                for (let k = 0; k < foodDatabase.drinks.length; k++) {
                    const combo = [
                        foodDatabase.breakfast[i],
                        foodDatabase.breakfast[j],
                        foodDatabase.drinks[k]
                    ];
                    
                    // 检查组合中是否有重复的食物
                    const foodNames = combo.map(item => item.name);
                    const uniqueNames = new Set(foodNames);
                    if (uniqueNames.size === combo.length && !shouldExclude(combo)) {
                        const comboPrice = combo.reduce((sum, item) => sum + item.price, 0);
                        if (comboPrice <= budget) {
                            const nutritionScore = calculateNutritionScore(combo);
                            allPossibleCombinations.push({ combo, price: comboPrice, score: nutritionScore });
                        }
                    }
                }
            }
        }
        
        // 尝试减少食物数量
        if (allPossibleCombinations.length === 0) {
            for (let i = 0; i < foodDatabase.breakfast.length; i++) {
                for (let k = 0; k < foodDatabase.drinks.length; k++) {
                    const combo = [foodDatabase.breakfast[i], foodDatabase.drinks[k]];
                    if (!shouldExclude(combo)) {
                        const comboPrice = combo.reduce((sum, item) => sum + item.price, 0);
                        if (comboPrice <= budget) {
                            const nutritionScore = calculateNutritionScore(combo);
                            allPossibleCombinations.push({ combo, price: comboPrice, score: nutritionScore });
                        }
                    }
                }
            }
        }
    } else if (mealType.includes('午餐') || mealType.includes('晚餐') || mealType.includes('晚饭')) {
        // 午餐/晚餐推荐：类似早餐逻辑
        // 遍历所有可能的主餐组合，确保不重复
        for (let i = 0; i < foodDatabase.mainMeals.length; i++) {
            for (let j = i + 1; j < foodDatabase.mainMeals.length; j++) {
                for (let k = 0; k < foodDatabase.drinks.length; k++) {
                    const combo = [
                        foodDatabase.mainMeals[i],
                        foodDatabase.mainMeals[j],
                        foodDatabase.drinks[k]
                    ];
                    
                    // 检查组合中是否有重复的食物
                    const foodNames = combo.map(item => item.name);
                    const uniqueNames = new Set(foodNames);
                    if (uniqueNames.size === combo.length && !shouldExclude(combo)) {
                        const comboPrice = combo.reduce((sum, item) => sum + item.price, 0);
                        if (comboPrice <= budget) {
                            const nutritionScore = calculateNutritionScore(combo);
                            allPossibleCombinations.push({ combo, price: comboPrice, score: nutritionScore });
                        }
                    }
                }
            }
        }
        
        // 尝试减少食物数量
        if (allPossibleCombinations.length === 0) {
            for (let i = 0; i < foodDatabase.mainMeals.length; i++) {
                for (let k = 0; k < foodDatabase.drinks.length; k++) {
                    const combo = [foodDatabase.mainMeals[i], foodDatabase.drinks[k]];
                    if (!shouldExclude(combo)) {
                        const comboPrice = combo.reduce((sum, item) => sum + item.price, 0);
                        if (comboPrice <= budget) {
                            const nutritionScore = calculateNutritionScore(combo);
                            allPossibleCombinations.push({ combo, price: comboPrice, score: nutritionScore });
                        }
                    }
                }
            }
        }
    }
    
    return allPossibleCombinations;
}

// 从符合条件的组合中随机选择一个
function selectRandomRecommendation(combinations) {
    if (combinations.length === 0) {
        return [];
    }
    
    // 只考虑得分前50%的组合，确保营养均衡
    const sortedCombinations = [...combinations].sort((a, b) => b.score - a.score);
    const topHalf = sortedCombinations.slice(0, Math.ceil(sortedCombinations.length / 2));
    
    // 随机选择一个组合
    const randomIndex = Math.floor(Math.random() * topHalf.length);
    return topHalf[randomIndex].combo;
}

// 从所有类别中获取最便宜的食物
function getCheapestFoodFromAllCategories() {
    // 合并所有食物
    const allFoods = [
        ...foodDatabase.breakfast,
        ...foodDatabase.mainMeals,
        ...foodDatabase.drinks
    ];
    
    // 找到最便宜的食物
    return allFoods.reduce((cheapest, current) => {
        return current.price < cheapest.price ? current : cheapest;
    }, allFoods[0]);
}

// 从指定类别获取最便宜的食物
function getCheapestFoodFromCategory(category) {
    const foods = foodDatabase[category];
    return foods.reduce((cheapest, current) => {
        return current.price < cheapest.price ? current : cheapest;
    }, foods[0]);
}

// ===== 模态框功能 =====
// 显示消费模态框
function showExpenseModal() {
    const modal = document.getElementById('add-expense-modal');
    modal.classList.add('active');
}

// 隐藏模态框
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// ===== 工具函数 =====
// 生成食物推荐（供系统任务使用）
function generateFoodRecommendationsForTask(taskName) {
    // 首先尝试从localStorage获取存储的推荐结果
    const storedRecommendationsStr = localStorage.getItem('storedFoodRecommendations');
    const today = new Date();
    const todayStr = today.toDateString();
    
    if (storedRecommendationsStr) {
        const storedRecommendations = JSON.parse(storedRecommendationsStr);
        
        // 检查推荐结果是否是今天生成的
        if (storedRecommendations.date === todayStr) {
            // 根据任务名称返回对应的推荐
            if (taskName.includes('早餐')) {
                return storedRecommendations.breakfast;
            } else if (taskName.includes('午餐') || taskName.includes('午饭')) {
                return storedRecommendations.lunch;
            } else if (taskName.includes('晚餐') || taskName.includes('晚饭')) {
                return storedRecommendations.dinner;
            }
        } else {
            // 如果不是今天的推荐，删除旧的推荐
            localStorage.removeItem('storedFoodRecommendations');
        }
    }
    
    // 如果没有存储的推荐或推荐已过期，回退到重新生成
    const budgetData = JSON.parse(localStorage.getItem('budgetData') || JSON.stringify({ dailyLimit: 30 }));
    const dailyLimit = budgetData.dailyLimit || 30;
    const budgetPerMeal = dailyLimit / 3;
    
    // 获取所有符合条件的组合
    const combinations = generateMealRecommendation(taskName, budgetPerMeal);
    // 随机选择一个组合
    return selectRandomRecommendation(combinations);
}

// 获取食物数据库（供系统任务使用）
function getFoodDatabase() {
    return foodDatabase;
}

// 获取预算数据（供系统任务使用）
function getBudgetData() {
    return JSON.parse(localStorage.getItem('budgetData') || JSON.stringify({ monthlyBudget: 0, currentSpent: 0, remainingBudget: 0, dailyLimit: 30 }));
}

// ===== 系统任务支持 =====
// 为系统任务生成食物推荐弹窗
function showFoodRecommendationModal(task) {
    console.log('showFoodRecommendationModal called with task:', task);
    
    // 移除可能存在的旧弹窗
    const existingModal = document.querySelector('.food-recommendation-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 创建食物推荐弹窗
    const modal = document.createElement('div');
    modal.className = 'modal food-recommendation-modal';
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1000';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.overflow = 'auto';
    
    modal.innerHTML = `
        <div class="modal-content" style="background-color: white; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 600px; border-radius: 8px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 class="modal-title" style="margin: 0; color: #2c3e50;">${task.name} - 食物推荐</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #aaa;">&times;</button>
            </div>
            <div class="food-recommendation-content">
                <div class="food-list" id="recommendation-food-list"></div>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(modal);
    
    // 生成食物推荐
    const recommendations = generateFoodRecommendationsForTask(task.name);
    const foodList = modal.querySelector('#recommendation-food-list');
    
    console.log('Generated recommendations:', recommendations);
    
    if (recommendations && recommendations.length > 0) {
        recommendations.forEach(meal => {
            let nutritionText = '';
            if (meal.nutrition) {
                nutritionText = `蛋白质: ${meal.nutrition.protein}g | 碳水: ${meal.nutrition.carbs}g | 脂肪: ${meal.nutrition.fat}g`;
                if (meal.nutrition.vitamins) {
                    nutritionText += ` | 维生素: ${meal.nutrition.vitamins}`;
                }
            }
            
            const foodItem = document.createElement('div');
            foodItem.className = 'food-item';
            foodItem.style.padding = '15px';
            foodItem.style.marginBottom = '10px';
            foodItem.style.backgroundColor = '#f8f9fa';
            foodItem.style.borderRadius = '6px';
            foodItem.innerHTML = `
                <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${meal.name}</h4>
                <div style="font-size: 13px; color: #7f8c8d; margin-bottom: 5px;">${nutritionText}</div>
                <div style="font-weight: bold; color: #e67e22; font-size: 14px;">¥${meal.price.toFixed(1)}</div>
            `;
            
            foodList.appendChild(foodItem);
        });
    } else {
        foodList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">呜~呜~呜~没钱了😭</p>';
    }
    
    // 添加预算提示
    const budgetData = JSON.parse(localStorage.getItem('budgetData') || JSON.stringify({ dailyLimit: 30 }));
    const budgetInfo = document.createElement('div');
    budgetInfo.className = 'budget-info';
    budgetInfo.innerHTML = `
        <div style="text-align: center; color: #3498db; font-size: 14px; margin-top: 20px;">
            今日饮食预算剩余: ¥${(budgetData.dailyLimit || 30).toFixed(2)}
        </div>
    `;
    foodList.appendChild(budgetInfo);
    
    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 确保函数被暴露为全局函数
window.showFoodRecommendationModal = showFoodRecommendationModal;

// 全局函数，供任务点击事件调用
window.showFoodRecommendationModal = showFoodRecommendationModal;

