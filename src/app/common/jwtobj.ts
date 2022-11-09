export class Jwtobj {
    sub: string = "";
    authorities!: Authority[];
    iat: number | undefined;
    exp: number | undefined;
}

export class Authority {
    authority: string = "";
}
