import { switch$ } from 'src/util/switch';

export type HorizontalAlignment =
  | 'left'
  | 'center'
  | 'right'
  ;

export type VerticalAlignment =
  | 'top'
  | 'center'
  | 'bottom'
  ;

export interface ColumnProps extends ComponentProps {
  horizontalAlignment?: HorizontalAlignment;
  verticalAlignment?: VerticalAlignment;
}

export const Column = ({ horizontalAlignment, verticalAlignment, children }: ColumnProps) => {
  const style: Dictionary<any> = {
    display: 'flex',
    flexDirection: 'column',
  };

  if (horizontalAlignment) {
    style.alignItems = switch$(horizontalAlignment, {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    });
  }

  if (verticalAlignment) {
    style.justifyContent = switch$(verticalAlignment, {
      top: 'flex-start',
      center: 'center',
      bottom: 'flex-end',
    });
  }

  return (
    <div style={style}>
      {children}
    </div>
  );
};
