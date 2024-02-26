import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogComponent } from './blog.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: BlogComponent }
	])],
	exports: [RouterModule]
})
export class BlogRoutingModule { }
