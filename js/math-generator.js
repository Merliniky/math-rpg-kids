/**
 * 数学题目生成器
 * 严格遵循10以内加减法规则
 * 支持基于关卡的难度分级
 */
class MathQuestionGenerator {
    constructor() {
        this.difficulty = 1; // 1-3 对应不同难度
        this.area = '新手村'; // 当前区域
        this.level = 1;      // 当前关卡 (1-9)
        this.subLevel = 1;   // 当前子关卡 (1-5)
        
        // 难度权重配置：[简单, 中等, 困难]
        // 关卡越高，困难题目权重越大
        this.difficultyWeights = {
            1: [0.8, 0.2, 0.0],   // 第1关：80%简单，20%中等
            2: [0.7, 0.3, 0.0],   // 第2关：70%简单，30%中等
            3: [0.5, 0.4, 0.1],   // 第3关：50%简单，40%中等，10%困难
            4: [0.4, 0.4, 0.2],   // 第4关：40%简单，40%中等，20%困难
            5: [0.3, 0.4, 0.3],   // 第5关：30%简单，40%中等，30%困难
            6: [0.2, 0.4, 0.4],   // 第6关：20%简单，40%中等，40%困难
            7: [0.1, 0.4, 0.5],   // 第7关：10%简单，40%中等，50%困难
            8: [0.1, 0.3, 0.6],   // 第8关：10%简单，30%中等，60%困难
            9: [0.0, 0.2, 0.8]    // 第9关（四大天王/冠军）：20%中等，80%困难
        };
        
        // 难度范围配置：{加法最大值, 减法最大值, 是否包含减法}
        this.difficultyRanges = {
            1: { maxAddition: 5, maxSubtraction: 0, hasSubtraction: false },  // 简单：加法≤5，无减法
            2: { maxAddition: 8, maxSubtraction: 5, hasSubtraction: true },   // 中等：加法≤8，减法≤5
            3: { maxAddition: 10, maxSubtraction: 10, hasSubtraction: true }  // 困难：加法≤10，减法≤10
        };
    }
    
    /**
     * 根据关卡设置难度
     * @param {number} level - 大关卡 (1-9)
     * @param {number} subLevel - 子关卡 (1-5)
     */
    setDifficultyByLevel(level, subLevel) {
        this.level = Math.max(1, Math.min(9, level));
        this.subLevel = Math.max(1, Math.min(5, subLevel));
        
        // 根据关卡确定基础难度
        if (level <= 2) {
            this.difficulty = 1;  // 新手关卡：简单为主
        } else if (level <= 5) {
            this.difficulty = 2;  // 中期关卡：中等难度
        } else {
            this.difficulty = 3;  // 后期关卡：困难为主
        }
        
        // 子关卡5（道馆/天王/冠军）难度提升
        if (subLevel === 5) {
            this.difficulty = Math.min(3, this.difficulty + 1);
        }
        
        this.updateArea();
    }
    
    /**
     * 设置难度级别（保留兼容性）
     * @param {number} level - 难度级别 (1-3)
     */
    setDifficulty(level) {
        this.difficulty = Math.max(1, Math.min(3, level));
        this.updateArea();
    }
    
    /**
     * 更新当前区域名称
     */
    updateArea() {
        const gymNames = [
            '尼比道馆', '华蓝道馆', '枯叶道馆', '彩虹道馆',
            '浅红道馆', '金黄道馆', '红莲道馆', '常青道馆'
        ];
        
        if (this.level === 9) {
            if (this.subLevel === 5) {
                this.area = '冠军之路';
            } else {
                this.area = '四大天王';
            }
        } else if (this.subLevel === 5) {
            this.area = gymNames[this.level - 1] || '道馆';
        } else {
            this.area = `${gymNames[this.level - 1] || '道馆'}区域`;
        }
    }
    
    /**
     * 生成随机整数 [min, max]
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 随机整数
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * 生成加法题目
     * 规则：A + B = C, A >= 1, B >= 1, C <= 10
     * @param {number} maxSum - 最大和值
     * @returns {Object} 题目对象
     */
    generateAddition(maxSum = 10) {
        let a, b, c;
        
        if (this.difficulty === 1) {
            // 新手村：结果 <= 5 的加法
            maxSum = Math.min(maxSum, 5);
        } else if (this.difficulty === 2) {
            // 微风平原：结果 6-8 的加法
            maxSum = Math.min(maxSum, 8);
        } else {
            // 巨石山谷：结果 <= 10 的加法
            maxSum = Math.min(maxSum, 10);
        }
        
        // 生成满足条件的随机数（最小值为1，不包含0）
        do {
            a = this.getRandomInt(1, Math.min(10, maxSum));
            b = this.getRandomInt(1, Math.min(10, maxSum));
            c = a + b;
        } while (c > maxSum);
        
        // 断言验证：确保结果 <= 10
        console.assert(c <= 10, `加法结果 ${c} 超过10！`);
        console.assert(a >= 1, `被加数 ${a} 小于1！`);
        console.assert(b >= 1, `加数 ${b} 小于1！`);
        
        return {
            type: 'addition',
            a: a,
            b: b,
            answer: c,
            question: `${a} + ${b} = ?`,
            display: `${a} + ${b} = ?`
        };
    }
    
