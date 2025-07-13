import { Configuration } from ".";
import { BuildOptions } from "./types/types";

export function buildDevServer({port}:BuildOptions):Configuration['devServer'] {
  return {
    port:port ?? 3000,
    static:'./dist',
    open:true,
    historyApiFallback:true,
    hot:true

  }
}