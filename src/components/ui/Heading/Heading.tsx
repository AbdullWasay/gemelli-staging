import React, { JSX } from 'react';
import clsx from 'clsx';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
type HeadingVariant = 'default' | 'display' | 'section' | 'subtitle' | 'accent' | 'danger';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  variant?: HeadingVariant;
  level?: HeadingLevel;
  size?: string;
  weight?: string;
  color?: string;
  margin?: string;
  className?: string;
}

const Heading = ({ 
  children,
  variant = 'default',
  level = 'h4',
  size,
  weight,
  color,
  margin,
  className,
  ...props
}: HeadingProps) => {
  const Tag: keyof JSX.IntrinsicElements = level;
  

  const variants = {
    default: {
      size: 'text-[20px]',
      weight: 'font-semibold',
      margin: 'mt-5',
      font: 'font-poppins',
      color: 'text-text-black'
    },
    display: {
      size: 'text-[32px] md:text-[40px]',
      weight: 'font-bold',
      margin: 'mt-8 mb-6',
      font: 'font-poppins',
      color: 'text-text-black '
    },
    section: {
      size: 'text-[24px] md:text-[28px]',
      weight: 'font-semibold',
      margin: 'mt-6 mb-4',
      font: 'font-poppins',
      color: 'text-text-black '
    },
    subtitle: {
      size: 'text-[18px]',
      weight: 'font-medium',
      margin: 'mt-3 mb-2',
      font: 'font-poppins',
      color: 'text-text-black '
    },
    accent: {
      size: 'text-[20px]',
      weight: 'font-bold',
      margin: 'mt-5 mb-3',
      font: 'font-poppins',
      color: 'text-text-black '
    },
    danger: {
      size: 'text-[20px]',
      weight: 'font-semibold',
      margin: 'mt-5 mb-3',
      font: 'font-poppins',
      color: 'text-text-black '
    }
  };


  const selectedVariant = variants[variant] || variants.default;


  const classes = clsx(
    selectedVariant.size,
    selectedVariant.weight,
    selectedVariant.margin,
    selectedVariant.font,
    selectedVariant.color,
    size,
    weight,
    color,
    margin,
    className
  );

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export default Heading;


{/* 

<Heading variant="display">
Statistics
</Heading >

<Heading variant="section">
Statistics
</Heading>

<Heading variant="subtitle">
Statistics
</Heading>

<Heading variant="accent">
Statistics
</Heading> 

*/}