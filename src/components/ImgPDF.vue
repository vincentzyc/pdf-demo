<template>
  <div class="wrapper">
    <div v-for="(page, index) in pages" :key="index" class="pdf-page">
      <img :src="page.url" :alt="'Page ' + (index + 1)" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const PDFJS = window.pdfjsLib;

// PDF 链接
const pdfUrl = 'https://cdn.lipush.com/other/pdfjs@3.7.107/web/compressed.tracemonkey-pldi-09.pdf';

// 加载PDF并渲染为图片
async function renderPDF(pdfURL) {
  const loadingTask = PDFJS.getDocument(pdfURL);
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pages = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement('canvas');
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

    await page.render(renderContext).promise;

    const imageData = canvas.toDataURL(); // 获取图像数据URL
    pages.push({ url: imageData });
  }

  return pages;
}

// 渲染PDF
const pages = ref([]);

onMounted(async () => {
  pages.value = await renderPDF(pdfUrl);
});
</script>
