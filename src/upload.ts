let fileInput = document.getElementById('fileInput');

fileInput?.addEventListener('change', (e) => {
  let target = e.target as HTMLInputElement;
  let file = target.files?.[0];

  if (!file) {
    console.error('No file selected');
    return;
  }

  localStorage.setItem('filename', file.name.split('.xcstrings')[0]);

  let reader = new FileReader();

  reader.onload = function (event) {
    let fileContent = event.target?.result;
    if (fileContent) {
      localStorage.setItem('catalog', fileContent as string);
    }
  };

  reader.readAsText(file);
});
