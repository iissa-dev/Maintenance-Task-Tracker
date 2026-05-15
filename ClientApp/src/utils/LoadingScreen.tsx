import { ThreeDot } from "react-loading-indicators";

export const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <ThreeDot
      variant="bounce"
      color="var(--color-primary)"
      size="medium"
      text="LOADING"
      textColor="var(--color-primary)"
    />
  </div>
);