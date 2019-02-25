export interface ButtonProps extends ComponentProps {
  type?: 'submit' | 'button';
  label?: string;
  icon?: string;
  className?: string;
  styleOverride?: any;
  isDisabled?: boolean;
  isOutlined?: boolean;
  onClick: () => any;
}

export const Button = ({ type, label, icon, className, styleOverride, isDisabled, isOutlined, onClick, children }: ButtonProps) => (
  <button
    class={`button ${className || ''} ${isOutlined ? `is-outlined` : ``}`}
    style={styleOverride}
    type={type || 'button'}
    onClick={onClick}
    disabled={isDisabled}
  >
    {children}
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

export const DangerButton = (props: ButtonProps) => Button({ ...props, className: `${props.className || ''} is-danger` });
export const SuccessButton = (props: ButtonProps) => Button({ ...props, className: `${props.className || ''} is-success` });
export const PrimaryButton = (props: ButtonProps) => Button({ ...props, className: `${props.className || ''} is-primary` });

export interface CancelButtonProps {
  isDisabled?: boolean;
  onClick: () => any;
}

export const CancelButton = ({ isDisabled, onClick }: CancelButtonProps) => (
  <DangerButton
    label='Cancel'
    styleOverride={{ transitionDuration: 0 }}
    isDisabled={isDisabled}
    isOutlined={true}
    onClick={onClick}
  />
);

export interface SaveButtonProps {
  isDisabled?: boolean;
  isSaving?: boolean;
  onClick: () => any;
}

export const SaveButton = ({ isDisabled, isSaving, onClick }: SaveButtonProps) => (
  <SuccessButton
    type='submit'
    label='Save'
    className={isSaving ? 'is-loading' : ''}
    styleOverride={{ transitionDuration: 0 }}
    isDisabled={isDisabled || isSaving}
    onClick={onClick}
  />
);
