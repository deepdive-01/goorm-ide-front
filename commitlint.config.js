export default {
  rules: {
    'header-match-team-format': [2, 'always'],
  },

  plugins: [
    {
      rules: {
        'header-match-team-format': ({ header }) => {
          const regex = /^\[COD-\d+\]\s.+$/

          const isValid = regex.test(header)

          return [isValid, '커밋 메시지는 "[COD-숫자] 내용" 형식이어야 합니다.']
        },
      },
    },
  ],
}
