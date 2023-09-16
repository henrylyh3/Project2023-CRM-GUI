import { environment } from '@env/environment';

export class BaseService {
    baseURL: string = environment.apiUrl;

    constructor() { }
}
