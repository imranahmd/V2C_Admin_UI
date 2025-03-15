// import { IDoesFilterPassParams, IFilterParams } from "ag-grid-angular";

import {Component} from "@angular/core";
import { IFilterAngularComp } from "ag-grid-angular";
import {IDoesFilterPassParams, IFilterParams} from "ag-grid-community";

@Component({
    template: `
        <div style="display: inline-block">
            <div style="text-align: center; background: lightgray; width: 100%; display: block; border-bottom: 1px solid grey">
                <b>Custom Text Filter</b>
            </div>
            <div style="margin-top: 3px; float: left">
                <label style="border: 1px solid lightgrey; margin: 4px; padding: 4px; display: inline-block">
                    <span>
<!--                        <div style="text-align:center">{{skill.name}}</div>-->
                        <div>
                            <input type="text" name="filltextinput" id="filltextinput" (change)="onSkillChanged($event)"/>
                        </div>
                    </span>
                </label>
            </div>
        </div>
    `
})
export class TextfilFilter implements IFilterAngularComp {
    public skills = [
        {
            name: 'Android',
            get filename() {
                return `${this.field}.png`
            },
            field: 'android',
            selected: false
        },
        {
            name: 'CSS',
            get filename() {
                return `${this.field}.png`
            },
            field: 'css',
            selected: false
        },
        {
            name: 'HTML 5',
            get filename() {
                return `${this.field}.png`
            },
            field: 'html5',
            selected: false
        },
        {
            name: 'Mac',
            get filename() {
                return `${this.field}.png`
            },
            field: 'mac',
            selected: false
        },
        {
            name: 'Windows',
            get filename() {
                return `${this.field}.png`
            },
            field: 'windows',
            selected: false
        }
    ];
    public filltextinput:any;

    private params!: IFilterParams;

    agInit(params: IFilterParams): void {
        this.params = params;
    }

    onSkillChanged($event: any) {
        console.log($event);
        this.params.filterChangedCallback();
    }

    getModel() {
        return this.skills.reduce((state: any, skill) => {
            state[skill.field] = skill.selected;
            return state;
        }, {})
    }

    setModel(model: any) {
        console.log(model)
    }

    doesFilterPass(params: IDoesFilterPassParams) {
        const rowSkills = params.data.skills;
        let passed = true;

        for (const skill of this.skills) {
            passed = passed && (skill.selected ? (skill.selected && rowSkills[skill.field]) : true);
        }

        return passed;
    };

    public isFilterActive() {
        return true;
    };

}
