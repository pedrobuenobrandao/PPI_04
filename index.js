
import express, { response } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host ="0.0.0.0";
const porta = 3000;
var lista_login=[];
const server = express();
var lista_produtos = [];

var loginUsuario = false;

server.use(session({
    secret: "Ch4veSecret4",
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000* 60 *15
    }
}));

server.use(express.urlencoded({extended: true}));
server.use(express.json());
server.use(cookieParser());



server.get("/",(requisicao, resposta)=>{


    resposta.send(`

            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Login</title>
                </head>

                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f2f5; height: 100vh; display: flex; align-items: center; justify-content: center;">

                    
                    <form method="POST" action="/" style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 320px; text-align: center;">
                    <h2 style="margin-bottom: 25px; color: #333;">Login</h2>
                    <p>(admin@email.com<br>senha: admin)</p>

                    <div style="margin-bottom: 20px; text-align: left;">
                        <label for="exampleInputEmail1" style="display: block; font-weight: bold; margin-bottom: 6px; color: #555;">Email</label>
                        <input type="email" id="exampleInputEmail1" name="Email" 
                        style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>

                    <div style="margin-bottom: 20px; text-align: left;">
                        <label for="exampleInputPassword1" style="display: block; font-weight: bold; margin-bottom: 6px; color: #555;">Senha</label>
                        <input type="password" id="exampleInputPassword1" name="senha" 
                        style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>

                    <button type="submit"
                        style="width: 100%; background-color: #2E8B57; color: white; border: none; padding: 10px 0; border-radius: 6px; font-size: 16px; cursor: pointer; transition: background-color 0.2s;">
                        Entrar
                    </button>
                    </form>

                </body>
                </html>
        `);

});

server.post("/",(requisicao,resposta)=>{
    const {Email, senha} = requisicao.body;

    if(Email === "admin@email.com" && senha === "admin")
    {
        requisicao.session.loginUsuario =   {
                                                logado: true,
                                                loginUsuario: "Administrador"
                                            };
        resposta.redirect("/telaMenu");
    }
    else
    {
        resposta.write(
            `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Login</title>
                </head>

                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f2f5; height: 100vh; display: flex; align-items: center; justify-content: center;">

                    
                    <form method="POST" action="/" style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 320px; text-align: center;">
                    <h2 style="margin-bottom: 25px; color: #333;">Login</h2>
                    <p>(admin@email.com<br>senha: admin)</p>

                    <div style="margin-bottom: 20px; text-align: left;">
                        <label for="exampleInputEmail1" style="display: block; font-weight: bold; margin-bottom: 6px; color: #555;">Email</label>
                        <input type="email" id="exampleInputEmail1" name="Email" 
                        style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>

                    <div style="margin-bottom: 20px; text-align: left;">
                        <label for="exampleInputPassword1" style="display: block; font-weight: bold; margin-bottom: 6px; color: #555;">Senha</label>
                        <input type="password" id="exampleInputPassword1" name="senha" 
                        style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>

                    <button type="submit"
                        style="width: 100%; background-color: #2E8B57; color: white; border: none; padding: 10px 0; border-radius: 6px; font-size: 16px; cursor: pointer; transition: background-color 0.2s;">
                        Entrar
                    </button>
                    
                    <div>
                        <p style="color: red;"> Usuário ou Senha inválidos </p>
                    </div>

                    </form>

                </body>
                </html>

            `
        )
    }
});

function vereficaLogin(requisicao, resposta, proximo){
    if(requisicao.session?.loginUsuario?.logado)
    {
        proximo();
    }
    else
    {
        resposta.redirect("/");
    }

};

