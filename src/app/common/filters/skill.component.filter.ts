import {IDoesFilterPassParams, IFilterParams} from "ag-grid-community";

import {Component, ElementRef, ViewChild} from "@angular/core";
import {IFilterAngularComp} from "ag-grid-angular";

@Component({
  template: `
    <div class="ag-filter-wrapper ag-focus-managed">
      <div class="ag-filter-body-wrapper ag-simple-filter-body-wrapper">

        <!--AG-SELECT-->
        <div class="ag-filter-select ag-labeled ag-label-align-left ag-select" role="presentation" ref="eOptions1">
          <div ref="eLabel" class="ag-label ag-hidden" role="presentation"></div>
          <div ref="eWrapper" class="ag-wrapper ag-picker-field-wrapper" tabindex="0" aria-expanded="false"
               role="listbox" aria-describedby="156-display" aria-label="Filtering operator">
            <div ref="eDisplayField" class="ag-picker-field-display dropdown" id="156-display">
              <select #cricket class="ag-input-field-input" (change)="onSkillChanged($event, null)"
                      style="width: 100%;">
                <!--                              <option value="default">&#45;&#45;&#45;&#45;</option>-->
                <option *ngFor="let condition of conditions" [value]="condition.field">
                  {{condition.name}}
                </option>
              </select>
            </div>
<!--            <div ref="eIcon" class="ag-picker-field-icon" aria-hidden="true" (click)="openTypes($event)"><span-->
<!--              class="ag-icon ag-icon-small-down" unselectable="on" role="presentation"></span></div>-->
          </div>
        </div>

        <div class="ag-filter-body" ref="eCondition1Body" role="presentation">
          <!--AG-INPUT-TEXT-FIELD-->
          <div role="presentation"
               class=".ag-filter-from ag-filter-filter ag-labeled ag-label-align-left ag-text-field ag-input-field"
               ref="eValue-index0-1">
            <div ref="eLabel" class="ag-input-field-label ag-label ag-hidden ag-text-field-label"
                 role="presentation"></div>
            <div ref="eWrapper" class="ag-wrapper ag-input-wrapper ag-text-field-input-wrapper" role="presentation">
              <input #criketInput class="ag-input-field-input"
                     (change)="onSkillChanged($event, cricket.value)">
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./skill.component.filter.scss'],
})
export class SkillFilter implements IFilterAngularComp {
  @ViewChild('cricket') cricket: ElementRef;
  @ViewChild('criketInput') criketInput: ElementRef;
  public conditions = [
    {
      name: 'Contains',
      get filename() {
        return `${this.field}.png`
      },
      field: 'contains',
      selected: false
    },
    {
      name: 'Not Contains',
      get filename() {
        return `${this.field}.png`
      },
      field: 'notContains',
      selected: false
    },
    {
      name: 'Starts With',
      get filename() {
        return `${this.field}.png`
      },
      field: 'startsWith',
      selected: false
    },
    {
      name: 'Ends With',
      get filename() {
        return `${this.field}.png`
      },
      field: 'endsWith',
      selected: false
    },
    {
      name: 'Equals',
      get filename() {
        return `${this.field}.png`
      },
      field: 'equals',
      selected: false
    },
    {
      name: 'Not Equal',
      get filename() {
        return `${this.field}.png`
      },
      field: 'notEqual',
      selected: false
    },
    {
      name: 'Blank',
      get filename() {
        return `${this.field}.png`
      },
      field: 'blank',
      selected: false
    },
    {
      name: 'Not Blank',
      get filename() {
        return `${this.field}.png`
      },
      field: 'notBlank',
      selected: false
    }
  ];

  private params!: IFilterParams;

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  onSkillChanged($event: any, skill: any) {
    console.log(this.cricket.nativeElement.value)
    console.log(this.criketInput.nativeElement.value)
    // skill.selected = $event.target.checked;
    this.params.filterChangedCallback();
  }

  getModel() {
    // return this.conditions.reduce((state: any, skill) => {
    //     state[skill.field] = skill.selected;
    //     return state;
    // }, {})
    return {type: this.cricket.nativeElement.value, filter: this.criketInput.nativeElement.value};
  }

  setModel(model: any) {
    // for (const condition of this.conditions) {
    //   condition.selected = model && model[condition.field] ? model[condition.field].selected : false;
    // }
    // model[this.cricket.nativeElement.value]
  }

  doesFilterPass(params: IDoesFilterPassParams) {
    const rowSkills = params.data.skills;
    let passed = true;

    for (const condition of this.conditions) {
      passed = passed && (condition.selected ? (condition.selected && rowSkills[condition.field]) : true);
    }

    return passed;
  };

  public isFilterActive() {
    return true;
  };

  helloFromSkillsFilter() {
    alert("Hello From The Skills Filter!");
  }

  openTypes($event: MouseEvent) {
    console.log(this.cricket.nativeElement);
    this.cricket.nativeElement.click()
  }
}
