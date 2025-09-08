import AppError from '@/app/errors/AppError';
import { paginationHelpers } from '@/app/helper/paginationHelper';
import { IPaginationOptions } from '@/app/interface/iPaginationOptions';
import { ProductSearchAbleFields } from '@/app/modules/Product/product.constant';
import { IProductFilterRequest } from '@/app/modules/Product/product.interface';
import prisma from '@/app/shared/prisma';
import { Prisma, Product } from '@prisma/client';
import httpStatus from 'http-status';

const createAProduct = async (req: Record<string, any>): Promise<Product> => {
  const { name, sku } = req.body;

  // Check if SKU already exists
  const existingProduct = await prisma.product.findUnique({
    where: { sku },
  });

  if (existingProduct) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Product with this SKU already exists',
    );
  }

  const result = await prisma.product.create({
    data: {
      name,
      sku,
    },
  });

  return result;
};

const getFilteredProduct = async (
  filters: IProductFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ProductSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData)
        .map(key => {
          const value = (filterData as any)[key];

          if (value === undefined || value === '') {
            return {};
          }

          return {
            [key]: {
              contains: value,
              mode: 'insensitive',
            },
          };
        })
        .filter(condition => Object.keys(condition).length > 0),
    });
  }

  const whereConditons: Prisma.ProductWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.product.findMany({
    where: whereConditons,
    skip,
    take: limit,
    include: {
      stockLedgers: {
        include: {
          warehouse: true,
        },
      },
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : [{ createdAt: 'desc' }],
  });

  const total = await prisma.product.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAProduct = async (productId: string) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: parseInt(productId),
    },
    include: {
      stockLedgers: {
        include: {
          warehouse: true,
        },
      },
    },
  });

  return product;
};

const updateAProduct = async (
  productId: string,
  data: Partial<Product>,
): Promise<Product> => {
  await prisma.product.findFirstOrThrow({
    where: {
      id: parseInt(productId),
    },
  });

  // If SKU is being updated, check if the new SKU already exists
  if (data.sku) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku: data.sku,
        id: { not: parseInt(productId) },
      },
    });

    if (existingProduct) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Product with this SKU already exists',
      );
    }
  }

  const result = await prisma.product.update({
    where: {
      id: parseInt(productId),
    },
    data,
    include: {
      stockLedgers: {
        include: {
          warehouse: true,
        },
      },
    },
  });

  return result;
};

const deleteAProduct = async (productId: string): Promise<Product> => {
  await prisma.product.findFirstOrThrow({
    where: {
      id: parseInt(productId),
    },
  });

  const result = await prisma.product.delete({
    where: {
      id: parseInt(productId),
    },
  });

  return result;
};

export const ProductServices = {
  createAProduct,
  getFilteredProduct,
  getAProduct,
  updateAProduct,
  deleteAProduct,
};
