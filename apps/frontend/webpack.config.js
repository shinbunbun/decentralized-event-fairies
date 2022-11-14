const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (config, context) => {
  return merge(config, {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: '../../node_modules/@iota/identity-wasm/web/identity_wasm_bg.wasm',
            to: 'identity_wasm_bg.wasm',
          },
        ],
      }),
    ],
  });
};
