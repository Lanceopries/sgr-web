import {
  DropdownInterface,
  DropdownInterfaceMilti,
} from './../../shared/types/data/dropdown-interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../../shared/services/form.service';
import { LayoutService } from '../../shared/services/layout.service';
import { SGRDataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import {
  ExpressFormInnerInterface,
  ExpressFormInterface,
} from '../../shared/types/common/express-form.interface';
import { LocalStorageService } from '../../shared/services/localstorage.service';

@Component({
  selector: 'app-express-selection',
  styleUrls: ['./express-selection.component.scss'],
  templateUrl: './expres-selection.component.html',
})
export class ExpressSelectionComponent implements OnInit {
  // Form
  public expressForm!: FormGroup;

  private _stepperForm!: ExpressFormInterface;

  // Dropdown data
  public marketList: DropdownInterfaceMilti[] = [];
  public technologiesList: DropdownInterfaceMilti[] = [];
  public stageList: DropdownInterfaceMilti[] = [];
  public servicesList: DropdownInterfaceMilti[] = [];
  public businessModelList: DropdownInterfaceMilti[] = [];

  public dropdownSettings: any = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _layoutService: LayoutService,
    private _dataService: SGRDataService,
    private _localstorageService: LocalStorageService,
    private _formService: FormService
  ) {}

  ngOnInit() {
    this._layoutService.setCurrentPageConfig({
      title: 'Экспресс-подбор',
      subTitle: 'Быстрый подбор сервисов, за несколько кликов',
    });
    this.initValue();
    this.formUpdate();
  }

  public cancel(): void {
    this._router.navigate(['/']);
  }

  onSubmit() {
    console.log(this.expressForm.value);
    this._router.navigate(['/recommendation']);
  }

  private formUpdate() {
    this.expressForm.valueChanges.subscribe((changedForm) => {
      const updatedForm: ExpressFormInterface = {
        type: 'express',
        isNew: false,
        form: {
          businessModel: changedForm.businessModel,
          market: changedForm.market,
          dateCreation: changedForm.creationDate,
          service: changedForm.services,
          technologies: changedForm.technologies,
          stage: changedForm.companyStage
        },
      };
      this._localstorageService.setExpressDraft(updatedForm);
      this._formService.setExpressForm(updatedForm);
    });
  }

  private initValue(): void {
    this._formService.getForm().subscribe((form) => {
      this._stepperForm = form;
    });

    this.expressForm = this._formBuilder.group({
      market: [],
      creationDate: '',
      companyStage: '',
      technologies: [],
      services: '',
      businessModel: [],
    });

    this.businessModelList = this._dataService.businessModelList.map(
      (x, index) => {
        return {
          id: index,
          itemName: x.title,
        };
      }
    );
    this.marketList = this._dataService.marketList.map((x, index) => {
      return {
        id: index,
        itemName: x.title,
      };
    });
    this.technologiesList = this._dataService.technologiesList.map(
      (x, index) => {
        return {
          id: index,
          itemName: x.title,
        };
      }
    );
    this.stageList = this._dataService.stateCompanyList.map((x, index) => {
      return {
        id: index,
        itemName: x.title,
      };
    });
    this.servicesList = this._dataService.serviceList.map((x, index) => {
      return {
        id: index,
        itemName: x.title,
      };
    });

    this.dropdownSettings = {
      text: 'Выберите',
      enableSearchFilter: false,
    };

    if (!this._stepperForm?.isNew) {
      this.expressForm.patchValue({
        market: this._stepperForm?.form?.market,
        creationDate: this._stepperForm?.form?.dateCreation,
        technologies: this._stepperForm?.form?.technologies,
        services: this._stepperForm?.form?.service,
        businessModel: this._stepperForm?.form?.businessModel,
        companyStage: this._stepperForm?.form?.stage,
      });
    }
  }

  get market() {
    return this.expressForm.get('market');
  }

  get creationDate() {
    return this.expressForm.get('creationDate');
  }

  get technologies() {
    return this.expressForm.get('technologies');
  }

  get services() {
    return this.expressForm.get('services');
  }

  get businessModel() {
    return this.expressForm.get('businessModel');
  }
}
