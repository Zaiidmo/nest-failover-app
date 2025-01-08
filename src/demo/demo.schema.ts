import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop()
  dbInstance: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
