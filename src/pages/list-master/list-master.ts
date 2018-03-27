import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
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

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController,private camera: Camera,public http: HttpClient,public toastCtrl: ToastController) {
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
  
  
          const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
          };
  
          this.camera.getPicture(options).then((imageData) => {
         // imageData is either a base64 encoded string or a file URI
         // If it's base64:
         this.baseImage = 'data:image/jpeg;base64,' + imageData;
//         return this.baseImage; 
//         let toast = this.toastCtrl.create({
//            message:"image",
//            duration: 9000,
//            position: 'top'
//            });
//            toast.present();
        }, (err) => {
         // Handle error
        
        });
//                                               
//this.googleVision();
  
  }
  
//  googleVision(){
//  const data=
//  {
//  "requests":[
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
