// src/components/atoms/Search/InputSearch.jsx
'use client';

export default function InputSearch({
  placeholder,
  value,
  onChange,
  className,
  onClick,
  error,
  required,
  id,
  disabled,
  fullWidth = false,
}) {
  return (
    <div className={className ?? ''} style={fullWidth ? { width: '100%' } : undefined}>
      <div
        style={{
          position: 'relative',
          width: fullWidth ? '100%' : '320px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '2px',
            padding: '0 50px 0 16px',
            fontSize: '14px',
            color: '#fff',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          style={{
            position: 'absolute',
            right: '0',
            top: '0',
            width: '50px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <img src="/assets/icons/ic_search.svg" alt="search" width={20} height={20} />
        </button>
      </div>
      {error && <p style={{ marginTop: '4px', fontSize: '12px', color: '#f87171' }}>{error}</p>}
    </div>
  );
}
