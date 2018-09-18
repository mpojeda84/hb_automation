/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { AutomationTestModule } from '../../../test.module';
import { QueryComponent } from 'app/entities/query/query.component';
import { QueryService } from 'app/entities/query/query.service';
import { Query } from 'app/shared/model/query.model';

describe('Component Tests', () => {
    describe('Query Management Component', () => {
        let comp: QueryComponent;
        let fixture: ComponentFixture<QueryComponent>;
        let service: QueryService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutomationTestModule],
                declarations: [QueryComponent],
                providers: []
            })
                .overrideTemplate(QueryComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(QueryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QueryService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Query('123')],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.queries[0]).toEqual(jasmine.objectContaining({ id: '123' }));
        });
    });
});
