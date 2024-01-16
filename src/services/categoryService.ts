import { Category } from '../models/category';

export const getAllCategories = async () => {
  try {
    const categories = await Category.findAll();
    return categories;
  } catch (error) {
    throw new Error(error as string);
  }
};
