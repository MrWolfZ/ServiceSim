export interface PageProps extends ComponentProps {
  title: string;
}

export const Page = ({ title, children }: PageProps) => {
  return (
    <div class='page'>
      <div class='container flex-column'>
        <h1 class='title'>
          {title}
        </h1>

        {children}
      </div>
    </div>
  );
};
