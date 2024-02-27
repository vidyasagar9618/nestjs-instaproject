import {Document} from 'mongoose';


export interface User extends Document{
name:String,
  uuid:String,
  email:String,
  picture:String ,
}