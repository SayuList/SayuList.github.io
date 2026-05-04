import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>このページは見つかりませんでした</h1>
      <p>お探しのページは削除されたか、URLが変更された可能性があります。</p>
      <p>
        <Link href="/">ホーム画面</Link> や <Link href="/songs/">楽曲一覧</Link> や <Link href="/concerts/">公演一覧</Link> から情報をご覧ください。
      </p>
    </div>
  );
}
