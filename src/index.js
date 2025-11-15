/**
 * Custom Looker Studio Community Visualization
 * 棒グラフビジュアライゼーションのサンプル実装
 */

// Google Visualization API リファレンス
// Looker Studio環境では window.dscc が自動的に提供される
// 開発環境では undefined になる
const dscc = window.dscc;

// ビジュアライゼーションの設定
const vizConfig = {
  data: [
    {
      id: 'dimension',
      label: 'Dimension',
      type: 'DIMENSION'
    },
    {
      id: 'metric',
      label: 'Metric',
      type: 'METRIC'
    }
  ],
  style: [
    {
      id: 'barColor',
      label: 'Bar Color',
      type: 'FILL_COLOR',
      defaultValue: '#4285F4'
    },
    {
      id: 'backgroundColor',
      label: 'Background Color',
      type: 'FILL_COLOR',
      defaultValue: '#FFFFFF'
    },
    {
      id: 'showLabels',
      label: 'Show Labels',
      type: 'CHECKBOX',
      defaultValue: true
    },
    {
      id: 'fontSize',
      label: 'Font Size',
      type: 'NUMBER',
      defaultValue: 12,
      min: 8,
      max: 24
    }
  ]
};

// メインのレンダリング関数
function drawVisualization(data) {
  // コンテナをクリア
  const container = document.getElementById('myViz');
  container.innerHTML = '';

  // データが存在しない場合の処理
  if (!data || !data.tables || !data.tables.DEFAULT || data.tables.DEFAULT.length === 0) {
    container.innerHTML = '<div class="no-data">No data to display</div>';
    return;
  }

  const table = data.tables.DEFAULT;
  const style = data.style;
  
  // スタイル設定を取得
  const barColor = style.barColor.value || style.barColor.defaultValue;
  const backgroundColor = style.backgroundColor.value || style.backgroundColor.defaultValue;
  const showLabels = style.showLabels.value !== undefined ? style.showLabels.value : style.showLabels.defaultValue;
  const fontSize = style.fontSize.value || style.fontSize.defaultValue;

  // コンテナにスタイルを適用
  container.style.backgroundColor = backgroundColor;
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = fontSize + 'px';

  // SVG要素を作成
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const containerRect = container.getBoundingClientRect();
  const width = containerRect.width - margin.left - margin.right;
  const height = containerRect.height - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', containerRect.width)
    .attr('height', containerRect.height);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // データを準備
  const chartData = table.map(row => ({
    dimension: row[data.fields.dimension[0].name],
    metric: +row[data.fields.metric[0].name]
  }));

  // スケール設定
  const xScale = d3.scaleBand()
    .domain(chartData.map(d => d.dimension))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => d.metric)])
    .nice()
    .range([height, 0]);

  // X軸を描画
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .style('font-size', fontSize + 'px')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-45)');

  // Y軸を描画
  g.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale))
    .selectAll('text')
    .style('font-size', fontSize + 'px');

  // 棒グラフを描画
  const bars = g.selectAll('.bar')
    .data(chartData)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.dimension))
    .attr('y', d => yScale(d.metric))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d.metric))
    .attr('fill', barColor)
    .on('mouseover', function(event, d) {
      // ホバーエフェクト
      d3.select(this).style('opacity', 0.7);
      
      // ツールチップを表示
      const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('z-index', '1000');

      tooltip.html(`${d.dimension}: ${d.metric.toLocaleString()}`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
      d3.select(this).style('opacity', 1);
      d3.selectAll('.tooltip').remove();
    });

  // ラベルを表示
  if (showLabels) {
    g.selectAll('.bar-label')
      .data(chartData)
      .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.dimension) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.metric) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', (fontSize - 2) + 'px')
      .style('fill', '#333')
      .text(d => d.metric.toLocaleString());
  }
}

// Looker Studio Community Visualization用のコールバック
function subscribeToData(callback) {
  // データが更新されたときに呼び出される
  dscc.subscribeToData(callback, {
    transform: dscc.objectTransform
  });
}

// 初期化
if (typeof dscc !== 'undefined') {
  // Looker Studio環境 - 実際のデータソースと連携
  subscribeToData(drawVisualization);
  
  // 設定を送信
  dscc.sendConfig(vizConfig);
} else {
  // 開発環境 - サンプルデータで動作確認
  console.log('Development mode: dscc not available, using sample data');
  
  // サンプルデータでテスト
  const sampleData = {
    tables: {
      DEFAULT: [
        { dimension: 'Category A', metric: 100 },
        { dimension: 'Category B', metric: 150 },
        { dimension: 'Category C', metric: 75 },
        { dimension: 'Category D', metric: 200 },
        { dimension: 'Category E', metric: 120 }
      ]
    },
    fields: {
      dimension: [{ name: 'dimension' }],
      metric: [{ name: 'metric' }]
    },
    style: {
      barColor: { defaultValue: '#4285F4' },
      backgroundColor: { defaultValue: '#FFFFFF' },
      showLabels: { defaultValue: true },
      fontSize: { defaultValue: 12 }
    }
  };
  
  // 少し遅延させてDOM要素が準備されるのを待つ
  setTimeout(() => {
    drawVisualization(sampleData);
  }, 100);
}