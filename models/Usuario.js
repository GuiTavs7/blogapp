const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Usuario = new Schema({
  nome: {
    type: String,
    required: true
  },
  email: { 
    type: String,
    required: true
  },
  // Para ser admin, o valor do campo isAdmin deve ser true, caso contrário, será false!
  isAdmin: {
    type: Boolean,
    default: false
  },
  senha: {
    type: String,
    required: true
   }
});

// Precisamos usar o hash para criptografar a senha do usuário, para segurança do sistema
// Criptografia é diferente de hash, mas o hash é uma forma de criptografia. A diferença é que a criptografia pode ser revertida, enquanto o hash não pode ser revertido. Ou seja, a senha do usuário será transformada em um hash, e não poderá ser revertida para a senha original.

mongoose.model('usuarios', Usuario);