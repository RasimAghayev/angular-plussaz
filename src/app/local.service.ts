import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  removeItem(arg0: string) {
    throw new Error('Method not implemented.');
  }

  key = "StronglyPassword";

  constructor() { }

  public saveData(enc: boolean,key: string, value: string) {
    localStorage.setItem(key, enc?this.encrypt(value):value);
  }

  public getData(enc: boolean,key: string) {
    let data = localStorage.getItem(key)|| "";
    return enc?this.decrypt(data):data;
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }
}
