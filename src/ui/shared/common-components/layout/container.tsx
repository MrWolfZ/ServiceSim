export const Container = ({ children }: ComponentProps) => {
  return (
    <div class='container' style={{ height: '100%' }}>
      {children}
    </div>
  );
};
