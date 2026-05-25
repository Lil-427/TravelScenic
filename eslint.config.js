import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginPrettier from 'eslint-plugin-prettier'
import skipFormatting from 'eslint-config-prettier'

export default [
  // 基础 JS 规则
  js.configs.recommended,

  // Vue 3 基础规则
  ...pluginVue.configs['flat/essential'],

  // 关闭 ESLint 中与 Prettier 冲突的规则
  skipFormatting,

  // 主配置
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
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
      // Prettier 规则
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          printWidth: 100,
          trailingComma: 'none',
          tabWidth: 2,
          useTabs: false,
          endOfLine: 'auto'
        }
      ],

      // Vue 规则
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',

      // JS 规则
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',

      // 忽略无用的赋值错误
      'no-useless-assignment': 'off'
    }
  },

  // 忽略文件
  {
    ignores: ['node_modules/**', 'dist/**', '.vscode/**', 'eslint.config.js', '.prettierrc.js']
  }
]
