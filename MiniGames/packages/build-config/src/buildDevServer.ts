import path from "path";
import { Configuration } from ".";
import { BuildOptions } from "./types/types";

export function buildDevServer({port,paths}:BuildOptions):Configuration['devServer'] {
  return {
    port:port ?? 3000,
    static:paths.public,
    compress:true,
    open:true,
    historyApiFallback:true,
    hot:true

  }
}