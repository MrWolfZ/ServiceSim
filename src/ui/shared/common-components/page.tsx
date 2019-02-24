import { pure, PureComponentContext } from 'src/ui/infrastructure/tsx';

export interface PageProps {
  title: string;
}

export const Page = pure(({ title }: PageProps, { slots }: PureComponentContext) => {
  return (
    <div class='page'>
      <div class='container flex-column'>
        <h1 class='title'>
          {title}
        </h1>

        {slots.default}
      </div>
    </div>
  );
});
