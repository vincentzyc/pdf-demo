<template>
  <div class="wrapper">
    <div id="pdfcanvas"></div>
  </div>
</template>

<script setup>
const PDFJS = window.pdfjsLib;

// PDF 链接
// const pdfUrl = 'https://static.jetmobo.com/image/salecard-service/20230531/1685503646624.pdf';
const pdfUrl = 'https://cdn.lipush.com/other/pdfjs@3.7.107/web/compressed.tracemonkey-pldi-09.pdf';

// 创建用于渲染页面的Canvas元素
function createCanvas() {
  var canvas = document.createElement('canvas');
  var pdfcanvas = document.getElementById('pdfcanvas');
  pdfcanvas.appendChild(canvas);
  return canvas;
}

// 渲染页面到Canvas
function renderPage(page, canvas) {
  const viewport = page.getViewport({ scale: 1 });
  const context = canvas.getContext('2d');

  const windowAspectRatio = window.innerWidth / window.innerHeight;
  const pageAspectRatio = viewport.width / viewport.height;

  let scale;
  if (windowAspectRatio > pageAspectRatio) {
    scale = window.innerHeight / viewport.height;
  } else {
    scale = window.innerWidth / viewport.width;
  }

  const scaledViewport = page.getViewport({ scale });

  canvas.height = scaledViewport.height;
  canvas.width = scaledViewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: scaledViewport,
  };

  return page.render(renderContext).promise;
}

// 加载PDF并在多个Canvas中渲染所有页面
async function renderPDF(pdfURL) {
  PDFJS.getDocument(pdfURL).promise.then(function (pdf) {
    var pageCount = pdf.numPages;
    var canvases = [];

    // 创建足够数量的Canvas元素
    for (var i = 0; i < pageCount; i++) {
      canvases.push(createCanvas());
    }

    function renderPageAtIndex(pageIndex) {
      pdf.getPage(pageIndex + 1).then(function (page) {
        return renderPage(page, canvases[pageIndex]).then(function () {
          if (pageIndex < pageCount - 1) {
            // 渲染下一页
            renderPageAtIndex(pageIndex + 1);
          }
        });
      });
    }

    // 从第一页开始渲染
    renderPageAtIndex(0);
  });
}
renderPDF(pdfUrl);
</script>
