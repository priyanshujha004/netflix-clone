import React from 'react';
import { forwardRef } from 'react';

const baseClasses =
  'w-full px-4 py-3 rounded bg-[#333333] text-white border border-gray-600 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors placeholder-gray-400 text-sm font-normal';

const Input = forwardRef(function Input(props, ref) {
  const { className = '', ...rest } = props;
  const classes = `${baseClasses} ${className}`;
  return <input ref={ref} className={classes} {...rest} />;
});

export default Input;

