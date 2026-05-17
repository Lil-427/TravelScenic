import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginPrettier from 'eslint-plugin-prettier'
import skipFormatting from 'eslint-config-prettier'

export default [
  // 基础 JS 规则
  js.configs.recommended,

  // Vue 3 基础规则
  ...pluginVue.configs['flat/essential'],

  // 主配置
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // 浏览器全局变量
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        module: 'readonly'
      }
    },
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      // Prettier 格式化规则
      'prettier/prettier': [
        'warn',
        {
          semi: false, // 不使用分号
          singleQuote: true, // 使用单引号
          printWidth: 100, // 一行最大100字符
          trailingComma: 'none', // 不加尾随逗号
          tabWidth: 2, // 缩进2空格
          useTabs: false,
          endOfLine: 'auto'
        }
      ],

      // Vue 规则
      'vue/multi-word-component-names': 'off', // 组件名可以不是多个单词
      'vue/no-multiple-template-root': 'off', // Vue 3 可以有多个根元素

      // JS 规则
      'no-unused-vars': 'warn', // 未使用变量警告
      'no-console': 'off', // 允许 console.log
      'no-debugger': 'warn' // debugger 警告
    }
  },

  // 忽略文件
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.vscode/**',
      '.prettierrc',
      'eslint.config.js'
    ]
  }
]
