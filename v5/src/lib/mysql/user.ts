import { getJsonArray, getData, execute } from './common';

// 更新用户信息
export async function updateActor({ account, actorDesc, path }: { account: any; actorDesc: any; path: any }): Promise<any> {
    return await execute(
        "update a_account set actor_desc=?,avatar=? where actor_account=?",
        [actorDesc, path, account]
    );
}

// 获取用户信息
export async function getUser(findFiled: any, findValue: any, selectFields: any): Promise<DaismActor> {
    return await getData(`select ${selectFields} from a_account where LOWER(${findFiled})=?`,
        [(findValue + '').toLowerCase()],true) as DaismActor ;
}

// 获取 actor 信息
export async function getActor(did: any): Promise<any> {
    const _actor: any = await getJsonArray('actor', [did], true);
    return _actor.manager ? _actor : { manager: did, avatar: '', actor_name: '', actor_desc: '', actor_account: '', actor_url: '' };
}
