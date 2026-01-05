/*
 Navicat Premium Data Transfer

 Source Server         : doraemon
 Source Server Type    : MySQL
 Source Server Version : 50740
 Source Host           : localhost:3306
 Source Schema         : doraemon

 Target Server Type    : MySQL
 Target Server Version : 50740
 File Encoding         : 65001

 Date: 08/06/2024 00:32:09
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for blog
-- ----------------------------
DROP TABLE IF EXISTS `blog`;
CREATE TABLE `blog`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '帖子ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '内容',
  `create_time` datetime NOT NULL COMMENT '发表时间',
  `coverUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '封面链接',
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 570034183352390 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of blog
-- ----------------------------
INSERT INTO `blog` VALUES (566210548510789, '分享2张哆啦A梦的电脑壁纸', '<p><img src=\"http://localhost:3000/uploads/images/news/news_2024-05-19_06-35-35_292dc22566643f8c_wp12091166-doraemon-anime-wallpapers.jpg\" alt=\"\" data-href=\"news_2024-05-19_06-35-35_292dc22566643f8c_wp12091166-doraemon-anime-wallpapers.jpg\" style=\"\"/><img src=\"http://localhost:3000/uploads/images/news/news_2024-05-19_06-35-36_47324d82978f9c44_wp12683555-doraemon-all-movie-wallpapers.jpg\" alt=\"\" data-href=\"news_2024-05-19_06-35-36_47324d82978f9c44_wp12683555-doraemon-all-movie-wallpapers.jpg\" style=\"\"/></p>', '2024-05-19 06:36:37', 'http://localhost:3000/uploads/images/news/news_2024-05-19_06-36-21_064b52aa5a51d75b_20240519063608.png', '分享');
INSERT INTO `blog` VALUES (566215274528837, '朋友画了一幅哆啦A梦！', '<p><img src=\"http://localhost:3000/uploads/images/news/news_2024-05-19_06-55-45_fe166e5ad6c6b372_src=http___ci.xiaohongshu.com_3e906ae2-1f7b-105f-1441-47bd6a9fc432_imageView2_2_w_1080_format_jpg&refer=http___ci.xiaohongshu.webp\" alt=\"\" data-href=\"news_2024-05-19_06-55-45_fe166e5ad6c6b372_src=http___ci.xiaohongshu.com_3e906ae2-1f7b-105f-1441-47bd6a9fc432_imageView2_2_w_1080_format_jpg&refer=http___ci.xiaohongshu.webp\" style=\"\"/></p>', '2024-05-19 06:55:51', 'http://localhost:3000/uploads/images/news/news_2024-05-19_06-55-48_a65e9f2e5bca18fd_src=http___ci.xiaohongshu.com_3e906ae2-1f7b-105f-1441-47bd6a9fc432_imageView2_2_w_1080_format_jpg&refer=http___ci.xiaohongshu.webp', '娱乐');
INSERT INTO `blog` VALUES (566215756517445, '聊天过程中发现的一些有趣的表情包', '<p><img src=\"http://localhost:3000/uploads/images/news/news_2024-05-19_06-57-14_a3b9262158f1917f_u=794653339,786645029&fm=253&fmt=auto&app=120&f=JPEG.webp\" alt=\"\" data-href=\"news_2024-05-19_06-57-14_a3b9262158f1917f_u=794653339,786645029&fm=253&fmt=auto&app=120&f=JPEG.webp\" style=\"\"/><img src=\"http://localhost:3000/uploads/images/news/news_2024-05-19_06-57-14_8eee10b3d7186799_u=1572344362,1258478094&fm=253&fmt=auto&app=120&f=JPEG.webp\" alt=\"\" data-href=\"news_2024-05-19_06-57-14_8eee10b3d7186799_u=1572344362,1258478094&fm=253&fmt=auto&app=120&f=JPEG.webp\" style=\"\"/><img src=\"http://localhost:3000/uploads/images/news/news_2024-05-19_06-57-14_9b40932add188c52_u=2517922915,1385521455&fm=253&fmt=auto&app=138&f=JPEG.webp\" alt=\"\" data-href=\"news_2024-05-19_06-57-14_9b40932add188c52_u=2517922915,1385521455&fm=253&fmt=auto&app=138&f=JPEG.webp\" style=\"\"/><img src=\"http://localhost:3000/uploads/images/news/news_2024-05-19_06-57-14_422a13b4e51215da_u=3701611652,2632473257&fm=253&fmt=auto&app=120&f=JPEG.webp\" alt=\"\" data-href=\"news_2024-05-19_06-57-14_422a13b4e51215da_u=3701611652,2632473257&fm=253&fmt=auto&app=120&f=JPEG.webp\" style=\"\"/></p><p><br></p><h1><span style=\"color: rgb(225, 60, 57);\"><strong>喜欢的自取喔！！</strong></span></h1>', '2024-05-19 06:57:48', 'http://localhost:3000/uploads/images/news/news_2024-05-19_06-57-46_24bbd7244d2be82b_u=1572344362,1258478094&fm=253&fmt=auto&app=120&f=JPEG.webp', '分享');
INSERT INTO `blog` VALUES (566222054367301, '当哆啦A梦的道具照进了现实', '<h3></h3><h3>说起《哆啦A梦》，相信各位小伙伴们都不陌生。《哆啦A梦》发行于1970年，漫画连载长达26年。剧情里，哆啦A梦从口袋中掏出过超过1300件神秘道具。时空机、竹蜻蜓、任意门……更是无数孩子的童年梦想。</h3><p>半个世纪前，作者如此丰富的想象让哆啦A梦成为了科幻喜剧漫画的鼻祖，但也正因为半个世纪过去，不知不觉间，这1300多个道具，有些真的实现了。</p><p> 时光机</p><p>在哆啦A梦的道具中，时光机无疑是最具科幻色彩的一个。这台神奇的机器能够带领我们穿越时空，回到过去或未来。通过时光机，大雄和哆啦A梦不仅见到了逝去的亲人，见证了历史的变迁，更对未来充满了期待和想象。</p><p><img src=\"https://pics4.baidu.com/feed/023b5bb5c9ea15ce34dd1648036ee4fe3a87b238.png@f_auto?token=407955ba26232dfe89904b9382242f9e\" alt=\"\" data-href=\"\" style=\"\"/><img src=\"http://localhost:3000/uploads/images/news/news_2024-05-19_07-21-50_edbc8c236a2b2c04_image.png\" alt=\"\" data-href=\"news_2024-05-19_07-21-50_edbc8c236a2b2c04_image.png\" style=\"\"/></p><p>时光机 来源：网易</p><p>现在的AI技术日益发达，用AI“复活”逝去的人，再见(现)他们的音容笑貌也不是难事。</p><p>此前，人民日报发布了建党百年版《错位时空》短视频，在短视频中，出现了10位烈士的复原版图像，最令人激动的还不仅仅图像复原，更重要的是，他们的容貌动了起来。</p><p><img src=\"https://pics3.baidu.com/feed/6f061d950a7b0208edcef220d4b72cde562cc86d.jpeg@f_auto?token=a17dd7c08734280228baeae095b6360c\" alt=\"\" data-href=\"\" style=\"width: 699.812px;\"/><img src=\"http://localhost:3000/uploads/images/news/news_2024-05-19_07-22-03_7f0bdd6260fae426_image.png\" alt=\"\" data-href=\"news_2024-05-19_07-22-03_7f0bdd6260fae426_image.png\" style=\"\"/></p><p>烈士李大钊 来源：人民日报客户端</p><p><img src=\"https://pics3.baidu.com/feed/f7246b600c338744b63d4c0ae86107f4d62aa04c.jpeg@f_auto?token=87dc700ae9e5aea2cf84dd80d1dea70c\" alt=\"\" data-href=\"\" style=\"width: 699.812px;\"/></p><p>烈士董存瑞 来源：人民日报客户端</p><p>在制作过程中，技术人员通过一系列人工智能技术结合手绘，将老照片里模糊的人脸修复清晰，还为烈士的老照片进行上色。但是，由于老照片都比较模糊，在修复时会采取很多工序。首先，使用开源（AI）项目“GPEN”，将模糊的面部变为高清并转成彩色，再根据史料做些手绘精修，最后用AI做出还原皮肤质感的效果。</p><p>平时看到烈士的黑白老照片，很多人也许会觉得他们是离自己很遥远的历史人物。而这次经AI修复后面带微笑的他们，让我们感受到，这些革命先烈是鲜活的，不再是课本上冷冰冰的人名。这何尝不是一种别样的时光穿梭呢？</p><p>竹蜻蜓</p><p>竹蜻蜓是哆啦A梦中的经典道具之一，每当大雄和他的朋友们戴上竹蜻蜓，他们便能飞上天空，翱翔天际。</p><p><img src=\"https://pics5.baidu.com/feed/b03533fa828ba61e86460d70f45a4907314e5945.jpeg@f_auto?token=d5dbee775bfb2fbc8de36ddcbca90bcb\" alt=\"\" data-href=\"\" style=\"width: 699.812px;\"/></p><p>竹蜻蜓 来源：百度</p><p>如今，作为发展新质生产力的热点之一，低空经济与商业航天、生物制造、生命科学一起，首次被列入政府工作报告，备受瞩目。而当下占据低空经济C位的，是一种名叫eVTOL（electric Vertical Take-off and Landing，即电动垂直起降飞行器）的全新概念的交通工具，它有个不算太准确但更好理解的名字——飞行汽车。虽然名字是“飞行汽车”，但eVTOL绝大多数长得不像汽车，改叫“电动直升机”或许更准确。</p><p><img src=\"https://pics2.baidu.com/feed/c2fdfc039245d68849c2186d10aca313d01b24b7.jpeg@f_auto?token=04dadfbd8826c089d60c2a3c43e79f1e\" alt=\"\" data-href=\"\" style=\"width: 699.812px;\"/></p><p>“飞行汽车”来源：潮新闻</p><p>步入21世纪，随着电池及电动分布式推进领域的技术进步，使得和直升机同样可以悬停、可以垂直起降、不需要机场的全新事物eVTOL闪亮登场。由于电动机远比内燃机更为小巧、便宜、响应快捷，所以可以在一架航空器上安装多个发动机以及螺旋桨，实现分布式动力。</p><p>或许，在不久的将来，在手机上点几下就能“打飞的”的科幻愿景，将照进我们的现实生活。</p><p>任意门</p><p>一扇粉色的门，每打开一次，便可以瞬间抵达任何一个想去的地方，开启一段新的旅程。</p><p><img src=\"https://pics5.baidu.com/feed/a2cc7cd98d1001e907a08ad50c60a5e156e797cc.jpeg@f_auto?token=7eaab38c3991aaa114caee8fbf517eb8\" alt=\"\" data-href=\"\" style=\"width: 699.812px;\"/></p><p>任意门 来源：百度</p><p>那么，在现实中，有这样的门吗？</p><p>相信大部分人对高铁都有了解吧，伴随着高铁技术的日益进步，旅途所需的时间越来越短，可到达的站点越来越多，每当高铁进站，高铁车门开启的时候，我们就到了想去的地方，便可以开启一段新的旅行。</p><p><img src=\"https://pics3.baidu.com/feed/b999a9014c086e06f3a69632b566a5f90ad1cb3e.jpeg@f_auto?token=ea18a01718064708447251ce31c46a69\" alt=\"\" data-href=\"\" style=\"width: 699.812px;\"/></p><p>复兴号列车 来源：中国铁路</p><p>此前，“上海到北京仅需2.5小时”话题冲上微博热搜榜首，京沪高速铁路由北京南站至上海虹桥站，全长1318公里，目前运行的复兴号列车，最高时速为350公里，若实现时速400公里商业运营，两地间运行时间有望缩至4小时以内，不过以目前在研高铁技术，京沪之间尚不能实现高铁2.5小时到达。</p><p><img src=\"https://pics2.baidu.com/feed/79f0f736afc379310416e5c25caa694842a9115e.png@f_auto?token=183eb26928377c86ec9480f3856a84e5\" alt=\"\" data-href=\"\" style=\"width: 699.812px;\"/></p><p>复兴号智能动车组 来源：中国铁路</p><p>今年年初，（由武汉站出发的）复兴号智能动车组G853（12306App查询到的是G852，上面图片中也显示是G852，请确认一下车次）次列车历时9小时5分钟，驶进终点站西宁站，这是由华中地区开往青藏高原的首趟直达复兴号智能动车组列车，也是复兴号智能动车组，（建议去掉逗号）首次驶上青藏高原。当车门开启的那一刻，便可以尽情感受青藏高原的无限风光。</p><p>高铁车门的每一次开启和关闭，都将带领我们踏上去往目的地的征途，高铁创造了中国速度，带来了中国的“任意门”。</p><p>除此之外，哆啦A梦中的其他道具也得以实现，比如，送货电话不就是现在的网购＋快递？室内旅行机没准就是全息摄影技术，AR和VR也可以实现同样的效果；显示行踪徽章更是早已融入我们的生活，那就是北斗卫星导航系统，这是中国自主建设、独立运行的工程技术项目的一面旗帜！</p><p>（显示行踪的徽章就像手机一样，更是早已融入我们的生活，通过北斗卫星导航系统定位我们随身携带的手机，就可以知道我们所处的位置。这是中国自主建设、独立运行的工程技术项目的一面旗帜！）</p><p>科学技术日新月异，许多只存在于漫画、动漫中的高科技道具已经在逐步实现并融入我们的生活，作者根据单一场景做出的快乐纯粹的幻想，在现实世界中的科技发明更多是解决多个场景下的问题，随着新质生产力的不断发展，相信会有越来越（多）的高科技道具得以实现，与童年来一次浪漫重逢。</p>', '2024-05-19 07:23:26', 'http://localhost:3000/uploads/images/news/news_2024-05-19_07-19-04_542af6634e55c1d1_023b5bb5c9ea15ce34dd1648036ee4fe3a87b238.webp', '杂谈');
INSERT INTO `blog` VALUES (570017781743685, '123', '<p>123</p>', '2024-05-30 00:48:17', NULL, '娱乐');
INSERT INTO `blog` VALUES (570034183352389, '111', '<p>222</p>', '2024-05-30 01:55:01', 'http://localhost:3000/uploads/images/news/news_2024-05-30_01-55-00_35060871344fa35b_QQæªå¾20240515144050.png', '娱乐');

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '内容',
  `create_time` datetime NOT NULL COMMENT '时间',
  `publisher_id` bigint(20) NOT NULL COMMENT '评论人ID',
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评论人昵称',
  `pid` bigint(20) NULL DEFAULT NULL COMMENT '父级评论人ID',
  `pname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '父级评论人昵称',
  `like` int(11) NULL DEFAULT 0 COMMENT '点赞数量',
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章分类',
  `bn_id` bigint(20) NOT NULL COMMENT '评论的文章ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 570232285663302 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES (566223679897669, '<p>真想不到啊</p>', '2024-05-19 07:30:03', 552292927467589, '三青33', NULL, NULL, 4, 'blog', 566222054367301);
INSERT INTO `comment` VALUES (566224515563589, '<h3>是啊！</h3>', '2024-05-19 07:33:27', 552292927467589, '三青33', 566223679897669, '三青33', 0, 'blog', 566222054367301);
INSERT INTO `comment` VALUES (566476002549829, '<p>好期待！</p>', '2024-05-20 00:36:45', 566421340708933, '上官婉儿', NULL, NULL, 0, 'news', 566416230133829);
INSERT INTO `comment` VALUES (567554474512453, '<p>123</p>', '2024-05-23 01:45:04', 552292927467589, '三青33', NULL, NULL, 0, 'news', 566415676969029);
INSERT INTO `comment` VALUES (567795109441605, '<p>222</p>', '2024-05-23 18:04:12', 552292927467589, '三青33', NULL, NULL, 0, 'blog', 566215756517445);
INSERT INTO `comment` VALUES (570017852129349, '<p>期待！</p>', '2024-05-30 00:48:34', 570003461570629, '三青', 566476002549829, '上官婉儿', 0, 'news', 566416230133829);
INSERT INTO `comment` VALUES (570232285663301, '<p>123</p>', '2024-05-30 15:21:06', 570003461570629, '三青', NULL, NULL, 0, 'blog', 566222054367301);

-- ----------------------------
-- Table structure for feedback
-- ----------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback`  (
  `id` bigint(20) NOT NULL COMMENT '反馈ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '内容',
  `create_time` datetime NOT NULL COMMENT '反馈时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of feedback
-- ----------------------------
INSERT INTO `feedback` VALUES (566226738360389, 552292927467589, '<p>改善环境</p>', '2024-05-19 07:42:29');
INSERT INTO `feedback` VALUES (570018308952133, 570003461570629, '<p>加油</p>', '2024-05-30 00:50:26');
INSERT INTO `feedback` VALUES (570233364099141, 570232957128773, '<p>123</p>', '2024-05-30 15:25:29');

-- ----------------------------
-- Table structure for history
-- ----------------------------
DROP TABLE IF EXISTS `history`;
CREATE TABLE `history`  (
  `id` bigint(20) NOT NULL COMMENT '历史记录ID',
  `uid` bigint(20) NOT NULL COMMENT '用户ID',
  `bn_id` bigint(20) NOT NULL COMMENT '文章ID',
  `bn_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章分类',
  `create_time` datetime NOT NULL COMMENT '浏览时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of history
-- ----------------------------

-- ----------------------------
-- Table structure for movie
-- ----------------------------
DROP TABLE IF EXISTS `movie`;
CREATE TABLE `movie`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `coverUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `imageUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 44 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of movie
-- ----------------------------
INSERT INTO `movie` VALUES (1, '哆啦A梦：大雄的恐龙', 'https://i0.hdslb.com/bfs/article/7b9fae92e1f69f228569f31adfc039f38ec911ab.png@1256w_1890h_!web-article-pic.avif', NULL);
INSERT INTO `movie` VALUES (2, '哆啦A梦：大雄的宇宙开拓史', NULL, NULL);
INSERT INTO `movie` VALUES (3, '哆啦A梦：大雄的大魔境', NULL, NULL);
INSERT INTO `movie` VALUES (4, '哆啦A梦：大雄的海底鬼岩城', NULL, NULL);
INSERT INTO `movie` VALUES (5, '哆啦A梦：大雄的魔界大冒险', NULL, NULL);
INSERT INTO `movie` VALUES (6, '哆啦A梦：大雄的宇宙小战争', NULL, NULL);
INSERT INTO `movie` VALUES (7, '哆啦A梦：大雄与铁人兵团', NULL, NULL);
INSERT INTO `movie` VALUES (8, '哆啦A梦：大雄与龙骑士', NULL, NULL);
INSERT INTO `movie` VALUES (9, '哆啦A梦：大雄的平行西游记', NULL, NULL);
INSERT INTO `movie` VALUES (10, '哆啦A梦：大雄的日本诞生', NULL, NULL);
INSERT INTO `movie` VALUES (11, '哆啦A梦：大雄与动物行星', NULL, NULL);
INSERT INTO `movie` VALUES (12, '哆啦A梦：大雄的天方夜谭', NULL, NULL);
INSERT INTO `movie` VALUES (13, '哆啦A梦：大雄与云之王国', NULL, NULL);
INSERT INTO `movie` VALUES (14, '哆啦A梦：大雄与白金迷宫', NULL, NULL);
INSERT INTO `movie` VALUES (15, '哆啦A梦：大雄与梦幻三剑士', NULL, NULL);
INSERT INTO `movie` VALUES (16, '哆啦A梦：大雄的创世日记', NULL, NULL);
INSERT INTO `movie` VALUES (17, '哆啦A梦：大雄与银河超特急', NULL, NULL);
INSERT INTO `movie` VALUES (18, '哆啦A梦：大雄的发条都市冒险记', NULL, NULL);
INSERT INTO `movie` VALUES (19, '哆啦A梦：大雄的南海大冒险', NULL, NULL);
INSERT INTO `movie` VALUES (20, '哆啦A梦：大雄的宇宙漂流记', NULL, NULL);
INSERT INTO `movie` VALUES (21, '哆啦A梦：大雄的太阳王传说', NULL, NULL);
INSERT INTO `movie` VALUES (22, '哆啦A梦：大雄与翼之勇者', NULL, NULL);
INSERT INTO `movie` VALUES (23, '哆啦A梦：大雄与机器人王国', NULL, NULL);
INSERT INTO `movie` VALUES (24, '哆啦A梦：大雄与风之使者', NULL, NULL);
INSERT INTO `movie` VALUES (25, '哆啦A梦：大雄的猫狗时空传', NULL, NULL);
INSERT INTO `movie` VALUES (26, '哆啦A梦：大雄的恐龙2006', NULL, NULL);
INSERT INTO `movie` VALUES (27, '哆啦A梦：大雄的奇幻大冒险', NULL, NULL);
INSERT INTO `movie` VALUES (28, '哆啦A梦：大雄与绿巨人传', NULL, NULL);
INSERT INTO `movie` VALUES (29, '哆啦A梦：新·大雄的宇宙开拓史', NULL, NULL);
INSERT INTO `movie` VALUES (30, '哆啦A梦：大雄的人鱼大海战', NULL, NULL);
INSERT INTO `movie` VALUES (31, '哆啦A梦：新·大雄与铁人兵团～振翅吧天使们～', NULL, NULL);
INSERT INTO `movie` VALUES (32, '哆啦A梦：大雄与奇迹之岛～动物历险记～', NULL, NULL);
INSERT INTO `movie` VALUES (33, '哆啦A梦：大雄的秘密道具博物馆', NULL, NULL);
INSERT INTO `movie` VALUES (34, '哆啦A梦：新·大雄的大魔境～扁扁与5人之探险队～', NULL, NULL);
INSERT INTO `movie` VALUES (35, '哆啦A梦：大雄的宇宙英雄记', NULL, NULL);
INSERT INTO `movie` VALUES (36, '哆啦A梦：新·大雄的日本诞生', NULL, NULL);
INSERT INTO `movie` VALUES (37, '哆啦A梦：大雄的南极冰冰凉大冒险', NULL, NULL);
INSERT INTO `movie` VALUES (38, '哆啦A梦：大雄的金银岛', NULL, NULL);
INSERT INTO `movie` VALUES (39, '哆啦A梦：大雄的月球探险记', NULL, NULL);
INSERT INTO `movie` VALUES (40, '哆啦A梦：大雄的新恐龙', NULL, NULL);
INSERT INTO `movie` VALUES (41, '哆啦A梦：大雄的宇宙小战争 2021', NULL, NULL);
INSERT INTO `movie` VALUES (42, '哆啦A梦：大雄与天空的理想乡', NULL, NULL);
INSERT INTO `movie` VALUES (43, '哆啦A梦：大雄的地球交响乐', NULL, NULL);

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '新闻ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '内容',
  `coverUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '封面链接',
  `create_time` datetime NOT NULL COMMENT '发布时间',
  `state` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '发布状态',
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 570033562538054 CHARACTER SET = utf8mb4 COLLATE utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES (566416230133829, '哆啦A梦2024剧场版发布最新预告 儿童节欢乐不停', '<p><img src=\"http://localhost:3000/uploads/images/news/news_2024-05-19_20-31-47_d36be2ec5126c8fb_image.png\" alt=\"\" data-href=\"news_2024-05-19_20-31-47_d36be2ec5126c8fb_image.png\" style=\"\"/></p><p>《哆啦A梦》系列2024最新剧场版《哆啦A梦：大雄的地球交响乐》发布“乐团亮相”版预告，在胖虎激情澎湃的介绍中，“五人组”乐团成员一一登场，大家各自演奏的乐器也随之揭晓，在哆啦A梦的指挥下，一片欢腾的演奏中出现一声特别的“雄音”，这个声音是否有特殊的用意，也引发观众好奇。电影同时发布了CINITY定制专属海报，精彩纷呈的视听盛宴，将在细腻画质、沉浸式音效的呈现下带来更极致的享受。影片由今井一晓执导，内海照子编剧，在漫画原作作者藤子·F·不二雄诞辰90周年纪念之际，首次采用“音乐”主题，为大小朋友们带来双倍欢乐。电影5月31日全国上映，儿童节走进影院，一起乐响“乐”快乐！</p><p>电影讲述了哆啦A梦和朋友们来到漂浮在宇宙中的音乐殿堂，为抵抗想要将音乐从这个世界上消除的神秘生物，变身音乐家，共同守护地球和音乐的未来的故事。最新发布的预告当中，五人组携各自的乐器惊喜亮相——哆啦A梦担任指挥家，静香负责木琴等打击乐器，小夫演奏小提琴，胖虎吹奏小号，大雄演奏竖笛，每个人沉浸演奏，快乐音符与欢乐情绪齐飞。而在预告结尾，一片和谐的演奏中出现一声特别的“雄音”，这是大雄练习的最终成果，还是别有玄机？也等待观众走进影院，自行揭晓。</p><p>从预告中就可看出，今年最新剧场版在“音乐”元素的加持下，欢乐氛围也得到了升级，音乐殿堂不仅聚集着大家的快乐，也表现出了作者关于音乐和宇宙的浪漫想象，这场“地球交响乐”最终将以怎样的方式呈现，值得期待。</p><p>今日发布的CINITY海报也突出了影片五彩缤纷的视觉体验和伙伴合奏的欢乐氛围。海报以幽蓝宇宙为背景，以地球为舞台，哆啦A梦稳居“C位”指挥大家的演奏，每个人周围漂浮着快乐音符，也吸引了来自神秘星球的新朋友米佳和恰佩克，两人从宇宙赶来参加这场“音乐庆典”。海报定格了大家一起享受音乐的快乐时刻，大家脸上洋溢的灿烂笑容传递的欢乐能量，让人仿佛能听到他们的轻快乐曲，想要迫不及待参与其中。</p><p>《哆啦A梦：大雄的地球交响乐》已是该系列连续第十年引进国内，不仅俘获了众多亲子家庭的心，也赢得了从小看着哆啦A梦长大的青年观众的青睐，六一期间在电影院和哆啦A梦见面，已然成为大小朋友们欢度儿童节的专属仪式感。</p><p>此次剧场版由今井一晓，内海照子编剧，沿用 葵、 原惠美、嘉数由美、木村昴、关智 经典五人组配音，更邀请演员芳根京子、歌手演员吉川晃司、石丸干二等多名人气嘉宾，以及日本知名小提琴家叶加濑太郎、当红创作歌手Vaundy等重磅音乐人参与制作，必将为观众带来多重的视听享受，让我们一同在5月31日六一儿童节期间走进影院，守护童心和音乐的快乐吧！</p><p>动画电影《哆啦A梦：大雄的地球交响乐》由日本SHIN-EI动画株式会社出品，中国电影集团公司进口，中国电影股份有限公司发行、译制，将于5月31日全国上映，敬请期待。</p><p>《哆啦A梦》系列2024最新剧场版《哆啦A梦：大雄的地球交响乐》发布“乐团亮相”版预告，在胖虎激情澎湃的介绍中，“五人组”乐团成员一一登场，大家各自演奏的乐器也随之揭晓，在哆啦A梦的指挥下，一片欢腾的演奏中出现一声特别的“雄音”，这个声音是否有特殊的用意，也引发观众好奇。电影同时发布了CINITY定制专属海报，精彩纷呈的视听盛宴，将在细腻画质、沉浸式音效的呈现下带来更极致的享受。影片由今井一晓执导，内海照子编剧，在漫画原作作者藤子·F·不二雄诞辰90周年纪念之际，首次采用“音乐”主题，为大小朋友们带来双倍欢乐。电影5月31日全国上映，儿童节走进影院，一起乐响“乐”快乐！</p><p>电影讲述了哆啦A梦和朋友们来到漂浮在宇宙中的音乐殿堂，为抵抗想要将音乐从这个世界上消除的神秘生物，变身音乐家，共同守护地球和音乐的未来的故事。最新发布的预告当中，五人组携各自的乐器惊喜亮相——哆啦A梦担任指挥家，静香负责木琴等打击乐器，小夫演奏小提琴，胖虎吹奏小号，大雄演奏竖笛，每个人沉浸演奏，快乐音符与欢乐情绪齐飞。而在预告结尾，一片和谐的演奏中出现一声特别的“雄音”，这是大雄练习的最终成果，还是别有玄机？也等待观众走进影院，自行揭晓。</p><p>从预告中就可看出，今年最新剧场版在“音乐”元素的加持下，欢乐氛围也得到了升级，音乐殿堂不仅聚集着大家的快乐，也表现出了作者关于音乐和宇宙的浪漫想象，这场“地球交响乐”最终将以怎样的方式呈现，值得期待。</p><p>今日发布的CINITY海报也突出了影片五彩缤纷的视觉体验和伙伴合奏的欢乐氛围。海报以幽蓝宇宙为背景，以地球为舞台，哆啦A梦稳居“C位”指挥大家的演奏，每个人周围漂浮着快乐音符，也吸引了来自神秘星球的新朋友米佳和恰佩克，两人从宇宙赶来参加这场“音乐庆典”。海报定格了大家一起享受音乐的快乐时刻，大家脸上洋溢的灿烂笑容传递的欢乐能量，让人仿佛能听到他们的轻快乐曲，想要迫不及待参与其中。</p><p>《哆啦A梦：大雄的地球交响乐》已是该系列连续第十年引进国内，不仅俘获了众多亲子家庭的心，也赢得了从小看着哆啦A梦长大的青年观众的青睐，六一期间在电影院和哆啦A梦见面，已然成为大小朋友们欢度儿童节的专属仪式感。</p><p>此次剧场版由今井一晓，内海照子编剧，沿用 葵、 原惠美、嘉数由美、木村昴、关智 经典五人组配音，更邀请演员芳根京子、歌手演员吉川晃司、石丸干二等多名人气嘉宾，以及日本知名小提琴家叶加濑太郎、当红创作歌手Vaundy等重磅音乐人参与制作，必将为观众带来多重的视听享受，让我们一同在5月31日六一儿童节期间走进影院，守护童心和音乐的快乐吧！</p><p>动画电影《哆啦A梦：大雄的地球交响乐》由日本SHIN-EI动画株式会社出品，中国电影集团公司进口，中国电影股份有限公司发行、译制，将于5月31日全国上映，敬请期待。</p>', 'http://localhost:3000/uploads/images/news/news_2024-05-27_23-41-31_5dc96bc905d51a4a_20240525195618.png', '2024-05-19 20:33:32', 'true', '新闻');
INSERT INTO `news` VALUES (570033562538053, '33', '<p>11</p>', 'http://localhost:3000/uploads/images/news/news_2024-05-30_01-52-28_9da27eba23a31076_00.jpg', '2024-05-30 01:52:30', 'true', '公告');

-- ----------------------------
-- Table structure for user_blog
-- ----------------------------
DROP TABLE IF EXISTS `user_blog`;
CREATE TABLE `user_blog`  (
  `blog_id` bigint(20) NOT NULL COMMENT '帖子ID',
  `user_id` bigint(11) NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`blog_id`, `user_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `user_blog_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blog` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_blog_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_blog
-- ----------------------------
INSERT INTO `user_blog` VALUES (566222054367301, 552292927467589);
INSERT INTO `user_blog` VALUES (566210548510789, 552325032190021);
INSERT INTO `user_blog` VALUES (566215756517445, 566421340708933);
INSERT INTO `user_blog` VALUES (570034183352389, 570003461570629);

-- ----------------------------
-- Table structure for user_blog_collection
-- ----------------------------
DROP TABLE IF EXISTS `user_blog_collection`;
CREATE TABLE `user_blog_collection`  (
  `user_id` bigint(11) NOT NULL COMMENT '用户ID',
  `blog_id` bigint(20) NOT NULL COMMENT '帖子ID',
  `collection_time` datetime NOT NULL COMMENT '收藏时间',
  PRIMARY KEY (`user_id`, `blog_id`) USING BTREE,
  INDEX `blog_id`(`blog_id`) USING BTREE,
  CONSTRAINT `user_blog_collection_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_blog_collection_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blog` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_blog_collection
-- ----------------------------
INSERT INTO `user_blog_collection` VALUES (552292927467589, 566215756517445, '2024-05-19 07:44:09');
INSERT INTO `user_blog_collection` VALUES (570003461570629, 566210548510789, '2024-05-30 01:55:18');
INSERT INTO `user_blog_collection` VALUES (570003461570629, 566222054367301, '2024-05-30 15:21:10');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `nickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户昵称',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(999) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `avatarUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像链接',
  `create_time` datetime NOT NULL COMMENT '注册时间',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '邮箱',
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '性别',
  `birthday` date NULL DEFAULT NULL COMMENT '生日',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 570003461570630 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (552292927467589, '三青33', 'sqing', 'b3cb0a1492c16c86339516ebc1d58503b28e3345dea89672a091713ce00af4c3', 'http://localhost:3000/uploads/images/news/news_2024-05-19_07-17-20_4a1bf2086ea95c33_u=2608148525,3322066176&fm=253&fmt=auto&app=120&f=JPEG.webp', '2024-04-09 22:45:40', '1395251710@qq.com', '男', '1999-05-20', '12345678910');
INSERT INTO `users` VALUES (552325032190021, '超级无敌暴龙王', 'a186', 'bcb15f821479b4d5772bd0ca866c00ad5f926e3580720659cc80d39c9d09802a', 'http://localhost:3000/uploads/images/news/news_2024-05-19_15-41-44_3451318331ddf8e9_u=2517922915,1385521455&fm=253&fmt=auto&app=138&f=JPEG.webp', '2024-05-15 00:56:18', '1395251710@qq.com', '女', '1954-07-29', '1111111');
INSERT INTO `users` VALUES (566421340708933, '上官婉儿', '233233', 'e185d59f014d24e18bc5ebdbf039c9eb949e17ae52d96afdd7b96dc299c28706', 'http://localhost:3000/uploads/images/news/news_2024-05-19_21-02-35_6b24f7322fd117e8_a5e4fe275b19e70d42adaa40bd2fede4.jpg', '2024-05-19 20:54:20', '1395251710@qq.com', '女', '2013-01-01', '13912345678');
INSERT INTO `users` VALUES (570003461570629, '三青', 'sanqing', '96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e', 'http://localhost:3000/uploads/images/news/news_2024-05-29_23-52-37_377e4a05dccb1bf9_00.jpg', '2024-05-29 23:50:01', '1395251710@qq.com', NULL, NULL, '18978872289');

-- ----------------------------
-- Table structure for website
-- ----------------------------
DROP TABLE IF EXISTS `website`;
CREATE TABLE `website`  (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of website
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
