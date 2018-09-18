/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { AutomationTestModule } from '../../../test.module';
import { QueryDeleteDialogComponent } from 'app/entities/query/query-delete-dialog.component';
import { QueryService } from 'app/entities/query/query.service';

describe('Component Tests', () => {
    describe('Query Management Delete Component', () => {
        let comp: QueryDeleteDialogComponent;
        let fixture: ComponentFixture<QueryDeleteDialogComponent>;
        let service: QueryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutomationTestModule],
                declarations: [QueryDeleteDialogComponent]
            })
                .overrideTemplate(QueryDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(QueryDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QueryService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete('123');
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith('123');
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
