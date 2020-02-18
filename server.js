//0.1 -Configurando o servidor
//npm intall express
//npm install nodemon
//npm install pg
const express = require("express") //pega do node model o express
const server = express()

//3 - confugurar o servidor para arquivos extras
server.use(express.static('public'))

//5 abilitar body do formulario
server.use(express.urlencoded({ extended: true }))

//configurar conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
        user: "postgres",
        password: "1234",
        port: 5432,
        database: "doe"
    }) //novo objeto

//2.1- configurando a template engine
const nunjucks = require("nunjucks")

nunjucks.configure("./", {
    express: server,
    noCache: true //boolean/boleano
})

/*
// 4 lista de doadores (vetor/array)
const donors = [{
        name: "1 Igor Sthaynny",
        blood: "A+"
    },
    {
        name: "2 Igor Sthaynny",
        blood: "A+"
    },
    {
        name: "3 Igor Sthaynny",
        blood: "AB+"
    },
    {
        name: "4 Igor Sthaynny",
        blood: "O+"
    },
]*/



//2 - configurando a apresentaçao da pagina
server.get("/", function(req, res) {
    const query = `select * from donors`

    db.query(query, function(err, result) {
        if (err) return res.send("Erro no banco de dados")
        const donors = result.rows
        return res.render("index.html", { donors }) //2.2 renderizar o html. antes era o sender()
    })

})

server.post("/", function(req, res) {
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
        /*
            //coloca valor dentro do array
            donors.push({
                name: name,
                blood: blood
            })
            */

    if (name == "" || email == "" || blood == "") {
        return res.send("todos os campos são obrigatorios.")
    }

    //coloca valores dentro do banco de dados
    const query = `insert into donors ("name","email","blood") values ($1,$2,$3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        //fluxo de erro
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }


        //fluxo ideal
        return res.redirect("/")
    })




})

//1 - ligar o servidor na porta 3000
server.listen(3000, function() {
    console.log("iniciei o server")
})