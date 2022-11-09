import { Action } from "./action";
import { Product } from "./product";
import { Comment } from 'src/app/services/comments.service';
import { Photo } from "./photo";

export class Order {
    id: number | undefined;
    priority: string | undefined;
    orderNumber: string | undefined;
    WhenToBeDone: string | undefined;
    description: string | undefined;
    photos: Photo[] | undefined;
    actionStatuses!: ActionStatus[];
    product!: Product;
    tenantIds: string[] | undefined;
    completed: boolean | undefined;
}

export class ActionStatus {
    id: string | undefined;
    actions: Action | undefined;
    progress: string | undefined;
    tenants: Tenant[] | undefined;
    comments: Comment[] | undefined;
    timeBegin: string | undefined;
    timeEnd: string | undefined;
    timeTakenState: string | undefined;
    isReadyForWork: boolean | undefined;
    lastAction: boolean | undefined;
}

export class Tenant {
    id: string | undefined;
    tenantValue: string | undefined;
    user!: {
        id: number | undefined;
        username: string | undefined
    }
}