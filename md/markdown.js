function exportMarkdown() {
  const title = document.getElementById('titleInput').value;
  const tags = document.getElementById('tagsInput').value.split(',');
  const content = document.getElementById('contentInput').value;
  const currentDate = new Date();
  const filename = currentDate.toISOString() + '.md';
  

  const formattedTags = tags.map(tag => `  - ${tag.trim()}`).join('\n');

  const markdownContent = `---
title: ${title}
modified: ${getFormattedDate()} +07:00
tags:
${formattedTags}
---

${content}`;

  if (checkInputs(title, content)) {
    downloadMarkdown(markdownContent, filename);
    clearInputs();
  }
}

function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
}

function checkInputs(title, content) {
  const warningMessage = document.getElementById('warningMessage');

  if (!title.trim()) {
    warningMessage.textContent = '请输入标题';
    return false;
  }

  if (!content.trim()) {
    warningMessage.textContent = '请输入正文';
    return false;
  }

  warningMessage.textContent = '';
  return true;
}

function downloadMarkdown(content, filename) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function clearInputs() {
  document.getElementById('titleInput').value = '';
  document.getElementById('tagsInput').value = '';
  document.getElementById('contentInput').value = '';
}