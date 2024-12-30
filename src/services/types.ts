export type CategoryListType = {
  description: string;
  id: number;
  image: string;
  title: string;
};

export type CategoryUpdateType = {
  description: string;
  image?: File | undefined;
  id?: number | undefined;
  title: string;
};

export type ServicesType = {
  categoryID?: number;
  description: string;
  duration: number;
  id: number;
  price: number;
  title: string;
  isActive: boolean;
};

export type CreateServiceType = {
  title: string;
  description: string;
  duration: number;
  price: number;
  categoryID: number | undefined;
  isActive: boolean;
};
