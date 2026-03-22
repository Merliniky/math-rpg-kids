/**
 * 数理小精灵：十之秘境 - 游戏主逻辑
 * 包含战斗系统、宠物养成、关卡系统等核心功能
 */

// 游戏状态枚举
const GameState = {
    START: 'start',
    PET_SELECTION: 'pet_selection',
    EXPLORING: 'exploring',
    BATTLE: 'battle',
    STATS: 'stats',
    GAME_OVER: 'game_over'
};

// 战斗状态枚举
const BattleState = {
    WAITING_QUESTION: 'waiting_question',
    WAITING_ANSWER: 'waiting_answer',
    PLAYING_ANIMATION: 'playing_animation',
    SETTLEMENT: 'settlement'
};

// 宠物类型
const PetType = {
    FIRE: 'fire',
    WATER: 'water',
    GRASS: 'grass'
};

// 宝可梦数据库（初代宝可梦）
const PokemonDatabase = {
    // 普通宝可梦（用于随机遭遇）
    common: [
        { name: '绿毛虫', emoji: '🐛', baseHP: 25, attack: 5, type: '虫' },
        { name: '独角虫', emoji: '🪱', baseHP: 28, attack: 5, type: '虫' },
        { name: '波波', emoji: '🐦', baseHP: 30, attack: 6, type: '普通/飞行' },
        { name: '小拉达', emoji: '🐀', baseHP: 28, attack: 6, type: '普通' },
        { name: '烈雀', emoji: '🐤', baseHP: 30, attack: 7, type: '普通/飞行' },
        { name: '阿柏蛇', emoji: '🐍', baseHP: 32, attack: 7, type: '毒' },
        { name: '皮卡丘', emoji: '⚡', baseHP: 30, attack: 7, type: '电' },
        { name: '穿山鼠', emoji: '🦔', baseHP: 35, attack: 7, type: '地面' },
        { name: '尼多兰', emoji: '🐭', baseHP: 35, attack: 6, type: '毒' },
        { name: '尼多朗', emoji: '🐭', baseHP: 38, attack: 7, type: '毒' },
        { name: '皮皮', emoji: '🧚', baseHP: 40, attack: 5, type: '妖精' },
        { name: '六尾', emoji: '🦊', baseHP: 35, attack: 6, type: '火' },
        { name: '胖丁', emoji: '🎈', baseHP: 45, attack: 5, type: '普通/妖精' },
        { name: '超音蝠', emoji: '🦇', baseHP: 32, attack: 6, type: '毒/飞行' },
        { name: '走路草', emoji: '🌸', baseHP: 35, attack: 6, type: '草/毒' },
        { name: '毛球', emoji: '🪰', baseHP: 38, attack: 6, type: '虫/毒' },
        { name: '地鼠', emoji: '🐹', baseHP: 28, attack: 7, type: '地面' },
        { name: '喵喵', emoji: '🐱', baseHP: 35, attack: 7, type: '普通' },
        { name: '可达鸭', emoji: '🦆', baseHP: 40, attack: 6, type: '水' },
        { name: '猴怪', emoji: '🐒', baseHP: 35, attack: 8, type: '格斗' },
        { name: '卡蒂狗', emoji: '🐕', baseHP: 40, attack: 8, type: '火' },
        { name: '蚊香蝌蚪', emoji: '🐸', baseHP: 35, attack: 6, type: '水' },
        { name: '凯西', emoji: '✨', baseHP: 25, attack: 5, type: '超能力' },
        { name: '腕力', emoji: '💪', baseHP: 45, attack: 9, type: '格斗' },
        { name: '喇叭芽', emoji: '🌺', baseHP: 35, attack: 7, type: '草/毒' },
        { name: '玛瑙水母', emoji: '🪼', baseHP: 35, attack: 6, type: '水/毒' },
        { name: '小磁怪', emoji: '🧲', baseHP: 32, attack: 7, type: '电/钢' },
        { name: '嘟嘟', emoji: '🐦', baseHP: 38, attack: 8, type: '普通/飞行' },
        { name: '小海狮', emoji: '🦭', baseHP: 45, attack: 6, type: '水/冰' },
        { name: '臭泥', emoji: '🟤', baseHP: 50, attack: 8, type: '毒' }
    ],
    
    // 岩石系宝可梦（尼比道馆）
    rock: [
        { name: '小拳石', emoji: '🪨', baseHP: 40, attack: 8, type: '岩石/地面' },
        { name: '隆隆石', emoji: '🪨', baseHP: 55, attack: 9, type: '岩石/地面' },
        { name: '大岩蛇', emoji: '🐍', baseHP: 60, attack: 10, type: '岩石/地面' }
    ],
    
    // 水系宝可梦（华蓝道馆）
    water: [
        { name: '海星星', emoji: '⭐', baseHP: 40, attack: 7, type: '水' },
        { name: '宝石海星', emoji: '⭐', baseHP: 55, attack: 9, type: '水/超能力' },
        { name: '角金鱼', emoji: '🐟', baseHP: 40, attack: 7, type: '水' },
        { name: '金鱼王', emoji: '🐠', baseHP: 55, attack: 9, type: '水' }
    ],
    
    // 电系宝可梦（枯叶道馆）
    electric: [
        { name: '皮卡丘', emoji: '⚡', baseHP: 40, attack: 8, type: '电' },
        { name: '雷丘', emoji: '⚡', baseHP: 55, attack: 10, type: '电' },
        { name: '电击兽', emoji: '⚡', baseHP: 60, attack: 11, type: '电' }
    ],
    
    // 草系宝可梦（彩虹道馆）
    grass: [
        { name: '臭臭花', emoji: '🌺', baseHP: 45, attack: 8, type: '草/毒' },
        { name: '霸王花', emoji: '🌸', baseHP: 60, attack: 10, type: '草/毒' },
        { name: '蔓藤怪', emoji: '🌿', baseHP: 55, attack: 9, type: '草' }
    ],
    
    // 毒系宝可梦（浅红道馆）
    poison: [
        { name: '阿柏蛇', emoji: '🐍', baseHP: 45, attack: 8, type: '毒' },
        { name: '阿柏怪', emoji: '🐍', baseHP: 60, attack: 10, type: '毒' },
        { name: '双弹瓦斯', emoji: '☁️', baseHP: 65, attack: 9, type: '毒' }
    ],
    
    // 超能力系宝可梦（金黄道馆）
    psychic: [
        { name: '凯西', emoji: '✨', baseHP: 35, attack: 7, type: '超能力' },
        { name: '勇吉拉', emoji: '✨', baseHP: 50, attack: 9, type: '超能力' },
        { name: '胡地', emoji: '✨', baseHP: 65, attack: 12, type: '超能力' }
    ],
    
    // 火系宝可梦（红莲道馆）
    fire: [
        { name: '卡蒂狗', emoji: '🐕', baseHP: 50, attack: 9, type: '火' },
        { name: '风速狗', emoji: '🐕', baseHP: 70, attack: 11, type: '火' },
        { name: '鸭嘴火兽', emoji: '🔥', baseHP: 65, attack: 12, type: '火' }
    ],
    
    // 地面系宝可梦（常青道馆）
    ground: [
        { name: '穿山王', emoji: '🦔', baseHP: 55, attack: 9, type: '地面' },
        { name: '尼多后', emoji: '🦕', baseHP: 70, attack: 10, type: '毒/地面' },
        { name: '尼多王', emoji: '🦕', baseHP: 70, attack: 11, type: '毒/地面' }
    ],
    
    // 冰系宝可梦（科拿）
    ice: [
        { name: '白海狮', emoji: '🦭', baseHP: 65, attack: 10, type: '水/冰' },
        { name: '迷唇姐', emoji: '💃', baseHP: 60, attack: 11, type: '冰/超能力' },
        { name: '铁甲贝', emoji: '🐚', baseHP: 70, attack: 12, type: '水/冰' }
    ],
    
    // 格斗系宝可梦（希巴）
    fighting: [
        { name: '豪力', emoji: '💪', baseHP: 65, attack: 12, type: '格斗' },
        { name: '怪力', emoji: '💪', baseHP: 80, attack: 14, type: '格斗' },
        { name: '沙瓦郎', emoji: '🦵', baseHP: 60, attack: 13, type: '格斗' }
    ],
    
    // 幽灵系宝可梦（菊子）
    ghost: [
        { name: '鬼斯', emoji: '👻', baseHP: 50, attack: 10, type: '幽灵/毒' },
        { name: '鬼斯通', emoji: '👻', baseHP: 60, attack: 12, type: '幽灵/毒' },
        { name: '耿鬼', emoji: '👻', baseHP: 70, attack: 14, type: '幽灵/毒' }
    ],
    
    // 龙系宝可梦（渡）
    dragon: [
        { name: '迷你龙', emoji: '🐲', baseHP: 60, attack: 10, type: '龙' },
        { name: '哈克龙', emoji: '🐲', baseHP: 75, attack: 12, type: '龙' },
        { name: '快龙', emoji: '🐲', baseHP: 90, attack: 15, type: '龙/飞行' }
    ],
    
    // 冠军小智的宝可梦
    champion: [
        { name: '皮卡丘', emoji: '⚡', baseHP: 80, attack: 14, type: '电' },
        { name: '喷火龙', emoji: '🔥', baseHP: 90, attack: 15, type: '火/飞行' },
        { name: '水箭龟', emoji: '🌊', baseHP: 95, attack: 14, type: '水' },
        { name: '妙蛙花', emoji: '🌿', baseHP: 90, attack: 14, type: '草/毒' },
        { name: '卡比兽', emoji: '🐻', baseHP: 110, attack: 13, type: '普通' },
        { name: '快龙', emoji: '🐲', baseHP: 100, attack: 16, type: '龙/飞行' }
    ]
};

