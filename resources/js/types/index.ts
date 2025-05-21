export interface NewsItem {
    id: number;
    title: string;
    content: string;
    image: string;
    category: string;
    published_at: string;
    author: {
      name: string;
    };
  }
  