export interface IReview {
  title: string;
  text: string;
  rating: number;
  destination: {
    name: string;
    id: string;
  };
  user: {
    username: string;
    id: string;
  };
  createdAt: Date;
}
