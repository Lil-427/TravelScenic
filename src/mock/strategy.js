import Mock from 'mockjs'

const strategyList = [
  {
    id: 1,
    title: '九寨沟三日深度游攻略',
    description: '详细路线规划、美食与住宿推荐，带你玩遍九寨沟精华景点',
    content: '第一天：抵达九寨沟，入住酒店，适应高原环境。第二天：全天游览九寨沟景区，包括诺日朗瀑布、五花海、长海等核心景点。建议早上7点入园避开人流高峰。第三天：游览黄龙景区，下午返程。住宿推荐：九寨沟口附近酒店，价格200-500元/晚。美食推荐：藏式火锅、牦牛肉、青稞酒。',
    cover_image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
    category: '自由行',
    status: 1,
    views: 12500,
    likes: 2300,
    create_time: '2026-06-01 10:00:00'
  },
  {
    id: 2,
    title: '故宫深度文化之旅',
    description: '探索紫禁城六百年的历史沉淀与文化魅力',
    content: '故宫游览路线推荐：午门进→太和殿→中和殿→保和殿→乾清宫→交泰殿→坤宁宫→御花园→神武门出。建议预留4-6小时游览时间。提前在官网预约门票（60元）。最佳游览季节：春季（4-5月）和秋季（9-10月）。',
    cover_image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400',
    category: '热门推荐',
    status: 1,
    views: 18900,
    likes: 3600,
    create_time: '2026-06-01 14:30:00'
  },
  {
    id: 3,
    title: '成都美食探店全攻略',
    description: '本地人推荐的50家必吃美食，从街头小吃到米其林餐厅',
    content: '成都美食地图：春熙路商圈（龙抄手、钟水饺、赖汤圆）、宽窄巷子（三大炮、糖油果子）、锦里（钵钵鸡、三大炮）、玉林路（串串香、火锅）。推荐店铺：小龙坎火锅、蜀大侠火锅、陈麻婆豆腐、廖老妈蹄花。人均消费50-200元。',
    cover_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    category: '美食攻略',
    status: 1,
    views: 25300,
    likes: 5100,
    create_time: '2026-05-30 09:15:00'
  },
  {
    id: 4,
    title: '杭州西湖周末休闲游',
    description: '两天一夜玩转西湖，赏美景品茶香',
    content: '周六：断桥残雪→白堤→孤山→岳王庙→苏堤春晓→花港观鱼→雷峰塔。周日：灵隐寺→龙井村品茶→九溪烟树→钱塘江大桥。住宿推荐西湖周边民宿，价格300-800元。必吃美食：西湖醋鱼、龙井虾仁、东坡肉、叫花鸡。',
    cover_image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400',
    category: '周边游',
    status: 0,
    views: 8200,
    likes: 1200,
    create_time: '2026-06-02 08:00:00'
  },
  {
    id: 5,
    title: '三亚亲子度假攻略',
    description: '带娃畅游三亚，玩水玩沙不踩雷',
    content: '推荐亲子酒店：亚特兰蒂斯（有水世界和水族馆）、海棠湾红树林、亚龙湾万豪。行程安排：Day1 抵达+沙滩玩沙，Day2 亚特兰蒂斯水世界，Day3 蜈支洲岛浮潜，Day4 热带天堂森林公园，Day5 返程。注意事项：做好防晒、带好驱蚊液、准备儿童常用药。',
    cover_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    category: '亲子游',
    status: 0,
    views: 6800,
    likes: 890,
    create_time: '2026-06-02 11:20:00'
  },
  {
    id: 6,
    title: '丽江古城五日漫游攻略',
    description: '慢节奏感受纳西文化，古城与雪山一个不落',
    content: '行程规划：Day1 抵达丽江古城，逛四方街、大水车。Day2 玉龙雪山一日游（冰川公园+蓝月谷+印象丽江演出）。Day3 拉市海骑马+束河古镇。Day4 泸沽湖二日游出发。Day5 泸沽湖返回。住宿推荐古城内民宿，淡季150-300元/晚。',
    cover_image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
    category: '自由行',
    status: 1,
    views: 15200,
    likes: 2800,
    create_time: '2026-05-28 16:45:00'
  },
  {
    id: 7,
    title: '西安三日历史文化之旅',
    description: '十三朝古都，兵马俑到回民街的穿越之旅',
    content: 'Day1：兵马俑（建议早8点出发避开人流）→华清池→长恨歌演出（需提前订票）。Day2：陕西历史博物馆→大雁塔→大唐不夜城。Day3：古城墙骑行→钟楼鼓楼→回民街美食。必吃：肉夹馍、羊肉泡馍、凉皮、Biangbiang面。',
    cover_image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
    category: '热门推荐',
    status: 1,
    views: 21000,
    likes: 4200,
    create_time: '2026-05-25 13:00:00'
  },
  {
    id: 8,
    title: '重庆魔幻3D城市探险',
    description: '轻轨穿楼、洪崖洞夜景，体验山城独特魅力',
    content: '打卡路线：解放碑→洪崖洞（建议晚上去拍夜景）→长江索道→李子坝轻轨站→鹅岭二厂。火锅推荐：洞子老火锅、佩姐老火锅、大虎火锅。小面推荐：花市豌杂面、板凳面。游玩3-4天为宜。',
    cover_image: 'https://images.unsplash.com/photo-1559827291-f1ee87f2da69?w=400',
    category: '自由行',
    status: 2,
    views: 9800,
    likes: 1500,
    create_time: '2026-05-20 10:30:00'
  },
  {
    id: 9,
    title: '广州长隆欢乐世界亲子游',
    description: '长隆野生动物世界+欢乐世界+水上乐园一网打尽',
    content: '三天两晚长隆之旅：Day1 长隆野生动物世界（建议南门进，坐小火车看动物）→晚上看大马戏。Day2 长隆欢乐世界（垂直过山车必玩）→水上乐园。Day3 飞鸟乐园→返程。住宿：长隆酒店或周边公寓。门票建议买套票更划算。',
    cover_image: 'https://images.unsplash.com/photo-1569781212403-904fcfd09f1a?w=400',
    category: '亲子游',
    status: 1,
    views: 18500,
    likes: 3400,
    create_time: '2026-05-18 09:00:00'
  },
  {
    id: 10,
    title: '鼓浪屿文艺一日游',
    description: '钢琴之岛的慢时光，打卡最美转角与老别墅',
    content: '厦门轮渡码头乘船（往返35元，需提前购票）→三丘田码头上岛。路线：最美转角→风琴博物馆→皓月园→菽庄花园→日光岩→龙头路美食街。美食：叶氏麻糍、林记鱼丸、赵小姐的店、张三疯奶茶。建议避开节假日前往。',
    cover_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400',
    category: '周边游',
    status: 0,
    views: 5600,
    likes: 780,
    create_time: '2026-06-02 07:30:00'
  },
  {
    id: 11,
    title: '桂林阳朔山水甲天下',
    description: '漓江竹筏漂流，遇龙河骑行，十里画廊美如画',
    content: '行程推荐：Day1 桂林市区（象鼻山、两江四湖）。Day2 漓江竹筏（杨堤→兴坪，含20元人民币背景）→兴坪古镇。Day3 阳朔遇龙河漂流→十里画廊骑行→西街夜市。Day4 龙脊梯田一日游→返程。必吃：桂林米粉、啤酒鱼、田螺酿。',
    cover_image: 'https://images.unsplash.com/photo-1537531383496-f4749b88b95a?w=400',
    category: '自由行',
    status: 1,
    views: 14200,
    likes: 2600,
    create_time: '2026-05-22 14:00:00'
  },
  {
    id: 12,
    title: '上海迪士尼超详细攻略',
    description: '从早享卡到烟花秀，教你一天刷完热门项目',
    content: '准备工作：下载迪士尼APP、买早享卡（提前1小时入园）、带好身份证。必玩项目：飞越地平线→创极速光轮→七个小矮人矿山车→加勒比海盗→雷鸣山漂流。花车巡游12:15和15:45各一场。烟花秀20:30开始，建议提前1小时占位。',
    cover_image: 'https://images.unsplash.com/photo-1545583726-4d128e24cf94?w=400',
    category: '热门推荐',
    status: 1,
    views: 32000,
    likes: 6800,
    create_time: '2026-05-15 10:00:00'
  },
  {
    id: 13,
    title: '稻城亚丁徒步攻略',
    description: '蓝色星球上最后一片净土，高海拔徒步指南',
    content: '最佳季节：9-10月秋季色彩最美。行程：Day1 成都飞稻城→香格里拉镇适应高原。Day2 亚丁景区短线（冲古寺→珍珠海）。Day3 长线（洛绒牛场→牛奶海→五色海）需徒步6-8小时。注意事项：提前服用红景天、备好氧气瓶、穿防滑登山鞋。',
    cover_image: 'https://images.unsplash.com/photo-1504197880965-b743c0f06a15?w=400',
    category: '自由行',
    status: 1,
    views: 11000,
    likes: 1900,
    create_time: '2026-05-10 08:00:00'
  },
  {
    id: 14,
    title: '北京胡同美食探秘',
    description: '南锣鼓巷到簋街，吃遍老北京地道风味',
    content: '路线：南锣鼓巷（文宇奶酪、鬼味烤翅）→烟袋斜街→什刹海→鸦儿胡同（李记烧饼）→簋街（胡大麻小）。必吃清单：北京烤鸭（四季民福）、炸酱面（海碗居）、豆汁焦圈、卤煮火烧、炒肝。人均预算100-300元。',
    cover_image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400',
    category: '美食攻略',
    status: 0,
    views: 7500,
    likes: 1100,
    create_time: '2026-06-01 15:00:00'
  },
  {
    id: 15,
    title: '黄山两日登山攻略',
    description: '五岳归来不看山，黄山归来不看岳',
    content: 'Day1：云谷索道上山→始信峰→北海景区→光明顶→入住山顶酒店。Day2：光明顶看日出→飞来石→排云亭→西海大峡谷→玉屏楼看迎客松→玉屏索道下山。山顶住宿需提前1-2周预订（800-1500元/晚）。装备：登山杖、冲锋衣、手电筒。',
    cover_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    category: '周边游',
    status: 1,
    views: 13500,
    likes: 2400,
    create_time: '2026-05-20 06:30:00'
  },
  {
    id: 16,
    title: '大理洱海环湖自驾攻略',
    description: '租一辆车，环洱海一周，邂逅风花雪月',
    content: '环湖路线（全程约120km）：大理古城→喜洲古镇（网红稻田+转角楼）→双廊古镇（杨丽萍太阳宫）→挖色码头→小普陀→海东公路→大理古城。建议分两天完成，中途在双廊住一晚。租车费用200-500元/天。拍照点：磻溪村S弯、鹿卧山、理想邦。',
    cover_image: 'https://images.unsplash.com/photo-1559827291-f1ee87f2da69?w=400',
    category: '自由行',
    status: 1,
    views: 16800,
    likes: 3100,
    create_time: '2026-05-18 11:00:00'
  },
  {
    id: 17,
    title: '哈尔滨冰雪大世界全攻略',
    description: '冬季限定冰雪盛宴，南方人必看的北国风光',
    content: '最佳时间：12月底至次年2月。Day1：冰雪大世界（建议下午3点入园，白天看冰雕晚上看冰灯）→中央大街。Day2：太阳岛雪博会→松花江冰上娱乐→圣索菲亚教堂→老道外中华巴洛克。保暖装备：羽绒服+保暖内衣+雪地靴+暖宝宝。必吃：马迭尔冰棍、锅包肉、杀猪菜。',
    cover_image: 'https://images.unsplash.com/photo-1548503070-f8e3d7a4c237?w=400',
    category: '热门推荐',
    status: 2,
    views: 8900,
    likes: 1300,
    create_time: '2026-01-15 09:00:00'
  },
  {
    id: 18,
    title: '乌镇西塘江南水乡二日游',
    description: '小桥流水人家，体验江南水乡的温柔时光',
    content: 'Day1：乌镇西栅（推荐住景区内民宿，晚上人少景美）→草木本色染坊→乌镇邮局→酒吧一条街。Day2：上午逛东栅→下午前往西塘（车程30分钟）→烟雨长廊→送子来凤桥→西塘夜景。门票：乌镇西栅150元，东栅110元，西塘95元。',
    cover_image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
    category: '周边游',
    status: 0,
    views: 6200,
    likes: 950,
    create_time: '2026-06-01 12:00:00'
  },
  {
    id: 19,
    title: '张家界国家森林公园探险',
    description: '阿凡达取景地，站在玻璃栈道上俯瞰三千奇峰',
    content: '行程：Day1 张家界国家森林公园（袁家界+杨家界+天子山）。Day2 天门山（玻璃栈道+天门洞+99道弯盘山公路）。Day3 张家界大峡谷玻璃桥→黄龙洞。住宿：武陵源区酒店（200-600元）。注意事项：山上温差大带外套、穿舒适运动鞋、提前预订门票。',
    cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    category: '自由行',
    status: 1,
    views: 19500,
    likes: 3700,
    create_time: '2026-05-20 08:00:00'
  },
  {
    id: 20,
    title: '苏州园林一日游',
    description: '拙政园到平江路，一日看尽江南园林之精华',
    content: '路线：拙政园（建议早8点开门就进，避开人流）→苏州博物馆（紧邻拙政园，免费需预约）→狮子林→平江路（午餐+逛小店）→观前街（晚餐）。门票：拙政园80元，狮子林40元。美食：松鼠桂鱼、糖粥、生煎馒头、蟹壳黄。',
    cover_image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
    category: '周边游',
    status: 1,
    views: 10200,
    likes: 1800,
    create_time: '2026-05-25 10:00:00'
  },
  {
    id: 21,
    title: '青岛啤酒节狂欢攻略',
    description: '夏天就要去青岛，啤酒海鲜和沙滩',
    content: '啤酒节一般在7月底至8月中旬举办（崂山区会场）。Day1：栈桥→天主教堂→大学路网红墙→八大关→第二海水浴场。Day2：崂山一日游→啤酒博物馆→台东夜市。Day3：金沙滩→啤酒节会场。必吃：辣炒蛤蜊、鲅鱼水饺、海鲜大咖、烤海肠。',
    cover_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    category: '美食攻略',
    status: 0,
    views: 4700,
    likes: 680,
    create_time: '2026-06-02 09:00:00'
  },
  {
    id: 22,
    title: '西藏布达拉宫朝圣之旅',
    description: '雪域高原的心灵洗礼，从拉萨到纳木错',
    content: '行程：Day1-2 抵达拉萨适应高原（不要洗澡、不要剧烈运动）。Day3 布达拉宫（需提前预约）→大昭寺→八廓街。Day4 纳木错一日游（世界最高咸水湖）。Day5 色拉寺看辩经→罗布林卡。注意事项：提前10天吃红景天、办理边防证、注意防晒。',
    cover_image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400',
    category: '热门推荐',
    status: 1,
    views: 22000,
    likes: 4800,
    create_time: '2026-05-12 07:00:00'
  },
  {
    id: 23,
    title: '武汉樱花季三日游',
    description: '三月武汉，樱花与热干面的浪漫邂逅',
    content: '最佳时间：3月中下旬。Day1：武汉大学樱花大道（需提前预约）→东湖樱花园→楚河汉街。Day2：黄鹤楼→户部巷→长江大桥→江汉路步行街。Day3：湖北省博物馆（看越王勾践剑）→昙华林文艺街区。必吃：热干面、豆皮、鸭脖、武昌鱼。',
    cover_image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400',
    category: '周边游',
    status: 2,
    views: 7800,
    likes: 1200,
    create_time: '2026-03-20 10:00:00'
  },
  {
    id: 24,
    title: '长白山天池全攻略',
    description: '北坡西坡南坡怎么选？天池最佳观赏季节指南',
    content: '最佳季节：7-8月（天池解冻期，看到概率最大）。北坡（景点多，有地下森林）vs 西坡（需爬1442级台阶看全景）vs 南坡（人最少最原始）。推荐北坡+西坡各一天。住宿：二道白河镇。注意事项：山顶风大温度低带冲锋衣、提前看天气、备好晕车药（山路72道弯）。',
    cover_image: 'https://images.unsplash.com/photo-1591130998335-6c28bc9a2aa3?w=400',
    category: '自由行',
    status: 0,
    views: 5300,
    likes: 820,
    create_time: '2026-06-02 06:00:00'
  },
  {
    id: 25,
    title: '敦煌莫高窟丝路之旅',
    description: '大漠孤烟直，长河落日圆，感受千年壁画之美',
    content: '行程：Day1 抵达敦煌→鸣沙山月牙泉（骑骆驼+滑沙+看日落）。Day2 莫高窟（A类票需提前1个月预订，看8个窟+数字电影）→敦煌博物馆。Day3 玉门关→雅丹魔鬼城→敦煌夜市。美食：驴肉黄面、杏皮水、羊肉粉汤、胡羊焖饼。',
    cover_image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400',
    category: '热门推荐',
    status: 1,
    views: 11500,
    likes: 2100,
    create_time: '2026-05-08 14:00:00'
  },
  {
    id: 26,
    title: '厦门文艺清新三日游',
    description: '鼓浪屿+环岛路+曾厝垵，拍照打卡美食全搞定',
    content: 'Day1：鼓浪屿一日游（详见攻略#10）。Day2：南普陀寺→厦门大学（需预约）→猫街→沙坡尾→环岛路骑行。Day3：万石植物园（多肉区和雨林区最出片）→钟鼓索道→曾厝垵→中山路步行街。美食：沙茶面、海蛎煎、姜母鸭、花生汤。',
    cover_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400',
    category: '自由行',
    status: 0,
    views: 4100,
    likes: 620,
    create_time: '2026-06-01 16:00:00'
  },
  {
    id: 27,
    title: '广州早茶文化体验指南',
    description: '虾饺烧卖凤爪叉烧包，一盅两件的仪式感',
    content: '推荐茶楼：陶陶居（百年老字号，人均80-120）、点都德（连锁品质稳定，人均60-100）、广州酒家（老牌名店，人均100-150）。必点清单：虾饺、干蒸烧卖、豉汁凤爪、叉烧包、肠粉、榴莲酥、流沙包。茶楼一般7:00-14:00供应早茶。',
    cover_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    category: '美食攻略',
    status: 1,
    views: 9500,
    likes: 1600,
    create_time: '2026-05-28 08:30:00'
  },
  {
    id: 28,
    title: '呼和浩特草原骑马攻略',
    description: '策马奔腾在希拉穆仁草原，住蒙古包看星空',
    content: '最佳季节：7-8月草原最绿。行程：Day1 呼和浩特→希拉穆仁草原（骑马+射箭+草原越野车）→晚上住蒙古包参加篝火晚会。Day2 草原日出→返回市区参观大召寺→塞上老街。Day3 响沙湾沙漠一日游（骑骆驼+滑沙+沙漠冲浪）。美食：手把肉、烤羊腿、奶茶、奶豆腐。',
    cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    category: '亲子游',
    status: 0,
    views: 3800,
    likes: 560,
    create_time: '2026-06-02 10:00:00'
  },
  {
    id: 29,
    title: '重庆火锅地图',
    description: '从微辣到特辣，50家重庆火锅实地测评',
    content: '必吃榜单：洞亭火锅（防空洞里吃火锅，人均80）、佩姐老火锅（排队王，人均100）、黄姐火锅（本地人最爱，人均60）、大虎火锅（牛油味最重，人均90）、珮姐老火锅（解放碑店，人均120）。点菜攻略：毛肚七上八下、鸭肠十秒、老肉片、耗儿鱼、贡菜是灵魂搭配。',
    cover_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    category: '美食攻略',
    status: 1,
    views: 28000,
    likes: 6200,
    create_time: '2026-05-15 11:00:00'
  },
  {
    id: 30,
    title: '凤凰古城周末休闲游',
    description: '沈从文笔下的边城，沱江边的慢生活',
    content: '行程：Day1 抵达凤凰古城→沱江泛舟→虹桥风雨楼→古城漫步→晚上看《边城》实景演出→酒吧一条街。Day2 沈从文故居→熊希龄故居→东门城楼→跳岩→南华山。住宿推荐沱江边临江客栈（200-500元）。美食：血粑鸭、酸汤鱼、姜糖、社饭。',
    cover_image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
    category: '周边游',
    status: 1,
    views: 11800,
    likes: 2000,
    create_time: '2026-05-22 09:00:00'
  }
]

