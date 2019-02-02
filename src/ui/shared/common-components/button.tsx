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

export const ButtonDef = (
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
};

export const Button = pure(ButtonDef);

export const DangerButtonDef = (
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
};

export const DangerButton = pure(DangerButtonDef);

export const SuccessButtonDef = (
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
};

export const SuccessButton = pure(SuccessButtonDef);

export const PrimaryButtonDef = (
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
};

export const PrimaryButton = pure(PrimaryButtonDef);

export interface CancelButtonProps {
  isDisabled?: boolean;
  onClick: () => any;
}

export const CancelButtonDef = ({ isDisabled, onClick }: CancelButtonProps) => {
  return (
    <DangerButton
      label='Cancel'
      styleOverride={{ transitionDuration: 0 }}
      isDisabled={isDisabled}
      isOutlined={true}
      onClick={onClick}
    />
  );
};

export const CancelButton = pure(CancelButtonDef);

export interface SaveButtonProps {
  isDisabled?: boolean;
  isSaving?: boolean;
  onClick: () => any;
}

export const SaveButtonDef = ({ isDisabled, isSaving, onClick }: SaveButtonProps) => {
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
};

export const SaveButton = pure(SaveButtonDef);
