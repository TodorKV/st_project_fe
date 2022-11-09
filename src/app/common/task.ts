import { Tenant } from "./order";

export class Task {
    id: number | undefined;
    WhenToBeDone: string | undefined;
    description: string | undefined;
    tenants: Tenant[] | undefined;
}
