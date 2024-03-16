import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCourseComponent } from './list-course/list-course.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'list-course', component: ListCourseComponent },
            {
                path: 'list',
                data: { breadcrumb: 'List' },
                loadChildren: () =>
                    import('./list/list-course.module').then(
                        (m) => m.ListCourseModule
                    ),
            },
            {
                path: 'course/:id',
                data: { breadcrumb: 'Course' },
                component: CourseDetailComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class LectureRoutingModule {}
