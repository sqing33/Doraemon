import { nextTick } from 'vue';

export function useCodeCollapse(containerClassName: string) {
  const initCodeCollapse = async (retryCount = 0) => {
    // 等待 DOM 更新
    await nextTick();

    // 1. 找到容器
    const container = document.querySelector(containerClassName);
    if (!container) {
      // 如果找不到容器，延迟重试
      if (retryCount < 5) {
        setTimeout(() => initCodeCollapse(retryCount + 1), 100);
      }
      return;
    }

    // 2. 找到所有代码块 (Vditor 生成的是 pre > code)
    const codeBlocks = container.querySelectorAll('pre');

    // 如果没有找到代码块，可能是 Vditor 还没渲染完成，延迟重试
    if (codeBlocks.length === 0 && retryCount < 5) {
      setTimeout(() => initCodeCollapse(retryCount + 1), 100);
      return;
    }

    codeBlocks.forEach((pre) => {
      // 防止重复添加
      if (pre.parentElement?.classList.contains('code-wrapper')) return;

      // 3. 获取代码块高度
      const height = pre.offsetHeight;
      const MAX_HEIGHT = 300; // 超过 300px 就折叠

      // 如果高度不超过限制，就不处理
      if (height <= MAX_HEIGHT) return;

      // 4. 包裹一层 wrapper 用于控制高度
      const wrapper = document.createElement('div');
      wrapper.className = 'code-wrapper collapsed'; // 默认折叠

      // 插入 wrapper
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // 5. 添加"展开/收起"遮罩按钮
      const mask = document.createElement('div');
      mask.className = 'code-mask';
      mask.innerHTML = `
        <div class="mask-content">
          <span>⬇️ 代码太长，点击展开</span>
        </div>
      `;

      // 6. 绑定点击事件
      mask.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isCollapsed = wrapper.classList.contains('collapsed');
        if (isCollapsed) {
          // 展开时，获取实际高度
          const actualHeight = pre.offsetHeight;
          wrapper.style.maxHeight = actualHeight + 'px';
          wrapper.classList.remove('collapsed');
          wrapper.classList.add('expanded');
          mask.innerHTML = '<div class="mask-content">⬆️ 收起代码</div>';
          mask.classList.add('is-expanded-mask');

          // 强制浏览器渲染一帧，确保动画能触发
          wrapper.offsetHeight;

          // 动画完成后，移除 max-height 限制
          setTimeout(() => {
            if (wrapper.classList.contains('expanded')) {
              wrapper.style.maxHeight = 'none';
            }
          }, 400);
        } else {
          // 收起时
          // 1. 设置当前实际高度
          wrapper.style.maxHeight = pre.offsetHeight + 'px';
          wrapper.classList.remove('expanded');
          mask.innerHTML = '<div class="mask-content">⬇️ 代码太长，点击展开</div>';
          mask.classList.remove('is-expanded-mask');

          // 2. 强制浏览器渲染一帧
          wrapper.offsetHeight;

          // 3. 设置折叠高度，触发动画
          wrapper.classList.add('collapsed');
          wrapper.style.maxHeight = '300px';
        }
      });

      wrapper.appendChild(mask);
    });
  };

  return { initCodeCollapse };
}