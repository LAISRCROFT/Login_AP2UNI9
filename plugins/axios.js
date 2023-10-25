export default function({ $axios }, inject) {
    const api = $axios.create({
        baseURL: `https://ap2uni9.laisrequena.repl.co/`
    })
   
    inject('api', api)
}