// 获取攻略列表
Mock.mock(/\/admin\/strategy\/list(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const status = url.searchParams.get('status')
  const category = url.searchParams.get('category')
  const keyword = url.searchParams.get('keyword')
  const page = Number(url.searchParams.get('page')) || 1
  const size = Number(url.searchParams.get('size')) || 10

  let list = [...strategyList]

  if (status !== null && status !== '') {
    list = list.filter((item) => item.status === Number(status))
  }

  if (category) {
    list = list.filter((item) => item.category === category)
  }

  if (keyword) {
    list = list.filter(
      (item) => item.title.includes(keyword) || item.description.includes(keyword)
    )
  }

  const total = list.length
  const start = (page - 1) * size
  const end = start + size
  const pageList = list.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list: pageList,
      total,
      page,
      size
    }
  }
})

// 获取攻略详情
Mock.mock(/\/admin\/strategy\/detail\/\d+$/, 'get', (options) => {
  const id = Number(options.url.match(/\/detail\/(\d+)/)[1])
  const item = strategyList.find((s) => s.id === id)
  return {
    code: item ? 200 : 404,
    message: item ? 'success' : '攻略不存在',
    data: item || null
  }
})

// 添加攻略
Mock.mock(/\/admin\/strategy\/add$/, 'post', (options) => {
  const body = JSON.parse(options.body)
  const newId = strategyList.length > 0 ? Math.max(...strategyList.map((s) => s.id)) + 1 : 1
  const newItem = {
    id: newId,
    title: body.title,
    description: body.description || '',
    content: body.content || '',
    cover_image: body.cover_image || '',
    category: body.category || '',
    status: 0,
    views: 0,
    likes: 0,
    create_time: new Date().toISOString().replace('T', ' ').slice(0, 19)
  }
  strategyList.unshift(newItem)
  return {
    code: 200,
    message: '添加成功',
    data: { id: newId }
  }
})

