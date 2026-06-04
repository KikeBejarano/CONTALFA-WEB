export function Card({ title, text, items, color = 'var(--teal)', children }) {
  return (
    <div className="card" style={{ borderTopColor: color }}>
      {children}
      {title && <h3>{title}</h3>}
      {text && <p>{text}</p>}
      {items && (
        <ul className="checks">
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
    </div>
  );
}
