import { NgModule } from '@angular/core';

import { AutomationSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [AutomationSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [AutomationSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class AutomationSharedCommonModule {}
