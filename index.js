const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 生成自定义指令
function generateCustomInstructions(projectType, framework, language) {
  const baseInstructions = `您是一个专业的AI编程助手，主要专注于生成清晰、可读的${getLanguageName(language, projectType)} 代码。
您始终使用最新的稳定版本的${getFrameworkName(language, projectType, framework)}，并且熟悉最新的功能和最佳实践。
${getAdditionalInstructions(language, projectType)}
您仔细提供准确、事实性、深思熟虑的答案，并且在推理方面非常出色。
- 仔细遵循用户的要求，逐字执行。
- 首先逐步思考 - 详细描述您要构建的计划的伪代码。
- 确认后，再编写代码！
- 始终编写正确、最新、无错误、完全功能齐全、安全、高效的代码。
- 更加注重可读性，而不是性能。
- 完全实现所有请求的功能。
- 不留任何待办事项、占位符或缺失部分。
- 确保引用文件名。
- 简明扼要，尽量减少其他文字。
- 如果您认为可能没有正确答案，请说明。如果您不知道答案，请直接说，而不是猜测。`;

  return baseInstructions.replace(/\n+/g, '\n').trim();
}

function getLanguageName(language, projectType) {
  if (language === 'ruby') return 'Ruby';
  if (projectType === 'nodejs') return 'Node.js';
  return language === 'typescript' ? 'React TypeScript' : 'React JavaScript';
}

function getFrameworkName(language, projectType, framework) {
  if (language === 'ruby') return 'Ruby和Rails';
  if (projectType === 'nodejs') return `Node.js${framework !== 'none' ? ` 和 ${framework}` : ''}`;
  return `React${framework !== 'none' ? ` 和 ${framework}` : ''}`;
}

function getAdditionalInstructions(language, projectType) {
  return (language === 'ruby' || projectType === 'react') ? '您还使用最新版本的Tailwind、Stimulus、Hotwire和Turbo。' : '';
}

// 用户交互
async function getUserInput() {
  const projectType = await askQuestion('选择项目类型 (nodejs/react): ', ['nodejs', 'react']);
  const frameworks = projectType === 'nodejs' ? ['express', 'nestjs', 'none'] : ['umijs', 'nextjs', 'none'];
  const framework = await askQuestion(`选择框架 (${frameworks.join('/')}): `, frameworks);
  const language = await askQuestion('选择语言 (javascript/typescript): ', ['javascript', 'typescript']);

  return { projectType, framework, language };
}

function askQuestion(question, validAnswers) {
  return new Promise((resolve) => {
    function ask() {
      rl.question(question, (answer) => {
        if (validAnswers.includes(answer)) {
          resolve(answer);
        } else {
          console.log('无效的选择，请重新选择。');
          ask();
        }
      });
    }
    ask();
  });
}

// 主函数
async function main() {
  try {
    const { projectType, framework, language } = await getUserInput();
    const customInstructions = generateCustomInstructions(projectType, framework, language);
    await writeRules(customInstructions);
    console.log('.cursorrules 文件已成功生成');
  } catch (error) {
    console.error('发生错误:', error);
  } finally {
    rl.close();
  }
}

function writeRules(rules) {
  return new Promise((resolve, reject) => {
    fs.writeFile('.cursorrules', rules, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

main();
