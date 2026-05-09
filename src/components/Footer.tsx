export default function Footer() {
    return (
      <footer>
        <hr className="footer-divider" />
        <p className="text-right">
          当サイトはファン有志が運営しており、<br className="mobile-br" />
          情報の正確性・網羅性は保証しておりません。
        </p>
        <p className="text-right" style={{ marginTop: 'var(--spacing-unit)' }}>ver0.1.1 / SayuList</p>
      </footer>
    );
  }
  