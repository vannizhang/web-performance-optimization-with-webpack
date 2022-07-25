// export const add = (a:number, b:number)=>a+b;

export const generateRandomNumber = (min=0, max=1)=>{
    const range = max - min;
    return Math.floor(Math.random() * range) + min;
}