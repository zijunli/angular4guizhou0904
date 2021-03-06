import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {Http} from '@angular/http';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable()
export class RandomUserService {
    // randomUserUrl = 'https://api.randomuser.me/';
    // randomUserUrl = '/api/results2';

    constructor(private http: Http, private httpClicent: HttpClient) {
    }

    getTotals(): Observable<any[]> {
        return this.http.get(environment.apiApp + '/apiApp' + '/groups/2/application-overview').map(res => res.json());
    }

    getUsers(pageIndex = 1, pageSize = 5, sortField, sortOrder): Observable<any> {
        const params = new URLSearchParams();
        params.set('page', `${pageIndex}`);
        params.set('results', `${pageSize}`);
        params.set('sortField', sortField);
        params.set('sortOrder', sortOrder);
        return this.http.get(environment.api + '/api/results', {search: params}).map(res => res.json().data);
    }

    getServiceInstances(pageIndex = 1, pageSize = 5, sortField, sortOrder): Observable<any> {
        const params = new URLSearchParams();
        params.set('page', `${pageIndex}`);
        params.set('results', `${pageSize}`);
        params.set('sortField', sortField);
        params.set('sortOrder', sortOrder);
        return this.http.get(environment.apiService + '/apiService' + '/groups/2/service-instances', {search: params}).map(res => res.json());
    }

    getAppInstances(pageIndex = 1, pageSize = 5, sortField, sortOrder, tabName): Observable<any> {
        const params = new URLSearchParams();
        params.set('page', `${pageIndex}`);
        params.set('results', `${pageSize}`);
        params.set('sortField', sortField);
        params.set('sortOrder', sortOrder);
        return this.http.get(environment.apiApp + '/apiApp' + '/groups/2/clusters/' + tabName + '/overviews', {search: params}).map(res => res.json());
    }
}
