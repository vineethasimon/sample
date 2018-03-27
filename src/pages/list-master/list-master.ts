import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { IonicPage, ModalController, NavController,ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';  

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];
  public baseImage: string;

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController,public camera: Camera,public http: HttpClient,public toastCtrl: ToastController) {
    this.currentItems = this.items.query();
  }
  
  
   
  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }
    
    
  clickImage(){
  
      
      
      
// ss this.srcImage = '../../assets/imgs/demo.png'
    Camera.getPicture({
      quality: 100,
      destinationType: 0, // DATA_URL
      sourceType: 1,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: Camera.EncodingType.PNG,
      mediaType: Camera.MediaType.PICTURE
    }).then((imageData) => {
      /*console.log(imageData);
      this.srcImage = `data:image/png;base64,${imageData}`;
      setTimeout(() => {
        (<any>window).OCRAD(document.getElementById('image'), text => {
          alert(text);
        });
      }, 1000);*/
//      let loading = this.loading.create({
//        content: 'Please wait...'
//      });
//    
//      loading.present();
  
      const body = {
        "requests": [
          {
            "image": {
              "content": imageData
            },
            "features": [
              {
                "type": "TEXT_DETECTION"
              }
            ]
          }
        ]
      }
      this.http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDAi4IYxh4mSTyCJhkg5Opz7ZW2OBLyovI",body)
      .subscribe(data=>{
        console.log(data.json().response);
        this.str=data.json().responses["0"].fullTextAnnotation.text.replace(/\r?\n|\r/g,"");
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Scanned Data',
          message: 'Please confirm scanned data',
          inputs: [
            {
              name: 'title',
              placeholder: 'Title',
              value:data.json().responses["0"].fullTextAnnotation.text.replace(/\r?\n|\r/g,"")
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Save',
              handler: (value) => {
                console.log('Saved clicked'+value.title);
              }
            }
          ]
        });
        
        alert.present();
//        this.onInput();
      });
    }, (err) => {
      console.log(`ERROR -> ${JSON.stringify(err)}`);
    });

  
         
  
  }
  
//  googleVision(){
//  const data=
//  {
//  "requests":[h
//    {
//      "image":{
//        "content":baseImage
//      },
//      "features":[
//        {
//          "type":"LABEL_DETECTION",
//          "maxResults":1
//        }
//      ]
//    }
//  ]
//};
//  
//     return new Promise((resolve, reject) => {
//      this.http.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDAi4IYxh4mSTyCJhkg5Opz7ZW2OBLyovI', JSON.stringify(data))
//      .subscribe(res => {
//        resolve(res);
//        
//            let toast = this.toastCtrl.create({
//            message:"sucess"+res,
//            duration: 3000,
//            position: 'top'
//            });
//            toast.present();
//            
//       
//      }, (err) => {
//        reject(err);
//        
//        let toast = this.toastCtrl.create({
//            message:"failure"+res,
//            duration: 3000,
//            position: 'top'
//            });
//            toast.present();
//      });
//  });
//  
//  
//  
//  }




  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}



\\\\

