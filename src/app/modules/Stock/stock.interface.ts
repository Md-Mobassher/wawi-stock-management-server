import { LedgerOperation } from '@prisma/client';

export type IStockFilterRequest = {
  searchTerm?: string | undefined;
  productId?: string | undefined;
  warehouseId?: string | undefined;
  operation?: LedgerOperation | undefined;
};

export type IStockInRequest = {
  productId: number;
  warehouseId: number;
  quantity: number;
  operationKey: string;
};

export type IStockOutRequest = {
  productId: number;
  warehouseId: number;
  quantity: number;
  operationKey: string;
};

export type IStockTransferRequest = {
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
  operationKey: string;
};

export type IStockSummaryRequest = {
  productId?: number;
  warehouseId?: number;
};
