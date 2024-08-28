const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 定义通用规则
const commonRules = [
  {
    name: "检测大型函数",
    pattern: "function\\s+\\w+\\s*\\([^)]*\\)\\s*{[\\s\\S]{500,}}",
    message: "这个函数可能太大了,考虑拆分它"
  },
  {
    name: "检测魔术数字",
    pattern: "\\b(?<!\\.)\\d{4,}\\b",
    message: "发现魔术数字,考虑使用命名常量"
  }
];

// 定义特定框架的规则
const frameworkRules = {
  nodejs: {
    express: [
      {
        name: "Express 路由检查",
        pattern: "app\\.(get|post|put|delete)\\(",
        message: "确保正确处理路由错误"
      }
    ],
    nestjs: [
      {
        name: "NestJS 装饰器检查",
        pattern: "@(Controller|Injectable|Module)\\(",
        message: "确保正确使用 NestJS 装饰器"
      }
    ]
  },
  react: {
    umijs: [
      {
        name: "UmiJS 路由检查",
        pattern: "export\\s+default\\s+{\\s*component:",
        message: "确保正确配置 UmiJS 路由"
      }
    ],
    nextjs: [
      {
        name: "NextJS 页面检查",
        pattern: "export\\s+default\\s+function\\s+\\w+",
        message: "确保正确定义 NextJS 页面组件"
      }
    ]
  }
};

// 生成规则文件
function generateRules(projectType, framework, language) {
  const customInstructions = `您是一个专业的AI编程助手，主要专注于生成清晰、可读的${language === 'ruby' ? 'Ruby' : projectType === 'nodejs' ? 'Node.js' : 'React'} ${language === 'typescript' ? 'TypeScript' : language === 'ruby' ? '' : 'JavaScript'} 代码。
您始终使用最新的稳定版本的${language === 'ruby' ? 'Ruby和Rails' : projectType === 'nodejs' ? 'Node.js' : 'React'}${framework !== 'none' ? ` 和 ${framework}` : ''}，并且熟悉最新的功能和最佳实践。
${language === 'ruby' || projectType === 'react' ? '您还使用最新版本的Tailwind、Stimulus、Hotwire和Turbo。' : ''}
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

  return customInstructions.replace(/\n+/g, '\n').trim();
}

// 用户交互
function askProjectType() {
  rl.question('选择项目类型 (nodejs/react): ', (projectType) => {
    if (!['nodejs', 'react'].includes(projectType)) {
      console.log('无效的项目类型，请重新选择。');
      askProjectType();
    } else {
      askFramework(projectType);
    }
  });
}

function askFramework(projectType) {
  const frameworks = projectType === 'nodejs' ? ['express', 'nestjs', 'none'] : ['umijs', 'nextjs', 'none'];
  rl.question(`选择框架 (${frameworks.join('/')}): `, (framework) => {
    if (!frameworks.includes(framework)) {
      console.log('无效的框架选择，请重新选择。');
      askFramework(projectType);
    } else {
      askLanguage(projectType, framework);
    }
  });
}

function askLanguage(projectType, framework) {
  rl.question('选择语言 (javascript/typescript): ', (language) => {
    if (!['javascript', 'typescript'].includes(language)) {
      console.log('无效的语言选择，请重新选择。');
      askLanguage(projectType, framework);
    } else {
      const rules = generateRules(projectType, framework, language);
      writeRules(rules);
    }
  });
}

askProjectType();

function writeRules(rules) {
  fs.writeFile('.cursorrules', rules, (err) => {
    if (err) {
      console.error('写入文件时出错:', err);
    } else {
      console.log('.cursorrules 文件已成功生成');
    }
    rl.close();
  });
}
