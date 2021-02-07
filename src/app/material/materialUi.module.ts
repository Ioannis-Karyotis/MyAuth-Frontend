import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import * as MaterialUiSystem from '@material-ui/core';



const MaterialUIComponents = [
    MaterialUiSystem
];

@NgModule({
  imports: [MaterialUIComponents],
  exports : [MaterialUIComponents]
})

export class MaterialUiModule { }
