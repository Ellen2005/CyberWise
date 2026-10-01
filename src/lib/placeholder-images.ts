import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = (data as any).placeholderImages.map((img: any) => ({
  id: img.id,
  description: img.description ?? img.id,
  imageUrl: img.imageUrl,
  imageHint: img.imageHint,
}));
