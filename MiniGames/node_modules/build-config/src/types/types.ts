export interface buildPaths{
   entry:string,
   html:string,
   output:string,
   src:string,
   public:string
}

export interface EnVariables{
   mode?:BuildMode,
   port?:number,
   analyzer?:boolean,
   platform?:BuildPlatform
 }

export type BuildMode = "production" | "development"
export type BuildPlatform = "mobile" | "desktop"

export interface BuildOptions {
   port:number,
   paths:buildPaths,
   mode:BuildMode,
   analyzer?:boolean,
   platform:BuildPlatform
}

