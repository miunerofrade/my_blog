import { visit } from 'unist-util-visit';

export function remarkImageSize() {
  return (tree: any) => {
    visit(tree, 'image', (node: any) => {
      let width: string | null = null;
      let height: string | null = null;

      let match = node.url.match(/[#=](\d+)x(\d+)/);
      if (match) {
        node.url = node.url.replace(/[#=]\d+x\d+/, '');
        width = match[1];
        height = match[2];
      }
      
      if (node.alt) {
        let altMatch = node.alt.match(/[#=](\d+)x(\d+)/);
        if (altMatch) {
            node.alt = node.alt.replace(/[#=]\d+x\d+/, '').trim();
            width = altMatch[1];
            height = altMatch[2];
        }
      }

      if (width && height) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.width = width;
        node.data.hProperties.height = height;

        if (!node.title) {
          node.title = JSON.stringify({ w: width, h: height });
        }
      }
    });
  };
}
