const { glob } = require('glob');
const path = require('path');
const fs = require('fs');

async function generateLLms() {
  const cwd = process.cwd();
  const llmsDir = path.resolve(cwd, '.vitepress');
  const docsDir = path.join(cwd, 'src');

  let docs = await glob('**/*.md', { cwd: docsDir });

  let docsIndex = [];
  let docsBody = [];

  for (let markdown of docs) {
    const mdPath = path.join(docsDir, markdown);
    const isEnUS = mdPath.includes('en-US');

    if (!isEnUS) {
      const mdContent = fs.readFileSync(mdPath, 'utf-8');
      const mdName = markdown.replace(/\.md$/, '');
      const url = `https://winjs-dev.github.io/winjs-docs/${mdName}`;
      const regex = /^# (.+)$/m;
      let title = mdName;
      let contentFromHeading = '';

      const match = regex.exec(mdContent);
      if (match) {
        const heading = match[1].trim();
        const startIndex = match.index;
        contentFromHeading = mdContent.slice(startIndex);
        title = heading;

        docsIndex.push({
          title,
          url,
        });

        docsBody.push(
          [
            '---',
            `Title: ${title}`,
            `URL: ${url}`,
            '---',
            '',
            `${contentFromHeading}`,
          ].join('\n'),
        );
      }
    }
  }
  const docsIndexContent = [
    '# WinJS - 插件化的前端应用框架',
    '',
    '- WinJS是可扩展的前端应用框架。以路由为基础的，同时支持配置式路由和约定式路由，保证路由的功能完备，并以此进行功能扩展。然后配以生命周期完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求。',
    '',
    '## Docs',
    '',
    ...docsIndex.map(({ title, url }) => `- [${title}](${url})`),
    '',
  ].join('\n');

  const docsBodyContent = docsBody.join('\n');

  fs.writeFileSync(path.join(llmsDir, 'dist/llms.txt'), docsIndexContent);
  fs.writeFileSync(path.join(llmsDir, 'dist/llms-full.txt'), docsBodyContent);
  console.log('Generated llms.txt and llms-full.txt');
}

if (require.main === module) {
  generateLLms().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
