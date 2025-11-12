// src/common/base.service.ts
import { Model, Document } from 'mongoose';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MESSAGES } from 'src/utils/const';

export class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return 'Unknown error';
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const newItem = await this.model.create(data);
      return newItem;
    } catch (error: unknown) {
      console.error('Error creating item:', this.getErrorMessage(error));
      throw new InternalServerErrorException(MESSAGES.SERVER_ERROR);
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const items = await this.model.find().exec();
      if (!items || items.length === 0) {
        throw new NotFoundException(MESSAGES.NOT_FOUND);
      }
      return items;
    } catch (error: unknown) {
      console.error('Error fetching all items:', this.getErrorMessage(error));
      throw error;
    }
  }

  async findById(id: string): Promise<T> {
    try {
      const item = await this.model.findById(id).exec();
      if (!item) {
        throw new NotFoundException(MESSAGES.NOT_FOUND);
      }
      return item;
    } catch (error: unknown) {
      console.error('Error fetching item by ID:', this.getErrorMessage(error));
      throw error;
    }
  }

  async updateById(id: string, updateData: Partial<T>): Promise<T> {
    try {
      const updatedItem = await this.model
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
      if (!updatedItem) {
        throw new NotFoundException(MESSAGES.NOT_FOUND);
      }
      return updatedItem;
    } catch (error: unknown) {
      console.error('Error updating item:', this.getErrorMessage(error));
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      const deleted = await this.model.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new NotFoundException(MESSAGES.NOT_FOUND);
      }
    } catch (error: unknown) {
      console.error('Error deleting item:', this.getErrorMessage(error));
      throw error;
    }
  }
}
