<template>
  <!-- <b-container class="d-flex align-items-center justify-content-center h-100"> -->
    <div class="d-flex align-items-center justify-content-center h-100 index">
      <b-card class="card-form">
        <b-row class="h-100 d-flex align-content-center">
          <b-col cols="8" offset="2" class="mb-4">
            <h1>LOGIN DE USUÁRIO</h1>
          </b-col>
          <b-col cols="8" offset="2" class="mb-3">
              <b-form-input id="input-nome" v-model="login.nome" trim placeholder="Nome de usuário"></b-form-input>
          </b-col>
          <b-col cols="8" offset="2" class="mb-3">
              <b-form-input id="input-password" v-model="login.password" type="password" trim placeholder="Senha"></b-form-input>
          </b-col>
          <b-col cols="8" offset="2">
              <p class="registrarse text-center" v-b-modal.modal-center>Clique aqui se ainda não possui um registro</p>
          </b-col>
          <b-col cols="8" offset="2" class="mt-3">
            <b-button block  variant="outline-dark" @click="loginAPI">LOGIN</b-button>
          </b-col>
          <b-col cols="8" offset="2" class="mt-3 mb-0" v-if="apiKeyExists">
            <b-alert show class="alerta-apikey"><b>APIKey:</b>&nbsp;{{ apiKey }} </b-alert>
          </b-col>
        </b-row>
      </b-card>
      <b-modal id="modal-center" centered hide-footer header-bg-variant="primary" headerClass="modal-registrarse">
        <template #modal-header>
          <h3>Cadastrar-se</h3>
        </template>
        <b-row class="row-modal-inputs">
          <b-col cols="8" offset="2" class="mb-3 mt-3">
            <b-form-input id="name-input" v-model="cadastro.nome" placeholder="Insira o nome de usuário"></b-form-input>
          </b-col>
          <b-col cols="8" offset="2" class="mb-4">
            <b-form-input id="password-input" v-model="cadastro.password" placeholder="Insira a senha" type="password"></b-form-input>
          </b-col>
          <b-col cols="8" offset="2" class="mb-3">
            <b-button block  @click="cadastrar" class="btn-cadastrar">CADASTRAR</b-button>
          </b-col>
        </b-row>
      </b-modal>
    </div>
  <!-- </b-container> -->
</template>

<script>
export default {
    name: "index",
    data() {
      return {
        login: {
          nome: '',
          password: ''
        },
        cadastro: {
          nome: '',
          password: ''
        },
        apiKeyExists: false,
        apiKey: ''
      }
    },
    computed: {
    
    },
    mounted() {
      
    },
    methods: {
      async loginAPI() {
        if (!this.login.nome) {
          await this.makeToast('danger', "Insira o nome de usuário", 'Erro')
          return false
        }
        if (!this.login.password) {
          await this.makeToast('danger', "Insira a senha", 'Erro')
          return false
        }
        try {
          let usuario = await this.$api.post(`usuarios/login`, this.login)
          console.log(usuario)
          if (usuario.data.error) {
            await this.makeToast('danger', usuario.data.message, `Error ${usuario.data.error}`)
          }
          else {
            this.apiKey = usuario.data.token
            this.apiKeyExists = true
            await this.makeToast('success', "APIKey obtida", 'Success')
            setTimeout(() => {
              this.login = {
                nome: '',
                password: ''
              }
            }, 1000)
          }
        } catch (error) {
          console.error("error: ", error)
          await this.makeToast('danger', "Erro ao obter APIKey. Revise os dados e tente novamente", 'Erro')
        }
      },
      async cadastrar() {
        if (!this.cadastro.nome) {
          await this.makeToast('danger', "Insira o nome de usuário", 'Erro')
          return false
        }
        if (!this.cadastro.password) {
          await this.makeToast('danger', "Insira a senha", 'Erro')
          return false
        }
        try {
          let usuario = await this.$api.post(`usuarios`, this.cadastro)
          console.log("Usuario: ", usuario)
          if (usuario.data.error) {
            await this.makeToast('danger', usuario.data.message, `Error ${usuario.data.error}`)
          }
          else {
            await this.makeToast('success', "Usuário cadastrado com sucesso", 'Sucesso')
            this.cadastro = {
              nome: '',
              password: ''
            }
            this.$bvModal.hide('modal-center')
          }
        } catch (error) {
          console.error(error)
          this.makeToast('danger', "Aconteceu um erro, revise os dados e tente novamente", 'Erro')
        }
      },
      makeToast(variant = null, message, title) {
        this.$bvToast.toast(message, {
          title: title,
          variant: variant,
          solid: true
        })
      }
    }
  }
</script>
<style lang="scss">
  .card-form {
    height: auto;
    width: 70vh;
    border: none;
    background-image: url('assets/images/blob-haikei-3.png');
    background-size: cover;
    background-repeat: no-repeat;
    -webkit-box-shadow: 30px 30px 0px 0px rgb(240 225 255 / 73%), 30px 31px 6px -18px rgb(0 0 0);
    border-radius: 31px;
    padding: 35px 0px;
    h1 {
      font-size: 3.3vh;
      font-family: Poppins;
      text-align: center;
      color: #80708f;
    }
    .input-form {
      font-family: 'Poppins';
    }
    .alert.alerta-apikey.alert-info {
      margin: 0;
      font-size: 71%;
      font-family: 'Poppins';
    }
    .registrarse {
      margin: 0;
      font-size: .8em;
      font-family: Poppins;
      color: #6a8bcb;
      cursor: pointer;
      transition: color 0.3s ease;
      &:hover {
        color: #9572b2;
      }
    }
  }
  .modal-registrarse {
    color: #fff;
    text-align: center;
    display: flex;
    justify-content: center;
    padding: 8px 0px;
    font-family: Poppins;
    text-transform: uppercase;
    h3 {
        font-size: 1.2em;
        margin: 7px 0;
    }
  }
  .btn-cadastrar {
    background: linear-gradient(88deg, rgb(183 166 198) 0%, rgb(196 184 229) 100%) !important;
    border-color: #b9a6ca;
    transition: background-color 0.3s ease;
    &:hover {
      background: linear-gradient(274deg, rgb(183, 166, 198) 0%, rgb(196, 184, 229) 100%) !important;
      border-color: #b9a6ca;
    }
    &:focus {
      box-shadow: none;
      border-color: #c1b0d1;
    }
    &:active {
      box-shadow: none;
      border-color: #c1b0d1;
    }
  }
</style>