server.get("/telaMenu",  vereficaLogin,  (requisicao, resposta)=>{

    let lastAcess = requisicao.cookies?.lastAcess;

    const data = new Date();
    resposta.cookie("lastAcess",data.toLocaleString());


    resposta.setHeader("Content-Type", "text/html");
    resposta.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Menu</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            </head>
        <body>

            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
                <a class="nav-link active" href="/" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Login</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" href="/cadastroProduto" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Cadastrar Produtos</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false" href="/lista_produto">Lista de Produtos</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false" href="/" >SAIR</a>
            </li>
            </ul>
            <hr style="height: 12px; background-color: #000000ff; border: none; border-radius: 5px;">

            <div class="tab-content" id="pills-tabContent">
            <br>
            <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" style="color: green; text-align: center; text-decoration: underline">Seja Bem-Vindo</div>
            </div>
            <div class="tab-content" id="pills-tabContent">
            <br>
            <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" style="color: green; text-align: center; text-decoration: underline">Ultimo acesso: ${lastAcess || "Primeiro acesso"}</div>
            </div>


        </body>
        </html>

    `);

    
    resposta.end();

});




server.get("/cadastroProduto", vereficaLogin, (requisicao, resposta)=>{
    resposta.send(`

            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Cadastro de Produtos</title>
            </head>
            <body style="font-family: Arial; background-color: #f5f5f5; margin: 0; padding: 20px;">

                <h2 style="text-align: center; margin-bottom: 20px;">Cadastro de Produto</h2>

                <form method=POST action="/cadastroProduto" style="
                    max-width: 900px;
                    margin: auto;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                ">

                    
                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Nome do Fabricante:</label>
                        <input type="text" name="nomeFabricante" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">
                    </div>

                    
                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Código de Barras:</label>
                        <input type="text" name="codigoBarras" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">
                    </div>

                    
                    <div style="grid-column: span 2; display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Descrição do Produto:</label>
                        <textarea rows="3" name="descricaoProduto" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px; resize: none;
                        "></textarea>
                    </div>

                    
                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Preço de Custo:</label>
                        <input type="number" name="precoCusto" step="0.01" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">
                    </div>

                    
                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Preço de Venda:</label>
                        <input type="number" name="precoVenda" step="0.01" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">
                    </div>

                   
                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Data de Validade:</label>
                        <input type="date" name="dataValidade" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">
                    </div>

                
                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Qtd em Estoque:</label>
                        <input type="number" name="estoque" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">
                    </div>

                    
                    <div style="grid-column: span 2; text-align: center; margin-top: 10px;">
                        <button type="submit" style="
                            padding: 12px 30px;
                            background-color: #4CAF50;
                            color: white;
                            font-size: 16px;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            transition: background-color 0.2s;"
                        onmouseover="this.style.backgroundColor='#449d48'"
                        onmouseout="this.style.backgroundColor='#4CAF50'">
                            Cadastrar Produto
                        </button>
                    </div>

                    <div style="grid-column: span 2; text-align: center; margin-top: 10px;">
                        <a type="submit" href="/telaMenu" style="
                            padding: 12px 30px;
                            background-color: #6c757d;
                            text-decoration: none;
                            color: white;
                            font-size: 16px;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            transition: background-color 0.2s;"
                        onmouseover="this.style.backgroundColor='#667066ff'"
                        onmouseout="this.style.backgroundColor='#6c757d'">
                            Voltar
                        </a>
                    </div>

                </form>

            </body>
            </html>
        `);

});



server.use(express.urlencoded({extended: true}));



server.post('/cadastroProduto', vereficaLogin, (requisicao, resposta)=>{
    const nomeFabricante =requisicao.body.nomeFabricante;
    const codigoBarras = requisicao.body.codigoBarras;
    const descricaoProduto = requisicao.body.descricaoProduto;
    const precoCusto = requisicao.body.precoCusto;
    const precoVenda = requisicao.body.precoVenda
    const dataValidade = requisicao.body.dataValidade
    const estoque = requisicao.body.estoque;


    if(nomeFabricante && codigoBarras && descricaoProduto && precoCusto && precoVenda && dataValidade && estoque)
    {
        lista_produtos.push({nomeFabricante, codigoBarras, descricaoProduto, precoCusto, precoVenda, dataValidade, estoque});
        resposta.redirect("/lista_produto");
    }
    else
    {
        let conteudo = `

            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Cadastro de Produtos</title>
            </head>
            <body style="font-family: Arial; background-color: #f5f5f5; margin: 0; padding: 20px;">

                <h2 style="text-align: center; margin-bottom: 20px;">Cadastro de Produto</h2>

                <form method="POST" action="/cadastroProduto" style="
                    max-width: 900px;
                    margin: auto;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                ">

                    
                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Nome do Fabricante:</label>
                        <input type="text" name="nomeFabricante" value="${nomeFabricante}" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">`

                        if(!nomeFabricante)
                            {
                                conteudo+=
                                `
                                <div>
                                    <p style="color: red" >Preencha esse campo, Nome do Fabricante</p>
                                </div>
                                `
                            }
    conteudo+=`</div>

                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Código de Barras:</label>
                        <input type="text" name="codigoBarras" value="${codigoBarras}" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">`

                        if(!codigoBarras)
                        {
                            conteudo+=
                            `
                            <div>
                                <p style="color: red" >Preencha esse campo, Código de Barras</p>
                            </div>
                            `
                        }
                    
     
    conteudo+=`</div>
                    
                    <div style="grid-column: span 2; display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Descrição do Produto:</label>
                        <textarea rows="3" name="descricaoProduto" value="${descricaoProduto}" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px; resize: none;
                        "></textarea>`

                        if(!descricaoProduto)
                        {
                            conteudo+=
                            `
                            <div>
                                <p style="color: red" >Preencha esse campo, Descrição do produto</p>
                            </div>
                            `
                        }
    conteudo+=`</div>
                    
                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Preço de Custo:</label>
                        <input type="number" name="precoCusto" value="${precoCusto}" step="0.01" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">`

                        if(!precoCusto)
                            {
                                conteudo+=
                                `
                                <div>
                                    <p style="color: red" >Preencha esse campo, Preço de Custo</p>
                                </div>
                                `
                            }
    conteudo+=`</div>
                    
                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Preço de Venda:</label>
                        <input type="number" name="precoVenda" value="${precoVenda}" step="0.01" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">`

                        if(!precoVenda)
                        {
                            conteudo+=
                            `
                            <div>
                                <p style="color: red" >Preencha esse campo, Preço de Venda</p>
                            </div>
                            `
                        }
                    
     
    conteudo+=`</div>

                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Data de Validade:</label>
                        <input type="date" name="dataValidade" value="${dataValidade}" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">`

                        if(!dataValidade)
                        {
                            conteudo+=
                            `
                            <div>
                                <p style="color: red" >Preencha esse campo, Data de Validade</p>
                            </div>
                            `
                        }
    conteudo+=`</div>
                
                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: bold;">Qtd em Estoque:</label>
                        <input type="number" name="estoque" value="${estoque}" style="
                            padding: 10px; border: 1px solid #ccc; border-radius: 5px;
                        ">`

                         if(!estoque)
                        {
                            conteudo+=
                            `
                            <div>
                                <p style="color: red" >Preencha esse campo, Quantidade em Estoque</p>
                            </div>
                            `
                        }
                    
    
    conteudo+=`</div>
                    
                    <div style="grid-column: span 2; text-align: center; margin-top: 10px;">
                        <button type="submit" style="
                            padding: 12px 30px;
                            background-color: #4CAF50;
                            color: white;
                            font-size: 16px;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            transition: background-color 0.2s;"
                        onmouseover="this.style.backgroundColor='#449d48'"
                        onmouseout="this.style.backgroundColor='#4CAF50'">
                            Cadastrar Produto
                        </button>
                    </div>

                </form>

            </body>
            </html>
        `
        resposta.send(conteudo);
    }

});



