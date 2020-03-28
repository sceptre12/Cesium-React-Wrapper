const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");

const cesiumSource = "node_modules/cesium/Source";

module.exports = {
  plugins: [
    {
      plugin: {
        overrideCracoConfig: ({ cracoConfig }) => {
          // Always return the config object.
          return cracoConfig;
        },
        overrideWebpackConfig: ({ webpackConfig, context: { env } }) => {
          const cesiumPath = "cesium";

          webpackConfig.plugins.push(
            new CopyWebpackPlugin([
              {
                from: path.join(cesiumSource, `../Build/CesiumUnminified`),
                to: cesiumPath
              }
            ]),
            new HtmlWebpackTagsPlugin({
              append: false,
              tags: [
                ...["cesium/Widgets/widgets.css"],
                path.join(cesiumPath, "Cesium.js")
              ]
            }),
            new webpack.DefinePlugin({
              CESIUM_BASE_URL: JSON.stringify(cesiumPath)
            })
          );

          webpackConfig.externals = {
            ...webpackConfig.externals,
            Cesium: "Cesium"
          };

          webpackConfig.amd = {
            ...webpackConfig.amd,
            toUrlUndefined: true // Enable webpack-friendly use of require in Cesium
          };

          webpackConfig.node = {
            ...webpackConfig.node,
            fs: "empty" // resolve node module use of fs
          };

          webpackConfig.output = {
            ...webpackConfig.output,
            sourcePrefix: "" // needed to compile multiline strings in cesium
          };

          webpackConfig.resolve = {
            ...webpackConfig.resolve,
            alias: {
              ...webpackConfig.resolve.alias,
              Cesium: path.resolve(__dirname, cesiumSource)
            }
          };
          webpackConfig.module = {
            ...webpackConfig.module,
            unknownContextCritical: false
          };

          return webpackConfig;
        }
      }
    }
  ]
};
