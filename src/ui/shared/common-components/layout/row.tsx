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

export interface RowProps extends ComponentProps {
  horizontalAlignment?: HorizontalAlignment;
  verticalAlignment?: VerticalAlignment;
}

export const Row = ({ horizontalAlignment, verticalAlignment, children }: RowProps) => {
  const style: Dictionary<any> = {
    display: 'flex',
    flexDirection: 'row',
  };

  if (horizontalAlignment) {
    style.justifyContent = switch$(horizontalAlignment, {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    });
  }

  if (verticalAlignment) {
    style.alignItems = switch$(verticalAlignment, {
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
