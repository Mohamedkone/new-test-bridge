export interface BigCardProps {
    width: string;
    minHeight: string;
    maxHeight?: string;
    title: string;
    children: React.ReactNode;
    link?: string;
}
export interface NewsCardProps {
    date: string;
    title: string;
    desc: string;
    thumbnail: string;
  }