import React from 'react';
import { forwardRef } from 'react';

const baseClasses =
  'px-5 py-2.5 rounded font-semibold text-sm cursor-pointer transition-all duration-200 inline-flex items-center justify-center active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed';

const variants = {
  primary:
    'bg-[#E50914] hover:bg-[#b9090b] text-white border border-red-600/80 shadow-md shadow-red-900/20',
  secondary:
    'bg-[#333333] hover:bg-[#444444] text-white border border-gray-600 shadow-md',
};

const Button = forwardRef(function Button(props, ref) {
  const { as: Component = 'button', variant = 'primary', className = '', children, ...rest } = props;
  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${className}`;
  return (
    <Component ref={ref} className={classes} {...rest}>
      {children}
    </Component>
  );
});

export default Button;

