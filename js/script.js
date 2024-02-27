const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchageIcon = document.querySelector(".exchange"),
  selectTag = document.querySelectorAll("select"),
  icons = document.querySelectorAll(".row i");
(translateBtn = document.querySelector("button")),
  selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
      //selecionar o inglês por predefinição como língua e o portugues como língua
      let selected =
        id == 0
          ? country_code == "en-GB"
            ? "selected"
            : ""
          : country_code == "pt-BR"
          ? "selected"
          : "";
      let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
      tag.insertAdjacentHTML("beforeend", option); //adicionar a etiqueta opções dentro da etiqueta select
    }
  });

exchageIcon.addEventListener("click", () => {
  //troca de valores de textarea e tag select
  let tempText = fromText.value,
    tempLang = selectTag[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
    translateFrom = selectTag[0].value, //obter o valor da etiqueta fromSelect
    translateTo = selectTag[1].value; //obter o valor da etiqueta toSelect
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  //site da api (https://mymemory.translated.net/doc/spec.php)
  //`https://api.mymemory.translated.net/get?q=H${text}&langpair=${translateFrom}|${translateTo}&de=your_email`;
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`; //Pode traduzir 5000 caracteres por dia gratuitamente. Se for registrado no site pode ser 50000 por dia
  //trata-se de uma API gratuita, pelo que, por vezes, o texto traduzido pode não ser exato
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach((data) => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value || !toText.value) return;
    if (target.classList.contains("fa-copy")) {
      //Se o ícone clicado for do id, copie o valor fromTextarea; caso contrário, copie o valor toTextarea
      if (target.id == "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      //se o ícone clicado for do id, fale o valor fromTextarea; caso contrário, fale o valor toTextarea
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value; //definir o idioma da expressão como o valor da tag formSelect
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value; //definir o idioma da expressão como o valor da tag toSelect
      }
      speechSynthesis.speak(utterance); //fale a expressão passada speechSynthesis.speak(utterance);
    }
  });
});
