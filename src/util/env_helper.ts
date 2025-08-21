
export const getEnv = (key:string,default_value:string)=>{
   let value = process.env[key];
    if(!value){
        if(default_value){
            return default_value;
   }
   throw new Error(`Environment variable ${key} is not set and no default value provided.`);
}
 return value
   
}