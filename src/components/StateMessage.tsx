interface StateMessageProps {
  kind: 'loading' | 'error' | 'empty';
  title: string;
  detail?: string;
  onRetry?: () => void;
}

export default function StateMessage({ kind, title, detail, onRetry }: StateMessageProps) {
  return (
    <div className={`state-message state-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span className="state-mark" aria-hidden="true">
        {kind === 'loading' ? '◌' : kind === 'error' ? '!' : '⌕'}
      </span>
      <div>
        <strong>{title}</strong>
        {detail && <p>{detail}</p>}
        {onRetry && <button className="text-button" onClick={onRetry}>Intentar de nuevo</button>}
      </div>
    </div>
  );
}
