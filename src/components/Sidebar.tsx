import Link from "next/link";

interface SidebarProps {
  onLinkClick: () => void;
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2><Link href="/" onClick={onLinkClick}>SayuList</Link></h2>
        <button onClick={onLinkClick} className="close-button" aria-label="メニューを閉じる">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <nav>
        <ul>
          <li><Link href="/" onClick={onLinkClick}>ホーム</Link></li>
          <li><Link href="/artist" onClick={onLinkClick}>クリエイター情報</Link></li>
          <li><Link href="/albums" onClick={onLinkClick}>アルバム</Link></li>
          <li><Link href="/songs" onClick={onLinkClick}>楽曲</Link></li>
          <li><Link href="/concerts" onClick={onLinkClick}>公演</Link></li>
          <li><Link href="/venues" onClick={onLinkClick}>イベント会場</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
