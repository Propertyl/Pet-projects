import {buildPaths, buildWebpack, EnVariables} from '@packages/build-config';
import path from 'path';
import webpack from 'webpack';
import packageJson from './package.json';

interface HostEnVariable extends EnVariables {
  SPY_GAME_URL:string
}

export default (env:HostEnVariable) => {
  const paths:buildPaths = {
    output:path.resolve(__dirname,'build'),
    entry:path.resolve(__dirname,'src','index.tsx'),
    html:path.resolve(__dirname,'public','index.html'),
    src:path.resolve(__dirname,'src'),
    public:path.resolve(__dirname,'public')
  };

  const spyUrl = env.SPY_GAME_URL ?? 'http://localhost:3001';

  const config:webpack.Configuration = buildWebpack({
    port:env.port ?? 3000,
    mode:env.mode ?? 'development',
    paths:paths,
    analyzer:env.analyzer,
    platform:env.platform ?? 'desktop'
  });



  config.plugins.push(new webpack.container.ModuleFederationPlugin({
    name:'home',
    filename:'remoteEntry.js',
    remotes:{
      'spy':`spy@${spyUrl}/remoteEntry.js`
    },
    shared: {
      ...packageJson.
      dependencies,
      react: {
        eager:true,
        // requiredVersion:packageJson.dependencies['react'],
      },
      'react-router-dom': {
        eager:true,
        // requiredVersion:packageJson.dependencies['react-router-dom'],
      },
      'react-dom': {
        eager:true,
        // requiredVersion:packageJson.dependencies['react-dom']
      },
    }
  }));


  return config;
};