// 更新攻略
Mock.mock(/\/admin\/strategy\/update\/\d+$/, 'put', (options) => {
  const id = Number(options.url.match(/\/update\/(\d+)/)[1])
  const body = JSON.parse(options.body)
  const index = strategyList.findIndex((s) => s.id === id)
  if (index !== -1) {
    strategyList[index] = {
      ...strategyList[index],
      title: body.title ?? strategyList[index].title,
      description: body.description ?? strategyList[index].description,
      content: body.content ?? strategyList[index].content,
      cover_image: body.cover_image ?? strategyList[index].cover_image,
      category: body.category ?? strategyList[index].category
    }
    return { code: 200, message: '更新成功', data: null }
  }
  return { code: 404, message: '攻略不存在' }
})

// 发布/下架攻略
Mock.mock(/\/admin\/strategy\/publish\/\d+$/, 'put', (options) => {
  const id = Number(options.url.match(/\/publish\/(\d+)/)[1])
  const body = JSON.parse(options.body)
  const index = strategyList.findIndex((s) => s.id === id)
  if (index !== -1) {
    strategyList[index].status = body.status
    const label = body.status === 1 ? '发布' : '下架'
    return { code: 200, message: `${label}成功`, data: null }
  }
  return { code: 404, message: '攻略不存在' }
})

// 删除攻略
Mock.mock(/\/admin\/strategy\/delete\/\d+$/, 'delete', (options) => {
  const id = Number(options.url.match(/\/delete\/(\d+)/)[1])
  const index = strategyList.findIndex((s) => s.id === id)
  if (index !== -1) {
    strategyList.splice(index, 1)
    return { code: 200, message: '删除成功' }
  }
  return { code: 404, message: '攻略不存在' }
})
