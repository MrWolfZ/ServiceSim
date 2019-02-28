import { Column } from './column';
import { Container } from './container';

export interface PageProps extends ComponentProps {
  title: string;
}

export const Page = ({ title, children }: PageProps) => {
  const style = {
    height: '100%',
    padding: '2rem 0',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  return (
    <div style={style}>
      <Container>
        <Column>
          <h1 class='title'>
            {title}
          </h1>

          {children}
        </Column>
      </Container>
    </div>
  );
};