    /**
     * 生成减法题目
     * 规则：X - Y = Z, X <= 10, Y >= 1, X > Y, Z >= 1
     * @param {number} maxMinuend - 最大被减数
     * @returns {Object} 题目对象
     */
    generateSubtraction(maxMinuend = 10) {
        let x, y, z;
        
        if (this.difficulty === 1) {
            // 新手村：不生成减法题目
            return null;
        } else if (this.difficulty === 2) {
            // 微风平原：结果 <= 5 的减法
            maxMinuend = Math.min(maxMinuend, 5);
        } else {
            // 巨石山谷：被减数 <= 10 的减法
            maxMinuend = Math.min(maxMinuend, 10);
        }
        
        // 生成满足条件的随机数（最小值为1，不包含0，且结果不为0）
        do {
            x = this.getRandomInt(2, maxMinuend); // 被减数至少为2
            y = this.getRandomInt(1, x - 1);      // 减数从1到x-1，确保结果>=1
        } while (x <= y);
        
        z = x - y;
        
        // 断言验证
        console.assert(x <= 10, `被减数 ${x} 超过10！`);
        console.assert(y >= 1, `减数 ${y} 小于1！`);
        console.assert(x > y, `被减数 ${x} 不大于减数 ${y}！`);
        console.assert(z >= 1, `结果 ${z} 小于1！`);
        
        return {
            type: 'subtraction',
            x: x,
            y: y,
            answer: z,
            question: `${x} - ${y} = ?`,
            display: `${x} - ${y} = ?`
        };
    }
    
    /**
     * 生成题目（根据当前难度权重）
     * @returns {Object} 题目对象
     */
    generateQuestion() {
        let question;
        
        // 获取当前关卡的难度权重
        const weights = this.difficultyWeights[this.level] || this.difficultyWeights[1];
        
        // 根据权重随机选择难度级别
        const rand = Math.random();
        let selectedDifficulty;
        
        if (rand < weights[0]) {
            selectedDifficulty = 1;  // 简单
        } else if (rand < weights[0] + weights[1]) {
            selectedDifficulty = 2;  // 中等
        } else {
            selectedDifficulty = 3;  // 困难
        }
        
        // 获取难度范围配置
        const rangeConfig = this.difficultyRanges[selectedDifficulty];
        
        // 决定生成加法还是减法
        const useSubtraction = rangeConfig.hasSubtraction && Math.random() < 0.4;
        
        if (useSubtraction) {
            question = this.generateSubtraction(rangeConfig.maxSubtraction);
        }
        
        // 如果减法生成失败或不需要减法，生成加法
        if (!question) {
            question = this.generateAddition(rangeConfig.maxAddition);
        }
        
        // 生成干扰项
        question.options = this.generateOptions(question.answer);
        
        return question;
    }
    
    /**
     * 生成答案选项（1个正确答案，2个干扰项）
     * @param {number} correctAnswer - 正确答案
     * @returns {Array} 选项数组
     */
    generateOptions(correctAnswer) {
        const options = [correctAnswer];
        
        // 生成干扰项（确保不重复且在1-10范围内，不包含0）
        while (options.length < 3) {
            let wrongOption;
            
            // 在正确答案附近生成干扰项
            const offset = this.getRandomInt(1, 3);
            if (Math.random() < 0.5) {
                wrongOption = correctAnswer + offset;
            } else {
                wrongOption = correctAnswer - offset;
            }
            
            // 确保干扰项在有效范围内（1-10）且不重复
            if (wrongOption >= 1 && wrongOption <= 10 && !options.includes(wrongOption)) {
                options.push(wrongOption);
            }
        }
        
        // 随机打乱选项顺序
        return this.shuffleArray(options);
    }
    
    /**
     * 随机打乱数组
     * @param {Array} array - 要打乱的数组
     * @returns {Array} 打乱后的数组
     */
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    /**
     * 验证答案是否正确
     * @param {number} userAnswer - 用户选择的答案
     * @param {number} correctAnswer - 正确答案
     * @returns {boolean} 是否正确
     */
    checkAnswer(userAnswer, correctAnswer) {
        return userAnswer === correctAnswer;
    }
    
    /**
     * 获取当前区域信息
     * @returns {Object} 区域信息
     */
    getAreaInfo() {
        return {
            name: this.area,
            difficulty: this.difficulty,
            description: this.getAreaDescription()
        };
    }
    
    /**
     * 获取区域描述
     * @returns {string} 区域描述
     */
    getAreaDescription() {
        switch(this.difficulty) {
            case 1:
                return '这里只有简单的加法题目，适合初学者';
            case 2:
                return '开始接触减法，难度逐渐提升';
            case 3:
                return '全面掌握10以内加减法';
            default:
                return '未知区域';
        }
    }
    
    /**
     * 测试题目生成器（用于开发调试）
     */
    test() {
        console.log('测试数学题目生成器...');
        
        // 测试不同难度
        for (let diff = 1; diff <= 3; diff++) {
            this.setDifficulty(diff);
            console.log(`\n=== 难度 ${diff} (${this.area}) ===`);
            
            // 生成5个题目
            for (let i = 0; i < 5; i++) {
                const question = this.generateQuestion();
                console.log(`题目 ${i + 1}: ${question.display}`);
                console.log(`答案: ${question.answer}`);
                console.log(`选项: ${question.options.join(', ')}`);
                console.log('---');
            }
        }
        
        // 测试边界条件
        console.log('\n=== 边界条件测试 ===');
        this.setDifficulty(3);
        
        // 测试最大和值
        const maxAddition = this.generateAddition(10);
        console.log(`最大加法: ${maxAddition.display} (答案: ${maxAddition.answer})`);
        
        // 测试减法
        const subtraction = this.generateSubtraction(10);
        if (subtraction) {
            console.log(`减法: ${subtraction.display} (答案: ${subtraction.answer})`);
        }
        
        console.log('\n测试完成！');
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathQuestionGenerator;
}