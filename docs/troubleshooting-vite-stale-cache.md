# Vite ビルドキャッシュによる画面表示不具合

## 発生日

2026-04-10

## 症状

- 注文一覧画面が**薄暗く表示**され、全ての要素が**非活性（クリック不可）**になる
- シークレットウィンドウでは正常に表示される
- 通常ウィンドウではブラウザのキャッシュクリア・ハードリロード（`Cmd + Shift + R`）でも解消しない場合がある

## 原因

新しいページコンポーネント（`resources/js/pages/Orders/Create.tsx`）を追加した後、ブラウザが**古い Vite ビルドファイル**を参照し続けていたことが原因。

### 発生メカニズム

1. `Orders/Create.tsx` を新規作成し、`OrderController::create()` で `Inertia::render('Orders/Create')` を返すよう実装
2. Vite の `import.meta.glob('./pages/**/*.tsx')`（`resources/js/app.tsx`）はビルド時にファイル一覧を構築する
3. ブラウザが古いビルドの JS バンドルをキャッシュしており、新しい `Orders/Create` コンポーネントが含まれていなかった
4. 注文一覧画面から `/orders/create` へ遷移しようとすると、Inertia がコンポーネントを解決できず `Page not found` エラーが発生
5. Inertia のエラーモーダル（半透明の黒いオーバーレイ + iframe）が表示され、背面の一覧画面が**薄暗く非活性**に見えた

### ブラウザログ（参考）

```text
[vite] server connection lost. Polling for restart...
```

```text
Unhandled Promise Rejection Error Page not found: ./pages/Orders/Create.tsx
```

## 対応方法

### 即時対応

以下を順番に試す:

1. **ハードリロード**: `Cmd + Shift + R`（Mac）/ `Ctrl + Shift + R`（Windows）
2. **DevTools でキャッシュ無効化**: F12 → Network タブ → 「Disable cache」にチェック → リロード
3. **ブラウザのキャッシュを完全にクリア**: 設定 → 閲覧データの削除 → 「キャッシュされた画像とファイル」を選択して削除
4. **シークレットウィンドウで確認**: キャッシュが原因かどうかの切り分けに有効

### 根本対応（再発防止）

新しいページコンポーネントを追加した場合:

```bash
# 1. ビルドファイルを削除して再ビルド
rm -rf public/build && npm run build

# 2. Vite 開発サーバーを使っている場合は再起動
composer run dev
# または
npm run dev
```

## 再発しやすい状況

| 状況 | 理由 |
|------|------|
| 新しいページファイル（`.tsx`）を追加した | `import.meta.glob` の対象が変わるため再ビルドが必要 |
| Vite 開発サーバーの接続が切れた | ブラウザが古いモジュールをキャッシュしたまま復帰する |
| Docker コンテナを再起動せずにファイルを変更した | コンテナ内のサーバーが変更を検知できない場合がある |

## 判別方法

「画面が薄暗い・非活性」という症状が出た場合:

1. **シークレットウィンドウで同じ URL にアクセス** → 正常なら**ブラウザキャッシュが原因**
2. **DevTools の Console を確認** → `Page not found` エラーがあればコンポーネント解決の問題
3. **DevTools の Network タブを確認** → 古いハッシュ付きファイル名（例: `app-Dd_6WY_g.js`）が読み込まれていればキャッシュが原因
