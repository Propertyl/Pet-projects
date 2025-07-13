import { buildDevServer } from "./buildDevServer";
import { buildLoaders } from "./buildLoaders";
import { buildPlugins } from "./buildPlugins";
import { buildResolvers } from "./buildResolvers";
import { BuildOptions } from "./types/types";
import webpack from 'webpack';

export function buildWebpack(options:BuildOptions):webpack.Configuration {
  const isDev = options.mode === 'development';
  const {mode,paths} = options;

  return {
    mode:mode ?? 'development',
    entry:paths.entry,
    output:{
      path:paths.output,
      filename: '[name].[hash].js',
      clean:true
    },
    module:{
      rules:buildLoaders(options),
    },
    plugins:buildPlugins(options),
    resolve:buildResolvers(options),
    devServer:buildDevServer(options),
    devtool:isDev && 'inline-source-map'
  }
}