server.get("/lista_produto", vereficaLogin, (requisicao, resposta)=>{
    let conteudo=`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Lista de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            </head>
            <body>
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nome do Fabricante</th>
                            <th>Código de Barras</th>
                            <th>Descrição do Produto</th>
                            <th>Preço de Custo</th>
                            <th>Preço de Venda</th>
                            <th>Data de Validade</th>
                            <th>Quantidade no Estoque</th>
                        </tr>
                    </thead>
                    <tbody>`;
            for (let i= 0; i<lista_produtos.length; i++)
            {
                conteudo+=`
                <tr>
                    <td>${lista_produtos[i].nomeFabricante}</td>
                    <td>${lista_produtos[i].codigoBarras} </td>
                    <td>${lista_produtos[i].descricaoProduto} </td>
                    <td>${lista_produtos[i].precoCusto} </td>
                    <td>${lista_produtos[i].precoVenda} </td>
                    <td>${lista_produtos[i].dataValidade} </td>
                    <td>${lista_produtos[i].estoque} </td>

                </tr>
              
                `;
            }
            conteudo+=`
                </tbody>
                </table>

               <a href="/telaMenu"
                    style="display: block; width: 150px; margin: 20px auto; text-align: center;
                        background-color: #6c757d; color: white; text-decoration: none;
                        padding: 10px 0; border-radius: 6px; font-size: 16px;
                        cursor: pointer; transition: background-color 0.2s;">
                    Voltar
                </a>

            </body>
        </html>`

        resposta.send(conteudo);
});


// server.listen(3000, () => {
//     console.log("Servidor rodando na porta 3000");
// });
server.listen(porta, host, ()=>{
    console.log(`Servidor rodando em http://localhost:${porta}/`)
});
