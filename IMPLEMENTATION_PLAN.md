# 多动漫主题改造方案

## 项目目标

将现有的"哆啦A梦+博客"网站改造为"博客+多动漫"主题网站，支持哆啦A梦、声之形、青春猪头少年不会梦见兔女郎学姐三部动漫。

## 核心需求

1. 将博客页面（/blog）作为首页（/）
2. 博客页面的"时光胶囊"区域改造为3部动漫的圆形图片导航
3. 每个动漫有独立的详情页面，包含二级导航：作者介绍、动漫人物、相关网站
4. 现有的 /author 和 /character 内容整合到哆啦A梦详情页面
5. 其他两部动漫也需要完整功能
6. 博客内容保持现有分类，不需要按动漫主题分类

## 实施方案

### 1. 路由改造

**文件**: `/home/sqing/Codes/Doraemon/doraemon-vue/src/router/index.ts`

**改造内容**:
- 将 `/` 重定向到 `/blog`
- 添加新的动漫详情路由 `/anime/:animeId`
- 添加子路由：`/anime/:animeId/author`、`/anime/:animeId/character`、`/anime/:animeId/website`
- 保留 `/author`、`/character`、`/website` 作为向后兼容的重定向

### 2. 博客页面改造

**文件**: `/home/sqing/Codes/Doraemon/doraemon-vue/src/components/blog/index.vue`

**改造内容**:
- 修改头部卡片标题："时光胶囊" → "动漫世界"
- 修改副标题："Doraemon World" → "Anime World"
- 修改描述文字为通用描述
- 在头部卡片右侧添加3个动漫圆形图片导航
- 调整右侧边栏的"站点导航"，添加3部动漫的链接

**圆形图片导航设计**:
- 每个动漫一个圆形图片（100px × 100px）
- 图片下方显示动漫名称
- 点击跳转到对应的动漫详情页面
- 悬停效果：上移、阴影增强

### 3. 创建动漫详情页面

**新文件**: `/home/sqing/Codes/Doraemon/doraemon-vue/src/components/anime/AnimeDetail.vue`

**页面结构**:
- 动漫头部横幅（背景图 + 标题 + 副标题 + 返回按钮）
- 二级导航栏（作者介绍、动漫人物、相关网站）
- 内容区域（router-view）
- 底部版权信息

**功能**:
- 根据路由参数 `animeId` 动态加载动漫配置
- 二级导航栏固定在顶部
- 支持不同动漫的主题色

### 4. 创建子页面组件

#### 4.1 作者介绍子页面

**新文件**: `/home/sqing/Codes/Doraemon/doraemon-vue/src/components/anime/AnimeAuthor.vue`

**内容**:
- 作者头像和基本信息
- 作者生平介绍（HTML格式）
- 外部链接（维基百科、百度百科等）
- 作品展示画廊

#### 4.2 动漫人物子页面

**新文件**: `/home/sqing/Codes/Doraemon/doraemon-vue/src/components/anime/AnimeCharacter.vue`

**内容**:
- 哆啦A梦：复用现有的百度地图展示
- 其他动漫：使用卡片网格布局展示角色信息
- 每个角色卡片包含：图片、姓名、生日、身高、体重、性格、喜好、厌恶

#### 4.3 相关网站子页面

**新文件**: `/home/sqing/Codes/Doraemon/doraemon-vue/src/components/anime/AnimeWebsite.vue`

**内容**:
- 官方网站列表（卡片布局）
- 视频资源列表（网格布局）

### 5. 创建动漫配置文件

**新文件**: `/home/sqing/Codes/Doraemon/doraemon-vue/src/config/animeConfig.ts`

**数据结构**:
```typescript
{
  doraemon: {
    id: 'doraemon',
    name: '哆啦A梦',
    subtitle: '来自未来的蓝色机器人猫',
    color: '#2f76d2',
    banner: 'banner图片URL',
    author: { ... },
    characters: [ ... ],
    websites: { ... }
  },
  koeNoKatachi: { ... },
  bunnyGirl: { ... }
}
```

**包含内容**:
- 动漫基本信息（ID、名称、副标题、主题色、横幅图）
- 作者信息（姓名、头衔、头像、生平、链接、作品画廊）
- 角色信息（姓名、生日、身高、体重、性格、喜好、厌恶、图片）
- 网站信息（官方网站、视频资源）

### 6. 资源文件准备

