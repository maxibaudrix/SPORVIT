// src/components/ui/Logo.tsx
import React from 'react';

export interface LogoProps {
  variant?: 'full' | 'symbol' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  colorScheme?: 'default' | 'white' | 'mono';
  className?: string;
}

const sizes = {
  sm: { 
    container: 32, 
    circleRadius: 12,
    strokeWidth: 3,
    pulseStroke: 1.5,
    textSize: 'text-lg',
    gap: 'gap-2'
  },
  md: { 
    container: 48, 
    circleRadius: 18,
    strokeWidth: 4.5,
    pulseStroke: 2.25,
    textSize: 'text-2xl',
    gap: 'gap-3'
  },
  lg: { 
    container: 64, 
    circleRadius: 24,
    strokeWidth: 6,
    pulseStroke: 3,
    textSize: 'text-3xl',
    gap: 'gap-4'
  },
  xl: { 
    container: 80, 
    circleRadius: 30,
    strokeWidth: 7.5,
    pulseStroke: 3.75,
    textSize: 'text-5xl',
    gap: 'gap-5'
  },
};

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'full',
  size = 'md',
  colorScheme = 'default',
  className = ''
}) => {
  const s = sizes[size];
  const center = s.container / 2;
  
  // Calcular proporciones del pulso basadas en el radio
  const pulseScale = s.circleRadius / 24; // 24 es el radio base
  
  // Color schemes
  const getColors = () => {
    switch (colorScheme) {
      case 'white':
        return {
          bgCircle: 'rgba(255, 255, 255, 0.2)',
          gradient: false,
          strokeColor: '#FFFFFF',
          textColor: 'text-white',
        };
      case 'mono':
        return {
          bgCircle: 'rgba(51, 51, 51, 0.5)',
          gradient: false,
          strokeColor: '#94A3B8',
          textColor: 'text-slate-400',
        };
      default: // 'default' con gradiente emerald
        return {
          bgCircle: 'rgba(51, 51, 51, 0.5)',
          gradient: true,
          strokeColor: 'url(#emeraldGradient)',
          textColor: 'text-white',
        };
    }
  };

  const colors = getColors();

  const renderSymbol = () => {
    // Calcular el strokeDasharray para 75% del círculo
    const circumference = 2 * Math.PI * s.circleRadius;
    const dashArray = `${circumference * 0.75} ${circumference}`;

    return (
      <svg 
        width={s.container} 
        height={s.container} 
        viewBox={`0 0 ${s.container} ${s.container}`}
        fill="none"
        className="flex-shrink-0"
      >
        {colors.gradient && (
          <defs>
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
        )}
        
        {/* Anillo de fondo (base) */}
        <circle 
          cx={center} 
          cy={center} 
          r={s.circleRadius} 
          fill="none" 
          stroke={colors.bgCircle}
          strokeWidth={s.strokeWidth}
        />
        
        {/* Anillo de progreso (75% - 3/4 de círculo) */}
        <circle 
          cx={center}
          cy={center}
          r={s.circleRadius}
          fill="none" 
          stroke={colors.strokeColor}
          strokeWidth={s.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          transform={`rotate(-90 ${center} ${center})`}
        />
        
        {/* Pulso de Vitalidad (ECG) - escalado proporcionalmente */}
        <path 
          d={`
            M ${center - 13 * pulseScale} ${center} 
            L ${center - 8 * pulseScale} ${center} 
            L ${center - 5 * pulseScale} ${center - 6 * pulseScale} 
            L ${center} ${center + 6 * pulseScale} 
            L ${center + 5 * pulseScale} ${center - 6 * pulseScale} 
            L ${center + 8 * pulseScale} ${center} 
            L ${center + 13 * pulseScale} ${center}
          `}
          fill="none" 
          stroke={colors.strokeColor}
          strokeWidth={s.pulseStroke}
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const renderWordmark = () => (
    <span 
      className={`${s.textSize} font-extrabold tracking-wide ${colors.textColor}`}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      SPORVIT
    </span>
  );

  if (variant === 'symbol') {
    return <div className={className}>{renderSymbol()}</div>;
  }

  if (variant === 'wordmark') {
    return <div className={className}>{renderWordmark()}</div>;
  }

  // variant === 'full'
  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {renderSymbol()}
      {renderWordmark()}
    </div>
  );
};

// Export conveniente para casos específicos
export const LogoSymbol = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="symbol" />
);

export const LogoWordmark = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="wordmark" />
);

export default Logo;