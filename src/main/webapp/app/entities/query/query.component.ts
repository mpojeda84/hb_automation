import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IQuery } from 'app/shared/model/query.model';
import { Principal } from 'app/core';
import { QueryService } from './query.service';

@Component({
    selector: 'jhi-query',
    templateUrl: './query.component.html'
})
export class QueryComponent implements OnInit, OnDestroy {
    queries: IQuery[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private queryService: QueryService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.queryService.query().subscribe(
            (res: HttpResponse<IQuery[]>) => {
                this.queries = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInQueries();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IQuery) {
        return item.id;
    }

    registerChangeInQueries() {
        this.eventSubscriber = this.eventManager.subscribe('queryListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
