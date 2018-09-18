import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQuery } from 'app/shared/model/query.model';

@Component({
    selector: 'jhi-query-detail',
    templateUrl: './query-detail.component.html'
})
export class QueryDetailComponent implements OnInit {
    query: IQuery;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ query }) => {
            this.query = query;
        });
    }

    previousState() {
        window.history.back();
    }
}
