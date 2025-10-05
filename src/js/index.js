/**Objetivo
 * - enviar o texto de um formulario para uma API do n8n e exibir o resultado do codigo html e css retornado e colocar a animacao no fundo da tela do site
 * 
 * Passos:
 * 1. no javascript, pegar o evento de submit do formulario para evitar o reload da pagina
 * 2. obter o valor digitado pelo usuario no campo de texto
 * 3. exibir um indicador de carregamento enquanto a requisicao esta sendo processada
 * 4. fazer uma requisisacao HTTP (POST) para a API do n8n, enviando o texto do formulario no corpo da requisicao em formato JSON
 * 5. receber a resposta da API do n8n (esperando um JSON com o codigo HTML/CSS do background)
 * 6. se a resposta for valida, exbir o codigo HTML/CSS retornado na tela:
 *   - mostrar o HTML gerado em uma area de preview
 *   - inserir o CSS retornado dinamicamente na pagina para aplicar o background
 * 7. remover o indicador de carregamento apos o recebimento da resposta
 */

function setLoading(isLoading){
    const btnSpan = document.getElementById('generate-btn');

    if(isLoading){
        btnSpan.innerHTML = 'Gerando Background...';
    } else {
        btnSpan.innerHTML = 'Gerar Background Mágico';
    }
}

document.addEventListener('DOMContentLoaded', function(){
    // 1. no javascript, pegar o evento de submit do formulario para evitar o reload da pagina
    const form = document.querySelector('.form-group');
    const textArea = document.getElementById('description');
    const htmlCode = document.getElementById('html-code');
    const cssCode = document.getElementById('css-code');
    const preview = document.getElementById('preview-section');

    form.addEventListener('submit', async function(event){
        event.preventDefault();

        // 2. obter o valor digitado pelo usuario no campo de texto
        const description = textArea.value.trim();

        if(!description){
            return;
        }

        // 3. exibir um indicador de carregamento enquanto a requisicao esta sendo processada
        setLoading(true);

        // 4. fazer uma requisisacao HTTP (POST) para a API do n8n, enviando o texto do formulario no corpo da requisicao em formato JSON
        try {
            const response = await fetch('https://marianinha123.app.n8n.cloud/webhook/gerador-fundo', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({description})
            }); 

            const data = await response.json();
            htmlCode.textContent = data.code || "";
            cssCode.textContent = data.style || "";

            preview.style.display = "block";
            preview.innerHTML = data.code || "";

            let styleTag = document.getElementById('dynamic-style');

            if(styleTag) styleTag.remove();

            if (data.style){
                styleTag = document.createElement('style');
                styleTag.id = 'dynamic-style';
                styleTag.textContent = data.style;
                document.head.appendChild(styleTag);
            }


        } catch (e){
            console.error('Erro ao gerar o background:', e);
            htmlCode.textContent = "Não consegui gerar o código HTML, tente novamente";
            cssCode.textContent = "Não consegui gerar o código CSS, tente novamente";
            preview.innerHTML = "";

        } finally {
            setLoading(false);

        }
    });

});