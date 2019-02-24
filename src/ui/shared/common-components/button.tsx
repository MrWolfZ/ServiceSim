import { pure, PureComponentContext } from 'src/ui/infrastructure/tsx';

export interface ButtonProps {
  type?: 'submit' | 'button';
  label?: string;
  icon?: string;
  className?: string;
  styleOverride?: any;
  isDisabled?: boolean;
  isOutlined?: boolean;
  onClick: () => any;
}

export const Button = pure((
  { type, label, icon, className, styleOverride, isDisabled, isOutlined, onClick }: ButtonProps,
  { slots }: PureComponentContext,
) => {
  return (
    <button
      class={`button ${className || ''} ${isOutlined ? `is-outlined` : ``}`}
      style={styleOverride}
      type={type || 'button'}
      onClick={onClick}
      disabled={isDisabled}
    >
      {slots.default}
      {label &&
        <span>{label}</span>
      }
      {icon &&
        <span class='icon is-small'>
          <fa-icon icon={icon} />
        </span>
      }
    </button>
  );
});

export const DangerButton = pure((
  { type, label, icon, className, styleOverride, isDisabled, isOutlined, onClick }: ButtonProps,
  { slots }: PureComponentContext,
) => {
  return (
    <Button
      type={type}
      label={label}
      icon={icon}
      className={`${className || ''} is-danger`}
      styleOverride={styleOverride}
      isDisabled={isDisabled}
      isOutlined={isOutlined}
      onClick={onClick}
    >
      {slots.default}
    </Button>
  );
});

export const SuccessButton = pure((
  { type, label, icon, className, styleOverride, isDisabled, isOutlined, onClick }: ButtonProps,
  { slots }: PureComponentContext,
) => {
  return (
    <Button
      type={type}
      label={label}
      icon={icon}
      className={`${className || ''} is-success`}
      styleOverride={styleOverride}
      isDisabled={isDisabled}
      isOutlined={isOutlined}
      onClick={onClick}
    >
      {slots.default}
    </Button>
  );
});

export const PrimaryButton = pure((
  { type, label, icon, className, styleOverride, isDisabled, isOutlined, onClick }: ButtonProps,
  { slots }: PureComponentContext,
) => {
  return (
    <Button
      type={type}
      label={label}
      icon={icon}
      className={`${className || ''} is-primary`}
      styleOverride={styleOverride}
      isDisabled={isDisabled}
      isOutlined={isOutlined}
      onClick={onClick}
    >
      {slots.default}
    </Button>
  );
});

export interface CancelButtonProps {
  isDisabled?: boolean;
  onClick: () => any;
}

export const CancelButton = pure(({ isDisabled, onClick }: CancelButtonProps) => {
  return (
    <DangerButton
      label='Cancel'
      styleOverride={{ transitionDuration: 0 }}
      isDisabled={isDisabled}
      isOutlined={true}
      onClick={onClick}
    />
  );
});

export interface SaveButtonProps {
  isDisabled?: boolean;
  isSaving?: boolean;
  onClick: () => any;
}

export const SaveButton = pure(({ isDisabled, isSaving, onClick }: SaveButtonProps) => {
  return (
    <SuccessButton
      type='submit'
      label='Save'
      className={isSaving ? 'is-loading' : ''}
      styleOverride={{ transitionDuration: 0 }}
      isDisabled={isDisabled || isSaving}
      onClick={onClick}
    />
  );
});