// 宠物数据（初代小精灵）
const PetData = {
    fire: {
        name: '小火龙',
        baseHP: 100,
        baseAttack: 12,
        color: '#ff6b6b',
        emoji: '🔥',
        evolvedEmoji: '🌋',
        evolutionName: '喷火龙'
    },
    water: {
        name: '杰尼龟',
        baseHP: 120,
        baseAttack: 10,
        color: '#74b9ff',
        emoji: '💧',
        evolvedEmoji: '🌊',
        evolutionName: '水箭龟'
    },
    grass: {
        name: '妙蛙种子',
        baseHP: 110,
        baseAttack: 11,
        color: '#00b894',
        emoji: '🌱',
        evolvedEmoji: '🌿',
        evolutionName: '妙蛙花'
    }
};

// 道馆数据（初代8个道馆）
const GymData = [
    { 
        id: 1, 
        name: '尼比道馆', 
        leader: '小刚', 
        type: '岩石系', 
        emoji: '🪨',
        signaturePokemon: '大岩蛇',  // 成名宝可梦
        pokemonType: 'rock',
        baseHP: 60, 
        attack: 8 
    },
    { 
        id: 2, 
        name: '华蓝道馆', 
        leader: '小霞', 
        type: '水系', 
        emoji: '💧',
        signaturePokemon: '宝石海星',
        pokemonType: 'water',
        baseHP: 70, 
        attack: 9 
    },
    { 
        id: 3, 
        name: '枯叶道馆', 
        leader: '马志士', 
        type: '电系', 
        emoji: '⚡',
        signaturePokemon: '雷丘',
        pokemonType: 'electric',
        baseHP: 80, 
        attack: 10 
    },
    { 
        id: 4, 
        name: '彩虹道馆', 
        leader: '莉佳', 
        type: '草系', 
        emoji: '🌿',
        signaturePokemon: '霸王花',
        pokemonType: 'grass',
        baseHP: 90, 
        attack: 11 
    },
    { 
        id: 5, 
        name: '浅红道馆', 
        leader: '阿桔', 
        type: '毒系', 
        emoji: '☠️',
        signaturePokemon: '阿柏怪',
        pokemonType: 'poison',
        baseHP: 100, 
        attack: 12 
    },
    { 
        id: 6, 
        name: '金黄道馆', 
        leader: '娜姿', 
        type: '超能力系', 
        emoji: '🔮',
        signaturePokemon: '胡地',
        pokemonType: 'psychic',
        baseHP: 110, 
        attack: 13 
    },
    { 
        id: 7, 
        name: '红莲道馆', 
        leader: '夏伯', 
        type: '火系', 
        emoji: '🔥',
        signaturePokemon: '风速狗',
        pokemonType: 'fire',
        baseHP: 120, 
        attack: 14 
    },
    { 
        id: 8, 
        name: '常青道馆', 
        leader: '菊子', 
        type: '地面系', 
        emoji: '🏜️',
        signaturePokemon: '尼多王',
        pokemonType: 'ground',
        baseHP: 130, 
        attack: 15 
    }
];

