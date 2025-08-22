// import { createClient } from 'redis';

// export default class MyRedis{
//     static redis=null
//     constructor(){}
//     static async getRedis()
//     {
//         if(!MyRedis.redis) MyRedis.redis= await createClient({url: `redis://${process.env.REDIS_HOST}:6379`})
//         .on('error', async err =>{ 
//             console.error('Redis Client Error', err)
//             try{
//                 await MyRedis.redis.disconnect()
//             }catch(e){
//                 console.error(e)
//             }
//             MyRedis.redis.connect()           
//         })
//         .on('connect',()=> console.info('Successfully connected to Redis.')).connect()

//         return MyRedis.redis;
//     }
// }


//  export async function redis_set(key,value,ex)
// {
//     let client=await MyRedis.getRedis();
//     if(ex)
//         await client.set(key, value, {EX:ex});
//     else 
//         await client.set(key, value);
// }

// export async function redis_get(key)
// { 
//     let client=await MyRedis.getRedis();
//     const value = await client.get(key);
//     return value;
// }

// export async function redis_remove(key)
// {
//     let client=await MyRedis.getRedis();
//     if(!key) return
//     let ex= await client.get(key)
//     if(ex!==null) await client.del(key)
// }

// export async function redis_expire(key,v)
// {
//     let client=await MyRedis.getRedis();
//     let ex= await client.get(key)
//     if(ex!==null) await client.expire(key, v);
// }

// export async function redis_exists(key)
// {
//     let client=await MyRedis.getRedis();
//     let ex= await client.get(key)
//     return ex!==null
// }



