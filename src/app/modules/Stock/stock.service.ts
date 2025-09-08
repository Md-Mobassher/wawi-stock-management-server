import AppError from '@/app/errors/AppError';
import { paginationHelpers } from '@/app/helper/paginationHelper';
import { IPaginationOptions } from '@/app/interface/iPaginationOptions';
import {
  StockEnumFields,
  StockSearchAbleFields,
} from '@/app/modules/Stock/stock.constant';
import {
  IStockFilterRequest,
  IStockInRequest,
  IStockOutRequest,
  IStockSummaryRequest,
  IStockTransferRequest,
} from '@/app/modules/Stock/stock.interface';
import prisma from '@/app/shared/prisma';
import { LedgerOperation, Prisma, StockLedger } from '@prisma/client';
import httpStatus from 'http-status';

const stockIn = async (req: IStockInRequest): Promise<StockLedger> => {
  const { productId, warehouseId, quantity, operationKey } = req;

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Check if warehouse exists
  const warehouse = await prisma.warehouse.findUnique({
    where: { id: warehouseId },
  });

  if (!warehouse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Warehouse not found');
  }

  // Check if operation key already exists
  const existingOperation = await prisma.stockLedger.findUnique({
    where: { operationKey },
  });

  if (existingOperation) {
    throw new AppError(httpStatus.CONFLICT, 'Operation key already exists');
  }

  const result = await prisma.stockLedger.create({
    data: {
      productId,
      warehouseId,
      quantity,
      operationKey,
      operation: LedgerOperation.IN,
    },
    include: {
      product: true,
      warehouse: true,
    },
  });

  return result;
};

const stockOut = async (req: IStockOutRequest): Promise<StockLedger> => {
  const { productId, warehouseId, quantity, operationKey } = req;

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Check if warehouse exists
  const warehouse = await prisma.warehouse.findUnique({
    where: { id: warehouseId },
  });

  if (!warehouse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Warehouse not found');
  }

  // Check if operation key already exists
  const existingOperation = await prisma.stockLedger.findUnique({
    where: { operationKey },
  });

  if (existingOperation) {
    throw new AppError(httpStatus.CONFLICT, 'Operation key already exists');
  }

  // Check current stock level
  const currentStock = await getCurrentStock(productId, warehouseId);
  if (currentStock < quantity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Insufficient stock. Available: ${currentStock}, Requested: ${quantity}`,
    );
  }

  const result = await prisma.stockLedger.create({
    data: {
      productId,
      warehouseId,
      quantity: -quantity, // Negative for stock out
      operationKey,
      operation: LedgerOperation.OUT,
    },
    include: {
      product: true,
      warehouse: true,
    },
  });

  return result;
};

const stockTransfer = async (
  req: IStockTransferRequest,
): Promise<StockLedger[]> => {
  const { productId, fromWarehouseId, toWarehouseId, quantity, operationKey } =
    req;

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Check if warehouses exist
  const fromWarehouse = await prisma.warehouse.findUnique({
    where: { id: fromWarehouseId },
  });

  if (!fromWarehouse) {
    throw new AppError(httpStatus.NOT_FOUND, 'From warehouse not found');
  }

  const toWarehouse = await prisma.warehouse.findUnique({
    where: { id: toWarehouseId },
  });

  if (!toWarehouse) {
    throw new AppError(httpStatus.NOT_FOUND, 'To warehouse not found');
  }

  // Check if operation key already exists
  const existingOperation = await prisma.stockLedger.findUnique({
    where: { operationKey },
  });

  if (existingOperation) {
    throw new AppError(httpStatus.CONFLICT, 'Operation key already exists');
  }

  // Check current stock level in source warehouse
  const currentStock = await getCurrentStock(productId, fromWarehouseId);
  if (currentStock < quantity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Insufficient stock in source warehouse. Available: ${currentStock}, Requested: ${quantity}`,
    );
  }

  // Create transfer operation (two ledger entries)
  const results = await prisma.$transaction([
    // Stock out from source warehouse
    prisma.stockLedger.create({
      data: {
        productId,
        warehouseId: fromWarehouseId,
        quantity: -quantity,
        operationKey: `${operationKey}_OUT`,
        operation: LedgerOperation.TRANSFER,
      },
      include: {
        product: true,
        warehouse: true,
      },
    }),
    // Stock in to destination warehouse
    prisma.stockLedger.create({
      data: {
        productId,
        warehouseId: toWarehouseId,
        quantity: quantity,
        operationKey: `${operationKey}_IN`,
        operation: LedgerOperation.TRANSFER,
      },
      include: {
        product: true,
        warehouse: true,
      },
    }),
  ]);

  return results;
};

const getStockSummary = async (req: IStockSummaryRequest) => {
  const { productId, warehouseId } = req;

  let whereCondition: Prisma.StockLedgerWhereInput = {};

  if (productId) {
    whereCondition.productId = productId;
  }

  if (warehouseId) {
    whereCondition.warehouseId = warehouseId;
  }

  // Get all stock movements
  const stockMovements = await prisma.stockLedger.findMany({
    where: whereCondition,
    include: {
      product: true,
      warehouse: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate current stock levels
  const stockLevels = await prisma.stockLedger.groupBy({
    by: ['productId', 'warehouseId'],
    where: whereCondition,
    _sum: {
      quantity: true,
    },
  });

  // Get product and warehouse details for stock levels
  const stockLevelsWithDetails = await Promise.all(
    stockLevels.map(async level => {
      const product = await prisma.product.findUnique({
        where: { id: level.productId },
      });
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: level.warehouseId },
      });

      return {
        product,
        warehouse,
        currentStock: level._sum.quantity || 0,
      };
    }),
  );

  return {
    stockMovements,
    stockLevels: stockLevelsWithDetails,
  };
};

const getFilteredStock = async (
  filters: IStockFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: StockSearchAbleFields.map(field => ({
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

          if (StockEnumFields.includes(key)) {
            return {
              [key]: {
                equals: value,
              },
            };
          }

          if (key === 'productId' || key === 'warehouseId') {
            return {
              [key]: {
                equals: parseInt(value),
              },
            };
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

  const whereConditons: Prisma.StockLedgerWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.stockLedger.findMany({
    where: whereConditons,
    skip,
    take: limit,
    include: {
      product: true,
      warehouse: true,
    },
    orderBy: [{ createdAt: 'desc' }],
  });

  const total = await prisma.stockLedger.count({
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

// Helper function to get current stock level
const getCurrentStock = async (
  productId: number,
  warehouseId: number,
): Promise<number> => {
  const result = await prisma.stockLedger.aggregate({
    where: {
      productId,
      warehouseId,
    },
    _sum: {
      quantity: true,
    },
  });

  return result._sum.quantity || 0;
};

export const StockServices = {
  stockIn,
  stockOut,
  stockTransfer,
  getStockSummary,
  getFilteredStock,
};
