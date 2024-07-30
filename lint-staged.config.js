module.exports = {
  "*.ts": ["biome lint", "git add"],
  // '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
  //   'yarn lint:prettier --parser json',
  // ],
  // 'package.json': ['yarn lint:prettier'],
  // '*.md': ['yarn lint:markdownlint', 'yarn lint:prettier'],
};
