import { TranslationCatalog } from './types/XCStrings';
import { assert } from 'console';

let fileInput = document.getElementById('fileInput');

fileInput?.addEventListener('change', (e) => {
  let target = e.target as HTMLInputElement;
  let file = target.files?.[0];

  if (!file) {
    return;
  }

  let reader = new FileReader();

  reader.onload = (e) => {
    let content = e.target?.result as string;

    localStorage.setItem('catalog', content);
  };
});
