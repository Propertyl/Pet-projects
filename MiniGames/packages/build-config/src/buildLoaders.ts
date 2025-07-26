import {ModuleOptions} from 'webpack';
import { BuildOptions } from "./types/types";

export function buildLoaders({mode}:BuildOptions):ModuleOptions['rules'] {
  const isDev = mode === 'development';

  const fontsLoader = {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type:'asset/resource',
  }

  const svgLoader =   {
  test: /\.svg$/i,
  issuer: /\.[jt]sx?$/,
  use:[
    {
      loader:'@svgr/webpack', 
      options:{
        icon:true,
        svgoConfig: {
           plugins: [
             {
               name:'convertColors',
               params: {
                 currentColor: true,
               }
             }
           ]
        }
      }
    }],
  }

  const scssLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      // Creates `style` nodes from JS strings
      'style-loader',
      // Translates CSS into CommonJS
      'css-loader',
      // Compiles Sass to CSS
      "sass-loader",
    ]
  }

  const assetsLoader = {
    test:/\.(png|jpeg|jpg|gif|webp|mp3)/i,
    type:'asset/resource'
  }

  const tsLoader = {
    exclude:/node_modules/,
    test:/\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly:isDev
        },
      }
    ]
  }

  return [
    assetsLoader,
    scssLoader,
    tsLoader,
    svgLoader,
    fontsLoader
  ]
}
