import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IQuery } from 'app/shared/model/query.model';
import { QueryService } from './query.service';

@Component({
    selector: 'jhi-query-delete-dialog',
    templateUrl: './query-delete-dialog.component.html'
})
export class QueryDeleteDialogComponent {
    query: IQuery;

    constructor(private queryService: QueryService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.queryService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'queryListModification',
                content: 'Deleted an query'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-query-delete-popup',
    template: ''
})
export class QueryDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ query }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(QueryDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.query = query;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
