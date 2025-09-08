import { paginationHelpers } from '@/app/helper/paginationHelper';
import { IPaginationOptions } from '@/app/interface/iPaginationOptions';
import { WarehouseSearchAbleFields } from '@/app/modules/Warehouse/warehouse.constant';
import { IWarehouseFilterRequest } from '@/app/modules/Warehouse/warehouse.interface';
import prisma from '@/app/shared/prisma';
import { Prisma, Warehouse } from '@prisma/client';

const createAWarehouse = async (
  req: Record<string, any>,
): Promise<Warehouse> => {
  const { name, location } = req.body;

  const result = await prisma.warehouse.create({
    data: {
      name,
      location,
    },
  });

  return result;
};

const getFilteredWarehouse = async (
  filters: IWarehouseFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: WarehouseSearchAbleFields.map(field => ({
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

  const whereConditons: Prisma.WarehouseWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.warehouse.findMany({
    where: whereConditons,
    skip,
    take: limit,
    include: {
      stockLedgers: {
        include: {
          product: true,
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

  const total = await prisma.warehouse.count({
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

const getAWarehouse = async (warehouseId: string) => {
  const warehouse = await prisma.warehouse.findUniqueOrThrow({
    where: {
      id: parseInt(warehouseId),
    },
    include: {
      stockLedgers: {
        include: {
          product: true,
        },
      },
    },
  });

  return warehouse;
};

const updateAWarehouse = async (
  warehouseId: string,
  data: Partial<Warehouse>,
): Promise<Warehouse> => {
  await prisma.warehouse.findFirstOrThrow({
    where: {
      id: parseInt(warehouseId),
    },
  });

  const result = await prisma.warehouse.update({
    where: {
      id: parseInt(warehouseId),
    },
    data,
    include: {
      stockLedgers: {
        include: {
          product: true,
        },
      },
    },
  });

  return result;
};

const deleteAWarehouse = async (warehouseId: string): Promise<Warehouse> => {
  await prisma.warehouse.findFirstOrThrow({
    where: {
      id: parseInt(warehouseId),
    },
  });

  const result = await prisma.warehouse.delete({
    where: {
      id: parseInt(warehouseId),
    },
  });

  return result;
};

export const WarehouseServices = {
  createAWarehouse,
  getFilteredWarehouse,
  getAWarehouse,
  updateAWarehouse,
  deleteAWarehouse,
};
