module.exports = {
  root: true,
  extends: ['@react-native-community',"standard", "prettier", "plugin:react/recommended"],
  parser: "@typescript-eslint/parser",
  env: {
      mocha: true,
      node: true,
      "jest/globals": true
  },
  plugins: ["sql", "jest", "react"],
  rules: {
      "no-unexpected-multiline": ["warn"],
      "max-len": ["error", { "code": 650 }],
      "no-set-state": "off",
      "react/prop-types": 0,
      "no-unused-expressions": 0,
      "no-return-assign": 0,
      "new-cap": 0,
      "dot-notation": 0,
      "no-unused-vars": 2
  },
  settings: {
      "import/resolver": {
          "babel-module": {}
      }
  }
};
