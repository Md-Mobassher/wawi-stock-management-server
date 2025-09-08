import catchAsync from '@/app/shared/catchAsync';
import pick from '@/app/shared/pick';
import sendResponse from '@/app/shared/sendResponse';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ProductFilterableFields } from './product.constant';
import { ProductServices } from './product.service';

const createAProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.createAProduct(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Product created successfully',
    data: result,
  });
});

const getFilteredProduct = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ProductFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ProductServices.getFilteredProduct(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.getAProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateAProduct = catchAsync(async (req: Request, res: Response) => {
  const { id: productId } = req.params;

  const result = await ProductServices.updateAProduct(productId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteAProduct = catchAsync(async (req: Request, res: Response) => {
  const { id: productId } = req.params;

  const result = await ProductServices.deleteAProduct(productId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product deleted successfully',
      data: null,
    });
  }
});

export const ProductControllers = {
  createAProduct,
  getFilteredProduct,
  getAProduct,
  updateAProduct,
  deleteAProduct,
};
