# 👰🤵 convites-qrcode

Um aplicativo Web Progressivo (PWA) simples e robusto para gerenciar a lista de convidados e validar a presença em eventos (casamentos, festas, etc.) usando a leitura de QR Code.

[![PWA Status](https://img.shields.io/badge/PWA-Pronto%20para%20Offline-blue)](https://web.dev/progressive-web-apps/)
[![Licença](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 💡 Sobre o Projeto

Este projeto transforma um dispositivo móvel (smartphone ou tablet) numa estação de *check-in* eficiente. Cada convidado recebe um QR Code único que, ao ser escaneado no local, confirma a sua presença e atualiza a lista em tempo real.

O sistema utiliza o **localStorage** do navegador como um banco de dados simples para garantir que a lista funcione **offline**, mesmo que a internet falhe no dia do evento.

---

## ✅ Funcionalidades Principais

| Ícone | Funcionalidade | Descrição |
| :---: | :--- | :--- |
| 📱 | **Leitor QR Code** | Uso da câmera do dispositivo para *scan* rápido e validação imediata do convite. |
| 🔑 | **Área Admin Segura** | Seção protegida por senha para cadastro e gestão da lista. |
| 📊 | **Lista de Presença** | Visualização em tempo real da contagem de **Presentes**, **A Faltar** e **Total**. |
| 🏷️ | **Gestão de Categorias** | Ao cadastrar, permite definir a categoria do convidado (**A**-Noivo, **B**-Noiva, **C**-Amigos). |
| 🗑️ | **Remoção Flexível** | Permite remover convidados pesquisando tanto pelo **ID** quanto pelo **Nome Completo**. |
| 🌐 | **Suporte Offline** | O PWA funciona perfeitamente sem conexão após o primeiro carregamento. |

---

## 💻 Tecnologias Utilizadas

* **HTML5 / CSS3:** Estrutura e estilização do PWA.
* **JavaScript (Vanilla JS):** Toda a lógica do aplicativo.
* **GitHub Pages:** Serviço de hospedagem e *deployment*.
* **HTML5-QRCode:** Biblioteca para leitura de QR Codes via câmera.
* **Python:** (Opcional) Script de apoio (`gerar_qrcode_unico.py`) para geração das imagens coloridas dos QR Codes.

---

## ⚙️ Instalação e Configuração Local

Para começar a usar o PWA no seu ambiente, siga estes passos:

1.  ### Clone o Repositório
    Baixe os ficheiros para a sua máquina:

    ```bash
    git clone [https://github.com/SEU_USUARIO/convites-qrcode.git](https://github.com/SEU_USUARIO/convites-qrcode.git)
    cd convites-qrcode
    ```

2.  ### Inicialize o Servidor Local
    Como este projeto usa o recurso de câmera, ele **não pode** ser aberto diretamente a partir do ficheiro (`file://...`). Você precisa de um servidor local simples.

    * **Com Python (Recomendado):**
        ```bash
        python3 -m http.server 8000
        ```
    * **Acesse:** Abra o seu navegador e vá para `http://localhost:8000`.

3.  ### Ative o Service Worker (PWA)
    Na primeira visita, abra as Ferramentas de Desenvolvedor (F12) e verifique se o **`service-worker.js`** está ativo na aba `Application` para garantir o funcionamento offline.

---

## 🔑 Instruções da Área Admin

### A. Credenciais de Acesso

Use as suas credenciais para aceder à Área Admin:

### B. Fluxo de Criação de Convite (ID + QR Code)

1.  **Acesse a Admin:** Faça login com as credenciais acima.
2.  **Selecione o Grupo:** Escolha a categoria do convidado (**A**, **B** ou **C**).
3.  **Cadastre:** Insira o **Nome do Casal/Pessoa** e clique em **"Adicionar Convidado"**.
4.  **Obtenha o ID:** O sistema gerará um **ID único** (ex: `F2R9`) e confirmará a categoria.
5.  **Gere o QR Code:** Utilize o seu script Python (`gerar_qrcode_unico.py`) no seu computador, passando o ID e a Categoria como argumentos:

    ```bash
    # Exemplo para o ID F2R9 na Categoria A
    python3 gerar_qrcode_unico.py F2R9 A
    ```
    Isto irá gerar o ficheiro PNG do QR Code colorido que deverá ser enviado ao convidado.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.

Para mais detalhes, consulte o ficheiro [LICENSE].

[LICENSE]: LICENSE
