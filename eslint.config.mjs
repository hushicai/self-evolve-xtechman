import wxml from 'eslint-plugin-wxml'
import wxmlParser from '@wxml/parser'

export default [
  {
    files: ['**/*.wxml'],
    plugins: {
      wxml
    },
    languageOptions: {
      parser: wxmlParser
    },
    rules: {
      'wxml/report-wxml-syntax-error': 'error',
      'wxml/empty-tag-self-closing': 'error',
      'wxml/no-duplicate-attributes': 'error',
      'wxml/wx-key': 'error'
    }
  }
]