// 四大天王数据
const EliteFourData = [
    { 
        id: 1, 
        name: '科拿', 
        type: '冰系', 
        emoji: '❄️',
        title: '冰之天王',
        signaturePokemon: '铁甲贝',
        pokemonType: 'ice',
        baseHP: 150, 
        attack: 16 
    },
    { 
        id: 2, 
        name: '希巴', 
        type: '格斗系', 
        emoji: '👊',
        title: '格斗天王',
        signaturePokemon: '怪力',
        pokemonType: 'fighting',
        baseHP: 160, 
        attack: 17 
    },
    { 
        id: 3, 
        name: '菊子', 
        type: '幽灵系', 
        emoji: '👻',
        title: '幽灵天王',
        signaturePokemon: '耿鬼',
        pokemonType: 'ghost',
        baseHP: 170, 
        attack: 18 
    },
    { 
        id: 4, 
        name: '渡', 
        type: '龙系', 
        emoji: '🐲',
        title: '龙之天王',
        signaturePokemon: '快龙',
        pokemonType: 'dragon',
        baseHP: 180, 
        attack: 19 
    }
];

// 冠军小智数据
const ChampionData = {
    name: '小智',
    title: '联盟冠军',
    emoji: '👑',
    signaturePokemon: '皮卡丘',
    pokemonType: 'champion',
    baseHP: 200,
    attack: 20
};

class Game {
    constructor() {
        this.state = GameState.START;
        this.battleState = null;
        this.mathGenerator = new MathQuestionGenerator();
        
        // 玩家宠物
        this.playerPet = null;
        this.currentEnemy = null;
        this.currentQuestion = null;
        
        // 关卡系统：9个大关，每个大关5个子关卡
        // 1-8: 道馆关卡，9: 四大天王+冠军
        this.currentLevel = 1;      // 当前大关 (1-9)
        this.currentSubLevel = 1;   // 当前子关卡 (1-5)
        this.isGymLeaderFight = false;
        this.isEliteFourFight = false;
        this.isChampionFight = false;
        
        // 游戏统计
        this.monstersDefeated = 0;
        this.isBossFight = false;
        
        // UI元素
        this.elements = {};
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化游戏
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.showPetSelection();
    }
    
