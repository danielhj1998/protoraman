const ModuleResolverPlugin = ['module-resolver', {
    alias: {
        '@app': './app',
        '@assets' : './assets',
    },
}];

const InlineImportPlugin = ['babel-plugin-inline-import', {
    extensions: [".svg"],
}];

module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [ModuleResolverPlugin, InlineImportPlugin],
    overrides: [
        {
            test: /\.ts?$/,
            plugins: [
                ['@babel/plugin-transform-typescript', { allowNamespaces: true }]
            ]
        }
    ]
}
