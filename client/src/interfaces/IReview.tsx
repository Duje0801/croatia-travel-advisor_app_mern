export interface IReview {
  _id: string;
  destination: {
    name: string;
    id: string;
  };
  user: {
    username: string;
    id: string;
  };
  title: string;
  text: string;
  rating: number;
  createdAt: string;
}
