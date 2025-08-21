
export const  AccountProviderEnum = {
     GOOGLE :"GOOGLE",
     GITHUB :"GITHUB", 
     FACEBOOK:"FACEBOOK",
     EMAIL:"EMAIL",
     LINKEDIN:"LINKEDIN",
    }
export type AccountProviderTypeEnum = keyof typeof AccountProviderEnum;