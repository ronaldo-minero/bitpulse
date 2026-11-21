# BITPULSE — Minigame de Arquitetura Computacional

Minigame arcade interativo em **HTML, Bootstrap 5, CSS e JavaScript** para aprender na prática os **16 componentes essenciais de Arquitetura Computacional** operando uma placa-mãe ao vivo.

## Site publicado

> Após ativar o GitHub Pages, troque `SEU-USUARIO` e `NOME-DO-REPO` abaixo pelo seu link real:

https://SEU-USUARIO.github.io/NOME-DO-REPO/

---

## Como funciona o minigame

Você atua como operador de uma **placa-mãe interativa** dividida em 4 setores (**Processamento**, **Memórias**, **Barramentos** e **Embarcados**). Chamados reais de hardware chegam no console e você precisa acionar o chip certo antes que o tempo acabe:

- **⚡ Plantão (16/16):** 3 fusíveis (vidas) para responder corretamente todos os 16 componentes da placa. Se errar algum chip, ele volta para a fila até você dominar!
- **🟢 Treino Livre:** sem timer e vidas infinitas — perfeito para estudar com calma.
- **🔥 Overclock:** modo infinito em que o clock acelera progressivamente e acertos em sequência multiplicam seus pontos até `x5` (com recorde salvo no navegador).
- **💡 Dica de Setor:** ilumina apenas o setor certo da placa para ajudar a raciocinar sem entregar a resposta.
- **⚠ Curto-Circuito Educativo:** toda vez que você erra, o jogo pausa e compara o chip clicado com o chip correto, mostrando uma **analogia** e uma **dica "não confunda!"**.
- **📚 Laboratório dos 16 Chips (tecla `L`):** guia rápido com os 16 termos, filtros por setor e seus 2 LEDs de maestria em cada chip.

---

## Os 16 componentes treinados (32 cenários)

| Setor | Componentes |
| :--- | :--- |
| **Núcleo & Processamento** | `CPU`, `UC`, `ULA`, `REGISTRADORES`, `DUAL CORE`, `QUAD CORE` |
| **Memórias & Armazenamento** | `CACHE`, `RAM`, `ROM`, `EEPROM`, `FLASH`, `MEMÓRIA DE MASSA` |
| **Barramentos & Fluxo** | `ADDRESS BUS`, `DATA BUS`, `DMA` |
| **Sistemas Embarcados** | `MICROCONTROLADOR` |

---

## Estrutura do projeto

- `index.html` — interface limpa com **Bootstrap 5.3** + **Bootstrap Icons**, placa-mãe em grid responsivo e modais nativos.
- `style.css` — tema dark minimalista integrado ao Bootstrap, microchips com LEDs de maestria e animações suaves.
- `script.js` — 32 cenários reais, 3 modos de jogo, faíscas sob demanda em Canvas e sintetizador arcade (Web Audio API).
- `README.md` — documentação do minigame.
