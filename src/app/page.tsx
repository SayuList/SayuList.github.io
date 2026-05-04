import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>SayuListへようこそ</h1>
      <p>このサイトは伊達さゆりさんのアーティスト活動を記録するデータベースサイトです。</p>
      <p>
        <Link href="/songs">楽曲一覧</Link> や <Link href="/concerts">公演一覧</Link> から情報をご覧ください。
      </p>
    </div>
  );
}