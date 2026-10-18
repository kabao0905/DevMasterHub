function cva(base, { variants, defaultVariants = {} }) {
  return (props = {}) => {
    const chon = { ...defaultVariants, ...props };
    return [base, ...Object.entries(variants).map(([ten, cacKieu]) => cacKieu[chon[ten]])].filter(Boolean).join(' ');
  };
}

const button = cva(
  'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      intent: {
        primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
        secondary: 'bg-primary-light text-primary hover:bg-blue-200 focus:ring-primary',
        danger: 'bg-danger text-white hover:bg-red-700 focus:ring-danger',
        ghost: 'text-primary hover:bg-primary-light'
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg'
      }
    },
    defaultVariants: { intent: 'primary', size: 'md' }
  }
);

const badge = cva('rounded-full px-2.5 py-0.5 text-xs font-bold', {
  variants: {
    tone: { success: 'bg-green-100 text-success', danger: 'bg-red-100 text-danger', info: 'bg-primary-light text-primary' }
  },
  defaultVariants: { tone: 'info' }
});

const cacNut = [
  { intent: 'primary', size: 'sm' },
  { intent: 'primary' },
  { intent: 'secondary' },
  { intent: 'danger', size: 'lg' },
  { intent: 'ghost' }
];

const khungNut = document.getElementById('buttons');
for (const props of cacNut) {
  const nut = document.createElement('button');
  nut.className = button(props);
  nut.textContent = `${props.intent} ${props.size || 'md'}`;
  khungNut.append(nut);
}

const khungBadge = document.getElementById('badges');
for (const tone of ['success', 'danger', 'info']) {
  const b = document.createElement('span');
  b.className = badge({ tone });
  b.textContent = tone;
  khungBadge.append(b);
}

document.getElementById('out').textContent = `button({ intent: 'danger', size: 'lg' })\n→ "${button({ intent: 'danger', size: 'lg' })}"`;
