export type CategoryListType = {
  description: string;
  id: number;
  image: string;
  title: string;
  order: number;
};

export type CategoryEditType = {
  description: string;
  image?: File | undefined;
  id?: number | undefined;
  title: string;
  order?: number;
  staff: number[];
};

export type ServicesType = {
  categoryID?: number;
  description: string;
  duration: number;
  id: number;
  price: number;
  title: string;
  isActive: boolean;
  order: number;
};

export type CreateServiceType = {
  title: string;
  description: string;
  duration: number;
  price: number;
  categoryID: number | undefined;
  isActive: boolean;
};

export type StaffType = {
  id: number;
  created_at: Date;
  name: string;
  role: string;
  image: string;
  schedule: {
    [date: string]: string[];
  };
};
