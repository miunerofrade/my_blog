import { visit } from 'unist-util-visit';

export function remarkImageSize() {
  return (tree: any) => {
    visit(tree, 'image', (node: any) => {
      let width: string | null = null;
      let height: string | null = null;

      // url 中带有 #100x200 或 =100x200
      let match = node.url.match(/[#=](\d+)x(\d+)/);
      if (match) {
        node.url = node.url.replace(/[#=]\d+x\d+/, '');
        width = match[1];
        height = match[2];
      }
      
      // 或者在 alt 中带有 =100x200
      if (node.alt) {
        let altMatch = node.alt.match(/[#=](\d+)x(\d+)/);
        if (altMatch) {
            node.alt = node.alt.replace(/[#=]\d+x\d+/, '').trim();
            width = altMatch[1];
            height = altMatch[2];
        }
      }

      // 如果有尺寸信息，写入多个位置以确保传递到自定义 img 组件
      if (width && height) {
        // 方式 1: hProperties（标准 remark-rehype 方式）
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.width = width;
        node.data.hProperties.height = height;

        // 方式 2: title 属性（100% 可靠，title 会作为 prop 传递给组件）
        // 只有在原 title 为空时才使用，避免覆盖用户设置的 title
        if (!node.title) {
          node.title = JSON.stringify({ w: width, h: height });
        }
      }
    });
  };
}
