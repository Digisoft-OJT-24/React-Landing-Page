export type Province = {
  id: string;
  name: string;
};

export type School = {
  id: string;
  name: string;
  provinceId: string;
};

export type Product = {
  id: number;
  code: string;
  title: string;
  short: string;
  description: string;
};

export type ChangeLog = {
  id: number;
  appName: string;
  description: string;
  version: string;
  revision: string;
  date: string;
};

export type ProductBrochure = {
  id: number;
  productCode: string;
  title: string;
  link: string;
};

export type ProductVersion = {
  id: number;
  productCode: string;
  version: string;
  link: string;
  note: string;
  createdAt: string;
};

export type GetAllProductsData = {
  getProducts: Product[];
};