    /**
     * 缓存DOM元素
     */
    cacheElements() {
        this.elements = {
            playerLevel: document.getElementById('player-level'),
            playerHPFill: document.getElementById('player-hp-fill'),
            playerXPFill: document.getElementById('player-xp-fill'),
            playerPetImage: document.getElementById('player-pet-image'),
            playerPetName: document.getElementById('player-pet-name'),
            enemyHPFill: document.getElementById('enemy-hp-fill'),
            enemyMonsterImage: document.getElementById('enemy-monster-image'),
            monsterName: document.getElementById('monster-name'),
            trainerName: document.getElementById('trainer-name'),
            mathBoard: document.getElementById('math-board'),
            exploreHint: document.getElementById('explore-hint'),
            questionText: document.getElementById('question-text'),
            answerButtons: document.querySelectorAll('.answer-btn'),
            exploreBtn: document.getElementById('explore-btn'),
            potionBtn: document.getElementById('potion-btn'),
            statsBtn: document.getElementById('stats-btn'),
            messageOverlay: document.getElementById('message-overlay'),
            messageText: document.getElementById('message-text'),
            messageOkBtn: document.getElementById('message-ok-btn'),
            petSelection: document.getElementById('pet-selection'),
            petOptions: document.querySelectorAll('.pet-option'),
            confirmPetBtn: document.getElementById('confirm-pet-btn'),
            statsPanel: document.getElementById('stats-panel'),
            closeStatsBtn: document.getElementById('close-stats-btn'),
            petName: document.getElementById('pet-name'),
            petLevelDisplay: document.getElementById('pet-level-display'),
            petXP: document.getElementById('pet-xp'),
            xpToNext: document.getElementById('xp-to-next'),
            petHP: document.getElementById('pet-hp'),
            petMaxHP: document.getElementById('pet-max-hp'),
            petAttack: document.getElementById('pet-attack'),
            currentLevel: document.getElementById('current-level'),
            monstersDefeatedDisplay: document.getElementById('monsters-defeated'),
            levelDisplay: document.getElementById('level-display')
        };
    }
    
    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 探索按钮
        this.elements.exploreBtn.addEventListener('click', () => this.explore());
        
        // 药水按钮
        this.elements.potionBtn.addEventListener('click', () => this.usePotion());
        
        // 状态按钮
        this.elements.statsBtn.addEventListener('click', () => this.showStats());
        
        // 消息确认按钮
        this.elements.messageOkBtn.addEventListener('click', () => this.hideMessage());
        
        // 宠物选择
        this.elements.petOptions.forEach(option => {
            option.addEventListener('click', (e) => this.selectPet(e.currentTarget));
        });
        
        // 确认宠物选择
        this.elements.confirmPetBtn.addEventListener('click', () => this.confirmPetSelection());
        
        // 关闭状态面板
        this.elements.closeStatsBtn.addEventListener('click', () => this.hideStats());
        
