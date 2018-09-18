import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IQuery } from 'app/shared/model/query.model';
import { QueryService } from './query.service';

@Component({
    selector: 'jhi-query-update',
    templateUrl: './query-update.component.html'
})
export class QueryUpdateComponent implements OnInit {
    private _query: IQuery;
    isSaving: boolean;

    constructor(private queryService: QueryService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ query }) => {
            this.query = query;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.query.id !== undefined) {
            this.subscribeToSaveResponse(this.queryService.update(this.query));
        } else {
            this.subscribeToSaveResponse(this.queryService.create(this.query));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IQuery>>) {
        result.subscribe((res: HttpResponse<IQuery>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get query() {
        return this._query;
    }

    set query(query: IQuery) {
        this._query = query;
    }
}
