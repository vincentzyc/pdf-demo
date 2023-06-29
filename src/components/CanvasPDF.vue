<template>
  <div class="wrapper">
    <div id="pdfcanvas"></div>
  </div>
</template>

<script setup>
// PDF 链接
const pdfUrl = 'https://cdn.lipush.com/other/pdfjs@3.7.107/web/compressed.tracemonkey-pldi-09.pdf';
const PDFJS = window.pdfjsLib;

// 创建用于渲染页面的Canvas元素
function createCanvas() {
  var canvas = document.createElement('canvas');
  var pdfcanvas = document.getElementById('pdfcanvas');
  pdfcanvas.appendChild(canvas);
  return canvas;
}

// 渲染页面到Canvas
function renderPage(page, canvas) {
  var viewport = page.getViewport({ scale: 1 });
  console.log(viewport);
  var context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  // canvas.height = window.innerHeight;
  // canvas.width = window.innerWidth;

  return page.render({ canvasContext: context, viewport: viewport }).promise;
}

// 加载PDF并在多个Canvas中渲染所有页面
async function renderPDF(pdfURL) {
  // try {
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
  // } catch (error) {
  // if (String(error).indexOf('response.body.getReader') > -1) {
  // 某些浏览器内核不支持 Fetch - response.body.getReader 的模式，专门在这里修复
  // const pdfData = await fetch(new URL(pdfURL, window.location).href);
  // const arrayBufferPdf = await pdfData.arrayBuffer(); // 转成 ArrayBuffer 塞给 pdf.js
  // PDFJS.getDocument({ data: arrayBufferPdf }).promise.then(function (pdf) {
  //   var pageCount = pdf.numPages;
  //   var canvases = [];

  //   // 创建足够数量的Canvas元素
  //   for (var i = 0; i < pageCount; i++) {
  //     canvases.push(createCanvas());
  //   }

  //   function renderPageAtIndex(pageIndex) {
  //     pdf.getPage(pageIndex + 1).then(function (page) {
  //       return renderPage(page, canvases[pageIndex]).then(function () {
  //         if (pageIndex < pageCount - 1) {
  //           // 渲染下一页
  //           renderPageAtIndex(pageIndex + 1);
  //         }
  //       });
  //     });
  //   }

  //   // 从第一页开始渲染
  //   renderPageAtIndex(0);
  // });
  // }
  // }
}
renderPDF(pdfUrl);
</script>
