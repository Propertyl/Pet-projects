import { buildPaths, buildWebpack, EnVariables } from "build-config";
import path from "path";
import webpack from 'webpack';
import packageJson from './package.json';

export default (env:EnVariables) => {
  const {mode,port,platform,analyzer} = env;

  const paths:buildPaths = {
    entry:path.resolve(__dirname,'src','index.tsx'),
    output:path.resolve(__dirname,'build'),
    html:path.resolve(__dirname,'public','index.html'),
    src:path.resolve(__dirname,'src'),
    public:path.resolve(__dirname,'public')
  };

  const config:webpack.Configuration = buildWebpack({
    port:port ?? 3001,
    mode:mode ?? 'development',
    paths,
    analyzer,
    platform:platform ?? 'desktop'
  });

  config.plugins.push(new webpack.container.ModuleFederationPlugin({
    name:"spy",
    filename:'remoteEntry.js',
    exposes: {
      './Router': './src/router/Router.tsx',
    },
    shared:{
      ...packageJson.dependencies,
      react:{
        eager:true,
        // requiredVersion:packageJson.dependencies['react']
      },
      'react-router-dom':{
        eager:true,
        // requiredVersion:packageJson.dependencies['react-router-dom']
      },
      'react-dom':{
        eager:true,
        // requiredVersion:packageJson.dependencies['react-dom']
      }
    }

  }));

  return config;
}