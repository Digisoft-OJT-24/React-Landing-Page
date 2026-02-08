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
  code: string;
  title: string;
  short: string;
  description: string;
};

export type ChangeLog = {
  appName: string;
  description: string;
  version: string;
  revision: string;
};

export type ProductBrochure = {
  productCode: string;
  title: string;
  link: string;
};

export type ProductVersion = {
  id: string;
  productCode: string;
  version: string;
  link: string;
  notes: string;
  createdAt: string;
};

export type GetAllProductsData = {
  getProducts: Product[];
};
