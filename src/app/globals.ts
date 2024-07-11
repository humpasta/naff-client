import {ReplaySubject} from "rxjs";

export const jwtToken: ReplaySubject<any> = new ReplaySubject(1);
