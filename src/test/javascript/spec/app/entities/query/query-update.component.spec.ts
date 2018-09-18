/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AutomationTestModule } from '../../../test.module';
import { QueryUpdateComponent } from 'app/entities/query/query-update.component';
import { QueryService } from 'app/entities/query/query.service';
import { Query } from 'app/shared/model/query.model';

describe('Component Tests', () => {
    describe('Query Management Update Component', () => {
        let comp: QueryUpdateComponent;
        let fixture: ComponentFixture<QueryUpdateComponent>;
        let service: QueryService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutomationTestModule],
                declarations: [QueryUpdateComponent]
            })
                .overrideTemplate(QueryUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(QueryUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QueryService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Query('123');
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.query = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Query();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.query = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
