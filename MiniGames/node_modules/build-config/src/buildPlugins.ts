import { BuildOptions } from "./types/types";
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'html-webpack-plugin';
import { Configuration,DefinePlugin } from "webpack";
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import HtmlWebpackPlugin from "html-webpack-plugin";

export function buildPlugins({mode,analyzer,paths,platform}:BuildOptions) {
  const plugins:Configuration['plugins'] = [
    new HtmlWebpackPlugin({
      template:paths.html,
      favicon:path.resolve(paths.public,'favicon.ico'),
      publicPath:'/'
    }),
    new DefinePlugin({
      __PLATFORM__:JSON.stringify(platform)
    })
  ];
  const isDev = mode === 'development';

  if(isDev) {
    plugins.push(new webpack.ProgressPlugin());
    plugins.push(new ReactRefreshWebpackPlugin());
  } else if(!isDev) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename:'css/[name].[contenthash:8].css',
        chunkFilename:'css/[name].[contenthash:8].css'
      })
    );
    plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from:path.resolve(paths.public,'locales'),
            to:path.resolve(paths.output,'locales')
          },
        ],
      })
    )
  }

  if(analyzer) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return plugins
}