**需要准备的图片资源**:
```
doraemon-vue/src/assets/anime/
├── doraemon/
│   ├── circle.png          # 圆形导航图
│   ├── banner.jpg          # 横幅图
│   ├── author-avatar.png   # 作者头像
│   ├── author-gallery-*.jpg # 作者作品画廊
│   ├── characters/
│   │   ├── nobita.png
│   │   ├── doraemon.png
│   │   └── ...
│   └── websites/
│       ├── official-*.png
│       └── video-*.png
├── koe-no-katachi/
│   └── (类似结构)
└── bunny-girl/
    └── (类似结构)
```

### 7. 样式调整

**文件**: `/home/sqing/Codes/Doraemon/doraemon-vue/src/App.vue`

**改造内容**:
- 根据路由动态切换背景色/背景图
- 为不同动漫设置不同的主题色
- 确保响应式设计在移动端正常工作

## 实施步骤

### 阶段1：数据结构准备
1. 创建 `animeConfig.ts` 配置文件
2. 准备3部动漫的配置数据
3. 准备所需的图片资源

### 阶段2：路由改造
1. 修改 `router/index.ts`
2. 添加新的动漫详情路由
3. 添加向后兼容的重定向

### 阶段3：博客页面改造
1. 修改博客头部卡片
2. 添加动漫圆形导航
3. 调整右侧边栏导航

### 阶段4：创建动漫详情页面
1. 创建 `AnimeDetail.vue` 主页面
2. 创建 `AnimeAuthor.vue` 子页面
3. 创建 `AnimeCharacter.vue` 子页面
4. 创建 `AnimeWebsite.vue` 子页面

### 阶段5：样式优化
1. 调整全局样式
2. 实现主题色切换
3. 优化响应式布局

### 阶段6：测试验证
1. 测试路由跳转
2. 测试页面渲染
3. 测试响应式布局
4. 测试不同浏览器兼容性

## 关键文件清单

### 需要修改的文件
- `/home/sqing/Codes/Doraemon/doraemon-vue/src/router/index.ts`
- `/home/sqing/Codes/Doraemon/doraemon-vue/src/components/blog/index.vue`
- `/home/sqing/Codes/Doraemon/doraemon-vue/src/App.vue`

### 需要创建的文件
- `/home/sqing/Codes/Doraemon/doraemon-vue/src/config/animeConfig.ts`
- `/home/sqing/Codes/Doraemon/doraemon-vue/src/components/anime/AnimeDetail.vue`
- `/home/sqing/Codes/Doraemon/doraemon-vue/src/components/anime/AnimeAuthor.vue`
- `/home/sqing/Codes/Doraemon/doraemon-vue/src/components/anime/AnimeCharacter.vue`
- `/home/sqing/Codes/Doraemon/doraemon-vue/src/components/anime/AnimeWebsite.vue`

### 需要准备的资源
- 3部动漫的圆形导航图（100px × 100px）
- 3部动漫的横幅图（1920px × 400px）
- 3位作者的头像
- 角色图片
- 网站图标

## 注意事项

1. **向后兼容**: 保留原有的 `/author`、`/character`、`/website` 路由，重定向到新的哆啦A梦页面
2. **百度地图**: 哆啦A梦的人物页面继续使用百度地图，其他动漫使用卡片布局
3. **响应式设计**: 确保所有页面在移动端正常显示
4. **主题色**: 为每个动漫设置独特的主题色，提升视觉识别度
5. **数据迁移**: 将现有的 CharactIntro.ts 中的哆啦A梦数据迁移到新的 animeConfig.ts

## 预期效果

改造完成后：
- 访问首页（/）直接显示博客页面
- 博客页面头部显示3部动漫的圆形导航
- 点击任意动漫圆形图跳转到对应的动漫详情页面
- 每个动漫详情页面有完整的作者介绍、动漫人物、相关网站功能
- 整体布局美观，用户体验流畅
- 支持响应式设计，移动端体验良好
# 轮播图滚动转换效果实现计划

## 项目目标

参考 https://github.com/sqing33/saber.git 项目,实现博客页面轮播图的滚动转换效果:
- 页面滚动时,轮播图从大图区域(380px)平滑过渡到紧凑的导航栏(60px)
- 采用上下叠加的三层结构(轮播图层、白色背景层、内容层)
- 保留 Element Plus 的 el-carousel 组件
- 在轮播图中添加动漫名称和描述

## 核心需求

1. **滚动转换效果**: 页面滚动250px内,头部从380px平滑过渡到60px
2. **三层结构**: 轮播图背景层、白色背景遮罩层、导航内容层
3. **保留 Element Plus**: 继续使用 el-carousel 组件
4. **添加文字内容**: 在轮播图中显示动漫名称和描述
5. **响应式设计**: 支持移动端适配

## 技术方案

### 1. 状态管理