import { Component } from '@angular/core';
import { NavController, AlertController ,LoadingController} from 'ionic-angular';
import { BarcodeScanner} from 'ionic-native';
import { Camera } from 'ionic-native';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map'
import { SpeechRecognition } from '@ionic-native/speech-recognition';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  text:String[];
  srcImage: string;
  product: any[];
  array:any[];  
  str:String="";
  constructor(public navCtrl: NavController, public http: Http, public alertCtrl: AlertController,private speechRecognition: SpeechRecognition, public loading:LoadingController) { 
    http.get('assets/json/response.json').map(res => res.json()).subscribe(data => {
      
          this.product = data.map(data=>data);
          this.array = data.map(data=>data);
        })
  }
   onInput(){

    // if(i.data!=null){
    //   this.str=this.str.concat(i.data)
    // }
    // else if(i.data==null){
    //   this.str=this.str.slice(0,-1)
    // }
  //  console.log(this.str)
   this.product=this.array.filter((event)=>{
      if((event.product_name.toLowerCase().indexOf(this.str.toLowerCase()) > -1)||event.product_id.indexOf(this.str)>-1){
        return true;
      }
      return false; 
    })
  }
  async onClear(){
    this.str="";
    this.onInput();
  }

  clickForBarcode() {
    BarcodeScanner.scan()
      .then((result) => {
        this.str=result.text;
        alert(
          "We got a barcode\n" +
          "Result: " + result.text + "\n" +
          "Format: " + result.format + "\n" +
          "Cancelled: " + result.cancelled
        )
        this.onInput();
       
      })
      .catch((error) => {
        alert(error);
      })
  }
  clickForOCR() {
    this.srcImage = '../../assets/imgs/demo.png'
    Camera.getPicture({
      quality: 100,
      destinationType: 0, // DATA_URL
      sourceType: 1,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: Camera.EncodingType.PNG,
      mediaType: Camera.MediaType.PICTURE
    }).then((imageData) => {
      /*console.log(imageData);
      this.srcImage = `data:image/png;base64,${imageData}`;
      setTimeout(() => {
        (<any>window).OCRAD(document.getElementById('image'), text => {
          alert(text);
        });
      }, 1000);*/
        
         let alert1 = this.alertCtrl.create({
          title: 'Scan Image as:',
//          message: 'Please confirm scanned data',
//          inputs: [
//            {
//              name: 'title',
//              placeholder: 'Title',
//              value:data.json().responses["0"].fullTextAnnotation.text.replace(/\r?\n|\r/g,"")
//            },
//          ],
          buttons: [
            {
              text: 'OCR',
              handler: (value) => {
//                console.log('Cancel clicked');
                  
                   let loading = this.loading.create({
                    content: 'Please wait...'
                  });

                  loading.present();

                  const bodyTxt ={
                    "requests": [
                      {
                        "image": {
                          "content": imageData
                        },
                        "features": [
                          {
                            "type": "TEXT_DETECTION"
                          }
                        ]
                      }
                    ]
                  }
                  
                  
                  this.http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDAi4IYxh4mSTyCJhkg5Opz7ZW2OBLyovI",bodyTxt)
                  .subscribe(data=>{
                    console.log("++++"+data.json().response);
                    this.str=data.json().responses["0"].fullTextAnnotation.text.replace(/\r?\n|\r/g,"");
                    loading.dismiss();
                    let alert = this.alertCtrl.create({
                      title: 'Scanned Data',
                      message: 'Please confirm scanned data',
                      inputs: [
                        {
                          name: 'title',
                          placeholder: 'Title',
                          value:data.json().responses["0"].fullTextAnnotation.text.replace(/\r?\n|\r/g,"")
                        },
                      ],
                      buttons: [
                        {
                          text: 'Cancel',
                          handler: () => {
                            console.log('Cancel clicked');
                          }
                        },
                        {
                          text: 'Save',
                          handler: (value) => {
                            console.log('Saved clicked'+value.title);
                          }
                        }
                      ]
                    });

                    alert.present();
                    this.onInput();
                  });

                                 
              } 
            },
            {
              text: 'Object Image',
              handler: (value) => {

                  
                        let loading = this.loading.create({
                        content: 'Please wait...'
                      });

                      loading.present();

                      const body = {
                        "requests": [
                          {
                            "image": {
                              "content": imageData
                            },
                            "features": [
                              {
                                "type": "LABEL_DETECTION",
                                "maxResults":1
                              }
                            ]
                          }
                        ]
                      }
                  
                  
                  this.http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDAi4IYxh4mSTyCJhkg5Opz7ZW2OBLyovI",body)
                  .subscribe(data=>{
                    console.log(data.json().response);
                    this.str=data.json().responses["0"].labelAnnotations["0"].description;
                    loading.dismiss();
                    let alert = this.alertCtrl.create({
                      title: 'Scanned Data',
                      message: 'Please confirm scanned data',
                      inputs: [
                        {
                          name: 'title',
                          placeholder: 'Title',
                          value: data.json().responses["0"].labelAnnotations["0"].description
                        },
                      ],
                      buttons: [
                        {
                          text: 'Cancel',
                          handler: () => {
                            console.log('Cancel clicked');
                          }
                        },
                        {
                          text: 'Save',
                          handler: (value) => {
                            console.log('Saved clicked'+value.title);
                          }
                        }
                      ]
                    });

                    alert.present();
                    this.onInput();
                  });

              }
            }
          ]
        });
        alert1.present();
        
        
//      let loading = this.loading.create({
//        content: 'Please wait...'
//      });
//    
//      loading.present();
//  
//      const body = {
//        "requests": [
//          {
//            "image": {
//              "content": imageData
//            },
//            "features": [
//              {
//                "type": "TEXT_DETECTION"
//              }
//            ]
//          }
//        ]
//      }
//      this.http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDAi4IYxh4mSTyCJhkg5Opz7ZW2OBLyovI",body)
//      .subscribe(data=>{
//        console.log(data.json().response);
//        this.str=data.json().responses["0"].fullTextAnnotation.text.replace(/\r?\n|\r/g,"");
//        loading.dismiss();
//        let alert = this.alertCtrl.create({
//          title: 'Scanned Data',
//          message: 'Please confirm scanned data',
//          inputs: [
//            {
//              name: 'title',
//              placeholder: 'Title',
//              value:data.json().responses["0"].fullTextAnnotation.text.replace(/\r?\n|\r/g,"")
//            },
//          ],
//          buttons: [
//            {
//              text: 'Cancel',
//              handler: () => {
//                console.log('Cancel clicked');
//              }
//            },
//            {
//              text: 'Save',
//              handler: (value) => {
//                console.log('Saved clicked'+value.title);
//              }
//            }
//          ]
//        });
//        
//        alert.present();
//        this.onInput();
//      });
    }, (err) => {
      console.log(`ERROR -> ${JSON.stringify(err)}`);
    });
  }
  clickForSpeech(){
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => console.log(hasPermission));
     this.speechRecognition.startListening().subscribe(data=>{
      this.text=data;
      alert(this.text)
      this.str=this.text[0].replace(/ /g,"")
      this.onInput();
      setTimeout(() => {
        this.speechRecognition.stopListening();
      }, 10);
     }
      );
     
   }

}

