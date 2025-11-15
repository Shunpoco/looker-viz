# Looker Studio カスタムビジュアライゼーション

このプロジェクトは、Looker Studio（旧Google Data Studio）用のコミュニティビジュアライゼーションを作成するためのサンプル実装です。D3.jsを使用してインタラクティブな棒グラフを作成します。

## 📋 プロジェクト構成

```
looker-viz/
├── src/                          # ソースファイル
│   ├── index.js                 # メインのJavaScriptファイル
│   ├── index.css                # スタイルシート
│   └── myViz_config.json        # ビジュアライゼーション設定
├── examples/                     # 開発・テスト用ファイル
│   └── index.html               # 開発プレビュー用HTML
├── assets/                       # リソースファイル（画像など）
├── manifest.json                 # Looker Studio マニフェストファイル
├── package.json                  # Node.js 依存関係
├── .eslintrc.json               # ESLint設定
└── README.md                     # このファイル
```

## 🚀 クイックスタート

### 1. 環境セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーを起動（ローカルテスト用）
npm run dev
```

### 2. ローカルでテスト

開発サーバーを起動後、以下のURLにアクセス：
```
http://localhost:8080/examples/index.html
```

### 3. ビルド

```bash
# プロダクションビルド
npm run build
```

## 🛠️ 開発方法

### 主要ファイルの説明

#### `src/index.js`
- ビジュアライゼーションのメインロジック
- Looker Studio APIとの連携処理
- D3.jsを使用したチャート描画
- **dscc**: Looker Studioが自動提供するAPIオブジェクト（`window.dscc`）

**dsccについて**:
- **Looker Studio環境**: `window.dscc`として自動提供され、実際のデータソースと連携
- **開発環境**: `dscc`は`undefined`のため、サンプルデータで動作確認
- `dscc.subscribeToData()`: データ更新の監視
- `dscc.sendConfig()`: ビジュアライゼーション設定の送信

**環境の判定**:
```javascript
if (typeof dscc !== 'undefined') {
  // Looker Studio環境での動作
} else {
  // 開発環境での動作（サンプルデータ使用）
}
```

#### `src/index.css`
- ビジュアライゼーションのスタイル定義
- レスポンシブデザイン対応
- ダークモード・アクセシビリティ対応

#### `src/myViz_config.json`
- データフィールド設定
- スタイルオプション定義
- インタラクション設定

#### `manifest.json`
- Looker Studioでの表示情報
- リソースファイルの場所指定
- メタデータ定義

### 設定可能なオプション

ビジュアライゼーションでは以下の設定が可能です：

- **データフィールド**:
  - Dimension（次元）: 1つ必須
  - Metric（指標）: 1-3個まで

- **スタイルオプション**:
  - 棒の色
  - 背景色
  - ラベル表示の有無
  - フォントサイズ（8-24px）
  - チャートタイトル

## 📦 デプロイメント

### GitHub Pagesへのデプロイ (推奨開発環境)

1. **GitHubリポジトリを作成**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/looker-viz.git
   git push -u origin main
   ```

2. **GitHub Pages を有効化**:
   - GitHubリポジトリの Settings > Pages
   - Source: "GitHub Actions" を選択
   - 自動的にデプロイが開始されます

3. **manifest.json のURL更新**:
   - `yourusername` を実際のGitHubユーザー名に変更
   - `https://yourusername.github.io/looker-viz/manifest.json`

4. **アクセス確認**:
   - デプロイ後: `https://yourusername.github.io/looker-viz/examples/index.html`
   - マニフェスト: `https://yourusername.github.io/looker-viz/manifest.json`

### Google Cloud Storageへのデプロイ (本番環境推奨)

1. **Google Cloud Storageバケットを作成**
2. **バケット名を更新**:
   ```bash
   # package.json の deploy スクリプトでバケット名を変更
   ```
3. **デプロイを実行**:
   ```bash
   npm run deploy
   ```

### Looker Studioでの利用

1. Looker Studioでレポートを作成
2. 「コミュニティの可視化を追加」を選択
3. マニフェストURLを入力:
   - GitHub Pages: `https://yourusername.github.io/looker-viz/manifest.json`
   - GCS: `gs://your-bucket/manifest.json`
4. ビジュアライゼーションを追加

### CORS設定について

GitHub Pagesを使用する場合、CORS（Cross-Origin Resource Sharing）の設定が重要です：

- `_headers` ファイルでCORSヘッダーを設定済み
- GitHub Actionsでの自動デプロイで適用
- Looker StudioからのアクセスでCORSエラーが発生する場合は、Google Cloud Storage の利用を検討してください

## 🔧 カスタマイズ

### 新しいチャートタイプの追加

1. `src/index.js`の`drawVisualization`関数を編集
2. D3.jsコードを変更してチャートタイプを変更
3. 必要に応じて`myViz_config.json`でオプションを追加

### スタイルの変更

1. `src/index.css`でスタイルを編集
2. レスポンシブデザインとアクセシビリティを考慮

## 📊 サポートする機能

- ✅ インタラクティブな棒グラフ
- ✅ ホバーツールチップ
- ✅ カスタマイズ可能なカラー
- ✅ レスポンシブデザイン
- ✅ アクセシビリティ対応
- ✅ ダークモード対応
- ✅ データラベル表示
- ✅ フィルタリング対応（準備済み）

## 🧪 テスト・デバッグ

### ローカル開発環境

`examples/index.html`を使用してLooker Studio環境外でテスト可能：

- サンプルデータでの動作確認
- 設定オプションのリアルタイム変更
- レスポンシブデザインの確認

### エラーハンドリング

- データが存在しない場合の表示
- 設定値の検証
- エラーメッセージの表示

## 🔗 関連リンク

- [Looker Studio Community Visualizations Guide](https://developers.google.com/looker-studio/vis/api)
- [D3.js Documentation](https://d3js.org/)
- [Google Cloud Storage](https://cloud.google.com/storage)

## 📝 ライセンス

MIT License - 詳細は`package.json`を参照

## 🤝 コントリビューション

1. フォークしてください
2. 新しいブランチを作成してください
3. 変更をコミットしてください
4. プルリクエストを送信してください

## 📞 サポート

問題が発生した場合は、GitHubのIssuesページでご報告ください。

---

**注意**: 実際にLooker Studioで使用する前に、Google Cloud Storageのバケット設定とURLの更新を忘れずに行ってください。