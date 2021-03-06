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

  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{11}$";
  Wday: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  disabledDays = [0];
  hasSlots: boolean  = false;
  availableSlots = [];
  orderServiceVos1: string[] = [];
  selectedValue = '';

  services: SelectItem[];
  userList: any = [];
  minimumDate = new Date();
  serviceList = [];
  activebtn;
  slotList:any = [];

  constructor(private httpService: HttpService, private toastr: ToastrService, private dataService: DataService) {
   
  }


  ngOnInit() {
    this.getServiceList();
    // this.httpService.getUser().subscribe(data => {
    //   this.userList = data['adminList'];
    // });

    // this.services = this.httpService.getMockData().services;
    // this.userList = this.httpService.getMockData().barbers;


  }

  getServiceList(){
    this.httpService.getServices().subscribe((data: SelectItem[]) => {
      this.services = data;
    });
  }

  resetForm() {
    this.orderServiceVos1 = [];
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
    this.getServiceList();
    this.slotList=[];
    this.hasSlots = false;
    this.activebtn=-1;
  }
  resetService() {
    this.availableSlots = [];
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // (<any>$(this.drpDown.nativeElement)).niceSelect();
  }

  getSelectedSlot(slot){
    this.booking['slotId'] = slot.id;
    this.activebtn = !this.activebtn;
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
    console.log(event);
    let list = Array();
    for(let service of event.value){    
      list.push({serviceId: service.serviceId})
      this.serviceList = list;
    }
    console.log(this.serviceList);
    // this.httpService.getUserDetails({serviceLists :this.serviceList}).subscribe(data => {
    //   this.userList = data;
    // });


 if (typeof this.booking.appointmentTime === 'string')
      this.booking.appointmentTime = new Date(this.booking.appointmentTime);
      this.booking['day'] = this.Wday[this.booking.appointmentTime.getDay()];
      this.booking.appointmentTime =
      this.booking.appointmentTime.getFullYear() + "-" +
      ("0" + (this.booking.appointmentTime.getMonth() + 1)).slice(-2) + "-" +
      ("0" + this.booking.appointmentTime.getDate()).slice(-2);

    this.httpService.getAvaliableEmployees(this.booking).subscribe(data => {
      this.userList = data;
    });

    //getAvaliableEmployees
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

  getAvailableSlots()
  {
    if (typeof this.booking.appointmentTime === 'string')
      this.booking.appointmentTime = new Date(this.booking.appointmentTime);
      this.booking['day'] = this.Wday[this.booking.appointmentTime.getDay()];
      this.booking.appointmentTime =
      this.booking.appointmentTime.getFullYear() + "-" +
      ("0" + (this.booking.appointmentTime.getMonth() + 1)).slice(-2) + "-" +
      ("0" + this.booking.appointmentTime.getDate()).slice(-2);

  this.httpService.getAvailableSlots(this.booking).subscribe(data => {
     this.slotList= data;
     this.hasSlots = true;
     if(this.slotList.length===0)
    {
      alert("There is no slots available for this stylisher");
      this.resetForm();
    }
    });

  }

  submitForm() {
    this.booking['orderServiceVos'] = this.serviceList;

    // this.booking.appointmentTime = '' + this.booking.appointmentTime;
    if (typeof this.booking.appointmentTime === 'string')
      this.booking.appointmentTime = new Date(this.booking.appointmentTime);

      this.booking['day'] = this.Wday[this.booking.appointmentTime.getDay()];
    // var m = new Date(this.booking.appointmentTime);
    this.booking.appointmentTime =
      this.booking.appointmentTime.getFullYear() + "-" +
      ("0" + (this.booking.appointmentTime.getMonth() + 1)).slice(-2) + "-" +
      ("0" + this.booking.appointmentTime.getDate()).slice(-2);
      // ("0" + this.booking.appointmentTime.getHours()).slice(-2) + ":" +
      // ("0" + this.booking.appointmentTime.getMinutes()).slice(-2) + ":" +
      // ("0" + this.booking.appointmentTime.getSeconds()).slice(-2);
      
   if(this.hasSlots && this.booking['slotId'] )
   {
    this.httpService.saveBooking(this.booking).subscribe(data => {
      if (!data['availableSlotsList'] || (data['availableSlotsList'] && data['availableSlotsList'].length <= 0)) {
        $.magnificPopup.close();
        this.toastr.success('Appointment has been confirmed.');
      } else {
        this.availableSlots = data['availableSlotsList'];
      }
      this.resetForm();
    });
   }else{
    this.toastr.error("Please select your slot time");
   }
  }


  cities1: SelectItem[];


  cities2: SelectItem[];

  selectedCities1: City[];

  selectedCities2: City[];





}
