const doodles = [
  { kind: 'star', color: 'amber', position: 'top-8 left-[4%]' },
  { kind: 'ring', color: 'lavender', position: 'top-16 right-[5%]' },
  { kind: 'plus', color: 'mint', position: 'top-[38%] left-[2%]' },
  { kind: 'squiggle', color: 'blue', position: 'top-[28%] right-[3%]' },
  { kind: 'triangle', color: 'peach', position: 'top-[60%] left-[6%]' },
  { kind: 'dot', color: 'lavender', position: 'top-[55%] right-[5%]' },
  { kind: 'ring', color: 'mint', position: 'bottom-12 left-[3%]' },
  { kind: 'star', color: 'peach', position: 'bottom-16 right-[4%]' },
  { kind: 'plus', color: 'amber', position: 'top-[18%] left-[48%]' },
  { kind: 'squiggle', color: 'lavender', position: 'bottom-[22%] right-[18%]' },
];

function Doodle({ kind }: { kind: string }) {
  if (kind === 'star') {
    return <path d="m12 2 2.2 6.1L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-1.9L12 2Z" fill="currentColor" />;
  }
  if (kind === 'ring') {
    return <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />;
  }
  if (kind === 'plus') {
    return <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />;
  }
  if (kind === 'triangle') {
    return <path d="m12 4 8 14H4L12 4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />;
  }
  if (kind === 'dot') {
    return <circle cx="12" cy="12" r="4" fill="currentColor" />;
  }
  return <path d="M3 15c3-10 6 10 9 0s6 10 9 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />;
}

export function PageDoodles() {
  return (
    <div className="page-doodles" aria-hidden="true">
      {doodles.map((doodle, index) => (
        <span
          key={`${doodle.kind}-${doodle.color}-${index}`}
          className={`page-doodles__item page-doodles__item--${doodle.color} ${doodle.position}`}
        >
          <svg viewBox="0 0 24 24" focusable="false">
            <Doodle kind={doodle.kind} />
          </svg>
        </span>
      ))}
    </div>
  );
}
