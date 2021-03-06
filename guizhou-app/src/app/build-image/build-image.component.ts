import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { environment } from "../../environments/environment";
import { FieldConfig } from '../dynamic-form/models/field-config.interface';
import { DynamicFormComponent } from '../dynamic-form/containers/dynamic-form/dynamic-form.component';
import { HttpClient } from "@angular/common/http";
import { HttpParams } from "@angular/common/http";
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import * as _ from 'lodash';

@Component({
  selector: 'app-build-image',
  templateUrl: './build-image.component.html',
  styleUrls: ['./build-image.component.scss']
})
export class BuildImageComponent implements OnInit {

  // 这里后端api有一个Module，是存放文件的目录，比如应用，那么就是app，服务，涉及到文件上传时，就是service，镜像，就是image
  // 这里前端定义好，后面有Get请求，需要用到这个module的话，可以参照
  public url: string = environment.api + '/api/2/upload/image/fileName/';
  // 这里的itemAlias是设置的name ="newname"，本来是name="file"，相当于form的name值
  // public uploader: FileUploader = new FileUploader({ url: this.url, itemAlias: 'newname' });
  public uploader: FileUploader = new FileUploader({ url: this.url });
  _dataSet = this.uploader.queue;

  radioValue: string = 'newImage';
  images: string[] = [];
  imageOriginId: string;
  // imageIdArr: object[] = [];
  // repositories: string[] = [];

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  formConfig: FieldConfig[] = [
    {
      type: 'input',
      label: '镜像名称',
      name: 'imageName',
      placeholder: '请输入镜像名称',
      validation: [Validators.required],
      styles: {
        'width': '400px'
      }
    },
    {
      type: 'input',
      label: '镜像版本',
      name: 'version',
      placeholder: '请输入镜像版本',
      validation: [Validators.required],
      styles: {
        'width': '400px'
      }
    },
    {
      label: '发布',
      name: 'submit',
      type: 'button',
      buttonType: 'primary',
      styles: {
        'margin-left': '20%'
      },
      divStyles: {
        'width': '80%',
        'border-top': '1px solid #ddd',
        'padding-top': '20px'
      }
    },
  ];

  constructor(private http: HttpClient, private confirmServ: NzModalService) { }

  ngOnInit() {
    this.getImageOrigin();
    this.getImages();
  }

  FileSelected(uploaderType: any) {
    if (uploaderType === 'image') {
      console.log('文件上传完了', this.uploader);
      this.uploader.onBeforeUploadItem = (item) => {
        item.withCredentials = false;
        item.url = this.url + item.file.name;
      }
    } else {
      // console.log('Icon文件上传完了', this.uploaderIcon);
      // this.uploaderIcon.onBeforeUploadItem = (item) => {
      //   item.withCredentials = false;
      //   item.url = this.urlIcon + item.file.name;
      // }
    }
  }

  toggleRadio() {
    console.log(this.radioValue)
    if (this.radioValue === 'newImage') {
      this.formConfig[0] = {
        type: 'input',
        label: '镜像名称',
        name: 'imageName',
        placeholder: '请输入镜像名称',
        validation: [Validators.required],
        styles: {
          'width': '400px'
        }
      };
      // console.log('form333', this.form);
    } else {
      this.formConfig[0] = {
        type: 'select',
        label: '镜像名称',
        name: 'imageName',
        options: this.images,
        placeholder: '请选择镜像',
        styles: {
          'width': '400px'
        }
      };
      // console.log('form333', this.form);
    }
    this.form.setValue('imageName', this.formConfig[0]);
    console.log(this.formConfig);
  }

  async submit(value: { [name: string]: any }) {
    await this.loadImage(value);
    console.log('镜像上传');
  }

  async loadImage(formValue) {
    const fileArr = _.map(this._dataSet, (value, key) => {
      if (value['isSuccess'] === true) {
        return value['file']['name'];
      }
    })
    console.log('formValue', formValue);
    return new Promise((resolve, reject) => {
      // 这里箭头函数，解决闭包之后This指向windows的问题
      setTimeout(() => {
        console.log('测试promise', this);
        _.map(_.compact(fileArr), (value, key) => {
          const repositoryName = this.radioValue === 'newImage' ? formValue.imageName + '-' + 
          _.replace(value, '.', '') : formValue.imageName
          this.http.post(environment.api + '/api/2/warehouse/repository?module=image', {
            // "description": formValue.description,
            "fileName": value,
            "isApp": false,
            "registryId": this.imageOriginId,
            "repositoryName": repositoryName,
            "version": formValue.version
          }).subscribe(response => {
            console.log('这是response', response);
            this.confirmServ.success({
              maskClosable: false,
              title: '上传镜像成功!',
              content: '点确认按钮跳转到镜像商城',
              okText: '确定',
              onOk() {
                // .contentControl = true;
                // console.log('form11', thisParent.form);
                // const redirect = window.location.host + '/#/appStore';
                window.location.href = window.location.origin + '/#/repositoryStore';
              },
              onCancel() {
              }
            });
            // this.imageIdArr[key] = response;
            // this.repositories[key] = this.imageIdArr[key]['id'];
            resolve();
          });
        });
        // resolve();
      }, 0);
    });
  }

  getImageOrigin() {
    this.http.get(environment.api + '/api/2/warehouse/registry').subscribe(data => {
      const dataValue = data;
      this.imageOriginId = dataValue['id'];
      // this.imageOriginId = dataValue.id;
    })
  }

  getImages() {
    this.http.get(environment.api + '/api/2/warehouse/repository').subscribe(data => {
      this.images = _.map(data['images'], (value, key) => {
        return value['repositoryName'];
      })
    })
  }

}
