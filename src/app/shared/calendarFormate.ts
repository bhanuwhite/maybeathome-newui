import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { language } from '../base-module/constants/lang-constant';
let lang: any = localStorage.getItem("loginUser")
if (lang != null) {
  lang = JSON.parse(lang);
  lang = language[lang.data[0].country_code.toLowerCase()]
  lang = lang.split(".")[0];
}
else lang = "fr";
@Injectable()

export class CustomDateFormatter extends CalendarDateFormatter {

  public monthViewColumnHeader({ date }: DateFormatterParams): string {
    return formatDate(date, 'EEE', lang);
  }

  public weekViewColumnHeader({ date }: DateFormatterParams): string {
    return formatDate(date, 'EEE', lang);
  }

  public dayViewHour({ date }: DateFormatterParams): string {
    return formatDate(date, 'HH:mm', lang);
  }
}
