import { TranslationCatalog } from './types/XCStrings';
import { LANGUAGES_LIST } from './iso-639-1.js';
import { LanguageCode } from './types/LanguageList';

if (!localStorage.getItem('catalog'))
  console.error('No catalog found in local storage');

const catalog: TranslationCatalog = JSON.parse(
  localStorage.getItem('catalog') || '{}'
);

const projectTitle = localStorage.getItem('filename');

let targetLanguage: LanguageCode = (localStorage.getItem('targetLanguage') ||
  navigator.language.split('-')[0]) as LanguageCode;

window.onload = () => {
  $id('projectTitle')!.innerText = projectTitle || 'Untitled Project';
  $id('ISO_CODE_DEFAULT')!.innerText = catalog.sourceLanguage;

  // List Languages
  Object.keys(LANGUAGES_LIST).forEach((code) => {
    $id('target')!.innerHTML += `<option value="${code}">${
      LANGUAGES_LIST[code as LanguageCode].name
    } (${code})</option>`;
  });

  ($id('target') as HTMLSelectElement)!.value = targetLanguage;

  $id('target')!.onchange = (e) => {
    targetLanguage = ($id('target') as HTMLSelectElement)!
      .value as LanguageCode;
    localStorage.setItem('targetLanguage', targetLanguage);
    // Update translation
  };

  // List Strings
  updateTable();

  // Update translation
};

function updateTable() {
  Object.keys(catalog.strings).forEach((key) => {
    const string = catalog.strings[key];

    try {
      let defaultLocalization = key;
      if (
        string.localizations &&
        string.localizations[catalog.sourceLanguage] &&
        string.localizations[catalog.sourceLanguage].stringUnit
      ) {
        defaultLocalization =
          string.localizations[catalog.sourceLanguage].stringUnit.value;
      }

      let targetLocalization = '';
      if (
        string.localizations &&
        string.localizations[targetLanguage] &&
        string.localizations[targetLanguage].stringUnit
      ) {
        targetLocalization =
          string.localizations[targetLanguage].stringUnit.value;
      }

      let stateTag = 'N/A';
      if (!(string.shouldTranslate ?? true)) {
        stateTag = `<i title="Don't translate" class="bi bi-x-lg"></i>`;
      } else if (
        string.localizations &&
        string.localizations[targetLanguage] &&
        string.localizations[targetLanguage].stringUnit &&
        string.localizations[targetLanguage].stringUnit.state
      ) {
        const state = string.localizations[targetLanguage].stringUnit.state;

        if (state == 'needs_review') {
          stateTag = `<i title="Needs review" class="bi bi-exclamation-diamond-fill"></i>`;
        } else if (state == 'translated') {
          stateTag = `<i title="Translated" class="bi bi-check-circle-fill"></i>`;
        } else if (state == 'new') {
          stateTag = `NEW`;
        }
      }

      $query('#strings > tbody')!.innerHTML += `
        <tr>
            <td>${key}</td>
            <td>${defaultLocalization}</td>
            <td ${
              string.shouldTranslate ?? true ? 'contenteditable' : ''
            }>${targetLocalization}</td>
            <td>${string.comment || ''}</td>
            <td>${stateTag}</td>
        </tr>
        `;
    } catch (e) {
      debugger;
      console.error(e);
    }
  });
}

function $id(id: string) {
  return document.getElementById(id);
}

function $query(selector: string) {
  return document.querySelector(selector);
}
