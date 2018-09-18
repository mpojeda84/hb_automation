import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AutomationSharedModule } from 'app/shared';
import {
    QueryComponent,
    QueryDetailComponent,
    QueryUpdateComponent,
    QueryDeletePopupComponent,
    QueryDeleteDialogComponent,
    queryRoute,
    queryPopupRoute
} from './';

const ENTITY_STATES = [...queryRoute, ...queryPopupRoute];

@NgModule({
    imports: [AutomationSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [QueryComponent, QueryDetailComponent, QueryUpdateComponent, QueryDeleteDialogComponent, QueryDeletePopupComponent],
    entryComponents: [QueryComponent, QueryUpdateComponent, QueryDeleteDialogComponent, QueryDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AutomationQueryModule {}
