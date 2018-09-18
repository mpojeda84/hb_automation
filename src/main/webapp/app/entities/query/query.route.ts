import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Query } from 'app/shared/model/query.model';
import { QueryService } from './query.service';
import { QueryComponent } from './query.component';
import { QueryDetailComponent } from './query-detail.component';
import { QueryUpdateComponent } from './query-update.component';
import { QueryDeletePopupComponent } from './query-delete-dialog.component';
import { IQuery } from 'app/shared/model/query.model';

@Injectable({ providedIn: 'root' })
export class QueryResolve implements Resolve<IQuery> {
    constructor(private service: QueryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((query: HttpResponse<Query>) => query.body));
        }
        return of(new Query());
    }
}

export const queryRoute: Routes = [
    {
        path: 'query',
        component: QueryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Queries'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'query/:id/view',
        component: QueryDetailComponent,
        resolve: {
            query: QueryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Queries'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'query/new',
        component: QueryUpdateComponent,
        resolve: {
            query: QueryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Queries'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'query/:id/edit',
        component: QueryUpdateComponent,
        resolve: {
            query: QueryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Queries'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const queryPopupRoute: Routes = [
    {
        path: 'query/:id/delete',
        component: QueryDeletePopupComponent,
        resolve: {
            query: QueryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Queries'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