使用 Vue 3 Composition API 实现滚动状态管理:

```typescript
// 滚动进度状态 (0-1)
const scrollProgress = ref(0);

// 当前轮播图索引
const currentSlideIndex = ref(0);

// 线性插值函数
const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

// 滚动事件处理器
const handleScroll = () => {
  const scrollY = window.scrollY;
  const range = 250; // 滚动距离完成转换
  const newProgress = Math.min(Math.max(scrollY / range, 0), 1);
  scrollProgress.value = newProgress;
};

// 组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // 初始化状态
});

// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
```

### 2. 动态计算属性

使用 computed 实时计算动态样式:

```typescript
// 动态尺寸计算
const dynamicHeight = computed(() => lerp(380, 60, scrollProgress.value));
const dynamicMargin = computed(() => lerp(30, 0, scrollProgress.value));
const dynamicRadius = computed(() => lerp(24, 0, scrollProgress.value));
const dynamicPaddingX = computed(() => lerp(48, 24, scrollProgress.value));

// 透明度计算
const carouselOpacity = computed(() => Math.max(0, 1 - scrollProgress.value * 1.5));
const bgOpacity = computed(() => scrollProgress.value);

// 文字颜色判断
const isDarkText = computed(() => scrollProgress.value > 0.6);
const textColorClass = computed(() => isDarkText.value ? 'text-dark' : 'text-light');

// 阴影效果
const dynamicBoxShadow = computed(() => 
  scrollProgress.value > 0.8
    ? '0 1px 2px 0 rgb(0 0 0 / 0.05)'
    : '0 20px 50px -12px rgb(0 0 0 / 0.25)'
);
```

### 3. 三层结构设计

#### Layer 1: 轮播图背景层
- 包含 el-carousel 组件
- 滚动时快速淡出(opacity: 1 - progress * 1.5)
- 显示轮播图图片、动漫名称和描述

#### Layer 2: 白色背景层
- 滚动时淡入(opacity: progress)
- 作为紧凑导航栏的白色背景

#### Layer 3: 导航内容层
- 包含网站标题和副标题
- 文字颜色动态切换(progress > 0.6 时切换到深色)
- 内边距动态调整

### 4. 模板结构

```vue
<section class="blog-header">
  <div 
    class="blog-header__card"
    :style="{
      height: `${dynamicHeight}px`,
      marginTop: `${dynamicMargin}px`,
      borderRadius: `${dynamicRadius}px`,
      boxShadow: dynamicBoxShadow
    }"
  >
    <!-- Layer 1: 轮播图背景层 -->
    <div 
      class="blog-header__carousel-layer"
      :style="{ opacity: carouselOpacity }"
    >
      <el-carousel 
        height="100%" 
        motion-blur 
        indicator-position="outside" 
        :autoplay="true" 
        :interval="5000"
        @change="currentSlideIndex = $event"
      >
        <el-carousel-item v-for="anime in animeList" :key="anime.id">
          <router-link :to="`/anime/${anime.id}`" class="carousel-link">
            <div class="carousel-item">
              <img :src="anime.image" :alt="anime.name" class="carousel-image" />
              <!-- 添加动漫名称和描述 -->
              <div class="carousel-text">
                <h3 class="carousel-title">{{ anime.name }}</h3>
                <p class="carousel-subtitle">{{ anime.subtitle }}</p>
              </div>
            </div>
          </router-link>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- Layer 2: 白色背景层 -->
    <div 
      class="blog-header__bg-layer"
      :style="{ opacity: bgOpacity }"
    ></div>

    <!-- Layer 3: 内容层 -->
    <div 
      class="blog-header__content-layer"
      :style="{ 
        paddingLeft: `${dynamicPaddingX}px`, 
        paddingRight: `${dynamicPaddingX}px`
      }"
    >
      <div class="blog-header__content" :class="textColorClass">
        <p class="blog-header__eyebrow">Anime World</p>
        <h1 class="blog-header__title">动漫世界</h1>
        <p class="blog-header__subtitle">
          探索经典动漫,分享精彩故事
        </p>
      </div>
    </div>
  </div>
</section>
```

### 5. 样式实现

