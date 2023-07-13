const express = require('express');
const router = express.Router();
const db = require('./../db/models');

//Visualizar recebendo parametro pelo ID
router.get('/consult/:id', async (req, res) => {

   //Receber o parametro ID
   const { id } = req.params;
   //console.log(id);

   //Recuperar o registro depois de receber o parametro
   const user = await db.Users.findOne({
      //Indicar as colunas que quero recuperar
      attributes:['id','nome','telefone'],

      //Acrescentar a condição para indicar qual registro deve ser retornado do banco de dados
      where: {id},
   });
   //console.log(user);

   //Acessa o IF se encontrar o registro pelo ID passado
   if(user){
      return res.json({
         user
      })
   }else{
      return res.status(400).json({
         message: "Usuario não encontrado"
      })
   }

   res.json({
      message: "Usuario encontrado"
   });
})

//Cadastrar exemplo
router.post("/add", async (req, res) => {

   var data = req.body;
   //console.log(data);

   await db.Users.create(data)
   .then((dataUsers) => {
      res.json({
         message: "All right, Register is good!",
         dataUsers
      })      
   })
   .catch(() =>{
      res.json({
         message: "Error registering"
      })
   })

})

//Listar
router.get('/consult', async (req, res) => {

   //Receber o número da página, quando não enviado o número da página é atribuido página 1
   const { page = 1 } = req.query
   //console.log(page) //consult?page=3

   //Limite de registro em cada página 10
   const limit = 10;

   //variável com número da útlima página
   var lastPag = 1

   //contar a quantidade de registro no banco de dados
   const countUsers = await db.Users.count()
   //console.log(countUsers)

   //Acessar IF quando encontrar registro no banco de dados
   if(countUsers !== 0) {

      //Calcular última página
      lastPag = Math.ceil((countUsers / limit)); //arredondar para cima "ceil"

   }else {
      res.status(400).json({
         message: "ERROR: Nenhum registro encontrado!"
      })
   }



   //Recuperar dados de todos os usuarios
   const users = await db.Users.findAll({

      //Indicar quais colunas acessar na consulta
      attributes: ['id', 'nome', 'email'],

      //Ordenar os registro de como aparecer
      order: [['id', 'ASC']],

      //Calcular APARTI de qual registro deve retornar e o limite de registros
      offset: Number((page * limit) - limit), // ex:(3*10) - 10 = 20
      limit
   });

   //Acessa o IF se encontrar nos registro no banco de dados
   if(users) {

      //Criar um objeto com as informações da paginação
      var pagination = {
         //caminho
         path: '/consult',
         //página atual
         page,
         //Calcular pagina anterior
         prev_page_url: page - 1 >= 1 ? page - 1 : false,
         //Calcular proxima pagina
         next_page_url: Number(page) + Number(1) > lastPag ? false : Number(page) + Number(1),
         //Última página
         lastPag,
         //QTD total de registro
         totally_record: countUsers,
      }

      //retorno os dados em formado de objeto json
      res.json({
         users,
         pagination
      })
   }else {
      res.status(400).json({
         message: "Erro ao listar registros"
      })
   }

})

//Editar regist
router.put('/user', async (req, res) => {
   
   //Receber os dados enviados no body da req
   var dados = req.body;
   //console.log(dados);

   //Editando dados do registro
   await db.Users.update(dados, { where: {id: dados.id}})
   .then(() => {
      return res.json({
         message: "Usuário editado com sucesso!"
      })
   })
   .catch(() =>{
      res.status(404).json({
         message: "Erro ao editar registro"
      })
   })
})




module.exports = router;