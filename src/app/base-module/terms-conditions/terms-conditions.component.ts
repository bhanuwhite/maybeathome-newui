import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit {
  disableMandateBtn: boolean;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  askForPDF(): void {
    this.http.get(environment.LandingURl + '/assets/pdf/CGU_MAY_BE_AT_HOME_V4.4.pdf', { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          var base64data = reader.result;
        }
        reader.readAsDataURL(res);
        this.show(res)
      }
    );
  }
  show(blob) {
    var fileURL: any = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = fileURL;
    a.target = '_blank';
    a.download = "Terms&Conditions.pdf";
    a.click();
  }
}