```scss
.blog-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
  display: flex;
  justify-content: center;
}

.blog-header__card {
  pointer-events: auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.6);
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  transition: all 0.1s ease-out;
  will-change: height, margin-top, border-radius, box-shadow;
  position: relative;
}

// Layer 1: 轮播图背景层
.blog-header__carousel-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease;
  pointer-events: none;
}

// Layer 2: 白色背景层
.blog-header__bg-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  transition: opacity 0.3s ease;
  pointer-events: none;
}

// Layer 3: 内容层
.blog-header__content-layer {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  height: 100%;
  transition: padding 0.1s ease-out;
  pointer-events: auto;
}

// 文字颜色类
.text-light {
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.text-dark {
  color: #1b2430;
}

// 轮播图文字内容
.carousel-text {
  position: absolute;
  bottom: 40px;
  left: 40px;
  right: 40px;
  z-index: 5;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.carousel-title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
}

.carousel-subtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

// 调整 blog-shell 的上边距,为固定头部留出空间
.blog-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 400px 0 0; // 初始空间
  width: 100%;
  transition: padding-top 0.1s ease-out;
}
```

## 实施步骤

### 步骤 1: 添加滚动状态管理
- 在 `<script setup>` 中添加 `scrollProgress` 和 `currentSlideIndex` 状态
- 实现 `lerp` 线性插值函数
- 添加 `handleScroll` 滚动事件处理器
- 在 `onMounted` 中添加滚动监听
- 在 `onUnmounted` 中移除监听

### 步骤 2: 添加动态计算属性
- 添加 `dynamicHeight`、`dynamicMargin`、`dynamicRadius`、`dynamicPaddingX`
- 添加 `carouselOpacity`、`bgOpacity`
- 添加 `isDarkText`、`textColorClass`
- 添加 `dynamicBoxShadow`

### 步骤 3: 更新模板结构
- 重构 `blog-header__card` 为三层结构
- 添加动态样式绑定
- 在轮播图中添加动漫名称和描述

### 步骤 4: 更新样式
- 添加 `.blog-header` 的固定定位样式
- 添加三层结构的样式
- 添加文字颜色切换样式
- 添加轮播图文字内容样式
- 调整 `.blog-shell` 的 padding-top

### 步骤 5: 添加响应式适配
- 添加移动端媒体查询
- 调整移动端的样式和布局

### 步骤 6: 更新 animeConfig.ts
- 在 `animeList` 中添加 `subtitle` 字段
- 确保每个动漫都有描述信息

## 关键文件清单

### 需要修改的文件
1. **`/home/sqing/Codes/Doraemon/doraemon-vue/src/components/blog/index.vue`**
   - 添加滚动状态管理和计算属性
   - 重构模板为三层结构
   - 更新样式支持滚动转换效果

2. **`/home/sqing/Codes/Doraemon/doraemon-vue/src/config/animeConfig.ts`**
   - 在 `animeList` 中添加 `subtitle` 字段

## 技术细节

### 性能优化
- 使用 `{ passive: true }` 优化滚动监听
- 添加 `will-change` CSS 属性提示浏览器优化
- 避免在滚动时触发重排(reflow)

### Element Plus 兼容性
- 通过 CSS 的 absolute 定位和 z-index 控制层叠
- 保持 el-carousel 容器高度为 100%
- 使用 `:deep()` 选择器覆盖组件默认样式

### 文字可读性
- 添加文字阴影(text-shadow)
- 在轮播图图片上添加半透明遮罩
- 根据进度动态调整文字颜色

### 布局处理
- 为 `.blog-shell` 添加足够的 `padding-top`
- 动态调整 padding-top 以匹配头部高度
- 使用固定定位确保头部始终可见

## 预期效果

1. **滚动转换效果**: 
   - 页面滚动 250px 内,头部从 380px 平滑过渡到 60px
   - 转换过程流畅,无卡顿现象

2. **视觉一致性**:
   - 轮播图快速淡出(1.5倍进度)
   - 背景从透明平滑过渡到白色
   - 文字颜色在 progress > 0.6 时切换到深色

3. **Element Plus 兼容**:
   - el-carousel 组件正常工作
   - 轮播图自动播放、手动切换功能正常
   - 指示器和箭头样式正确显示

4. **文字内容显示**:
   - 轮播图中显示动漫名称(name)
   - 轮播图中显示动漫描述(subtitle)
   - 文字清晰可读,有适当的阴影效果

5. **响应式适配**:
   - 在桌面端(>768px)正常显示
   - 在移动端(≤768px)布局正确
   - 不同屏幕尺寸下滚动效果一致

## 注意事项

1. **事件监听清理**: 务必在 `onUnmounted` 中移除滚动监听,避免内存泄漏
2. **z-index 管理**: 确保三层结构的 z-index 正确(轮播图 < 背景 < 内容)
3. **TypeScript 类型**: 为计算属性添加正确的类型注解
4. **移动端测试**: 在真实移动设备上测试触摸滚动性能
5. **跨浏览器测试**: 在 Chrome、Firefox、Safari、Edge 上测试效果
