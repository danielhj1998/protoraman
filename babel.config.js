const ModuleResolverPlugin = ['module-resolver', {
    alias: {
        '@app': './app',
        '@assets' : './assets',
    },
}];

module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [ModuleResolverPlugin],
    overrides: [
        {
            test: /\.ts?$/,
            plugins: [
                ['@babel/plugin-transform-typescript', { allowNamespaces: true }]
            ]
        }
    ]
}
