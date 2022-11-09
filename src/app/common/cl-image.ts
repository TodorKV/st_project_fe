export class ClImage {
    total_count: number = 0;
    time: number = 0;
    resources: Resource[] = [];
}

export class Resource {
    public_id: string = "";
    secure_url: string = "";
    created_at: string = "";
}
