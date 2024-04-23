import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCourseComponent } from './list-course.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: ListCourseComponent }]),
    ],
    exports: [RouterModule],
})
export class ListDemoRoutingModule {}
