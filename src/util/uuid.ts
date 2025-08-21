import {v4 as uuid4} from 'uuid';

export function generateInviteCode(): string {
    console.log(uuid4().replace(/-/g, '').substring(0, 8)  )
    return uuid4().replace(/-/g, '').substring(0, 8)    ;
}

export function generateTaskCode(): string {
    return `TASK-${uuid4().replace(/-/g, '').substring(0, 8)}`;
}
