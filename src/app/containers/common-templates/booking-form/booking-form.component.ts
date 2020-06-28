import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import * as $ from 'jquery';
import 'jquery-nice-select/js/jquery.nice-select';
import { HttpService } from '../../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { SelectItem } from 'primeng/api';
import * as _ from 'lodash';


interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})


export class BookingFormComponent implements OnInit, AfterViewInit {
  @ViewChild('drpDown') drpDown: ElementRef;
  dateValue;
  booking = {
    appointmentTime: null,
    orderServiceVos: [],
    empId: '',
    name: null,
    phone: null,
    emailid: null,
    roleid: 3,
    experience: 1
  };

  availableSlots = [];
  orderServiceVos = [];
  selectedValue = '';

  services: SelectItem[];
  userList: any = [];
  minimumDate = new Date();

  constructor(private httpService: HttpService, private toastr: ToastrService, private dataService: DataService) {
    //SelectItem API with label-value pairs
    this.cities1 = [
      { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
      { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
      { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
      { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
      { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
    ];

    //An array of cities
    this.cities2 = [
      { label: 'New York', value: 'NY' },
      { label: 'Rome', value: 'RM' },
      { label: 'London', value: 'LDN' },
      { label: 'Istanbul', value: 'IST' },
      { label: 'Paris', value: 'PRS' }
    ];
  }
  activebtn;
  slotList=['4.34-4.40','4.34-4.40','4.34-4.40','4.34-4.40','4.34-4.40','4.34-4.40','4.34-4.40','4.34-4.40','4.34-4.40']

  ngOnInit() {
    this.httpService.getServices().subscribe((data: SelectItem[]) => {
      this.services = data;
      console.log(this.services)

    });
    // this.httpService.getUser().subscribe(data => {
    //   this.userList = data['adminList'];
    // });

    // this.services = this.httpService.getMockData().services;
    // this.userList = this.httpService.getMockData().barbers;



  }

  resetForm() {
    return;
    this.orderServiceVos = [];
    this.availableSlots = [];
    this.booking = {
      appointmentTime: null,
      orderServiceVos: [],
      empId: '',
      name: null,
      phone: null,
      emailid: null,
      roleid: 3,
      experience: 1
    };
  }
  resetService() {
    this.availableSlots = [];
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // (<any>$(this.drpDown.nativeElement)).niceSelect();
  }

  phonenumber(inputtxt) {
    // var phoneno = /^\d{10}$/;
    var phoneno = /^\d+$/;
    console.log(inputtxt);
    // let inText = parseInt(inputtxt);
    if (inputtxt && inputtxt.match(phoneno) && (this.booking.phone === null || this.booking.phone.length < 10)) {
      return true;
    }
    else {
      return false;
    }
  }

  setService(id, event) {
    // return;
    let serviceList = [];
    for(let service of event.value){
      serviceList.push({serviceId: service.serviceId})
    }
    this.httpService.getUserDetails({serviceLists :serviceList}).subscribe(data => {
      this.userList = data;
    });
    // this.services.forEach(element => {
      // if (element.serviceId == id) {
      //   element.customerid = 0;
      //   element.orderserviceid = 0;
      //   element.serviceid = element.serviceId;
      //   // delete  element.serviceId;
      //   this.booking.orderServiceVos = [element];
      //   this.userList = element.employeeVoList;
      // }
    // });
  }

  submitForm() {
    debugger
    // this.booking.appointmentTime = '' + this.booking.appointmentTime;
    if (typeof this.booking.appointmentTime === 'string')
      this.booking.appointmentTime = new Date(this.booking.appointmentTime);

    // var m = new Date(this.booking.appointmentTime);
    this.booking.appointmentTime =
      this.booking.appointmentTime.getFullYear() + "-" +
      ("0" + (this.booking.appointmentTime.getMonth() + 1)).slice(-2) + "-" +
      ("0" + this.booking.appointmentTime.getDate()).slice(-2) ;
      // ("0" + this.booking.appointmentTime.getHours()).slice(-2) + ":" +
      // ("0" + this.booking.appointmentTime.getMinutes()).slice(-2) + ":" +
      // ("0" + this.booking.appointmentTime.getSeconds()).slice(-2);

    this.httpService.saveBooking(this.booking).subscribe(data => {
      if (!data['availableSlotsList'] || (data['availableSlotsList'] && data['availableSlotsList'].length <= 0)) {
        $.magnificPopup.close();
        this.resetForm();
        this.toastr.success('Appointment has been confiremed.');
      } else {
        this.availableSlots = data['availableSlotsList'];
      }
    });
  }


  cities1: SelectItem[];


  cities2: SelectItem[];

  selectedCities1: City[];

  selectedCities2: City[];





}