        // 答案按钮
        this.elements.answerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.submitAnswer(e.currentTarget));
        });
    }
    
    /**
     * 显示宠物选择界面
     */
    showPetSelection() {
        this.state = GameState.PET_SELECTION;
        this.elements.petSelection.classList.remove('hidden');
    }
    
    /**
     * 选择宠物
     * @param {HTMLElement} selectedOption - 选中的宠物选项
     */
    selectPet(selectedOption) {
        // 移除其他选中状态
        this.elements.petOptions.forEach(opt => opt.classList.remove('selected'));
        // 添加选中状态
        selectedOption.classList.add('selected');
    }
    
    /**
     * 确认宠物选择
     */
    confirmPetSelection() {
        const selectedOption = document.querySelector('.pet-option.selected');
        if (!selectedOption) {
            this.showMessage('请先选择一只宠物！');
            return;
        }
        
        const petType = selectedOption.dataset.pet;
        this.createPlayerPet(petType);
        this.elements.petSelection.classList.add('hidden');
        this.state = GameState.EXPLORING;
        this.showMessage(`欢迎来到数理小精灵的世界！你选择了${PetData[petType].name}！`);
    }
    
    /**
     * 创建玩家宠物
     * @param {string} petType - 宠物类型
     */
    createPlayerPet(petType) {
        const petInfo = PetData[petType];
        this.playerPet = {
            type: petType,
            name: petInfo.name,
            level: 1,
            xp: 0,
            xpToNext: 100,
            hp: petInfo.baseHP,
            maxHP: petInfo.baseHP,
            attack: petInfo.baseAttack,
            evolved: false,
            potions: 3 // 初始药水数量
        };
        
        this.updatePetUI();
    }
    
    /**
     * 更新宠物UI
     */
    updatePetUI() {
        if (!this.playerPet) return;
        
        this.elements.playerLevel.textContent = this.playerPet.level;
        this.elements.playerHPFill.style.width = `${(this.playerPet.hp / this.playerPet.maxHP) * 100}%`;
        this.elements.playerXPFill.style.width = `${(this.playerPet.xp / this.playerPet.xpToNext) * 100}%`;
        
        // 更新宠物图片和名称
        const petInfo = PetData[this.playerPet.type];
        if (this.playerPet.evolved) {
            this.elements.playerPetImage.textContent = petInfo.evolvedEmoji;
            this.elements.playerPetName.textContent = petInfo.evolutionName;
        } else {
            this.elements.playerPetImage.textContent = petInfo.emoji;
            this.elements.playerPetName.textContent = petInfo.name;
        }
        
        // 更新关卡显示
        this.updateLevelDisplay();
    }
    
    /**
     * 更新关卡显示
     */
    updateLevelDisplay() {
        const gymNames = [
            '尼比道馆', '华蓝道馆', '枯叶道馆', '彩虹道馆',
            '浅红道馆', '金黄道馆', '红莲道馆', '常青道馆'
        ];
        
        let levelText = '';
        
        if (this.currentLevel === 9) {
            if (this.currentSubLevel === 5) {
                levelText = '第9关 冠军之路 - 小智';
            } else {
                const eliteInfo = EliteFourData[this.currentSubLevel - 1];
                levelText = `第9关 四大天王 - ${eliteInfo.name}`;
            }
        } else {
            const gymName = gymNames[this.currentLevel - 1];
            if (this.currentSubLevel === 5) {
                const gymInfo = GymData[this.currentLevel - 1];
                levelText = `第${this.currentLevel}关 ${gymName} - ${gymInfo.leader}`;
            } else {
                levelText = `第${this.currentLevel}关 ${gymName} (${this.currentSubLevel}/5)`;
            }
        }
        
        this.elements.levelDisplay.textContent = levelText;
        
        // 更新状态面板中的关卡
        if (this.elements.currentLevel) {
            this.elements.currentLevel.textContent = `${this.currentLevel}-${this.currentSubLevel}`;
        }
    }
    
    /**
     * 探索（遭遇训练师或道馆馆主）
     */
    explore() {
        if (this.state !== GameState.EXPLORING) return;
        
        // 第9关：四大天王和冠军
        if (this.currentLevel === 9) {
            if (this.currentSubLevel === 5) {
                // 9-5: 冠军小智
                this.encounterChampion();
            } else {
                // 9-1 到 9-4: 四大天王
                this.encounterEliteFour();
            }
        } 
        // 第1-8关：道馆关卡
        else if (this.currentSubLevel === 5) {
            // 子关卡5是道馆馆主
            this.encounterGymLeader();
        } else {
            // 子关卡1-4是普通训练师
            this.encounterTrainer();
        }
    }
    
    /**
     * 遭遇普通训练师（子关卡1-4）- 战斗对象是宝可梦
     */
    encounterTrainer() {
        // 训练师名字列表
        const trainerNames = ['新人训练师', '短裤小子', '捕虫少年', '迷你裙', '背包客', '登山男', '自行车手', '超能力者'];
        const trainerIndex = Math.floor(Math.random() * trainerNames.length);
        const trainerName = trainerNames[trainerIndex];
        
        // 从当前道馆类型或普通宝可梦中随机选择
        const gymInfo = GymData[this.currentLevel - 1];
        let pokemonPool = PokemonDatabase.common;
        
        // 30%概率从当前道馆类型的宝可梦中选择
        if (Math.random() < 0.3) {
            pokemonPool = PokemonDatabase[gymInfo.pokemonType] || PokemonDatabase.common;
        }
        
        // 随机选择一个宝可梦
        const pokemonIndex = Math.floor(Math.random() * pokemonPool.length);
        const pokemon = pokemonPool[pokemonIndex];
        
        // 根据当前关卡调整属性
        const levelMultiplier = 1 + (this.currentLevel - 1) * 0.15;
        
        this.currentEnemy = {
            name: pokemon.name,
            trainerName: trainerName,  // 训练师名字
            hp: Math.floor(pokemon.baseHP * levelMultiplier),
            maxHP: Math.floor(pokemon.baseHP * levelMultiplier),
            attack: Math.floor(pokemon.attack * levelMultiplier),
            xp: Math.floor(30 * levelMultiplier),
            emoji: pokemon.emoji,
            type: pokemon.type,
            isTrainer: true
        };
        
        this.isGymLeaderFight = false;
        this.isEliteFourFight = false;
        this.isChampionFight = false;
        this.isBossFight = false;
        
        // 设置题目难度
        this.mathGenerator.setDifficultyByLevel(this.currentLevel, this.currentSubLevel);
        
        this.showMessage(`${trainerName} 派出了 ${pokemon.name}（${pokemon.type}）！`, () => this.startBattle());
    }
    
    /**
     * 遭遇道馆馆主（子关卡5）- 派出成名宝可梦
     */
    encounterGymLeader() {
        const gymIndex = this.currentLevel - 1;
        const gymInfo = GymData[gymIndex];
        
        // 获取道馆馆主的成名宝可梦
        const pokemonPool = PokemonDatabase[gymInfo.pokemonType];
        const signaturePokemon = pokemonPool.find(p => p.name === gymInfo.signaturePokemon) || pokemonPool[pokemonPool.length - 1];
        
        // 根据当前关卡调整属性
        const levelMultiplier = 1 + (this.currentLevel - 1) * 0.1;
        
        this.currentEnemy = {
            name: signaturePokemon.name,
            trainerName: `${gymInfo.leader}（${gymInfo.name}）`,
            hp: Math.floor(signaturePokemon.baseHP * levelMultiplier * 1.5),  // 道馆宝可梦更强
            maxHP: Math.floor(signaturePokemon.baseHP * levelMultiplier * 1.5),
            attack: Math.floor(signaturePokemon.attack * levelMultiplier * 1.3),
            xp: Math.floor(100 * levelMultiplier),
            emoji: signaturePokemon.emoji,
            type: signaturePokemon.type,
            isGymLeader: true,
            gymType: gymInfo.type
        };
        
        this.isGymLeaderFight = true;
        this.isEliteFourFight = false;
        this.isChampionFight = false;
        this.isBossFight = true;
        
        // 设置题目难度（道馆战斗难度更高）
        this.mathGenerator.setDifficultyByLevel(this.currentLevel, 5);
        
        this.showMessage(`🏛️ ${gymInfo.leader} 派出了成名宝可梦 ${signaturePokemon.name}（${signaturePokemon.type}）！\n\n这是道馆战斗！`, () => this.startBattle());
    }
    
    /**
     * 遭遇四大天王 - 派出成名宝可梦
     */
    encounterEliteFour() {
        const eliteIndex = this.currentSubLevel - 1;
        const eliteInfo = EliteFourData[eliteIndex];
        
        // 获取四大天王的成名宝可梦
        const pokemonPool = PokemonDatabase[eliteInfo.pokemonType];
        const signaturePokemon = pokemonPool.find(p => p.name === eliteInfo.signaturePokemon) || pokemonPool[pokemonPool.length - 1];
        
        // 四大天王宝可梦属性更强
        const levelMultiplier = 1 + (this.currentLevel - 8) * 0.1;
        
        this.currentEnemy = {
            name: signaturePokemon.name,
            trainerName: `${eliteInfo.name}（${eliteInfo.title}）`,
            hp: Math.floor(signaturePokemon.baseHP * levelMultiplier * 2),  // 四大天王宝可梦更强
            maxHP: Math.floor(signaturePokemon.baseHP * levelMultiplier * 2),
            attack: Math.floor(signaturePokemon.attack * levelMultiplier * 1.5),
            xp: Math.floor(200 * levelMultiplier),
            emoji: signaturePokemon.emoji,
            type: signaturePokemon.type,
            isEliteFour: true,
            eliteType: eliteInfo.type
        };
        
        this.isGymLeaderFight = false;
        this.isEliteFourFight = true;
        this.isChampionFight = false;
        this.isBossFight = true;
        
        // 设置题目难度（四大天王最高难度）
        this.mathGenerator.setDifficultyByLevel(9, this.currentSubLevel);
        
        this.showMessage(`⭐ ${eliteInfo.name}（${eliteInfo.title}）派出了成名宝可梦 ${signaturePokemon.name}（${signaturePokemon.type}）！\n\n准备迎接最艰难的战斗！`, () => this.startBattle());
    }
    
    /**
     * 遭遇冠军小智 - 派出皮卡丘
     */
    encounterChampion() {
        const championInfo = ChampionData;
        
        // 获取冠军的皮卡丘
        const pokemonPool = PokemonDatabase[championInfo.pokemonType];
        const signaturePokemon = pokemonPool.find(p => p.name === championInfo.signaturePokemon) || pokemonPool[0];
        
        this.currentEnemy = {
            name: signaturePokemon.name,
            trainerName: `${championInfo.name}（${championInfo.title}）`,
            hp: signaturePokemon.baseHP,
            maxHP: signaturePokemon.baseHP,
            attack: signaturePokemon.attack,
            xp: 500,
            emoji: signaturePokemon.emoji,
            type: signaturePokemon.type,
            isChampion: true
        };
        
        this.isGymLeaderFight = false;
        this.isEliteFourFight = false;
        this.isChampionFight = true;
        this.isBossFight = true;
        
        // 设置题目难度（冠军最高难度）
        this.mathGenerator.setDifficultyByLevel(9, 5);
        
        this.showMessage(`👑 联盟冠军${championInfo.name}出现了！\n\n这是最终决战！`, () => this.startBattle());
    }
    
    /**
     * 开始战斗
     */
    startBattle() {
        this.state = GameState.BATTLE;
        this.battleState = BattleState.WAITING_QUESTION;
        
        // 显示题目区域，隐藏探索提示
        this.elements.mathBoard.classList.remove('hidden');
        this.elements.exploreHint.classList.add('hidden');
        
        // 设置题目难度
        this.mathGenerator.setDifficulty(this.currentArea);
        
        // 更新敌人血条
        this.updateEnemyUI();
        
        // 生成新题目
        this.generateNewQuestion();
    }
    
    /**
     * 更新敌人UI
     */
    updateEnemyUI() {
        if (!this.currentEnemy) return;
        
        const hpPercent = (this.currentEnemy.hp / this.currentEnemy.maxHP) * 100;
        this.elements.enemyHPFill.style.width = `${hpPercent}%`;
        
        // 更新训练师名字（如果有）
        if (this.currentEnemy.trainerName) {
            this.elements.trainerName.textContent = `👤 ${this.currentEnemy.trainerName}`;
            this.elements.trainerName.style.display = 'block';
        } else {
            this.elements.trainerName.textContent = '';
            this.elements.trainerName.style.display = 'none';
        }
        
        // 更新宝可梦名称
        this.elements.monsterName.textContent = this.currentEnemy.name;
        
        // 更新宝可梦图片
        this.elements.enemyMonsterImage.textContent = this.currentEnemy.emoji || '❓';
    }
    
    /**
     * 生成新题目
     */
    generateNewQuestion() {
        this.currentQuestion = this.mathGenerator.generateQuestion();
        this.elements.questionText.textContent = this.currentQuestion.display;
        
        // 更新答案按钮
        this.elements.answerButtons.forEach((btn, index) => {
            btn.textContent = this.currentQuestion.options[index];
            btn.dataset.answer = this.currentQuestion.options[index];
            btn.classList.remove('correct', 'wrong');
            btn.disabled = false;
        });
        
        this.battleState = BattleState.WAITING_ANSWER;
    }
    
    /**
     * 提交答案
     * @param {HTMLElement} button - 点击的答案按钮
     */
    submitAnswer(button) {
        if (this.battleState !== BattleState.WAITING_ANSWER) return;
        
        this.battleState = BattleState.PLAYING_ANIMATION;
        
        const userAnswer = parseInt(button.dataset.answer);
        const isCorrect = this.mathGenerator.checkAnswer(userAnswer, this.currentQuestion.answer);
        
        // 禁用所有答案按钮
        this.elements.answerButtons.forEach(btn => btn.disabled = true);
        
        if (isCorrect) {
            this.handleCorrectAnswer(button);
        } else {
            this.handleWrongAnswer(button);
        }
    }
    
    /**
     * 处理正确答案
     * @param {HTMLElement} button - 点击的按钮
     */
    handleCorrectAnswer(button) {
        button.classList.add('correct');
        
        // 播放攻击特效
        this.playAttackEffect();
        
        // 造成伤害
        const damage = this.playerPet.attack;
        this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - damage);
        
        // 更新UI
        this.updateEnemyUI();
        
        // 给予经验值
        this.addXP(10);
        
        // 检查敌人是否被击败
        setTimeout(() => {
            if (this.currentEnemy.hp <= 0) {
                this.enemyDefeated();
            } else {
                this.generateNewQuestion();
            }
        }, 1000);
    }
    
    /**
     * 处理错误答案
     * @param {HTMLElement} button - 点击的按钮
     */
    handleWrongAnswer(button) {
        button.classList.add('wrong');
        
        // 高亮显示正确答案
        this.elements.answerButtons.forEach(btn => {
            if (parseInt(btn.dataset.answer) === this.currentQuestion.answer) {
                btn.classList.add('correct');
            }
        });
        
        // 敌人反击
        setTimeout(() => {
            this.enemyAttack();
            
            // 显示正确答案提示
            setTimeout(() => {
                this.generateNewQuestion();
            }, 1500);
        }, 500);
    }
    
    /**
     * 敌人攻击
     */
    enemyAttack() {
        const damage = this.currentEnemy.attack;
        this.playerPet.hp = Math.max(0, this.playerPet.hp - damage);
        
        this.updatePetUI();
        
        // 检查玩家是否死亡
        if (this.playerPet.hp <= 0) {
            this.playerDefeated();
        }
    }
    
    /**
     * 敌人被击败
     */
    enemyDefeated() {
        // 给予额外经验值
        this.addXP(this.currentEnemy.xp);
        
        // 增加击败计数
        this.monstersDefeated++;
        
        // 清空敌人显示
        this.elements.monsterName.textContent = '';
        this.elements.enemyMonsterImage.textContent = '';
        this.elements.trainerName.textContent = '';
        
        // 隐藏题目区域
        this.elements.mathBoard.classList.add('hidden');
        
        // 检查是否是冠军战斗（游戏通关）
        if (this.isChampionFight) {
            this.showMessage(`🎉🎉🎉 恭喜你击败了小智的皮卡丘！\n\n你成为了新的宝可梦联盟冠军！\n\n感谢游玩《数理小精灵：十之秘境》！`, () => {
                this.showGameComplete();
            });
            return;
        }
        
        // 推进关卡
        let message = '';
        
        if (this.isGymLeaderFight) {
            // 击败道馆馆主的宝可梦
            const gymInfo = GymData[this.currentLevel - 1];
            message = `🏆 恭喜你击败了${gymInfo.leader}的${this.currentEnemy.name}！\n获得了${gymInfo.type}徽章！\n\n获得经验值：${this.currentEnemy.xp}`;
            
            // 进入下一个大关
            this.currentLevel++;
            this.currentSubLevel = 1;
            
            if (this.currentLevel > 8) {
                // 进入四大天王
                this.currentLevel = 9;
                message += `\n\n⭐ 你已经获得了所有道馆徽章！\n准备挑战四大天王吧！`;
            }
        } else if (this.isEliteFourFight) {
            // 击败四大天王的宝可梦
            const eliteInfo = EliteFourData[this.currentSubLevel - 1];
            message = `⭐ 恭喜你击败了${eliteInfo.name}的${this.currentEnemy.name}！\n\n获得经验值：${this.currentEnemy.xp}`;
            
            this.currentSubLevel++;
            
            if (this.currentSubLevel > 4) {
                // 挑战冠军
                message += `\n\n👑 准备迎接最终决战！\n联盟冠军小智在等着你！`;
            }
        } else {
            // 普通训练师的宝可梦
            const trainerName = this.currentEnemy.trainerName || '对手';
            message = `成功击败了${trainerName}的${this.currentEnemy.name}！\n\n获得经验值：${this.currentEnemy.xp}`;
            this.currentSubLevel++;
        }
        
        this.showMessage(message, () => {
            this.state = GameState.EXPLORING;
            this.currentEnemy = null;
            this.isGymLeaderFight = false;
            this.isEliteFourFight = false;
            this.isChampionFight = false;
            this.isBossFight = false;
            
            // 显示探索提示
            this.elements.exploreHint.classList.remove('hidden');
            
            // 更新探索提示
            this.updateExploreHint();
        });
    }
    
    /**
     * 更新探索提示信息
     */
    updateExploreHint() {
        const hintText = document.querySelector('.hint-text');
        if (!hintText) return;
        
        if (this.currentLevel === 9) {
            if (this.currentSubLevel === 5) {
                hintText.textContent = '点击"探索"按钮，挑战联盟冠军小智！';
            } else {
                const eliteInfo = EliteFourData[this.currentSubLevel - 1];
                hintText.textContent = `点击"探索"按钮，挑战四大天王${eliteInfo.name}！`;
            }
        } else {
            const gymInfo = GymData[this.currentLevel - 1];
            if (this.currentSubLevel === 5) {
                hintText.textContent = `点击"探索"按钮，挑战${gymInfo.name}道馆馆主！`;
            } else {
                hintText.textContent = `点击"探索"按钮，继续${gymInfo.name}道馆的挑战！`;
            }
        }
    }
    
    /**
     * 显示游戏通关界面
     */
    showGameComplete() {
        this.state = GameState.GAME_OVER;
        
        // 显示通关界面
        this.elements.exploreHint.innerHTML = `
            <div class="hint-content">
                <span class="hint-icon">🏆</span>
                <span class="hint-text">恭喜通关！</span>
                <span class="hint-subtext">你已经成为了宝可梦联盟冠军！</span>
                <button onclick="location.reload()" class="restart-btn">重新开始</button>
            </div>
        `;
        this.elements.exploreHint.classList.remove('hidden');
    }
    
    /**
     * 玩家被击败
     */
    playerDefeated() {
        this.showMessage('你的宠物被击败了！需要休息一下...', () => {
            // 恢复一半血量
            this.playerPet.hp = Math.floor(this.playerPet.maxHP * 0.5);
            this.updatePetUI();
            this.state = GameState.EXPLORING;
            // 隐藏题目区域，显示探索提示
            this.elements.mathBoard.classList.add('hidden');
            this.elements.exploreHint.classList.remove('hidden');
        });
    }
    
    /**
     * 添加经验值
     * @param {number} amount - 经验值数量
     */
    addXP(amount) {
        this.playerPet.xp += amount;
        
        // 检查是否升级
        while (this.playerPet.xp >= this.playerPet.xpToNext) {
            this.levelUp();
        }
        
        this.updatePetUI();
    }
    
    /**
     * 升级
     */
    levelUp() {
        this.playerPet.level++;
        this.playerPet.xp -= this.playerPet.xpToNext;
        
        // 提升属性
        this.playerPet.maxHP += 10;
        this.playerPet.hp = this.playerPet.maxHP; // 升级时完全恢复
        this.playerPet.attack += 2;
        
        // 计算下一级所需经验
        this.playerPet.xpToNext = Math.floor(this.playerPet.xpToNext * 1.5);
        
        // 检查进化
        if (this.playerPet.level >= 5 && !this.playerPet.evolved) {
            this.evolvePet();
        }
        
        this.showMessage(`恭喜！你的宠物升到了${this.playerPet.level}级！`);
    }
    
    /**
     * 宠物进化
     */
    evolvePet() {
        this.playerPet.evolved = true;
        const petInfo = PetData[this.playerPet.type];
        this.playerPet.name = petInfo.evolutionName;
        
        this.showMessage(`你的宠物进化成了${petInfo.evolutionName}！变得更强大了！`);
    }
    
    /**
     * 使用药水
     */
    usePotion() {
        if (this.playerPet.potions <= 0) {
            this.showMessage('没有药水了！');
            return;
        }
        
        if (this.playerPet.hp >= this.playerPet.maxHP) {
            this.showMessage('血量已满，不需要使用药水！');
            return;
        }
        
        this.playerPet.potions--;
        const healAmount = Math.floor(this.playerPet.maxHP * 0.3);
        this.playerPet.hp = Math.min(this.playerPet.maxHP, this.playerPet.hp + healAmount);
        
        this.updatePetUI();
        this.showMessage(`使用了药水，恢复了${healAmount}点生命值！`);
    }
    
    /**
     * 显示状态面板
     */
    showStats() {
        this.state = GameState.STATS;
        
        // 更新状态显示
        const petInfo = PetData[this.playerPet.type];
        this.elements.petName.textContent = this.playerPet.evolved ? petInfo.evolutionName : petInfo.name;
        this.elements.petLevelDisplay.textContent = this.playerPet.level;
        this.elements.petXP.textContent = this.playerPet.xp;
        this.elements.xpToNext.textContent = this.playerPet.xpToNext;
        this.elements.petHP.textContent = this.playerPet.hp;
        this.elements.petMaxHP.textContent = this.playerPet.maxHP;
        this.elements.petAttack.textContent = this.playerPet.attack;
        this.elements.currentLevel.textContent = `${this.currentLevel}-${this.currentSubLevel}`;
        this.elements.monstersDefeatedDisplay.textContent = this.monstersDefeated;
        
        this.elements.statsPanel.classList.remove('hidden');
    }
    
    /**
     * 隐藏状态面板
     */
    hideStats() {
        this.elements.statsPanel.classList.add('hidden');
        this.state = GameState.EXPLORING;
    }
    
    /**
     * 显示消息
     * @param {string} message - 消息内容
     * @param {Function} callback - 回调函数
     */
    showMessage(message, callback) {
        this.elements.messageText.textContent = message;
        this.elements.messageOverlay.classList.remove('hidden');
        
        if (callback) {
            this.messageCallback = callback;
        } else {
            this.messageCallback = null;
        }
    }
    
    /**
     * 隐藏消息
     */
    hideMessage() {
        this.elements.messageOverlay.classList.add('hidden');
        
        if (this.messageCallback) {
            this.messageCallback();
            this.messageCallback = null;
        }
    }
    
    /**
     * 播放攻击特效
     */
    playAttackEffect() {
        const enemySprite = document.querySelector('.monster-sprite');
        const effect = document.createElement('div');
        effect.className = 'attack-effect';
        enemySprite.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 500);
        
        // 添加星星特效
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.playStarEffect();
            }, i * 100);
        }
    }
    
    /**
     * 播放星星特效
     */
    playStarEffect() {
        const battleArea = document.getElementById('battle-area');
        const star = document.createElement('div');
        star.className = 'star-effect';
        star.textContent = '★';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.color = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'][Math.floor(Math.random() * 5)];
        
        battleArea.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 1000);
    }
}

// 游戏初始化
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});